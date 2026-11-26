import express from 'express';
import { KOMODITAS, PROVINSI, BULAN, SUMBER } from '../lib/harga.js';

export const app = express();
app.use(express.json());

// Contoh route: daftar id komoditas, provinsi, dan bulan untuk mengisi form.
app.get('/api/referensi', (req, res) => {
  res.json({ komoditas: KOMODITAS, provinsi: PROVINSI, bulan: BULAN, sumber: SUMBER });
});

// TODO kelompok (Sesi 7): GET /api/harga?komoditas=…&provinsi=…&periode=YYYY-MM:YYYY-MM
//   - Komoditas tidak dikenal (mutu lain) -> 400 dengan pesan "mutu lain tidak dicampur".
//   - Provinsi tidak dikenal, periode salah format, atau bulan awal setelah bulan akhir -> 400.
//   - Ambil data dengan ambilHarga() dari ../lib/harga.js (sudah berisi pasar_sama dan volatilitas).
//   - Hitung persen perubahan dengan fungsi buatan kelompok, misalnya di server/hitung.js,
//     dari pasar_sama.rata_awal dan pasar_sama.rata_akhir. Nol atau kosong -> null, bukan dibagi.
//   - Kirim hasilnya sebagai JSON beserta SUMBER (atribusi).

// TODO kelompok (Sesi 7–8): CRUD /api/pantauan
//   - Simpan lewat createStore('pantauan') dari ../lib/adapter.js (lihat README).
//   - Field: provinsi, catatan, status. Validasi semuanya di server, jangan hanya di form.
//   - GET /api/pantauan -> 200 berisi daftar.
//   - POST -> 201 kalau berhasil; 400 + pesan per field kalau tidak valid (termasuk body kosong).
//   - PUT /api/pantauan/:id -> 200; 400 kalau tidak valid; 404 kalau id tidak ada.
//   - DELETE /api/pantauan/:id -> 204; 404 kalau id tidak ada.
//   - Simpan hanya field yang diizinkan; jangan langsung menyimpan seluruh req.body.
