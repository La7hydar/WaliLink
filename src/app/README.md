# Aplikasi Wali Santri Pondok Pesantren

Aplikasi mobile-first dengan autentikasi dan Beranda wali dari Supabase. Modul lain yang belum dimigrasikan masih menggunakan data lokal.

## **Mode Data Saat Ini**

Login wali dan Beranda menggunakan Supabase Auth/Database. Pembayaran, administrasi, dan modul lain yang belum dimigrasikan masih memakai data lokal/demo.

Untuk setup email verification dan akun uji, lihat [Panduan Setup Data](../../README_DATA_SETUP.md). Fitur backup/restore lokal tetap tersedia untuk modul offline.

## ✨ Fitur Utama

### 📱 **Pembayaran & Kirim Uang** (Simulasi)
- Pembayaran SPP simulasi
- Top-up E-Money santri (lokal)
- Riwayat transaksi lengkap
- Virtual account simulasi

### 📊 **Kedisiplinan & Kehadiran**
- Monitoring kehadiran offline
- Laporan pelanggaran dan reward
- Grafik perkembangan kedisiplinan
- Sistem poin akademik

### 🏆 **Prestasi & Nilai Ujian**
- Dashboard prestasi santri
- Nilai ujian per mata pelajaran
- Radar chart performa akademik
- Pencatatan sertifikat digital

### 📸 **Album & Dokumentasi**
- Galeri foto kegiatan santri
- Kategori foto (kegiatan, pembelajaran, ibadah)
- Penyimpanan lokal

### 👤 **Personal Info & Komunikasi**
- Profil lengkap santri dan wali (offline)
- Chat simulasi dengan ustadz dan admin
- Pengaturan notifikasi
- Mode gelap/terang

## 🎨 **Teknologi & Desain**

- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS v4.0 + Dark Mode
- **UI Components**: Shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Storage**: Browser Local Storage (Offline)
- **Theme**: Merah, Hijau, Putih (Light) / Otomatis Dark Mode

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- ❌ **TIDAK** memerlukan database atau server

### Installation

```bash
# Clone repository
git clone https://github.com/your-repo/pesantren-app.git
cd pesantren-app

# Install dependencies
npm install

# Start development server
npm start
```

### Tidak Ada Environment Setup!
Aplikasi berjalan langsung tanpa konfigurasi server atau database.

## 📱 **Demo Credentials**

Gunakan kredensial berikut untuk login:

**Wali Santri:**
- Phone: `0812-3456-7890`
- Password: `demo123`
- Email: `demo@walisant.com`

**Admin Utama:**
- Email: `admin@almunawwarah.com`
- Password: `admin123`

**Admin Bagian:**
- Email: `absensi@almunawwarah.com` / `keuangan@almunawwarah.com`
- Password: `admin123`

## 🏗️ **Arsitektur Aplikasi (Offline)**

### Struktur Folder
```
src/
├── components/           # React components
│   ├── ui/              # Shadcn/ui components
│   ├── guardian/        # Guardian-specific components
│   ├── OfflineModeIndicator.tsx
│   └── DataBackupManager.tsx
├── hooks/               # Custom React hooks
├── services/            
│   ├── localStorage.ts  # Local storage management
│   ├── api.ts          # Offline API client
│   └── mockData.ts     # Mock/demo data
├── types/               # TypeScript type definitions
├── config/
│   └── environment.ts   # Offline mode config
├── styles/              # Global CSS & Tailwind
└── docs/
    └── offline-mode.md  # Offline documentation
```

### Data Flow (Offline)
```
Frontend (React) 
  ↕️ 
Local Storage Service
  ↕️
Browser Local Storage
```

## 💾 **Local Storage Management**

### Backup Data
1. Buka **Pengaturan** → **Kelola Data**
2. Klik **"Ekspor ke File"**
3. File JSON akan diunduh ke perangkat

### Restore Data
1. Buka **Pengaturan** → **Kelola Data**
2. Klik **"Pilih File"**
3. Pilih file backup (.json)
4. Aplikasi akan restart otomatis

### Hapus Data
1. Buka **Pengaturan** → **Kelola Data**
2. Klik **"Hapus Semua"**
3. Konfirmasi penghapusan

## ⚠️ **Batasan & Peringatan**

### Data Lokal Saja
- ❌ Data **TIDAK** tersinkronisasi antar perangkat
- ❌ Data **TIDAK** dibackup otomatis ke cloud
- ⚠️ Jika browser data dihapus, data akan **HILANG**
- ⚠️ **WAJIB** backup data secara berkala

### Pembayaran Simulasi
- ❌ **BUKAN** transaksi uang nyata
- ❌ **TIDAK** terhubung ke payment gateway
- ✅ Hanya untuk demo/testing

### Keamanan
- ⚠️ Data disimpan **TANPA** enkripsi
- ⚠️ **TIDAK DISARANKAN** untuk data sensitif/pribadi
- ⚠️ Siapa saja yang akses browser dapat melihat data

### Kapasitas Storage
- Limit browser: biasanya 5-10MB
- Untuk data besar, gunakan export/import

## ✅ **Cocok Untuk:**
- ✅ Demo aplikasi
- ✅ Testing fitur
- ✅ Presentasi/prototype
- ✅ Penggunaan personal
- ✅ Pembelajaran/training

## ❌ **TIDAK Cocok Untuk:**
- ❌ Produksi dengan data nyata
- ❌ Data pribadi/sensitif
- ❌ Multi-user environment
- ❌ Aplikasi yang butuh sinkronisasi
- ❌ Transaksi uang nyata

## 📚 **Documentation**

- [**Offline Mode Guide**](./docs/offline-mode.md) - **WAJIB BACA!**
- [API Schema](./docs/api-schema.md) - API documentation (untuk referensi)
- [React Integration](./docs/react-api-integration.md) - Frontend integration
- [Database Integration](./docs/database-integration.md) - (Tidak digunakan dalam mode offline)

## 🔧 **Development**

### Available Scripts
```bash
npm start              # Development server
npm run build          # Production build
npm test              # Run tests
```

## 🎯 **Fitur Unggulan Offline**

### 💾 **Local Storage Management**
- Ekspor data ke file JSON
- Import data dari backup
- Hapus semua data lokal
- Monitor ukuran storage

### 🌓 **Dark Mode**
- Toggle otomatis berdasarkan sistem
- Persistensi preferensi user
- Transisi smooth antar theme

### 📱 **Mobile-First Design**
- Responsif di semua ukuran layar
- Touch-friendly interface
- iPhone mockup untuk demo

### 🔔 **Offline Indicators**
- Badge mode offline di semua screen
- Warning pada fitur yang memerlukan internet
- Info jelas tentang status offline

## 🛠️ **Troubleshooting**

### Data Hilang?
```bash
# Reset ke data default:
1. Buka browser console (F12)
2. Jalankan: localStorage.clear()
3. Refresh halaman
```

### Storage Penuh?
- Export dan hapus data lama
- Hapus foto/media yang tidak diperlukan
- Gunakan fitur "Hapus Semua Data"

### Import Gagal?
- Pastikan file format JSON valid
- Periksa ukuran file tidak melebihi limit
- Coba dengan browser lain

## 📄 **License**

This project is licensed under the MIT License.

## 🙏 **Acknowledgments**

- **UI Framework**: [Shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## 📞 **Support**

Untuk pertanyaan atau masalah teknis, silakan buka issue di repository.

---

**Versi**: 2.0.0-offline  
**Mode**: Offline Only - No Internet Required  
**Dibuat dengan ❤️ untuk pendidikan pesantren di Indonesia**