# Dasbor Harga Pangan Daerah — Kelompok 5 (Jalur A)

Dasbor Harga Pangan Daerah: Beras dan Pangan Pokok per Provinsi (Target SDG 2.c).
Final Project Web Development, kelompok 5.

> Status: repo baru dibuat. Kode aplikasi belum ada.

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
- Perbandingan perubahan memakai pasar yang sama pada kedua bulan.
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

## Sandbox API dan adapter dari mentor

**Sandbox API (latihan fetch, Sesi 6):** https://dasbor-pangan-sandbox.vercel.app. Isinya baca saja, dengan bentuk `GET /api/harga` yang sama seperti kontrak di atas. Daftar id komoditas dan provinsi ada di `GET /api/referensi`. Setelah backend kelompok jadi, ganti base URL ke API sendiri.

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

| Nama | Peran | GitHub |
|---|---|---|
| _belum diisi_ | | |
| _belum diisi_ | | |
| _belum diisi_ | | |

## Pengumpulan

Link Vercel, repo GitHub, README ini, ZIP tanpa `node_modules`/`.env`, bukti uji, slide, dan kontribusi tiap anggota.

## Sumber dan lisensi data

WFP/HDX — Indonesia Food Prices: https://data.humdata.org/dataset/wfp-food-prices-for-indonesia
Lisensi: CC BY-IGO.
