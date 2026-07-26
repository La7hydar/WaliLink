# Mode Offline - Dokumentasi

## Ringkasan

Aplikasi WaliSantri telah diubah untuk berjalan sepenuhnya secara **offline**. Semua data disimpan di **local storage** browser dan tidak ada koneksi ke server atau layanan eksternal.

## Perubahan Utama

### 1. **Penyimpanan Data**
- ✅ Semua data disimpan di **browser local storage**
- ✅ Tidak ada koneksi ke database cloud/server
- ✅ Data tersimpan per browser/perangkat

### 2. **Fitur yang Dinonaktifkan**
- ❌ Payment Gateway (simulasi saja)
- ❌ Cloud Sync
- ❌ Google Analytics
- ❌ Push Notifications
- ❌ External API calls
- ❌ Supabase integration

### 3. **Fitur yang Tersedia**
- ✅ Manajemen data santri lokal
- ✅ Tracking prestasi dan nilai
- ✅ Monitoring kedisiplinan
- ✅ Album dokumentasi
- ✅ Sistem pembayaran simulasi
- ✅ Chat lokal
- ✅ Export/Import data (backup)

## Struktur Penyimpanan

### Local Storage Keys:
```
walisantri_student_profiles
walisantri_guardians
walisantri_achievements
walisantri_academic_scores
walisantri_performance_data
walisantri_discipline_records
walisantri_payments
walisantri_emoney_transactions
walisantri_attendance_records
walisantri_album_photos
walisantri_notifications
walisantri_chat_contacts
walisantri_chat_messages
walisantri_current_user
walisantri_current_student_id
walisantri_servers
walisantri_admins
walisantri_app_settings
walisantri_admin_data_history
```

## Cara Menggunakan

### Login Kredensial Default

**Wali Santri:**
- Email: `demo@walisant.com`
- Password: `demo123`
- Phone: `0812-3456-7890`

**Admin Utama:**
- Email: `admin@almunawwarah.com`
- Password: `admin123`

**Admin Bagian:**
- Email: `absensi@almunawwarah.com` / `keuangan@almunawwarah.com`
- Password: `admin123`

### Backup & Restore Data

1. **Export Data:**
   - Buka Pengaturan → Kelola Data
   - Klik "Ekspor ke File"
   - File JSON akan diunduh

2. **Import Data:**
   - Buka Pengaturan → Kelola Data
   - Klik "Pilih File"
   - Pilih file backup (.json)
   - Aplikasi akan restart otomatis

3. **Hapus Semua Data:**
   - Buka Pengaturan → Kelola Data
   - Klik "Hapus Semua"
   - Konfirmasi penghapusan

## Batasan Mode Offline

⚠️ **Penting untuk Diperhatikan:**

1. **Data Lokal Saja**
   - Data hanya tersimpan di browser perangkat yang digunakan
   - Tidak dapat diakses dari perangkat lain
   - Jika browser data dihapus, data akan hilang

2. **Pembayaran Simulasi**
   - Fitur pembayaran hanya simulasi
   - Tidak ada transaksi uang nyata
   - Untuk demo/testing saja

3. **Tidak Ada Sinkronisasi**
   - Perubahan di satu perangkat tidak akan muncul di perangkat lain
   - Tidak ada backup otomatis ke cloud
   - Manual backup diperlukan

4. **Kapasitas Storage**
   - Local storage browser memiliki batasan (biasanya 5-10MB)
   - Untuk data besar, gunakan export/import

## File-File Penting

### Service Layer:
- `/services/localStorage.ts` - Manajemen local storage
- `/services/api.ts` - API client offline
- `/services/mockData.ts` - Data mock/simulasi

### Components:
- `/components/OfflineModeIndicator.tsx` - Indikator mode offline
- `/components/DataBackupManager.tsx` - Manajemen backup/restore

### Configuration:
- `/config/environment.ts` - Konfigurasi mode offline

## Keamanan Data

⚠️ **Catatan Keamanan:**

1. Data disimpan **tanpa enkripsi** di local storage
2. Siapa saja yang mengakses browser dapat melihat data
3. **TIDAK DISARANKAN** untuk data sensitif/pribadi
4. Gunakan hanya untuk demo, testing, atau data non-sensitif

## Rekomendasi Penggunaan

✅ **Cocok untuk:**
- Demo aplikasi
- Testing fitur
- Presentasi
- Prototype
- Penggunaan personal offline

❌ **Tidak cocok untuk:**
- Produksi dengan data nyata
- Data pribadi/sensitif
- Multi-user environment
- Memerlukan sinkronisasi antar perangkat

## Troubleshooting

### Data Hilang?
- Periksa apakah browser data/cache dihapus
- Restore dari file backup jika ada
- Initialize ulang dengan data default

### Storage Penuh?
- Export dan hapus data lama
- Hapus foto/media yang tidak diperlukan
- Gunakan fitur "Hapus Semua Data"

### Tidak Bisa Import Data?
- Pastikan file format JSON valid
- Periksa ukuran file tidak melebihi limit
- Coba dengan browser lain

## Developer Notes

### Menambah Data Default:
Edit fungsi `initializeDefaultData()` di `/services/localStorage.ts`

### Mengubah Struktur Storage:
Update `STORAGE_KEYS` dan fungsi terkait di `/services/localStorage.ts`

### Testing:
```javascript
// Di browser console:
localStorage.clear(); // Hapus semua data
location.reload(); // Reload untuk initialize ulang
```

## Kontak & Support

Untuk pertanyaan atau masalah teknis, silakan hubungi developer atau buka issue di repository.

---

**Versi:** 2.0.0-offline  
**Terakhir diupdate:** 27 Maret 2026
