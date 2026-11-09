# 06. Audit File dan Batas Cleanup

Tanggal audit: 17 Oktober 2026. Scope mencakup source/runtime aplikasi, entrypoint, config/build, dokumentasi, migrations, dan file Git yang terlacak. Dependency internals di `node_modules` tidak ditinjau satu per satu karena dihasilkan dari package manager.

## Metode

- Telusuri entrypoint `src/main.tsx` dan screen graph `src/app/App.tsx`.
- Cari import/referensi pada source TypeScript/TSX.
- Bandingkan package/config, dokumen, assets, dan folder Supabase.
- Jalankan `npm run build` setelah cleanup.

## Dihapus Karena Terbukti Orphan

Empat komponen berikut merupakan mockup dashboard generik terpisah dari WaliLink; `Dashboard.tsx` tidak diimpor oleh entrypoint, dan tiga komponennya hanya diimpor oleh file tersebut:

- `src/app/components/Dashboard.tsx`
- `src/app/components/OverviewChart.tsx`
- `src/app/components/UserManagement.tsx`
- `src/app/components/SettingsPanel.tsx`

Setelah penghapusan, pencarian tidak menemukan referensi tersisa dan build produksi berhasil. Ini satu-satunya source-code group yang dihapus pada audit ini.

## Dipertahankan Dengan Sengaja

| Kandidat | Alasan tidak dihapus |
| --- | --- |
| `src/app/components/Posture*.tsx` | Tidak masuk alur utama `App`, tetapi membentuk satu prototipe fitur yang saling memakai. Mungkin eksperimen lama atau fitur mendatang; perlu keputusan pemilik sebelum dihapus. |
| `src/app/components/admin/*` | Beberapa layar masih mock, tetapi terhubung dari admin flow. Perbaiki/migrasikan bertahap, jangan dihapus hanya karena datanya belum remote. |
| `src/app/supabase/functions/server/*` | Jalur backend alternatif; deployment/reference saat ini belum final, tetapi berpotensi dipakai. Audit/decommission terpisah diperlukan. |
| `public/data/*`, assets, Android, fonts, UI primitives | Dapat dipakai runtime, build, atau target mobile; tidak aman menyimpulkan unused dari satu import search. |
| `guidelines/Guidelines.md` yang kosong | File placeholder; tidak merusak build dan bisa punya tujuan tooling. Dibiarkan sampai fungsinya diputuskan. |
| `utils/supabase/info.tsx` / project IDs lama | Tampak stale, tetapi generated integration/config mungkin dipakai di luar entrypoint saat ini. Verifikasi target sebelum menghapus. |

## Dependency dan Salinan Bersarang

- Repository melacak sekitar **55 ribu** file pada root `node_modules` dan **25 ribu** file pada salinan bersarang. Dependency root dibutuhkan untuk build lokal; package dapat dipasang ulang dari lockfile, tetapi file sudah tracked sehingga `.gitignore` saja tidak mengeluarkannya dari Git.
- Folder `WaliLink-main/` berisi salinan config/dokumentasi/package dan dependency, tetapi tidak terlihat memiliki source `src` untuk aplikasi kedua. Tidak ada referensi dari entrypoint aktif. Ini kandidat arsip/copy yang sangat mungkin tidak diperlukan.
- Tidak dilakukan `git rm --cached -r` atau penghapusan direktori massal: tindakan itu akan menghasilkan puluhan ribu perubahan Git dan dapat membuang arsip yang sengaja disimpan. Minta persetujuan khusus sebelum membersihkan dependency tracked atau salinan nested.
- `.gitignore` kini mengabaikan `node_modules/`, `dist/`, `coverage/`, `.env`, serta env lokal. Aturan ignore mencegah file baru, tetapi tidak otomatis untrack file yang sudah ada.
- Dependency `@supabase/server` tidak ditemukan dalam import aplikasi Vite saat audit. Kemungkinan belum diperlukan untuk client-side Auth, tetapi dipertahankan karena baru dipasang dan mungkin sedang dipertimbangkan untuk backend.

## Keputusan Audit

Cleanup otomatis dibatasi pada empat mockup orphan. Tidak ada penghapusan migration, database, schema, auth, assets, native Android, atau backup. Setelah penghapusan, `npm run build` berhasil.

Jika ingin tahap cleanup berikutnya, keputusan yang dibutuhkan hanya: apakah nested copy `WaliLink-main/` dan dependency `node_modules` yang sudah tracked boleh dikeluarkan dari repository. Folder dependency lokal dapat dipertahankan di disk sambil di-untrack Git, tetapi push akan memuat commit penghapusan file tracked yang sangat besar.
