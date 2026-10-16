// Initial Data - Fallback jika JSON files tidak bisa di-load
// Data ini akan digunakan sebagai fallback default

export const initialStudents = [
  {
    id: 'student_001',
    name: 'Ahmad Rizki',
    fullName: 'Ahmad Rizki Maulana',
    nickname: 'Ahmad',
    nisn: '0078594321',
    birthPlace: 'Yogyakarta',
    birthDate: '15 Agustus 2010',
    age: 14,
    class: 'Kelas 3 Tsanawiyah',
    grade: 9,
    studyClub: 'Tahfidz Club Al-Hikmah',
    dormitory: 'Asrama Al-Hikmah',
    roomNumber: 'Kamar 15B',
    entryYear: '2022',
    status: 'Aktif',
    profilePhoto: '',
    guardianId: 'guardian_001',
  },
];

export const initialGuardians = [
  {
    id: 'guardian_001',
    title: 'Bapak',
    fullName: 'Amaluddin La Mani',
    relationship: 'Ayah Kandung',
    phone: '0812-3456-7890',
    whatsapp: '0812-3456-7890',
    email: 'demo@walisant.com',
    password: 'demo123',
    occupation: 'Wiraswasta',
    company: 'CV. Berkah Jaya',
    address: {
      street: 'Jl. Raya Pondok No. 123',
      village: 'Kebayoran',
      district: 'Kebayoran Baru',
      regency: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      postalCode: '12180',
      region: 'Jakarta Selatan',
    },
    emergencyContact: {
      contactName: 'Ibu Siti Aminah',
      relationship: 'Ibu Kandung',
      phone: '0856-7890-1234',
    },
    students: ['student_001'],
  },
];

export const initialAdmins = [
  {
    id: 'admin_001',
    email: 'admin@almunawwarah.com',
    phone: '0812-1111-2222',
    password: 'admin123',
    name: 'Admin Utama',
    role: 'super-admin',
    sections: ['all'],
  },
  {
    id: 'admin_002',
    email: 'absensi@almunawwarah.com',
    password: 'admin123',
    name: 'Admin Absensi',
    role: 'admin',
    sections: ['attendance'],
  },
  {
    id: 'admin_003',
    email: 'keuangan@almunawwarah.com',
    password: 'admin123',
    name: 'Admin Keuangan',
    role: 'admin',
    sections: ['payment'],
  },
];

export const initialPayments = [
  {
    id: 'pay_001',
    studentId: 'student_001',
    type: 'spp',
    amount: 500000,
    description: 'SPP Bulan Januari 2025',
    status: 'pending',
    dueDate: '2025-01-10',
  },
  {
    id: 'pay_002',
    studentId: 'student_001',
    type: 'spp',
    amount: 500000,
    description: 'SPP Bulan Desember 2024',
    status: 'paid',
    dueDate: '2024-12-10',
    paidDate: '2024-12-08',
    method: 'Bank Transfer',
  },
];

export const initialAchievements = [
  {
    id: 'ach_001',
    studentId: 'student_001',
    title: 'Juara 2 Lomba Tahfidz Al-Quran',
    description: 'Meraih juara 2 dalam lomba hafalan Al-Quran tingkat kabupaten',
    category: 'religious',
    level: 'kabupaten',
    position: 'Juara 2',
    date: '2024-11-15',
    certificate: 'cert_tahfidz_001.pdf',
  },
];

export const initialAcademicScores = [
  {
    id: 'score_001',
    studentId: 'student_001',
    subject: 'Al-Quran',
    score: 88,
    fullMark: 100,
    grade: 'A-',
    semester: 'Ganjil',
    year: '2024',
  },
  {
    id: 'score_002',
    studentId: 'student_001',
    subject: 'Hadits',
    score: 85,
    fullMark: 100,
    grade: 'B+',
    semester: 'Ganjil',
    year: '2024',
  },
];

export const initialDiscipline = [
  {
    id: 'disc_001',
    studentId: 'student_001',
    type: 'violation',
    title: 'Terlambat Sholat Maghrib',
    description: 'Terlambat mengikuti sholat maghrib berjamaah di masjid',
    category: 'Ibadah',
    date: '2024-12-18',
    reportedBy: 'Ustadz Ahmad',
    points: -5,
    status: 'confirmed',
  },
];

export const initialAttendance = [
  {
    id: 'att_001',
    studentId: 'student_001',
    date: '2024-12-19',
    status: 'present',
    sessions: [
      {
        name: 'Sholat Subuh',
        time: '05:00',
        status: 'present',
      },
      {
        name: 'Pembelajaran Pagi',
        time: '08:00',
        status: 'present',
      },
    ],
  },
];

