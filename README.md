
  # WaliLink

  WaliLink adalah aplikasi wali santri pesantren dengan website publik, pendaftaran santri, area wali, dan area operasional admin.

  ## Status Implementasi

  Aplikasi saat ini hybrid: login wali dan Beranda menggunakan Supabase; sebagian menu wali/admin masih lokal atau mock. Website penerimaan santri dengan approval admin masih dalam perancangan.

  ## Menjalankan Lokal

  ```sh
  npm install
  npm run dev
  ```

  Gunakan `.env.local` dengan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY`. Jangan pernah masukkan service-role key ke frontend/repository.

  ## Blueprint

  Mulai dari [Blueprint WaliLink](docs/blueprint/README.md), yang memuat kondisi saat ini, target arsitektur/data/security, website admissions, dan roadmap.

  Setup Auth dan database ada di [README_DATA_SETUP.md](README_DATA_SETUP.md). Dokumen offline lama bersifat historis, bukan gambaran penuh runtime saat ini.
  