# 📦 Panduan Setup Data - Aplikasi WaliSantri

## 🎯 Tentang Sistem Data Baru

Aplikasi ini sekarang menggunakan **arsitektur data modular** yang memungkinkan Anda:

✅ Menjalankan modul yang tersedia dalam mode offline dengan database lokal
✅ Mengubah data santri dengan mudah melalui file JSON  
✅ Memuat login wali dan Beranda dari Supabase

## 📁 Lokasi File Data

Semua data awal tersimpan dalam TypeScript module:

```
src/app/data-access/initialData.ts
```

File ini berisi semua data santri, wali, admin, pembayaran, prestasi, dan lainnya dalam format TypeScript yang mudah diedit.

**Bonus:** File JSON backup tersedia di `public/data/` untuk referensi.

## 🚀 Quick Start

### 1. Menjalankan Aplikasi

Akses wali sementara memakai Supabase Auth email/password dengan confirmation email. Phone Auth belum dipakai dan boleh tetap nonaktif; credential Twilio tidak diperlukan untuk login email.

1. `.env.local` menggunakan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY`. Publishable key aman untuk client; jangan gunakan service-role key.
2. Di Supabase Dashboard, pastikan **Authentication > Sign In / Providers > Email > Confirm email** aktif.
3. Tambahkan `http://127.0.0.1:5173/**` ke **Authentication > URL Configuration > Redirect URLs** agar confirmation link kembali ke aplikasi lokal.
4. Email `haidarahnaf137@gmail.com` sudah dicatat pada guardian demo **Ahnaf Haidar**. Untuk guardian lain, administrator harus mencatat email aktif yang sama pada record guardian yang telah disetujui. Contoh SQL untuk record demo:

```sql
UPDATE public.guardians
SET email = lower('haidarahnaf137@gmail.com')
WHERE id = '394a1763-3541-4e1d-a29f-81da571347c1'::uuid
  AND auth_user_id IS NULL;
```

5. Di aplikasi pilih **Daftar Akun Wali**. Email sudah terisi: `haidarahnaf137@gmail.com`; isi password pilihan Anda, nama anak **Haidar Ahnaf**, dan tanggal lahir demo `2010-04-12`. Klik tautan konfirmasi yang masuk ke email, kembali ke aplikasi, lalu tekan **Saya sudah verifikasi email** dan lanjutkan aktivasi.

Record uji tersimpan sebagai wali **Ahnaf Haidar** dan anak **Haidar Ahnaf** (`DUMMY-2026-001`), dengan lokasi umum Sulawesi. Nomor telepon `+628135442907` tetap tersimpan untuk aktivasi Phone Auth di masa depan; tanggal lahir, kelas, dan detail lain masih dummy.

Supabase default SMTP mungkin hanya mengirim ke alamat anggota organisasi. Gunakan email anggota project untuk test atau pasang SMTP provider Auth agar email Anda bisa menerima tautan. Phone Auth dapat diaktifkan kembali nanti bersama provider SMS; jangan simpan Twilio secret di aplikasi.

Login admin masih memakai data lokal demo:

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

## 🔄 Konfigurasi Backend Lain

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