export const initialEmoneyTransactions = [
  // ── Top Up via VA ─────────────────────────────────
  {
    id: 'emoney_001',
    studentId: 'student_001',
    type: 'topup',
    amount: 500000,
    description: 'Top Up via BSI Virtual Account',
    category: 'Top Up',
    date: '2024-12-15',
    verificationStatus: 'verified',
    vaReference: '7770012345678',
  },
  {
    id: 'emoney_002',
    studentId: 'student_001',
    type: 'topup',
    amount: 300000,
    description: 'Top Up via BCA Virtual Account',
    category: 'Top Up',
    date: '2024-12-01',
    verificationStatus: 'verified',
    vaReference: '70012000011234',
  },
  // ── Pengeluaran ────────────────────────────────────
  {
    id: 'emoney_003',
    studentId: 'student_001',
    type: 'spending',
    amount: 500000,
    description: 'Bayar SPP Desember 2024',
    category: 'spp',
    date: '2024-12-15',
    location: 'Koperasi Pesantren',
  },
  {
    id: 'emoney_004',
    studentId: 'student_001',
    type: 'spending',
    amount: 75000,
    description: 'Makan siang & malam — 5 hari',
    category: 'makan',
    date: '2024-12-19',
    location: 'Kantin Pesantren',
  },
  {
    id: 'emoney_005',
    studentId: 'student_001',
    type: 'spending',
    amount: 35000,
    description: 'Laundry seragam & pakaian',
    category: 'laundry',
    date: '2024-12-17',
    location: 'Laundry Pesantren',
  },
  {
    id: 'emoney_006',
    studentId: 'student_001',
    type: 'spending',
    amount: 85000,
    description: 'Pembelian Kitab Fiqih & Nahwu',
    category: 'kitab',
    date: '2024-12-10',
    location: 'Toko Kitab Pesantren',
  },
  {
    id: 'emoney_007',
    studentId: 'student_001',
    type: 'spending',
    amount: 50000,
    description: 'Iuran kegiatan Pesantren Festival',
    category: 'kegiatan',
    date: '2024-12-08',
    location: 'Sekretariat Pesantren',
  },
  {
    id: 'emoney_008',
    studentId: 'student_001',
    type: 'spending',
    amount: 45000,
    description: 'Perlengkapan mandi & kebersihan',
    category: 'perlengkapan',
    date: '2024-12-05',
    location: 'Koperasi Pesantren',
  },
  {
    id: 'emoney_009',
    studentId: 'student_001',
    type: 'transfer_in',
    amount: 100000,
    description: 'Uang Saku dari Ayah',
    category: 'uang_saku',
    date: '2024-12-03',
  },
  // ── Top Up pending (menunggu verifikasi) ──────────
  {
    id: 'emoney_010',
    studentId: 'student_001',
    type: 'topup',
    amount: 200000,
    description: 'Top Up via Mandiri Virtual Account',
    category: 'Top Up',
    date: '2024-12-20',
    verificationStatus: 'pending',
    vaReference: '88808000098765',
  },
];

export const initialAlbumPhotos = [
  {
    id: 'photo_001',
    studentId: 'student_001',
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    title: 'Kegiatan Tahfidz Pagi',
    description: 'Kegiatan hafalan Al-Quran di pagi hari',
    category: 'Kegiatan',
    date: '2024-12-19',
    tags: ['tahfidz', 'pagi', 'alquran'],
  },
];

export const initialNotifications = [
  {
    id: 'notif_001',
    studentId: 'student_001',
    title: 'Pembayaran SPP',
    message: 'Pengingat: SPP bulan Januari 2025 akan jatuh tempo dalam 7 hari',
    type: 'payment',
    priority: 'medium',
    date: '2024-12-19',
    isRead: false,
    actionUrl: '/payment',
  },
];

export const initialVirtualAccounts = [
  {
    id: 'va_001',
    studentId: 'student_001',
    bankName: 'Bank Syariah Indonesia',
    accountNumber: '7770012345678',
    accountName: 'Ahmad Rizki Maulana — Al-Munawwarah',
    swiftCode: 'BSYAIDJA',
    purpose: 'Dompet Santri — Top Up & Pembayaran',
  },
  {
    id: 'va_002',
    studentId: 'student_001',
    bankName: 'BCA Virtual Account',
    accountNumber: '70012000011234',
    accountName: 'Ahmad Rizki Maulana — Al-Munawwarah',
    swiftCode: 'CENAIDJA',
    purpose: 'Dompet Santri — Top Up & Pembayaran',
  },
  {
    id: 'va_003',
    studentId: 'student_001',
    bankName: 'Mandiri Virtual Account',
    accountNumber: '88808000098765',
    accountName: 'Ahmad Rizki Maulana — Al-Munawwarah',
    swiftCode: 'BMRIIDJA',
    purpose: 'Dompet Santri — Top Up & Pembayaran',
  },
];
