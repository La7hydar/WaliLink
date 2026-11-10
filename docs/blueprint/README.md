# WaliLink Blueprint

Status: rancangan produk dan teknis, disusun 17 Oktober 2026.

Pembaruan status terakhir: 9 November 2026. Rancangan dan item yang belum selesai tetap dipertahankan; lihat [laporan progress](../progress/README.md) untuk status implementasi terkini dan keterbatasan yang telah diverifikasi.

Dokumen ini menjadi titik masuk perencanaan WaliLink. Label **Sudah ada**, **Parsial**, dan **Usulan** memisahkan apa yang terverifikasi pada repository/database dari target yang belum dibangun.

## Ringkasan Keputusan

- WaliLink terdiri dari satu website dengan dua area navigasi: area publik untuk perkenalan pesantren dan pendaftaran santri; area wali/admin setelah login.
- Pendaftaran santri dilakukan terlebih dahulu melalui website. Admin meninjau dan menyetujui data sebelum akun aplikasi wali dapat diaktifkan.
- Auth sementara menggunakan email + password dengan email confirmation. Phone Auth adalah opsi fase selanjutnya, bukan prasyarat demo.
- Satu akun wali hanya boleh melihat santri yang secara eksplisit terhubung kepadanya. RLS menjadi batas keamanan utama; filter UI bukan kontrol keamanan.
- Data contoh dan data pribadi nyata harus dipisahkan. Informasi tanggal lahir, alamat, nilai, kesehatan, pembayaran, dan identitas biometrik tidak boleh disebar ke berkas publik.

## Dokumen

- [01. Kondisi Saat Ini](01-current-state.md): implementasi yang sudah ada, bagian mock, dan batasan yang telah diverifikasi.
- [02. Arsitektur, Data, dan Keamanan](02-architecture-data-security.md): target komponen, model data, autentikasi, authorization, privasi, dan deployment.
- [03. Website Publik dan Pendaftaran](03-public-website-admissions.md): menu website tunggal, alur pendaftar, status aplikasi, persetujuan admin, dan aktivasi wali.
- [04. Roadmap](04-roadmap.md): urutan pengembangan, dependensi, risiko, dan kriteria selesai.
- [05. Peta Belajar](05-learning-path.md): urutan belajar, file terkait, dan kemampuan yang didapat.
- [06. Audit File](06-file-audit.md): metode scan, mockup yang dihapus, dan kandidat yang dipertahankan karena berisiko.

## Snapshot Terverifikasi

- Aplikasi menggunakan React/Vite dan mempunyai alur Welcome -> pilih server -> login/daftar.
- Login wali dan Beranda telah diarahkan ke Supabase Auth/Database; bagian pembayaran, kedisiplinan, album, personal, serta panel admin belum seluruhnya memakai data remote.
- Project Supabase memiliki tabel inti `guardians`, `students`, `academic_scores`, `student_evaluations`, `achievements`, `spp_bills`, `emoney_accounts`, `emoney_transactions`, `albums`, `news_events`, `teachers`, dan `Link`.
- `guardians` memiliki `auth_user_id` dan `email`. Email wali demo sudah disiapkan pada record demo, tetapi akun Auth baru aktif setelah proses signup/konfirmasi email berhasil.
- Migration email menambahkan RLS untuk mencocokkan akun yang email-nya telah dikonfirmasi dengan data wali yang email-nya telah disetujui admin.
- Email konfirmasi produksi memerlukan SMTP yang dapat mengirim ke alamat wali. Default SMTP Supabase memiliki batas penerima; cek konfigurasi project sebelum menguji ke Gmail umum.

## Di Luar Cakupan Checkpoint Ini

Blueprint tidak berarti semua menu sudah diimplementasikan. Khusus website penerimaan santri, tabel aplikasi pendaftaran, panel review, email status, dan audit trail masih merupakan pekerjaan terencana. Demikian pula transaksi pembayaran riil, attendance ingestion, storage media privat, push notification, dan provisioning admin belum boleh dianggap siap produksi.

Audit cleanup menghapus hanya empat komponen mockup yang terbukti tidak direferensikan. Dependency tracked dan nested project copy dicatat sebagai kandidat terpisah, bukan dihapus massal.

## Catatan Progress 9 November 2026

Bagian di atas adalah snapshot blueprint awal dan tidak mengklaim bahwa target sudah selesai. Perubahan berikutnya yang telah diverifikasi:

- Signup wali lokal kini meminta verifikasi email sebelum menampilkan saran nama anak; saran dibatasi oleh RLS berdasarkan email yang disetujui. Tanggal lahir tetap dicocokkan sebagai pemeriksaan tambahan.
- Session pendaftaran yang email-nya telah diverifikasi dapat kembali ke layar aktivasi saat aplikasi dibuka lagi.
- Build lokal untuk perubahan tersebut berhasil, tetapi perubahan belum di-deploy; pengujian end-to-end signup dan konfigurasi Cloudflare/Supabase masih perlu diverifikasi.
- Endpoint domain custom merespons HTTP 200 saat diperiksa; status tersebut bukan bukti bahwa konfigurasi Auth, email, atau data aplikasi di production telah lulus uji.
- Data contoh presensi, kedisiplinan, notifikasi, dan e-money ada khusus untuk akun demo dan harus diperlakukan sebagai simulasi.

Untuk fase, gap, urutan tindakan, serta status branch/deployment, lihat [laporan progress 9 November 2026](../progress/README.md).
