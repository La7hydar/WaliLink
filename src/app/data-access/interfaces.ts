// Data Access Layer Interfaces
// Interface yang harus diimplementasikan oleh semua data provider

import type {
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
  ChatContact,
  ChatMessage,
} from '../types/api';

// Base interface untuk semua data providers
export interface IDataProvider {
  // Initialization
  initialize(): Promise<void>;

  // Student operations
  getStudent(studentId: string): Promise<any | null>;
  getAllStudents(): Promise<any[]>;
  saveStudent(student: any): Promise<void>;
  deleteStudent(studentId: string): Promise<void>;

  // Guardian operations
  getGuardian(guardianId: string): Promise<any | null>;
  authenticateGuardian(email: string, password: string): Promise<any | null>;
  createGuardian(guardian: any): Promise<any>;

  // Admin operations
  getAdmin(adminId: string): Promise<any | null>;
  authenticateAdmin(email: string, password: string): Promise<any | null>;

  // Payment operations
  getPayments(studentId: string, status?: string): Promise<Payment[]>;
  savePayment(payment: Payment): Promise<void>;

  // Achievement operations
  getAchievements(studentId: string, category?: string): Promise<Achievement[]>;
  saveAchievement(achievement: Achievement): Promise<void>;

  // Academic score operations
  getAcademicScores(studentId: string, semester?: string, year?: string): Promise<AcademicScore[]>;
  saveAcademicScore(score: AcademicScore): Promise<void>;

  // Discipline operations
  getDisciplineRecords(studentId: string, type?: 'violation' | 'reward'): Promise<DisciplineRecord[]>;
  saveDisciplineRecord(record: DisciplineRecord): Promise<void>;

  // Attendance operations
  getAttendanceRecords(studentId: string, date?: string): Promise<AttendanceRecord[]>;
  saveAttendanceRecord(record: AttendanceRecord): Promise<void>;

  // E-money operations
  getEmoneyBalance(studentId: string): Promise<number>;
  getEmoneyTransactions(studentId: string): Promise<EmoneyTransaction[]>;
  saveEmoneyTransaction(transaction: EmoneyTransaction): Promise<void>;

  // Album operations
  getAlbumPhotos(studentId: string, category?: string): Promise<AlbumPhoto[]>;
  saveAlbumPhoto(photo: AlbumPhoto): Promise<void>;

  // Notification operations
  getNotifications(studentId: string, unreadOnly?: boolean): Promise<Notification[]>;
  saveNotification(notification: Notification): Promise<void>;
  markNotificationAsRead(notificationId: string): Promise<void>;

  // Chat operations
  getChatContacts(studentId: string): Promise<ChatContact[]>;
  getChatMessages(studentId: string, contactId: string): Promise<ChatMessage[]>;
  saveChatMessage(message: ChatMessage): Promise<void>;

  // Server operations
  getServers(): Promise<any[]>;
  saveServer(server: any): Promise<void>;

  // Virtual Account operations
  getVirtualAccount(studentId: string): Promise<any | null>;
}

// Response type untuk API calls
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
