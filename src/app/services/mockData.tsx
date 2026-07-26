// Mock Data for Demo Purposes - Now using Local Storage
// All data is stored locally on the device

import { 
  StudentProfile, 
  Achievement, 
  AcademicScore, 
  PerformanceData,
  DisciplineRecord,
  Payment,
  EmoneyTransaction,
  AttendanceRecord,
  AlbumPhoto,
  Notification,
  ChatContact
} from '../types/api';
import { createMockApiResponse } from './api';
import * as localStorage from './localStorage';

// Get current student ID (now from local storage)
export const getCurrentStudentId = (): string => {
  return localStorage.getCurrentStudentId();
};

// Mock Student Profile (now from local storage)
export const getMockStudentProfile = (): Promise<any> => {
  const studentId = getCurrentStudentId();
  const mockProfile = localStorage.getStudentProfile(studentId);
  return createMockApiResponse(mockProfile, 100);
};

// Mock Performance Data
export const getMockPerformanceData = (): Promise<any> => {
  const mockData: PerformanceData[] = [
    { subject: 'Keaktifan', score: 85, fullMark: 100 },
    { subject: 'Kedisiplinan', score: 78, fullMark: 100 },
    { subject: 'Prestasi', score: 92, fullMark: 100 },
    { subject: 'Kehadiran', score: 95, fullMark: 100 },
    { subject: 'Nilai', score: 87, fullMark: 100 },
    { subject: 'Perilaku', score: 89, fullMark: 100 },
  ];

  return createMockApiResponse(mockData, 100);
};

// Mock Academic Scores
export const getMockAcademicScores = (): Promise<any> => {
  const mockScores: AcademicScore[] = [
    { subject: 'Al-Quran', score: 88, fullMark: 100, grade: 'A-', semester: 'Ganjil', year: '2024' },
    { subject: 'Hadits', score: 85, fullMark: 100, grade: 'B+', semester: 'Ganjil', year: '2024' },
    { subject: 'Fiqih', score: 90, fullMark: 100, grade: 'A-', semester: 'Ganjil', year: '2024' },
    { subject: 'Aqidah Akhlaq', score: 92, fullMark: 100, grade: 'A', semester: 'Ganjil', year: '2024' },
    { subject: 'Bahasa Arab', score: 78, fullMark: 100, grade: 'B', semester: 'Ganjil', year: '2024' },
    { subject: 'Matematika', score: 82, fullMark: 100, grade: 'B+', semester: 'Ganjil', year: '2024' },
    { subject: 'Bahasa Indonesia', score: 87, fullMark: 100, grade: 'A-', semester: 'Ganjil', year: '2024' },
    { subject: 'Bahasa Inggris', score: 79, fullMark: 100, grade: 'B', semester: 'Ganjil', year: '2024' },
  ];

  return createMockApiResponse(mockScores, 100);
};

// Mock Achievements
export const getMockAchievements = (): Promise<any> => {
  const mockAchievements: Achievement[] = [
    {
      id: 'ach_001',
      title: 'Juara 2 Lomba Tahfidz Al-Quran',
      description: 'Meraih juara 2 dalam lomba hafalan Al-Quran tingkat kabupaten',
      category: 'religious',
      level: 'kabupaten',
      position: 'Juara 2',
      date: '2024-11-15',
      certificate: 'cert_tahfidz_001.pdf'
    },
    {
      id: 'ach_002',
      title: 'Siswa Terbaik Semester Ganjil',
      description: 'Meraih prestasi akademik terbaik di kelas',
      category: 'academic',
      level: 'pesantren',
      position: 'Peringkat 1',
      date: '2024-12-20',
    },
    {
      id: 'ach_003',
      title: 'Juara 3 Olimpiade Matematika',
      description: 'Meraih juara 3 dalam olimpiade matematika tingkat provinsi',
      category: 'academic',
      level: 'provinsi',
      position: 'Juara 3',
      date: '2024-10-08',
      certificate: 'cert_math_001.pdf'
    }
  ];

  return createMockApiResponse(mockAchievements, 100);
};

// Mock Discipline Records
export const getMockDisciplineRecords = (): Promise<any> => {
  const mockRecords: DisciplineRecord[] = [
    {
      id: 'disc_001',
      type: 'violation',
      title: 'Terlambat Sholat Maghrib',
      description: 'Terlambat mengikuti sholat maghrib berjamaah di masjid',
      category: 'Ibadah',
      date: '2024-12-18',
      reportedBy: 'Ustadz Ahmad',
      points: -5,
      status: 'confirmed'
    },
    {
      id: 'disc_002',
      type: 'reward',
      title: 'Membantu Membersihkan Masjid',
      description: 'Aktif membantu membersihkan masjid setelah sholat',
      category: 'Kebersihan',
      date: '2024-12-17',
      reportedBy: 'Ustadz Mahmud',
      points: 10,
      status: 'confirmed'
    },
    {
      id: 'disc_003',
      type: 'violation',
      title: 'Tidak Rapi Berseragam',
      description: 'Seragam tidak rapi saat mengikuti pembelajaran',
      category: 'Kedisiplinan',
      date: '2024-12-16',
      reportedBy: 'Ustadz Fatah',
      points: -3,
      status: 'pending'
    }
  ];

  return createMockApiResponse(mockRecords, 100);
};

