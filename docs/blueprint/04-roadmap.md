# 04. Roadmap dan Kriteria Selesai

Urutan ini meminimalkan perubahan besar sebelum alur wali/approval teruji. Setiap fase punya demo dan acceptance criteria sendiri.

## Fase 0 - Checkpoint Fondasi (sekarang)

Status: sebagian besar selesai.

- Supabase project dan publishable client env tersedia; `.env.local` tidak masuk Git.
- Email Auth aktif sebagai target sementara; `guardians.email` dan `auth_user_id` tersedia.
- RLS mengunci bacaan wali ke data milik sendiri dan update linker hanya ke `auth_user_id`.
- Beranda wali sudah mengambil ringkasan Supabase.
- Email demo sudah diset pada guardian test; tanggal lahir anak tetap dummy.

**Selesai bila:** build berhasil, row demo diperiksa, email confirmation/SMTP dan redirect lokal dikonfigurasi, signup -> email confirmation -> guardian link -> Beranda dapat diuji end-to-end.

## Fase 1 - Selesaikan Aktivasi Akun Wali

- Gunakan satu email yang bisa diakses untuk test; admin menaruhnya pada approved guardian record.
- Aktifkan Email Confirmations, redirect URL localhost dan production.
- Konfigurasikan custom SMTP jika alamat di luar anggota organisasi tidak menerima email default.
- Uji email salah, anak tidak cocok, email belum verified, duplicate signup, guardian sudah tertaut, dan dua guardian yang berbeda.
- Tambah UI “email sudah digunakan/konfirmasi kedaluwarsa” dan resend confirmation yang rate-limited.
- Tambah password reset dan email-change verification sebelum onboarding wali produksi.

**Selesai bila:** email tidak terkonfirmasi tidak mendapat guardian data; email benar + anak benar hanya membuka data milik guardian itu; email/anak yang salah tidak membocorkan keberadaan row lain.

## Fase 2 - Website Publik dan Admissions MVP

- Bangun satu website dengan menu Beranda, Profil, Program, Fasilitas, Berita, Pendaftaran, Login Wali.
- Buat schema staging `admission_applications` dan audit events, policies, migration serta retention.
- Buat wizard pendaftaran draft -> konfirmasi email -> submitted.
- Bangun admin queue untuk request info/approve/reject dan notifikasi status.
- Approval membuat operational guardian/student rows secara atomik; akun Auth tetap dibuat wali setelah approval.

**Selesai bila:** anonymous hanya membuat application melalui endpoint terkontrol, tidak membaca data siswa; approve menghasilkan row operasional yang dapat diaktivasi; decline tidak menghasilkan akses app.

## Fase 3 - Lengkapi Produk Wali

Urutan modul yang disarankan:

1. Personal/profile: baca Auth + guardian dari DB, update profil melalui policy tervalidasi.
2. Prestasi dan nilai: query `achievements`, `academic_scores`; state kosong/loading/error.
3. Pembayaran: `spp_bills`, bukti bayar storage privat, rekonsiliasi; jangan tampilkan pembayaran sukses sebelum webhook/konfirmasi backend.
4. Kedisiplinan dan kehadiran: finalisasi schema, sumber data petugas, periodisasi, dan audit.
5. Album/notifikasi/chat: akses RLS/storage/realtime yang jelas.
6. E-money: ledger append-only; saldo dihitung/diubah server-side dengan idempotency key, bukan dari browser.

**Selesai bila:** tidak ada angka/riwayat demo tampil sebagai nyata, setiap panel memuat dari DB atau jelas unavailable, dan wali kedua tidak dapat melihat data wali pertama.

## Fase 4 - Admin dan Operasional

- Ganti login/role hard-coded dengan Supabase Auth dan role admin dari tabel protected/server-managed.
- Pisahkan permission admissions, akademik, keuangan, media, dan super-admin.
- Migrasikan form mock ke layanan data ber-audit; semua operasi tulis melalui service/RPC/Edge Function sesuai risiko.
- Tambah logging perubahan, recovery, export, dan prosedur staff offboarding.

**Selesai bila:** role diuji dengan RLS, admin tanpa hak tidak dapat mengubah modul lain, dan tidak ada secret/akun default di source.

## Fase 5 - Go-Live dan Phone Auth

- Verifikasi custom SMTP/domain, rate limits, CAPTCHA, email deliverability, redirects, backups, monitoring, security review.
- Jalankan uji RLS automated dan scenario browser end-to-end di staging sebelum production.
- Jika SMS budget/provider siap, hidupkan Phone Auth, tambahkan phone verification sebagai faktor kontak/MFA atau metode sign-in alternatif.
- Migrasikan nomor telepon terverifikasi dan sediakan flow ganti nomor/recycled number recovery; jangan menjadikan phone sebagai satu-satunya recovery method.

**Selesai bila:** Security Advisor tidak punya issue kritis, test matrix lintas role lulus, backup/incident playbook disetujui, dan roll-back plan tersedia.

## Release Gate Tiap Fase

- Migration, RLS policy, dan rollback/recovery direview.
- `npm run build`, unit/component test terkait, dan e2e journey terkait lulus.
- Uji mobile/desktop, empty/loading/error/duplicate states.
- Update dokumen, data classification, dan release notes.
- Periksa `.env`, logs, fixtures, screenshots, dan seed agar tidak berisi PII/secret produksi.

## Status Eksekusi — 9 November 2026

Status berikut melengkapi checklist fase di atas; checklist dan kriteria selesai yang belum terpenuhi tetap berlaku.

| Fase | Status saat ini | Catatan |
| --- | --- | --- |
| 0 — Fondasi | Parsial | App, client Supabase, RLS inti, query Beranda, dan build tersedia. HTTP 200 domain custom sudah dicek, tetapi konfigurasi production dan Auth belum diuji menyeluruh. |
| 1 — Aktivasi wali | Parsial | Signup email dan linking tersedia; suggestion nama setelah verifikasi email dan restore session dibuat di lokal. Belum di-deploy atau diuji end-to-end. |
| 2 — Admissions | Belum | Website publik dan workflow pengajuan/review/approval masih berupa blueprint. |
| 3 — Produk wali | Parsial | Sebagian Beranda dan data wali terhubung; fitur lain memiliki integrasi parsial, simulasi, atau belum diaudit. |
| 4 — Admin | Belum / parsial | UI ada, tetapi auth role-based dan proses operasional berbasis database belum siap produksi. |
| 5 — Go-live | Belum | SMTP, RLS test matrix, monitoring/backup, review keamanan, dan release gate belum seluruhnya diverifikasi. |

Build lokal untuk perubahan signup terbaru lulus; Vite tetap memberi peringatan ukuran bundle utama di atas 500 KB. Lihat [laporan progress 9 November 2026](../progress/README.md) untuk bukti, gap, status branch, dan urutan tindak lanjut.
