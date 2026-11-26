// JavaScript halaman (DOM dan fetch) ditulis di sini.
// Pakai path relatif untuk file di folder ini, misalnya src="app.js", bukan "/app.js".
// Petunjuk mentor di bawah menjelaskan APA yang dibuat. Hapus setiap TODO setelah bagiannya selesai.

// TODO (Sesi 4): saat tombol "Tampilkan" diklik, cek provinsi sudah dipilih; kalau belum, tampilkan pesan
// TODO (Sesi 4): kirim permintaan hanya saat tombol diklik, jangan setiap kali pilihan berubah atau diketik

// TODO (Sesi 6): isi pilihan provinsi dan bulan dari GET /api/referensi (di sandbox ada endpoint yang sama)
// TODO (Sesi 6): ambil data harga dengan fetch. Sementara pakai sandbox:
//   https://dasbor-pangan-sandbox.vercel.app/api/harga?komoditas=...&provinsi=...&periode=YYYY-MM:YYYY-MM
// TODO (Sesi 6): tampilkan "Memuat..." selama menunggu, lalu hapus setelah data datang
// TODO (Sesi 6): kalau server membalas error (misalnya 400), tampilkan pesan dari server
// TODO (Sesi 6): kalau fetch gagal (koneksi), tampilkan pesan error dan cara mencoba lagi

// TODO (Sesi 6): tampilkan tabel per bulan: bulan, rata-rata harga/kg, jumlah pasar (n_pasar dari n_pasar_panel)
// TODO (Sesi 6): tampilkan persen perubahan awal→akhir; kalau null, tulis "tidak dapat dihitung"
// TODO (Sesi 6): tampilkan bulan terakhir data dan bulan tanpa data (bulan kosong bukan harga nol)
// TODO (Sesi 6): kalau tidak ada data di periode itu, tampilkan pesan, jangan tabel kosong

// TODO (Sesi 7–8): daftar pantauan dari GET /api/pantauan; kalau kosong, tampilkan "belum ada ..."
// TODO (Sesi 7–8): form tambah (provinsi, catatan, status) -> POST /api/pantauan
// TODO (Sesi 7–8): tombol Ubah -> isi form, lalu PUT /api/pantauan/:id; tombol Hapus -> konfirmasi, lalu DELETE
// TODO (Sesi 7–8): tampilkan pesan error validasi dari server di dekat form
// TODO (Sesi 7–8): tampilkan teks dari pengguna dengan textContent, bukan innerHTML

// TODO (Sesi 8): ganti alamat sandbox ke API sendiri dengan path relatif, misalnya fetch('api/harga?...')
