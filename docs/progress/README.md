# Laporan Progress WaliLink

**Tanggal laporan:** 9 November 2026
**Acuan:** [Blueprint](../blueprint/README.md) dan status repository/deployment yang diperiksa pada tanggal laporan.

## Ringkasan

WaliLink sudah memiliki fondasi aplikasi React/Vite, integrasi Supabase untuk alur wali dan sebagian data, data simulasi yang ditandai, serta domain publik yang merespons. Namun aplikasi **belum siap dianggap selesai atau siap produksi**: beberapa modul masih lokal/simulasi, alur signup belum diuji end-to-end dengan email nyata, website publik penerimaan dan panel persetujuan belum dibangun, dan autentikasi/otorisasi admin belum dituntaskan.

Perubahan terbaru pada pendaftaran wali menambahkan pencarian saran nama anak setelah email diverifikasi. Saran dibatasi oleh policy RLS yang ada; tanggal lahir tetap diperiksa sebelum akun ditautkan. Build lokal berhasil, tetapi perubahan tersebut masih lokal dan belum di-deploy.

## Arti Status

- **Tercapai:** implementasi dan bukti keberadaannya tersedia.
- **Parsial:** sebagian berjalan, tetapi masih ada skenario, konfigurasi, atau integrasi yang belum selesai.
- **Belum:** belum ada implementasi yang memenuhi tujuan blueprint.
- **Perlu verifikasi:** kode atau konfigurasi terlihat tersedia, tetapi belum diuji pada kondisi sebenarnya.

## Kemajuan Berdasarkan Fase Blueprint

| Fase | Status | Progress dan batas yang diketahui |
| --- | --- | --- |
| 0 — Fondasi | **Parsial** | Aplikasi React/Vite, client Supabase, Auth wali, RLS inti, query Beranda, dan build tersedia. Domain `bytesights.my.id` merespons HTTP 200 saat diperiksa. Konfigurasi environment Cloudflare terbaru, redirect Auth, email produksi, dan signup end-to-end belum terverifikasi. |
| 1 — Aktivasi akun wali | **Parsial** | Signup email/password, konfirmasi email, pencocokan record wali/santri, dan linking UID tersedia. Perubahan lokal terbaru menambahkan saran nama yang hanya muncul sesudah email dikonfirmasi serta pemeriksaan tanggal lahir. Belum diuji end-to-end dengan email nyata dan deployment belum memuat perubahan lokal. Resend, reset password, dan recovery terstruktur masih perlu dikerjakan. |
| 2 — Website publik dan admissions | **Belum** | Blueprint halaman publik dan pendaftaran masih berupa rancangan. Tabel pengajuan, status, audit trail, form publik, antrean review admin, serta approval belum tersedia sebagai workflow lengkap. |
| 3 — Produk wali | **Parsial** | Beranda dan beberapa data wali telah dihubungkan ke Supabase; presensi, kedisiplinan, dan data demo sudah disiapkan. Pembayaran bank/gateway nyata belum ada. Album/media privat, CRUD yang terkontrol, notifikasi, profil, dan modul lain masih perlu audit/integrasi per fitur. |
| 4 — Admin dan operasional | **Belum / parsial** | Sebagian layar admin tersedia, tetapi blueprint mencatat statistik, kredensial, dan beberapa operasi masih lokal atau mock. Auth admin berbasis role server-side, pembatasan permission, serta CRUD/audit operasional belum siap produksi. |
| 5 — Go-live dan Phone Auth | **Belum** | Domain publik merespons, tetapi ini tidak membuktikan konfigurasi Auth/SMTP, security review, test lintas role, backup, monitoring, dan kesiapan produksi. Phone Auth tetap rencana tahap lanjut. |

## Yang Sudah Tercapai

- Kerangka aplikasi React/Vite, alur layar wali, dan build produksi tersedia.
- Supabase Auth wali menggunakan email/password; record wali ditautkan dengan Auth UID.
- Policy RLS membatasi pembacaan record wali/santri pada email yang sudah diverifikasi dan tercatat; update oleh wali dibatasi pada `auth_user_id`.
- Beranda wali mengambil sebagian ringkasan dari Supabase, bukan hanya dari fixture lokal.
- Data simulasi untuk akun demo telah disiapkan di database: 5 catatan presensi, 1 catatan kedisiplinan, 3 notifikasi, serta 4 transaksi e-money dengan saldo ledger Rp185.000. Data tersebut adalah **simulasi**, bukan transaksi atau saldo bank.
- Domain `https://bytesights.my.id` membalas HTTP 200 saat diperiksa. Ini hanya bukti endpoint merespons, bukan bukti semua environment atau alur Auth berfungsi.
- Perubahan signup terbaru lulus `npm run build` dan `git diff --check`.

## Perubahan Tambahan di Luar Blueprint Awal

