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

// TODO kelompok (uji wajib): buat file tes baru, misalnya test/hitung.test.js, untuk fungsi persen perubahan:
//   - 10.000 ke 12.000 = 20
//   - harga acuan 0, null, atau undefined -> null (tidak dibagi)
// TODO kelompok (uji wajib): tes route /api/harga menolak komoditas lain (400) dan hasilnya memuat jumlah pasar.
// Uji wajib juga boleh dibuktikan dengan tangkapan layar atau Postman; simpan buktinya untuk pengumpulan.
