# Dasbor Harga Pangan Daerah — Kelompok 5 (Jalur A)

Dasbor Harga Pangan Daerah: Beras dan Pangan Pokok per Provinsi (Target SDG 2.c).
Final Project Web Development, kelompok 5.

> Status: struktur proyek dan bahan mentor sudah siap. Halaman, route `/api/harga`, dan CRUD `/api/pantauan` dikerjakan kelompok.

## Studi kasus — Jalur A

Konsumen melihat harga beras mutu medium di provinsi pilihan beserta perubahannya selama periode data yang tersedia.

Pertanyaan utama: bagaimana menampilkan tren dan daftar pantauan dengan mutu, satuan, periode, dan cakupan pasar yang jelas?

Arah SDG 2.c: akses informasi pasar pangan. Aplikasi ini tidak membuktikan stabilisasi harga. Manfaat proyek dinilai dari bukti tugas; dampak ke masyarakat belum dianggap terukur.

## Latar belakang

WFP/HDX menyediakan data harga komoditas dan tabel pasar Indonesia. Berkasnya memuat beberapa mutu komoditas, seri `actual` dan `aggregate`, serta baris National Average. Kalau semuanya dicampur, perbandingannya bisa keliru. Aplikasi ini membantu membaca tren pada periode data. Aplikasi ini **tidak** menunjukkan harga toko atau harga hari ini.

## Fitur yang direncanakan

- Filter komoditas, provinsi, dan periode.
- Tren harga.
- Perbandingan perubahan harga.
- CRUD daftar pantauan.

## Aturan data

- Subset: Rice (medium quality); Retail, IDR, KG, `priceflag=aggregate`. National Average dikeluarkan dan seri `actual` tidak dicampur.
- Agregasi: rata-rata tak berbobot dari pasar yang memiliki data. Ini **bukan** harga representatif provinsi atau nasional.
- Tampilkan jumlah pasar (n) dan flag cakupan.
- Perbandingan perubahan memakai pasar yang sama pada kedua bulan. Rata-rata pasar sama sudah disediakan helper (`pasar_sama.rata_awal` dan `pasar_sama.rata_akhir`); kelompok menulis rumus persen perubahannya sendiri.
- Acuan nol atau tidak tersedia menghasilkan "tidak dapat dihitung".
- Tampilkan bulan terakhir data, metode, dan atribusi WFP/HDX.
- Bulan terakhir berbeda antarseri; ambil dari `data/snapshot/referensi.json`, jangan dianggap Mei 2024. Bulan kosong bukan harga nol.

Snapshot data dari mentor ada di `data/snapshot/`; penjelasannya di `data/README.md`. Snapshot itu juga memuat gula lokal dan minyak nabati karena dipakai bersama Jalur B; Jalur A cukup memakai `beras-medium`.

