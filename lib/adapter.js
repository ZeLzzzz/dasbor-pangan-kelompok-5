// Mentor storage adapter (Upstash Redis). Copy this file to lib/adapter.js in a group repo.
//
//   import { createStore } from './lib/adapter.js';
//   const pantauan = createStore('pantauan');
//   await pantauan.list();            // -> [item, ...] oldest first
//   await pantauan.get(id);           // -> item | null
//   await pantauan.create(data);      // -> item (with id, createdAt, updatedAt)
//   await pantauan.update(id, data);  // -> item | null   (replaces the fields, keeps id/createdAt)
//   await pantauan.remove(id);        // -> true | false
//
// The adapter only stores and returns objects. Field validation and business rules
// belong in the group's Express routes.
//
// Environment (set in Vercel and in a local .env, never committed):
//   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
//     (KV_REST_API_URL / KV_REST_API_TOKEN from the Vercel integration also work)
//   ADAPTER_NAMESPACE   optional key prefix, e.g. "kelompok-5" (default "app")
//   ADAPTER_DRIVER=memory   local development only; data is lost on restart and refused on Vercel
import { randomUUID } from 'node:crypto';
import { Redis } from '@upstash/redis';

const RESERVED = ['id', 'createdAt', 'updatedAt'];
const MAX_BYTES = 10_000;

export class AdapterError extends Error {}

function memoryDriver() {
  const tables = new Map();
  const table = (key) => tables.get(key) ?? tables.set(key, new Map()).get(key);
  return {
    async getAll(key) { return [...table(key).values()]; },
    async get(key, id) { return table(key).get(id) ?? null; },
    async set(key, id, value) { table(key).set(id, value); },
    async del(key, id) { return table(key).delete(id); },
  };
}

export function redisDriver(client) {
  return {
    async getAll(key) {
      // With automaticDeserialization off, Upstash returns HGETALL as a flat [field, value, ...] array.
      const reply = (await client.hgetall(key)) ?? {};
      return Array.isArray(reply) ? reply.filter((_, i) => i % 2 === 1) : Object.values(reply);
    },
    async get(key, id) { return (await client.hget(key, id)) ?? null; },
    async set(key, id, value) { await client.hset(key, { [id]: value }); },
    async del(key, id) { return (await client.hdel(key, id)) > 0; },
  };
}

function driverFromEnv(env) {
  const url = env.UPSTASH_REDIS_REST_URL || env.KV_REST_API_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN;
  if (url && token) {
    return redisDriver(new Redis({ url, token, automaticDeserialization: false }));
  }
  if (env.ADAPTER_DRIVER === 'memory') {
    if (env.VERCEL) throw new AdapterError('ADAPTER_DRIVER=memory tidak boleh dipakai di Vercel: data tidak persisten.');
    console.warn('[adapter] memakai penyimpanan memori: data hilang saat server restart.');
    return memoryDriver();
  }
  throw new AdapterError(
    'Kredensial penyimpanan belum diatur. Isi UPSTASH_REDIS_REST_URL dan UPSTASH_REDIS_REST_TOKEN, atau ADAPTER_DRIVER=memory untuk pengembangan lokal.',
  );
}

let shared;

function assertPlainObject(data) {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new AdapterError('Data harus berupa objek.');
  }
  const bad = RESERVED.filter((k) => k in data);
  if (bad.length) throw new AdapterError(`Field ${bad.join(', ')} diatur oleh adapter dan tidak boleh dikirim.`);
}

export function createStore(collection, { driver, namespace, env = process.env, now = () => new Date() } = {}) {
  if (!/^[a-z0-9-]+$/.test(collection)) throw new AdapterError('Nama koleksi hanya boleh huruf kecil, angka, dan tanda hubung.');
  // One client per process for the real environment; explicit env objects (tests) get their own.
  const d = driver ?? (env === process.env ? (shared ??= driverFromEnv(env)) : driverFromEnv(env));
  const key = `${namespace ?? env.ADAPTER_NAMESPACE ?? 'app'}:${collection}`;

  const encode = (item) => {
    const json = JSON.stringify(item);
    if (Buffer.byteLength(json) > MAX_BYTES) throw new AdapterError(`Satu data maksimal ${MAX_BYTES} byte.`);
    return json;
  };
  const decode = (raw) => (raw === null ? null : typeof raw === 'string' ? JSON.parse(raw) : raw);

  return {
    async list() {
      const items = (await d.getAll(key)).map(decode);
      return items.sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
    },
    async get(id) {
      return decode(await d.get(key, String(id)));
    },
    async create(data) {
      assertPlainObject(data);
      const t = now().toISOString();
      const item = { ...data, id: randomUUID(), createdAt: t, updatedAt: t };
      await d.set(key, item.id, encode(item));
      return item;
    },
    async update(id, data) {
      assertPlainObject(data);
      const current = decode(await d.get(key, String(id)));
      if (!current) return null;
      const item = { ...data, id: current.id, createdAt: current.createdAt, updatedAt: now().toISOString() };
      await d.set(key, item.id, encode(item));
      return item;
    },
    async remove(id) {
      return d.del(key, String(id));
    },
  };
}
