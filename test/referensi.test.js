import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../server/app.js';

let server;
let base;
before(async () => {
  server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

// Contoh tes route. Tes untuk /api/harga, /api/pantauan, dan uji wajib ditulis kelompok.
test('GET /api/referensi mengembalikan daftar provinsi dan bulan', async () => {
  const res = await fetch(`${base}/api/referensi`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.provinsi.length, 34);
  assert.equal(body.bulan[0], '2020-01');
});
