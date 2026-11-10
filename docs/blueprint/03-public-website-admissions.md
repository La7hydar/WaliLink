# 03. Website Publik dan Pendaftaran Santri

## Tujuan Produk

Website publik dan aplikasi wali berada pada **satu domain/brand dan satu produk**, tetapi menggunakan menu, layout, dan hak akses berbeda. Pengunjung dapat mengenal pesantren tanpa login; pendaftaran adalah workflow mandiri; wali masuk ke area privat setelah persetujuan dan aktivasi akun.

Contoh struktur URL target:

| URL | Akses | Tujuan |
| --- | --- | --- |
| `/` | Publik | Beranda/perkenalan pesantren dan CTA pendaftaran |
| `/profil` | Publik | Sejarah, visi-misi, pengasuh, legalitas yang boleh dipublikasikan |
| `/program` | Publik | Jenjang, kurikulum, kegiatan, kalender ringkas |
| `/fasilitas` | Publik | Asrama, kelas, ibadah, kesehatan, foto yang telah disetujui |
| `/berita` | Publik | Berita/acara publik |
| `/pendaftaran` | Publik | Informasi syarat dan wizard pengajuan calon santri |
| `/cek-status` | Publik terbatas | Cek status memakai kode tracking + verifikasi email |
| `/login` | Publik | Login wali dengan email/password |
| `/wali/*` | Auth wali | Beranda dan menu privat wali |
| `/admin/*` | Auth petugas | Review admissions dan modul operasional sesuai role |

## Navigasi Satu Website

Header desktop: **Beranda | Profil | Program | Fasilitas | Berita | Pendaftaran | Login Wali**. Tombol utama **Daftar Santri** menuju `/pendaftaran`. Pada ponsel, menu yang sama masuk ke drawer; CTA pendaftaran dan login tetap mudah dijangkau.

Setelah login wali, shell/navigasi area publik diganti menjadi shell privat: **Beranda | Pembayaran | Kedisiplinan | Prestasi | Album | Personal**. Admin mendapat navigasi berdasarkan role. Logo mengarah kembali ke bagian publik, tetapi keluar dari area wali harus mempertahankan session hanya jika kebijakan produk memang menghendaki.

## Konten Halaman Publik

### Beranda

- Nama pesantren, lokasi umum, ringkasan pendek, foto/video nyata yang disetujui.
- CTA utama “Daftar Santri”; CTA kedua “Kenali Program” dan tautan kontak.
- Ringkasan jenjang/program, kehidupan belajar/asrama, berita terbaru, lokasi, FAQ singkat.
- Jangan memajang foto/nama santri tanpa persetujuan publikasi.

### Profil, Program, Fasilitas, dan Berita

- Dikelola admin dari CMS; setiap draft harus punya approval dan status publish.
- Pisahkan informasi publik dari direktori santri dan data operasional.
- Konten aksesibel, responsif, dapat dibaca tanpa akun, serta memiliki metadata SEO/share preview.

### Pendaftaran

Form bertahap dengan autosave draft:

1. Data calon santri dasar: nama resmi, tanggal lahir, jenjang diminta, asal wilayah, kontak wali.
2. Data kontak wali: nama, relasi, email yang aktif; telepon dapat dicatat sekarang dan diverifikasi ketika Phone Auth siap.
3. Persetujuan privasi dan pernyataan bahwa informasi benar.
4. Konfirmasi email/kode tracking; setelah verifikasi, status menjadi `submitted`.
5. Tampilkan ringkasan dan nomor tracking acak. Jangan memasukkan nama/tanggal lahir ke URL tracking.

Status yang disarankan: `draft`, `email_confirmation_pending`, `submitted`, `under_review`, `needs_information`, `approved`, `rejected`, `withdrawn`.

Sebelum `approved`, jangan membuat row di tabel operasional `students` dan jangan memberi akses GuardianApp. Simpan di staging table `admission_applications` dengan RLS/endpoint yang tidak memungkinkan applicant membaca pengajuan lain.

