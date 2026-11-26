# Snapshot data harga (dari mentor)

Berkas di `snapshot/` dibekukan dan disiapkan mentor dari CSV WFP/HDX yang diunduh 2026-11-24. **Jangan diedit.** Kalau ada data yang terlihat salah, laporkan ke mentor.

| Berkas | Isi | Boleh ke browser? |
|---|---|---|
| `meta.json` | Sumber, lisensi, filter, metode, batas | Ya |
| `referensi.json` | Id/label komoditas dan provinsi, daftar bulan, cakupan per seri (`seri`) | Ya |
| `agregat-bulanan.json` | Per komoditas × provinsi × bulan: `n_pasar`, `n_pasar_panel`, `cakupan`, `rata_rata`, `median`, `min`, `max` | Ya, setelah difilter di server |
| `harga-pasar.json` | Harga per pasar per bulan: `{ komoditas: { provinsi: { market_id: { "YYYY-MM": harga } } } }` | **Tidak**, khusus server |
| `pasar.json` | Daftar pasar | Ya |

## Yang perlu diperhatikan

- Isi snapshot: beras mutu medium, gula lokal, minyak nabati; Retail, IDR, per kg, `priceflag=aggregate`; 34 provinsi; Jan 2020–Mei 2024; 31.181 baris harga pasar. National Average dan seri `actual` tidak ada.
- `rata_rata` adalah rata-rata tak berbobot pasar yang punya data. Ini **bukan** harga provinsi.
- **Bulan terakhir berbeda antarseri.** Banyak seri berhenti di 2024-01. Ambil dari `referensi.json > seri[].bulan_terakhir`, jangan dianggap Mei 2024.
- Sebagian seri punya bulan kosong (`seri[].bulan_kosong`). Bulan kosong bukan harga nol.
- Persen perubahan antarbulan memakai **pasar yang sama** di kedua bulan, bukan selisih dua `rata_rata`. Rata-rata pasar sama sudah disiapkan `lib/harga.js` (`pasar_sama`); jangan membaca `harga-pasar.json` langsung.

Atribusi wajib tampil di aplikasi: Data: World Food Programme (WFP), via Humanitarian Data Exchange (HDX). Lisensi CC BY-IGO.
