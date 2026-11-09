# 05. Peta Belajar Pemilik WaliLink

Dokumen ini menyusun urutan belajar yang langsung berhubungan dengan pekerjaan di repository. Tujuannya bukan menjadikan Anda harus menguasai seluruh teknologi sekaligus, tetapi agar tiap perubahan dapat dilakukan dengan risiko terukur.

## Urutan Belajar

| Urutan | Topik | Yang dipelajari | Setelah menguasai, Anda dapat | Masalah yang dapat Anda diagnosa |
| --- | --- | --- | --- | --- |
| 1 | Git dan struktur proyek | folder source/config/data, `git status`, `diff`, branch, commit, push, ignore | membuat checkpoint, meninjau file sebelum push, memisahkan perubahan fitur | file ikut terhapus/terubah, konflik, secret ter-commit, dependency generated ikut masuk repository |
| 2 | HTML, CSS, responsive layout | DOM, semantic HTML, flex/grid, overflow, safe-area, breakpoint | mengubah tata letak login, Beranda, Personal, website publik | konten tertutup nav, scroll ganda, tombol/teks overflow di ponsel |
| 3 | JavaScript dan TypeScript dasar | variable, object, array, Promise, `async/await`, interface/type, error | mengubah data form, menambah field dan callback secara aman | `undefined`, data shape salah, query async tidak selesai, type error |
| 4 | React | component, props, state, effect, controlled input, conditional rendering, component tree | mengubah menu, form, loading/error/empty state, session flow | state tidak berubah, form tidak menyimpan input, layar stale setelah navigasi |
| 5 | Vite dan konfigurasi | `package.json`, scripts, `.env.local`, `import.meta.env`, build/dev server | menyiapkan URL/key, menjalankan app, membaca warning build | env tidak terbaca sebelum restart, module tidak ditemukan, dev server gagal |
| 6 | Supabase Auth email | sign-up, confirmation link, `email_confirmed_at`, session, login/logout, reset password, SMTP | mengubah onboarding/login wali, mengatur confirmation dan recovery | email tidak terkirim, redirect salah, user ada tetapi belum confirmed, login gagal |
| 7 | SQL dan relational data | table, UUID, PK/FK, unique/index, `SELECT/UPDATE`, transaction | menambah/mengoreksi guardian, student, class, program, status | FK gagal, duplikasi email/NIS, nilai tidak berelasi ke siswa |
| 8 | RLS dan security | `auth.uid()`, `auth.jwt()`, policies `USING/WITH CHECK`, grants, least privilege | menambah aturan akses dengan uji user A vs user B | data wali lain terlihat, update 0 row, policy terlalu longgar, email/DOB bocor |
| 9 | Data layer dan domain service | query Supabase dari service, mapping DB ke UI model, sumber data tunggal | mengganti menu lokal satu per satu tanpa menanam query di UI | Beranda menampilkan data mock, status DB beda dengan label UI, request ganda |
| 10 | Testing dan debugging | build, diagnostics, browser console/network, test cases, logs | memverifikasi perubahan sebelum push dan membuat regression test | kegagalan SMTP/API/RLS, field tak terlihat, error hanya pada satu state |
| 11 | Workflow admissions | draft, submitted, needs-info, approved, rejected, idempotency, audit | merancang formulir pendaftaran dan antrean admin | pengajuan ganda, approval tanpa audit, anak belum disetujui bisa login |
| 12 | SMTP, deployment, operasi | DNS sender, SPF/DKIM/DMARC, secret management, backup, monitoring | memindahkan dari demo ke domain produksi | confirmation masuk spam, sender ditolak, recovery/data restore gagal |

## File Yang Dipelajari Per Topik

### UI dan Navigasi

- `src/app/App.tsx`: alur layar, state login, restore session, dan perpindahan screen.
- `src/app/components/GuardianApp.tsx`: menu wali dan konten Beranda.
- `src/app/components/guardian/PersonalSection.tsx`: halaman Personal, scroll dan pengaturan.
- `src/app/components/LoginScreen.tsx`: form login wali/admin.
- `src/app/components/GuardianEmailRegistration.tsx`: signup, confirmation, pencocokan anak.

Jika menguasai bagian ini, Anda dapat mengubah teks, field, tata letak, loading/error state, dan menu tanpa menyentuh policy database.

### Auth dan Supabase

- `src/app/supabase/client.ts`: URL/publishable key client.
- `src/app/services/AuthService.ts`: signup, login, session restore, dan linking.
- `supabase/migrations/`: schema dan policy yang diterapkan.
- `.env.example` dan `.env.local`: konfigurasi lokal; `.env.local` tidak boleh di-commit.

Jika menguasai Auth, Anda dapat mengatur cara konfirmasi email dan reset password. Jika menguasai RLS, Anda dapat mengubah siapa yang boleh membaca/menghubungkan data dan mendiagnosa cross-account access. Jangan menaruh service-role key atau password Auth di React.

### Data Beranda dan Fitur

- `src/app/services/GuardianHomeService.ts`: query siswa dan ringkasan Beranda.
- `src/app/data-access/`: provider lokal/kontrak lama.
- `src/app/services/`: domain services.
- `supabase/seed-dummy-data.sql`: contoh data sintetis.

Jika menguasai service/data mapping, Anda dapat mengganti mock nilai/pembayaran/album ke data remote per menu. Lakukan satu domain setiap kali: schema -> RLS -> service -> UI -> tests.

### Website Publik dan Approval

Baca [03. Website Publik dan Pendaftaran](03-public-website-admissions.md) dan [02. Arsitektur, Data, dan Keamanan](02-architecture-data-security.md) sebelum mengubah `admission_applications`, approval, atau RLS. Jika menguasai workflow, Anda dapat mengubah status pengajuan, menambah langkah review, dan mendiagnosa mengapa pengajuan tertahan tanpa mengaktifkan akun sebelum approval.

## Latihan Aman

1. Ubah label/section UI di branch sendiri, lalu lihat `git diff` dan jalankan `npm run build`.
2. Tambah satu field opsional pada data demo, perbarui type, service mapping, dan state kosong.
3. Buat dua akun test dengan guardian berbeda; verifikasi masing-masing tidak dapat membaca siswa pihak lain.
4. Simulasikan email confirmation gagal dan link kedaluwarsa sebelum membuat recovery flow.
5. Buat satu application test dengan status `submitted`, lalu transisikan lewat admin dan pastikan audit event tercatat.

Jangan gunakan data anak sungguhan untuk latihan. Gunakan Supabase branch/project staging jika tersedia.

## Checklist Sebelum Mengubah

1. Tentukan apakah data milik UI, service, schema, policy, atau provider.
2. Cari import/reference sebelum menghapus file atau mengubah kontrak.
3. Baca schema/foreign key sebelum menulis SQL.
4. Catat data mana yang boleh diakses oleh tiap role.
5. Buat perubahan kecil, jalankan test/build, uji browser, lalu tinjau `git diff`.
6. Jangan push `.env.local`, secrets, user data, atau fixture yang memuat PII.