## Approval dan Aktivasi Akun

```mermaid
sequenceDiagram
  participant P as Pendaftar
  participant W as Website Publik
  participant A as Admissions API
  participant D as Petugas
  participant DB as Supabase
  participant G as GuardianApp

  P->>W: Isi data calon santri + email wali
  W->>A: Buat application (validasi/rate limit)
  A->>DB: Simpan sebagai draft/email pending
  W-->>P: Kirim tautan konfirmasi email
  P->>W: Konfirmasi kontak
  W->>A: Ubah status ke submitted
  D->>A: Review dan putuskan
  A->>DB: Approve, buat student + guardian (email terverifikasi)
  A-->>P: Kirim pemberitahuan diterima dan langkah aktivasi
  P->>G: Daftar email/password
  G->>DB: Konfirmasi email dan cocokkan data yang disetujui
  DB-->>G: Link Auth UID ke guardian; RLS mengunci data anak
```

Approval dilakukan manusia dengan role yang benar. Tanggal lahir boleh menjadi pemeriksaan tambahan saat aktivasi, tetapi bukan satu-satunya rahasia; email terverifikasi dan approval record menjadi syarat. Untuk fase lanjutan, gunakan activation token sekali pakai, kedaluwarsa, hashed di server, dan batasi percobaan.

## Admin Admissions Queue

- Daftar status submitted/under_review/needs_information dengan filter jenjang dan waktu.
- Detail satu pengajuan, data minimal, catatan internal terpisah dari pesan ke wali.
- Aksi: minta kelengkapan, setujui, tolak dengan alasan aman, batalkan.
- Setiap aksi mencatat actor Auth UID, timestamp, old/new status, dan reason code.
- Saat approve, operasi pembuatan `students` + `guardians` harus transaksional/idempotent. Jangan duplikasi jika petugas mengklik dua kali.
- Email wali baru dapat ditautkan pada guardian setelah disetujui; proses app activation tidak boleh mengubah email/phone row.

## Privasi dan Anti-Abuse

- Tampilkan hanya field minimum pada formulir publik; dokumen identitas/medis hanya jika proses benar-benar memerlukan dan dengan retention limit.
- Pesan kegagalan publik generik untuk mencegah enumerasi apakah nama/tanggal lahir/email terdapat di database.
- Rate limit signup, status lookup, konfirmasi email, dan upload; CAPTCHA saat perlu.
- Endpoint publik membuat aplikasi; browser tidak diberi akses SELECT seluruh tabel `students`, `guardians`, atau `admission_applications`.
- Cek status memakai token opaque dan email verification, bukan NIS/nama saja.
- Jangan mengirim informasi kesehatan atau keputusan internal pada email berisi detail berlebih.

## Fase Pertama Website

MVP website menyatukan halaman publik dan menu pendaftaran pada domain sama. Fase awal dapat memakai konten statis dan form admissions sederhana, tetapi status/approval sudah eksplisit. CMS, banyak bahasa, unggah dokumen, notifikasi multi-channel, dan payment pendaftaran dibuat sesudah workflow inti serta RLS teruji.

## Status Implementasi Signup Wali — 9 November 2026

Implementasi lokal signup wali sudah mengikuti bagian akhir alur aktivasi di diagram: email dikonfirmasi lebih dahulu; sesudah itu nama anak dipilih dari suggestion yang dibatasi oleh RLS ke email wali terverifikasi; tanggal lahir dicocokkan sebagai pemeriksaan tambahan sebelum UID ditautkan. Session pendaftaran tertunda dapat dipulihkan saat aplikasi dibuka kembali.

Ini **bukan** implementasi website admissions atau approval workflow. Tabel pengajuan publik, portal status, antrean review, audit trail, notifikasi keputusan, dan provisioning saat approve masih belum dibangun. Signup yang diperbarui juga belum di-deploy dan belum dibuktikan dengan uji end-to-end email produksi. Lihat [laporan progress](../progress/README.md).
