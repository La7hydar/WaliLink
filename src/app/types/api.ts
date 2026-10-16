// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Student Data Types
export interface Student {
  id: string;
  name: string;
  fullName: string;
  nickname: string;
  nisn: string;
  birthPlace: string;
  birthDate: string;
  age: number;
  class: string;
  grade: number;
  studyClub?: string;
  dormitory: string;
  roomNumber: string;
  entryYear: string;
  status: string;
  profilePhoto: string;
}

// Guardian Data Types
export interface Guardian {
  id: string;
  title: string;
  fullName: string;
  relationship: string;
  phone: string;
  whatsapp: string;
  email: string;
  occupation: string;
  company: string;
}

// Address Data Types
export interface Address {
  street: string;
  village: string;
  district: string;
  regency: string;
  province: string;
  postalCode: string;
  region: string;
}

// Emergency Contact Types
export interface EmergencyContact {
  contactName: string;
  relationship: string;
  phone: string;
}

// Virtual Account Types
export interface VirtualAccount {
  studentId?: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  swiftCode: string;
  purpose: string;
}

// Academic Performance Types
export interface AcademicScore {
  subject: string;
  score: number;
  fullMark: number;
  grade: string;
  semester: string;
  year: string;
}

export interface PerformanceData {
  subject: string;
  score: number;
  fullMark: number;
}

// Achievement Types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'religious' | 'sports' | 'arts' | 'leadership';
  level: 'pesantren' | 'kabupaten' | 'provinsi' | 'nasional' | 'internasional';
  position: string;
  date: string;
  certificate?: string;
  photo?: string;
}

// Discipline Types
export interface DisciplineRecord {
  id: string;
  type: 'violation' | 'reward';
  title: string;
  description: string;
  category: string;
  date: string;
  reportedBy: string;
  points: number;
  status: 'pending' | 'confirmed' | 'resolved';
}

// Payment Types
export interface Payment {
  id: string;
  type: 'spp' | 'emoney' | 'other';
  amount: number;
  description: string;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: string;
  paidDate?: string;
  method?: string;
}

export interface EmoneyTransaction {
  id: string;
  studentId?: string;
  type: 'topup' | 'spending' | 'refund' | 'transfer_in' | 'transfer_out';
  amount: number;
  description: string;
  /** Sub-kategori: 'spp' | 'makan' | 'laundry' | 'kitab' | 'kegiatan' | 'perlengkapan' | 'uang_saku' | 'umum' | 'Top Up' */
  category: string;
  date: string;
  location?: string;
  /** Status verifikasi top-up dari VA */
  verificationStatus?: 'pending' | 'verified' | 'failed';
  /** Referensi nomor VA yang digunakan untuk top-up */
  vaReference?: string;
}

export interface WalletTopupRequest {
  id: string;
  studentId: string;
  amount: number;
  vaNumber: string;
  bankName: string;
  method: string;
  requestedAt: string;
  status: 'menunggu_verifikasi' | 'terverifikasi' | 'gagal';
  verifiedAt?: string;
}

export interface WalletSummary {
  balance: number;
  totalTopup: number;
  totalSpending: number;
  spendingByCategory: { category: string; label: string; amount: number; color: string }[];
  recentTransactions: EmoneyTransaction[];
}

// Attendance Types
export interface AttendanceRecord {
  id: string;
  date: string;
  type: 'prayer' | 'class' | 'activity';
  activity: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  time?: string;
  note?: string;
}

// Album Types
export interface AlbumPhoto {
  id: string;
  url: string;
  title: string;
  description?: string;
  category: string;
  date: string;
  tags: string[];
}

// Chat Types
export interface ChatContact {
  id: string;
  name: string;
  role: 'guardian' | 'admin' | 'ustadz' | 'dormitory';
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file';
  timestamp: string;
  read: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'payment' | 'achievement' | 'discipline' | 'general' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  date: string;
  read: boolean;
  actionUrl?: string;
}

// Combined Student Profile
export interface StudentProfile {
  student: Student;
  guardian: Guardian;
  address: Address;
  emergencyContact: EmergencyContact;
  virtualAccount: VirtualAccount;
  academicScores: AcademicScore[];
  performanceData: PerformanceData[];
  achievements: Achievement[];
  disciplineRecords: DisciplineRecord[];
  payments: Payment[];
  emoneyBalance: number;
  emoneyTransactions: EmoneyTransaction[];
  attendanceRecords: AttendanceRecord[];
  attendanceRate: number;
  albumPhotos: AlbumPhoto[];
  notifications: Notification[];
  chatContacts: ChatContact[];
}