## Kontrak API

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/harga?komoditas=…&provinsi=…&periode=…` | Data harga agregat (baca saja) |
| GET | `/api/pantauan` | Daftar pantauan |
| POST | `/api/pantauan` | Tambah pantauan |
| PUT | `/api/pantauan/:id` | Ubah pantauan |
| DELETE | `/api/pantauan/:id` | Hapus pantauan |

- Format `periode`: `YYYY-MM:YYYY-MM` (dari:sampai, inklusif), misalnya `2023-01:2024-05`, atau satu bulan `YYYY-MM`. Kalau kosong, dipakai seluruh periode data.
- Untuk latihan fetch Sesi 6, mentor menyediakan sandbox API dengan bentuk `GET /api/harga` yang sama.
- Server mengirim agregat, bukan seluruh baris CSV, ke browser.
- Data harga hanya dibaca. Data pantauan disimpan lewat adapter penyimpanan dari mentor, karena array di server atau file JSON lokal tidak cukup untuk persistensi di Vercel.

## Struktur folder

```
public/            Halaman web: index.html, app.js (frontend). Tayang di GitHub Pages dan Vercel.
server/app.js      Aplikasi Express: route /api/... (backend).
server.js          Menjalankan aplikasi di komputer sendiri.
api/index.js       Penghubung ke Vercel. Jangan diubah.
lib/harga.js       Helper data dari mentor. Jangan diubah.
lib/adapter.js     Adapter penyimpanan dari mentor. Jangan diubah.
data/snapshot/     Snapshot data harga dari mentor. Jangan diubah.
test/              Tes otomatis (npm test).
vercel.json        Konfigurasi Vercel. Jangan diubah.
.github/workflows/ Deploy otomatis ke GitHub Pages. Jangan diubah.
```

## Menjalankan di komputer sendiri

```bash
npm install
cp .env.example .env     # isi nilainya dari mentor; tanpa database bisa pakai ADAPTER_DRIVER=memory
npm run dev              # buka http://localhost:3000
npm test
```

- **GitHub Pages** (sampai Sesi 6): isi `public/` otomatis tayang di https://zelzzzz.github.io/dasbor-pangan-kelompok-5/ setiap ada merge ke `main`. Pages tidak menjalankan Express, jadi fetch data memakai sandbox.
- **Vercel** (mulai Sesi 8): halaman dan API jalan bersama. Fetch ke API sendiri cukup pakai path relatif, misalnya `fetch('api/harga?...')`.
- Pakai **path relatif** untuk file di `public/` (`app.js`, bukan `/app.js`), karena alamat Pages diawali nama repo.

## Konvensi

- Jangan push langsung ke `main`. Buat branch, push, lalu buka pull request (PR) dan minta satu anggota lain me-review.
- Nama branch: `jenis/deskripsi-singkat`, misalnya `feat/form-provinsi`, `fix/tabel-mobile`, `docs/readme-anggota`.
- Pesan commit memakai format Conventional Commits dalam bahasa Inggris: `feat: add province form`, `fix: handle empty price`, `docs: add member list`.
- Commit kecil dan sering. Setiap anggota harus punya commit di riwayat repo.
- File yang ditandai "Jangan diubah" di atas berasal dari mentor. Kalau ada masalah, laporkan ke mentor.

## Jadwal koordinasi

_Belum ditentukan._

## Bahan dari mentor

**Sandbox API (latihan fetch, Sesi 6):** https://dasbor-pangan-sandbox.vercel.app. Isinya baca saja, dengan bentuk `GET /api/harga` yang sama seperti kontrak di atas. Daftar id komoditas dan provinsi ada di `GET /api/referensi`. Setelah backend kelompok jadi, ganti base URL ke API sendiri.

**Helper data (Sesi 7–8):** `lib/harga.js` membaca snapshot untuk route `/api/harga`. **Jangan diubah.**

```js
import { ambilHarga, KOMODITAS, PROVINSI, BULAN, SUMBER } from '../lib/harga.js';
const hasil = ambilHarga({ komoditas: 'beras-medium', provinsi: 'bali', dari: '2023-01', sampai: '2024-01' });
// hasil.data              -> per bulan: rata_rata, median, min, max, n_pasar, n_pasar_panel, cakupan
// hasil.pasar_sama        -> { n_pasar, rata_awal, rata_akhir } dari pasar yang punya data di kedua bulan
// hasil.volatilitas       -> { cv, n_bulan, alasan }
// hasil.bulan_terakhir_seri, hasil.bulan_tanpa_data
```

- Helper **tidak** memvalidasi input. Cek komoditas, provinsi, dan periode di route lebih dulu dan jawab 400 kalau salah; id yang tidak dikenal membuat helper error.
- Persen perubahan **tidak** dihitung helper. Kelompok menulis fungsinya sendiri dari `rata_awal` dan `rata_akhir`, termasuk penanganan nol atau kosong (lihat Uji wajib).

**Adapter penyimpanan (Sesi 7–8):** `lib/adapter.js` dipakai untuk CRUD `/api/pantauan`. **Jangan diubah;** kalau ada masalah, laporkan ke mentor.

```js
import { createStore } from './lib/adapter.js';
const pantauan = createStore('pantauan');
await pantauan.list();            // semua data, urut waktu dibuat
await pantauan.get(id);           // satu data atau null
await pantauan.create(data);      // data + id, createdAt, updatedAt
await pantauan.update(id, data);  // ganti isi field; null kalau id tidak ada
await pantauan.remove(id);        // true / false
```

- Adapter hanya menyimpan objek. Validasi field, status HTTP (400/404/...), dan aturan kasus ditulis kelompok di route Express.
- `id`, `createdAt`, dan `updatedAt` diatur adapter dan tidak boleh dikirim dari form. Satu data maksimal 10 KB.
- Kredensial database sudah terpasang di project Vercel kelompok. Untuk lokal, salin `.env.example` ke `.env` dan isi nilainya dari mentor (atau `vercel env pull`). `.env` tidak boleh di-commit.
- `ADAPTER_NAMESPACE` harus `kelompok-5`. Tanpa kredensial, adapter menolak jalan; `ADAPTER_DRIVER=memory` hanya untuk lokal dan ditolak di Vercel.

## Uji wajib

- Kenaikan 10.000 → 12.000 = +20%.
- Harga nol atau kosong tidak menjadi pembagi.
- Campuran mutu atau priceflag ditolak, dan jumlah pasar tampil.

## Teknologi

HTML, Tailwind CSS, JavaScript (DOM, fetch), Express.js, GitHub, Vercel.

## Anggota

Setiap anggota mengisi barisnya sendiri lewat PR.

| Nama | Peran | GitHub |
|---|---|---|
| _belum diisi_ | Frontend | |
| _belum diisi_ | Backend | |
| _belum diisi_ | Integrasi | |
| _belum diisi_ | Pengujian | |

## Pengumpulan

Link Vercel, repo GitHub, README ini, ZIP tanpa `node_modules`/`.env`, bukti uji, slide, dan kontribusi tiap anggota.

## Sumber dan lisensi data

WFP/HDX — Indonesia Food Prices: https://data.humdata.org/dataset/wfp-food-prices-for-indonesia
Lisensi: CC BY-IGO.