- Tabel `student_attendance` dan `student_discipline_records` serta policy baca wali ditambahkan untuk mendukung presensi dan kedisiplinan.
- Data contoh presensi, kedisiplinan, notifikasi, dan e-money dibuat untuk akun demo dan ditandai sebagai simulasi.
- Signup wali ditingkatkan: verifikasi email dilakukan sebelum daftar anak ditampilkan; pencarian nama mengambil saran dari data yang dapat dibaca oleh email terverifikasi; pengguna wajib memilih saran dan memberikan tanggal lahir yang cocok.
- Session pendaftaran email terverifikasi yang belum ditautkan dipulihkan ke layar signup saat aplikasi dibuka kembali.
- Domain custom Cloudflare telah dikaitkan dan merespons; hasil terbaru konfigurasi environment build Cloudflare tetap perlu diuji.

## Yang Perlu Diperbaiki atau Dilengkapi

### Prioritas 1 — Tutup alur pendaftaran wali

1. Deploy perubahan signup terbaru setelah perubahan lokal ditinjau dan digabungkan dengan commit remote yang belum ada di checkout ini.
2. Pastikan Cloudflare Production memiliki `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY`, lalu redeploy. Jangan pernah memasang service-role/secret key pada client.
3. Pastikan Supabase Auth mengizinkan redirect URL production yang benar dan email konfirmasi dapat dikirim melalui konfigurasi SMTP yang sesuai.
4. Uji jalur nyata: email wali benar/salah, email belum diverifikasi, nama tidak dipilih dari suggestion, tanggal lahir salah, data wali sudah tertaut, buka ulang aplikasi setelah konfirmasi, dan login setelah akun aktif.
5. Tambahkan recovery yang jelas untuk user Auth yang berhasil dibuat tetapi proses linking gagal; pertimbangkan resend confirmation dan reset password dengan pembatasan percobaan.

### Prioritas 2 — Amankan dan validasi akses data

- Otomatiskan uji RLS: anon, wali yang sesuai, wali lain, dan akun yang belum tertaut. Pastikan nama santri tidak dapat dicari secara global.
- Tinjau temuan keamanan project dan fungsi berhak tinggi yang tercatat dalam checkpoint sebelumnya; jangan menganggap keamanan produksi selesai sebelum temuan ditangani atau dinilai.
- Tanggal lahir adalah data pribadi. Pertahankan sebagai pemeriksaan tambahan, minimalkan paparan data, dan jangan menjadikannya satu-satunya faktor verifikasi.
- Pastikan semua nilai simulasi diberi label sehingga tidak tampak sebagai informasi bank atau catatan resmi.

### Prioritas 3 — Selesaikan produk dan operasional

- Bangun website publik dan admissions workflow sesuai Blueprint fase 2: staging table, verifikasi kontak, review, keputusan, audit trail, dan provisioning atomik/idempotent.
- Ganti kredensial dan role admin lokal/hard-coded dengan Supabase Auth serta permission yang ditentukan server-side.
- Audit setiap menu wali dan tandai sumber data: Supabase, data simulasi, lokal, atau belum tersedia. Lengkapi loading/error/empty states dan CRUD sesuai hak akses.
- Untuk pembayaran, integrasikan provider/webhook dan rekonsiliasi sebelum menyatakan transaksi berhasil; e-money harus memakai ledger yang dikendalikan server.
- Lengkapi backup, monitoring, pengiriman email domain, kebijakan retensi, serta prosedur pemulihan sebelum go-live.

## Status Repository dan Deployment

- Checkout pada saat laporan berada di branch `main` dan **tertinggal 1 commit** dari `origin/main`. Sinkronkan dengan hati-hati sebelum commit/push; jangan menimpa commit remote.
- Perubahan signup yang dijelaskan di atas masih berupa perubahan lokal pada `src/app/App.tsx`, `src/app/components/GuardianEmailRegistration.tsx`, dan `src/app/services/AuthService.ts`; belum dipush/deploy.
- Ada direktori tidak terlacak `supabase/functions/demo-bootstrap/`. Tinjau isinya dan pastikan tidak ada kredensial demo hard-coded atau konfigurasi yang tidak aman sebelum memasukkan atau mendeploy direktori tersebut.
- `npm run build` berhasil. Vite masih memberi peringatan bahwa bundle JavaScript utama melebihi 500 KB; optimasi pemecahan bundle belum dilakukan.
- Dokumen ini tidak mengubah database, menjalankan deployment, atau melakukan push.

## Urutan Tindak Lanjut yang Disarankan

1. Sinkronkan branch dengan remote tanpa membuang perubahan lokal.
2. Tinjau dan uji ulang diff signup, lalu deploy build baru.
3. Jalankan uji pendaftaran nyata dan verifikasi RLS untuk dua wali berbeda.
4. Tutup masalah email/redirect/recovery yang ditemukan dari pengujian.
5. Lanjutkan admissions workflow dan autentikasi admin sebelum menambah fitur publik atau operasi berisiko.
6. Audit menu wali satu per satu, bedakan data resmi dan simulasi, lalu rilis bertahap.

## Dokumen Blueprint Terkait

- [Ringkasan blueprint](../blueprint/README.md)
- [Kondisi aplikasi](../blueprint/01-current-state.md)
- [Arsitektur, data, dan keamanan](../blueprint/02-architecture-data-security.md)
- [Website publik dan admissions](../blueprint/03-public-website-admissions.md)
- [Roadmap dan kriteria selesai](../blueprint/04-roadmap.md)
