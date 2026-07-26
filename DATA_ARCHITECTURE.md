# Arsitektur Data - Aplikasi WaliSantri

## Overview

Aplikasi WaliSantri menggunakan arsitektur data modular yang memungkinkan perpindahan mudah dari mode offline (local JSON files) ke mode online (remote API server) di masa depan.

## Struktur Arsitektur

```
┌─────────────────────────────────────────────┐
│          React Components (UI)              │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│          Service Layer                      │
│  - StudentService                           │
│  - PaymentService                           │
│  - AchievementService                       │
│  - AttendanceService                        │
│  - AlbumService                             │
│  - AuthService                              │
│  - NotificationService                      │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│       Data Access Layer (DAL)               │
│                                             │
│  ┌────────────────┐    ┌────────────────┐  │
│  │  Local Data    │    │  Remote Data   │  │
│  │  Provider      │    │  Provider      │  │
│  │  (JSON Files)  │    │  (REST API)    │  │
│  └────────────────┘    └────────────────┘  │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│          Data Storage                       │
│                                             │
│  - JSON Files (public/data/)                │
│  - localStorage (cache & offline support)   │
│  - Remote Server (future)                   │
└─────────────────────────────────────────────┘
```

## Komponen Utama

### 1. Environment Configuration (.env)

File `.env` mengontrol mode operasi aplikasi:

```env
# Mode: 'local' atau 'remote'
VITE_DATA_SOURCE_MODE=local

# Path ke data lokal
VITE_LOCAL_DATA_PATH=/data

# Konfigurasi remote API (untuk masa depan)
VITE_API_BASE_URL=https://api.your-server.com
VITE_API_KEY=your_api_key_here
```

### 2. Initial Data (src/app/data-access/initialData.ts)

Data awal disimpan dalam TypeScript module:

- `initialStudents` - Data santri
- `initialGuardians` - Data wali santri
- `initialAdmins` - Data admin
- `initialPayments` - Data pembayaran
- `initialAchievements` - Data prestasi
- `initialAcademicScores` - Data nilai akademik
- `initialDiscipline` - Data kedisiplinan
- `initialAttendance` - Data kehadiran
- `initialEmoneyTransactions` - Data transaksi e-money
- `initialAlbumPhotos` - Data foto album
- `initialNotifications` - Data notifikasi
- `initialVirtualAccounts` - Data virtual account

**Keuntungan menggunakan TypeScript module:**
- Type-safe editing dengan IntelliSense
- Compile-time error checking
- Tidak perlu parsing JSON
- Lebih cepat dan reliable

### 3. Data Access Layer

**LocalDataProvider** (`src/app/data-access/LocalDataProvider.ts`)
- Membaca data dari JSON files
- Menyimpan ke localStorage untuk cache
- Mendukung operasi offline 100%

**RemoteDataProvider** (`src/app/data-access/RemoteDataProvider.ts`)
- Siap untuk koneksi ke REST API
- Implementasi lengkap untuk semua endpoint
- Belum diaktifkan (menunggu server backend)

**DataProviderFactory** (`src/app/data-access/DataProviderFactory.ts`)
- Memilih provider berdasarkan konfigurasi
- Pattern singleton untuk efisiensi

### 4. Service Layer

Service layer menyediakan business logic dan abstraksi untuk komponen UI:

**StudentService** - Operasi data santri dan profil lengkap
**PaymentService** - Operasi pembayaran dan e-money
**AchievementService** - Operasi prestasi dan nilai akademik
**AttendanceService** - Operasi kehadiran dan kedisiplinan
**AlbumService** - Operasi album dan dokumentasi
**AuthService** - Autentikasi guardian dan admin
**NotificationService** - Operasi notifikasi

Contoh penggunaan:

```typescript
import { getStudentService } from './services/StudentService';

const studentService = getStudentService();
const profile = await studentService.getStudentProfile('student_001');
```

## Cara Mengubah dari Local ke Remote

### Langkah 1: Siapkan Backend Server

Buat REST API server dengan endpoint berikut:

```
GET    /students/:id
GET    /students
PUT    /students/:id
DELETE /students/:id
POST   /auth/guardian/login
POST   /auth/admin/login
GET    /payments?studentId=xxx
PUT    /payments/:id
... (dan endpoint lainnya)
```

### Langkah 2: Update File .env

```env
# Ubah mode dari 'local' ke 'remote'
VITE_DATA_SOURCE_MODE=remote

# Tambahkan URL server dan API key
VITE_API_BASE_URL=https://api.your-server.com
VITE_API_KEY=your_actual_api_key_here
```

### Langkah 3: Restart Aplikasi

Aplikasi akan otomatis menggunakan RemoteDataProvider untuk semua operasi data.

**TIDAK PERLU MENGUBAH KODE APLIKASI!** Semua komponen akan tetap bekerja karena menggunakan Service Layer yang sama.

## Migrasi Data

### Export Data dari LocalStorage

```typescript
import { exportAllData } from './services/localStorage';

const jsonData = exportAllData();
// Simpan atau kirim ke server
```

### Import Data ke LocalStorage

```typescript
import { importAllData } from './services/localStorage';

const jsonData = '...'; // Data dari backup
importAllData(jsonData);
```

## Menambah Data Awal

Untuk menambah data santri baru, edit file `src/app/data-access/initialData.ts`:

```typescript
export const initialStudents = [
  // ... existing students
  {
    id: 'student_003',
    name: 'Nama Santri',
    fullName: 'Nama Lengkap',
    guardianId: 'guardian_003',
    // ... field lainnya
  },
];
```

Kemudian refresh browser untuk reload data. Vite akan hot-reload otomatis saat Anda mengedit file.

## Debugging

Aktifkan debug mode di `.env`:

```env
VITE_DEBUG_MODE=true
```

Semua operasi data akan di-log ke console browser.

## Best Practices

1. **Gunakan Service Layer** - Jangan panggil DataProvider langsung dari komponen
2. **Handle Errors** - Semua operasi async bisa gagal, gunakan try-catch
3. **Loading States** - Tampilkan loading indicator saat fetch data
4. **Cache Wisely** - Data di-cache di localStorage untuk performa
5. **Modular Data** - Pisahkan data ke file JSON berbeda untuk maintainability

## Troubleshooting

### Data tidak muncul setelah update JSON files

Solusi: Clear localStorage dan refresh browser

```javascript
localStorage.clear();
location.reload();
```

### Error "Failed to load data file"

Solusi: Pastikan file JSON ada di `public/data/` dan valid JSON format

### Data tidak tersimpan setelah edit

Solusi: Periksa localStorage quota. Jika penuh, export lalu clear data lama.

## Roadmap

- [ ] IndexedDB support untuk data lebih besar
- [ ] Background sync saat online
- [ ] Conflict resolution untuk multi-device sync
- [ ] Data encryption untuk keamanan
- [ ] Real-time updates dengan WebSocket

## Kontak

Untuk pertanyaan atau bantuan, hubungi tim developer.
