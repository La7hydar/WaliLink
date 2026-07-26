# 📦 Panduan Setup Data - Aplikasi WaliSantri

## 🎯 Tentang Sistem Data Baru

Aplikasi ini sekarang menggunakan **arsitektur data modular** yang memungkinkan Anda:

✅ Menjalankan aplikasi 100% offline dengan database lokal  
✅ Mengubah data santri dengan mudah melalui file JSON  
✅ Migrasi ke server backend dengan mudah di masa depan  
✅ Tidak perlu koneksi internet sama sekali  

## 📁 Lokasi File Data

Semua data awal tersimpan dalam TypeScript module:

```
src/app/data-access/initialData.ts
```

File ini berisi semua data santri, wali, admin, pembayaran, prestasi, dan lainnya dalam format TypeScript yang mudah diedit.

**Bonus:** File JSON backup tersedia di `public/data/` untuk referensi.

## 🚀 Quick Start

### 1. Menjalankan Aplikasi

Aplikasi sudah siap digunakan dengan data demo:

- **Wali Santri Login:**
  - Email: `demo@walisant.com`
  - Password: `demo123`

- **Admin Login:**
  - Email: `admin@almunawwarah.com`
  - Password: `admin123`

### 2. Menambah Data Santri Baru

Edit file `src/app/data-access/initialData.ts`, tambahkan di array `initialStudents`:

```typescript
export const initialStudents = [
  // ... data existing
  {
    id: 'student_002',
    name: 'Nama Santri',
    fullName: 'Nama Lengkap Santri',
    nisn: '0078594322',
    birthPlace: 'Kota Lahir',
    birthDate: 'DD Bulan YYYY',
    age: 14,
    class: 'Kelas 3 Tsanawiyah',
    grade: 9,
    studyClub: 'Tahfidz Club',
    dormitory: 'Asrama Al-Hikmah',
    roomNumber: 'Kamar 15B',
    entryYear: '2023',
    status: 'Aktif',
    guardianId: 'guardian_002',
  },
];
```

Kemudian tambahkan data wali di array `initialGuardians`:

```typescript
export const initialGuardians = [
  // ... data existing
  {
    id: 'guardian_002',
    email: 'email@example.com',
    phone: '0812-xxxx-xxxx',
    password: 'password123',
    fullName: 'Nama Wali',
    students: ['student_002'],
  },
];
```

Setelah mengedit, **refresh browser** untuk memuat data baru.

### 3. Menambah Pembayaran

Edit file `src/app/data-access/initialData.ts`, tambahkan di array `initialPayments`:

```typescript
export const initialPayments = [
  // ... data existing
  {
    id: 'pay_004',
    studentId: 'student_001',
    type: 'spp',
    amount: 500000,
    description: 'SPP Bulan Februari 2025',
    status: 'pending',
    dueDate: '2025-02-10',
  },
];
```

### 4. Menambah Prestasi

Edit file `src/app/data-access/initialData.ts`, tambahkan di array `initialAchievements`:

```typescript
export const initialAchievements = [
  // ... data existing
  {
    id: 'ach_004',
    studentId: 'student_001',
    title: 'Juara 1 Lomba Hafalan',
    description: 'Deskripsi prestasi',
    category: 'religious',
    level: 'kabupaten',
    position: 'Juara 1',
    date: '2025-01-15',
  },
];
```

## 🔄 Cara Migrasi ke Server Backend

Saat Anda siap untuk menghubungkan ke server backend:

### Langkah 1: Edit File `.env`

```env
# Ubah dari 'local' ke 'remote'
VITE_DATA_SOURCE_MODE=remote

# Tambahkan URL server Anda
VITE_API_BASE_URL=https://api.pondok-pesantren.com
VITE_API_KEY=your_api_key_here
```

### Langkah 2: Restart Aplikasi

Aplikasi akan otomatis terhubung ke server backend Anda!

**Tidak perlu mengubah kode aplikasi sama sekali.**

## 🛠️ Tips & Troubleshooting

### Data tidak muncul setelah edit JSON?

**Solusi:** Buka Developer Console (F12) dan jalankan:

```javascript
localStorage.clear();
location.reload();
```

### Ingin reset ke data awal?

**Solusi:** Hapus semua data localStorage:

```javascript
localStorage.clear();
location.reload();
```

### Ingin backup data saat ini?

Aplikasi akan menyimpan semua perubahan di localStorage browser. Anda bisa export data melalui fitur yang tersedia di menu admin.

## 📊 Format Data

### Student (Santri)

```json
{
  "id": "student_xxx",
  "name": "Nama Pendek",
  "fullName": "Nama Lengkap",
  "nisn": "10 digit",
  "birthPlace": "Kota",
  "birthDate": "DD Bulan YYYY",
  "age": 14,
  "class": "Kelas X",
  "grade": 9,
  "studyClub": "Nama Club",
  "dormitory": "Nama Asrama",
  "roomNumber": "Kamar XX",
  "entryYear": "YYYY",
  "status": "Aktif/Non-Aktif",
  "guardianId": "guardian_xxx"
}
```

### Guardian (Wali Santri)

```json
{
  "id": "guardian_xxx",
  "email": "email@example.com",
  "phone": "08xx-xxxx-xxxx",
  "password": "password",
  "fullName": "Nama Lengkap",
  "title": "Bapak/Ibu",
  "relationship": "Ayah/Ibu Kandung",
  "occupation": "Pekerjaan",
  "students": ["student_xxx"]
}
```

### Payment (Pembayaran)

```json
{
  "id": "pay_xxx",
  "studentId": "student_xxx",
  "type": "spp/other",
  "amount": 500000,
  "description": "Deskripsi pembayaran",
  "status": "pending/paid",
  "dueDate": "YYYY-MM-DD",
  "paidDate": "YYYY-MM-DD",
  "method": "Bank Transfer/E-Money"
}
```

## 🔐 Keamanan

- Password disimpan dalam plaintext di JSON files (untuk demo)
- Untuk production, gunakan server backend dengan encryption
- Data tersimpan di localStorage browser (private per user)

## 📞 Bantuan

Jika ada pertanyaan atau masalah, hubungi tim developer atau baca dokumentasi lengkap di `DATA_ARCHITECTURE.md`.

---

**Selamat menggunakan Aplikasi WaliSantri! 🎓📱**
