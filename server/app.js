import express from 'express';
import { KOMODITAS, PROVINSI, BULAN, SUMBER } from '../lib/harga.js';

export const app = express();
app.use(express.json());

// Contoh route: daftar id komoditas, provinsi, dan bulan untuk mengisi form.
app.get('/api/referensi', (req, res) => {
  res.json({ komoditas: KOMODITAS, provinsi: PROVINSI, bulan: BULAN, sumber: SUMBER });
});

// TODO kelompok: GET /api/harga?komoditas=…&provinsi=…&periode=YYYY-MM:YYYY-MM
//   - Validasi parameter; input salah dijawab 400 dengan pesan yang jelas.
//   - Ambil data dengan ambilHarga() dari ../lib/harga.js.
//   - Hitung persen perubahan dari pasar_sama.rata_awal dan pasar_sama.rata_akhir.

// TODO kelompok: CRUD /api/pantauan (GET, POST, PUT /:id, DELETE /:id)
//   - Simpan lewat createStore('pantauan') dari ../lib/adapter.js.
//   - Validasi field; status 201/400/404 sesuai README.