// Mock Payments
export const getMockPayments = (): Promise<any> => {
  const mockPayments: Payment[] = [
    {
      id: 'pay_001',
      type: 'spp',
      amount: 500000,
      description: 'SPP Bulan Januari 2025',
      status: 'pending',
      dueDate: '2025-01-10'
    },
    {
      id: 'pay_002',
      type: 'spp',
      amount: 500000,
      description: 'SPP Bulan Desember 2024',
      status: 'paid',
      dueDate: '2024-12-10',
      paidDate: '2024-12-08',
      method: 'Bank Transfer'
    },
    {
      id: 'pay_003',
      type: 'other',
      amount: 150000,
      description: 'Biaya Kegiatan Ekstrakurikuler',
      status: 'paid',
      dueDate: '2024-12-15',
      paidDate: '2024-12-14',
      method: 'E-Money'
    }
  ];

  return createMockApiResponse(mockPayments, 100);
};

// Mock E-money Transactions
export const getMockEmoneyTransactions = (): Promise<any> => {
  const mockTransactions: EmoneyTransaction[] = [
    {
      id: 'emoney_001',
      type: 'spending',
      amount: 15000,
      description: 'Beli makan siang di kantin',
      category: 'Makanan',
      date: '2024-12-19',
      location: 'Kantin Pesantren'
    },
    {
      id: 'emoney_002',
      type: 'topup',
      amount: 100000,
      description: 'Top up dari orang tua',
      category: 'Top Up',
      date: '2024-12-18'
    },
    {
      id: 'emoney_003',
      type: 'spending',
      amount: 25000,
      description: 'Beli alat tulis',
      category: 'Perlengkapan',
      date: '2024-12-17',
      location: 'Toko Koperasi'
    }
  ];

  return createMockApiResponse(mockTransactions, 100);
};

// Mock Album Photos
export const getMockAlbumPhotos = (): Promise<any> => {
  const mockPhotos: AlbumPhoto[] = [
    {
      id: 'photo_001',
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      title: 'Kegiatan Tahfidz Pagi',
      description: 'Kegiatan hafalan Al-Quran di pagi hari',
      category: 'Kegiatan',
      date: '2024-12-19',
      tags: ['tahfidz', 'pagi', 'alquran']
    },
    {
      id: 'photo_002',
      url: 'https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=400&h=300&fit=crop',
      title: 'Pembelajaran Fiqih',
      description: 'Suasana pembelajaran Fiqih di kelas',
      category: 'Pembelajaran',
      date: '2024-12-18',
      tags: ['fiqih', 'kelas', 'pembelajaran']
    },
    {
      id: 'photo_003',
      url: 'https://images.unsplash.com/photo-1497486751825-1233686d5937?w=400&h=300&fit=crop',
      title: 'Sholat Berjamaah',
      description: 'Sholat Maghrib berjamaah di masjid pesantren',
      category: 'Ibadah',
      date: '2024-12-17',
      tags: ['sholat', 'maghrib', 'jamaah', 'masjid']
    }
  ];

  return createMockApiResponse(mockPhotos, 100);
};

// Mock Notifications
export const getMockNotifications = (): Promise<any> => {
  const mockNotifications: Notification[] = [
    {
      id: 'notif_001',
      title: 'Pembayaran SPP',
      message: 'Pengingat: SPP bulan Januari 2025 akan jatuh tempo dalam 7 hari',
      type: 'payment',
      priority: 'medium',
      date: '2024-12-19',
      read: false,
      actionUrl: '/payment'
    },
    {
      id: 'notif_002',
      title: 'Prestasi Baru!',
      message: 'Selamat! Ahmad meraih Juara 2 Lomba Tahfidz tingkat kabupaten',
      type: 'achievement',
      priority: 'high',
      date: '2024-12-18',
      read: false,
      actionUrl: '/achievement'
    },
    {
      id: 'notif_003',
      title: 'Pelanggaran Kedisiplinan',
      message: 'Terlambat mengikuti sholat maghrib berjamaah',
      type: 'discipline',
      priority: 'medium',
      date: '2024-12-18',
      read: true,
      actionUrl: '/discipline'
    }
  ];

  return createMockApiResponse(mockNotifications, 100);
};

// Mock Chat Contacts
export const getMockChatContacts = (): Promise<any> => {
  const mockContacts: ChatContact[] = [
    {
      id: 'contact_001',
      name: 'Ustadz Ahmad Wijaya',
      role: 'ustadz',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      isOnline: true
    },
    {
      id: 'contact_002',
      name: 'Admin Pesantren',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      isOnline: false,
      lastSeen: '2024-12-19T10:30:00Z'
    },
    {
      id: 'contact_003',
      name: 'Pengurus Asrama Al-Hikmah',
      role: 'dormitory',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      isOnline: true
    },
    {
      id: 'contact_004',
      name: 'Wali Kelas 3 Tsanawiyah',
      role: 'ustadz',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=100&h=100&fit=crop&crop=face',
      isOnline: false,
      lastSeen: '2024-12-19T08:15:00Z'
    }
  ];

  return createMockApiResponse(mockContacts, 100);
};

// Export all mock functions
export const mockApi = {
  getStudentProfile: getMockStudentProfile,
  getPerformanceData: getMockPerformanceData,
  getAcademicScores: getMockAcademicScores,
  getAchievements: getMockAchievements,
  getDisciplineRecords: getMockDisciplineRecords,
  getPayments: getMockPayments,
  getEmoneyTransactions: getMockEmoneyTransactions,
  getAlbumPhotos: getMockAlbumPhotos,
  getNotifications: getMockNotifications,
  getChatContacts: getMockChatContacts
};
