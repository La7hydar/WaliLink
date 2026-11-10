# 01. Kondisi Aplikasi Saat Ini

Status dokumen: hasil pembacaan repository dan Supabase project; bukan spesifikasi semua fitur masa depan.

## Alur Aplikasi

1. Welcome.
2. Pilih server pondok.
3. Pilih login wali, daftar akun wali, atau login admin.
4. Wali login dengan email/password Supabase. Pada implementasi lokal terbaru, pendaftaran meminta verifikasi email terlebih dahulu; setelah email terverifikasi, nama anak dipilih dari saran yang terlihat melalui policy RLS, lalu tanggal lahir dicocokkan sebelum akun ditautkan. Perubahan ini belum di-deploy atau diuji end-to-end.
5. Sesudah akun aktif, aplikasi membuka GuardianApp. Auth UID dipetakan ke `guardians.auth_user_id`; siswa dan ringkasan Beranda dibaca dengan RLS.

Belum ada website penerimaan santri terpisah yang mengirim data ke database. Record guardian/student saat ini dipersiapkan admin lebih dulu; halaman signup aplikasi hanya dapat mencocokkan record tersebut.

## Menu Wali

- **Beranda**: identitas santri, nilai akademik, evaluasi kehadiran, status tagihan, e-money, prestasi, dan ringkasan aktivitas dari Supabase.
- **Pembayaran**: komponen UI tersedia, tetapi aksi detail, payment gateway, dan beberapa nilai masih simulasi/local.
- **Kedisiplinan**: halaman tersedia; riwayat dan chart belum sepenuhnya bersumber dari tabel remote. Skor pelanggaran tidak tersedia pada schema inti saat ini.
- **Prestasi**: UI tersedia; integrasi query/writes perlu audit.
- **Album**: UI tersedia; metadata tabel `albums` ada, tetapi storage dan akses media privat belum menjadi satu alur produksi.
- **Personal**: UI tersedia; beberapa profil/kontak dan preferensi masih hard-coded/local. Tombol navigasi bawah berada di luar area scroll halaman.

## Menu Admin

AdminDashboard memiliki overview, manajemen admin, pengaturan, attendance, students, dan section lain. Banyak nilai statistik, daftar admin, santri contoh, form data, serta autentikasi admin masih hard-coded atau lokal. AdminSectionDashboard berisi pola form generik/mock, bukan kontrol production yang terhubung penuh ke Supabase.

Admin credentials yang ada di kode adalah demo. Jangan gunakan mekanisme tersebut untuk deployment produksi. Admin produksi harus punya Auth session, role tersimpan/ditetapkan server-side, dan policy RLS yang memisahkan hak akses.

## Lapisan Data Saat Ini

- `src/app/supabase/client.ts`: Supabase browser client dari `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY`.
- `AuthService`: login/restore session, email confirmation registration, dan linking UID wali.
- `GuardianHomeService`: query siswa dan ringkasan Beranda.
- `GuardianApp`: konsumsi hasil query Beranda.
- `DataProviderFactory` masih memilih `LocalDataProvider` secara default.
- `RemoteDataProvider` adalah adapter REST API generik dan bukan adapter Supabase yang dipakai oleh layar wali.
- `src/app/services/api.tsx`, initial data, `localStorage`, dan sejumlah komponen masih menyediakan local/mock data.

Karena itu sistem saat ini bersifat **hybrid**, bukan sepenuhnya online ataupun offline. Setiap fitur harus menandai sumber datanya secara eksplisit.

## Schema Supabase Yang Terverifikasi

| Tabel | Peran saat ini |
| --- | --- |
| `guardians` | Profil wali, `email`, `phone_number`, `auth_user_id` |
| `students` | Data pokok santri dan `guardian_id` |
| `academic_scores` | Nilai per siswa |
| `student_evaluations` | Evaluasi periodik, termasuk attendance score |
| `achievements` | Prestasi siswa |
| `spp_bills` | Tagihan bulanan |
| `emoney_accounts` | Saldo/akun e-money |
| `emoney_transactions` | Transaksi e-money |
| `albums` | Metadata album/media |
| `news_events` | Berita/acara |
| `teachers` | Profil tenaga pengajar |
| `Link` | Tautan/konfigurasi lama |

RLS aktif untuk tabel inti wali/santri yang dipakai Beranda dan policy tambahan membatasi signup berdasarkan email terkonfirmasi yang sama dengan email yang telah dicatat admin pada guardian. Hak wali untuk linking dibatasi ke kolom `auth_user_id`; email dan nomor telepon tidak boleh diubah oleh client wali. UI suggestion terbaru baru menyaring nama melalui akses tersebut setelah konfirmasi email; uji lintas akun tetap diperlukan.

## Kesenjangan Yang Harus Dijaga

- Belum ada `admission_applications`, status approval, audit perubahan, atau portal cek status pendaftaran.
- Belum ada admin workflow untuk approve pengajuan lalu memprovision row guardian/student.
- Signup email dapat menghasilkan Auth user sebelum pencocokan anak selesai. Perlu UI bantuan untuk aplikasi yang tertolak setelah Auth user terbentuk, tanpa membuka data siswa lain.
- Tidak ada email wali yang diverifikasi otomatis pada admin review, SMTP/URL redirect harus dikonfigurasi.
- Satu siswa saat ini terhubung melalui satu `guardian_id`; kebutuhan kedua orang tua belum dimodelkan.
- `birth_date` adalah data pribadi. Cocokkan di query terbatas; jangan menampilkan daftar siswa global, mengirim tanggal lahir melalui URL, atau menggunakannya sebagai satu-satunya verifikasi.
- Test email/user yang belum dikonfirmasi tidak memberi session. Jangan menandai Auth user terkonfirmasi manual untuk mensimulasikan verifikasi nyata.

## Status Tambahan 9 November 2026

- Signup kini mengharuskan wali memilih nama anak dari saran, bukan mengirim nama bebas; ID siswa yang dipilih dan tanggal lahir dicocokkan kembali pada penyelesaian aktivasi.
- Setelah konfirmasi email, aplikasi dapat memulihkan session pendaftaran yang belum ditautkan. Kegagalan pencocokan/recovery masih memerlukan pengujian browser nyata.
- Implementasi lokal lulus production build; perubahan belum dirilis ke Cloudflare. Rincian gap dan urutan validasi ada pada [laporan progress](../progress/README.md).
