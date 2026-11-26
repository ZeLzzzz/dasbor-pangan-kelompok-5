// Mentor data helper. Copy this file to lib/harga.js in a group repo (next to data/snapshot/).
//
//   import { ambilHarga, KOMODITAS, PROVINSI, BULAN, SUMBER } from './lib/harga.js';
//
//   KOMODITAS  -> [{ id: 'beras-medium', label: 'Beras (mutu medium)' }, ...]
//   PROVINSI   -> [{ id: 'aceh', label: 'ACEH' }, ...]
//   BULAN      -> ['2020-01', ..., '2024-05']
//   SUMBER     -> { atribusi, url, lisensi, tanggal_unduh }
//
//   ambilHarga({ komoditas: 'beras-medium', provinsi: 'bali', dari: '2023-01', sampai: '2024-01' })
//   -> {
//        komoditas, provinsi, dari, sampai, satuan: 'IDR/kg',
//        bulan_terakhir_seri: '2024-05',   // last month with data for this commodity + province
//        bulan_tanpa_data: [...],          // months in the period with no data (not zero!)
//        data: [{ bulan, rata_rata, median, min, max, n_pasar, n_pasar_panel, cakupan }, ...],
//        pasar_sama: { n_pasar, rata_awal, rata_akhir },  // markets present in BOTH dari and sampai
//        volatilitas: { cv, n_bulan, alasan },            // CV in percent; null when it cannot be computed
//      }
//
// The helper does NOT validate input: check komoditas, provinsi, and the period in your route first
// and answer 400 for bad input. Unknown ids make it throw. The percent change itself is computed by
// the group from pasar_sama.rata_awal and pasar_sama.rata_akhir.
import meta from '../data/snapshot/meta.json' with { type: 'json' };
import referensi from '../data/snapshot/referensi.json' with { type: 'json' };
import agregat from '../data/snapshot/agregat-bulanan.json' with { type: 'json' };
import hargaPasar from '../data/snapshot/harga-pasar.json' with { type: 'json' };

export const KOMODITAS = referensi.komoditas.map(({ id, label }) => ({ id, label }));
export const PROVINSI = referensi.provinsi.map(({ id, label }) => ({ id, label }));
export const BULAN = [...referensi.bulan];
export const SUMBER = {
  atribusi: meta.sumber.atribusi,
  url: meta.sumber.url,
  lisensi: meta.sumber.lisensi,
  tanggal_unduh: meta.sumber.tanggal_unduh,
};
export const METODE = [
  ...meta.metode,
  'pasar_sama: rata-rata bulan awal dan akhir dihitung hanya dari pasar yang memiliki data pada kedua bulan.',
  'volatilitas.cv = simpangan baku populasi ÷ rata-rata × 100 dari rata-rata bulanan pada periode; minimal 2 bulan berdata dan rata-rata positif.',
];

const round2 = (n) => Math.round(n * 100) / 100;
const mean = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;
const KOM_IDS = new Set(KOMODITAS.map((k) => k.id));
const PROV_IDS = new Set(PROVINSI.map((p) => p.id));

export function pasarSama(byMarket, dari, sampai) {
  const pairs = Object.values(byMarket ?? {})
    .map((m) => [m[dari], m[sampai]])
    .filter(([a, b]) => typeof a === 'number' && typeof b === 'number');
  if (dari === sampai || !pairs.length) return { n_pasar: pairs.length, rata_awal: null, rata_akhir: null };
  return { n_pasar: pairs.length, rata_awal: round2(mean(pairs.map((p) => p[0]))), rata_akhir: round2(mean(pairs.map((p) => p[1]))) };
}

export function volatilitas(values) {
  const xs = values.filter((v) => typeof v === 'number' && Number.isFinite(v));
  if (xs.length < 2) return { cv: null, n_bulan: xs.length, alasan: 'Butuh minimal 2 bulan berdata.' };
  const m = mean(xs);
  if (m <= 0) return { cv: null, n_bulan: xs.length, alasan: 'Rata-rata tidak positif.' };
  const sd = Math.sqrt(mean(xs.map((x) => (x - m) ** 2)));
  return { cv: round2((sd / m) * 100), n_bulan: xs.length, alasan: null };
}

export function ambilHarga({ komoditas, provinsi, dari = BULAN[0], sampai = BULAN.at(-1) }) {
  if (!KOM_IDS.has(komoditas)) throw new Error(`Komoditas tidak dikenal: ${komoditas}`);
  if (!PROV_IDS.has(provinsi)) throw new Error(`Provinsi tidak dikenal: ${provinsi}`);

  const data = agregat
    .filter((r) => r.komoditas === komoditas && r.provinsi === provinsi && r.bulan >= dari && r.bulan <= sampai)
    .map(({ komoditas: _k, provinsi: _p, ...rest }) => rest);
  const ada = new Set(data.map((r) => r.bulan));
  const seri = referensi.seri.find((s) => s.komoditas === komoditas && s.provinsi === provinsi);

  return {
    komoditas,
    provinsi,
    dari,
    sampai,
    satuan: 'IDR/kg',
    bulan_terakhir_seri: seri?.bulan_terakhir ?? null,
    bulan_tanpa_data: BULAN.filter((m) => m >= dari && m <= sampai && !ada.has(m)),
    data,
    pasar_sama: pasarSama(hargaPasar[komoditas]?.[provinsi], dari, sampai),
    volatilitas: volatilitas(data.map((r) => r.rata_rata)),
  };
}
