// Local Data Provider
// Implementasi data provider untuk mode offline menggunakan JSON files + localStorage

import type { IDataProvider } from './interfaces';
import type {
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
import { ENV_CONFIG, debugLog, getDataFilePath } from '../config/environment';
import {
  initialStudents,
  initialGuardians,
  initialAdmins,
  initialPayments,
  initialAchievements,
  initialAcademicScores,
  initialDiscipline,
  initialAttendance,
  initialEmoneyTransactions,
  initialAlbumPhotos,
  initialNotifications,
  initialVirtualAccounts,
} from './initialData';

// Cache untuk menyimpan data yang sudah di-load dari JSON files
interface DataCache {
  students: any[];
  guardians: any[];
  admins: any[];
  payments: Payment[];
  achievements: Achievement[];
  academicScores: AcademicScore[];
  discipline: DisciplineRecord[];
  attendance: AttendanceRecord[];
  emoneyTransactions: EmoneyTransaction[];
  albumPhotos: AlbumPhoto[];
  notifications: Notification[];
  virtualAccounts: any[];
}

export class LocalDataProvider implements IDataProvider {
  private cache: DataCache | null = null;
  private initialized = false;

  // Load data dari initial data (TypeScript module)
  // Data dapat diubah di file initialData.ts
  private async loadJsonFile<T>(filename: string): Promise<T[]> {
    try {
      let data: T[];

      // Load dari initial data yang sudah di-import
      switch (filename) {
        case 'students.json':
          data = initialStudents as T[];
          break;
        case 'guardians.json':
          data = initialGuardians as T[];
          break;
        case 'admins.json':
          data = initialAdmins as T[];
          break;
        case 'payments.json':
          data = initialPayments as T[];
          break;
        case 'achievements.json':
          data = initialAchievements as T[];
          break;
        case 'academic-scores.json':
          data = initialAcademicScores as T[];
          break;
        case 'discipline.json':
          data = initialDiscipline as T[];
          break;
        case 'attendance.json':
          data = initialAttendance as T[];
          break;
        case 'emoney-transactions.json':
          data = initialEmoneyTransactions as T[];
          break;
        case 'album-photos.json':
          data = initialAlbumPhotos as T[];
          break;
        case 'notifications.json':
          data = initialNotifications as T[];
          break;
        case 'virtual-accounts.json':
          data = initialVirtualAccounts as T[];
          break;
        default:
          console.warn(`Unknown file: ${filename}, returning empty array`);
          return [];
      }

      debugLog(`Loaded ${filename}:`, data);
      return data;
    } catch (error) {
      console.error(`Error loading ${filename}:`, error);
      return [];
    }
  }

  // Initialize: Load semua data dari JSON files ke cache
  async initialize(): Promise<void> {
    if (this.initialized) {
      debugLog('LocalDataProvider already initialized');
      return;
    }

    debugLog('Initializing LocalDataProvider...');

    try {
      // Load semua data dari JSON files
      const [
        students,
        guardians,
        admins,
        payments,
        achievements,
        academicScores,
        discipline,
        attendance,
        emoneyTransactions,
        albumPhotos,
        notifications,
        virtualAccounts,
      ] = await Promise.all([
        this.loadJsonFile('students.json'),
        this.loadJsonFile('guardians.json'),
        this.loadJsonFile('admins.json'),
        this.loadJsonFile('payments.json'),
        this.loadJsonFile('achievements.json'),
        this.loadJsonFile('academic-scores.json'),
        this.loadJsonFile('discipline.json'),
        this.loadJsonFile('attendance.json'),
        this.loadJsonFile('emoney-transactions.json'),
        this.loadJsonFile('album-photos.json'),
        this.loadJsonFile('notifications.json'),
        this.loadJsonFile('virtual-accounts.json'),
      ]);

      // Simpan ke cache
      this.cache = {
        students,
        guardians,
        admins,
        payments,
        achievements,
        academicScores,
        discipline,
        attendance,
        emoneyTransactions,
        albumPhotos,
        notifications,
        virtualAccounts,
      };

      // Sync ke localStorage untuk persistensi
      this.syncToLocalStorage();

      this.initialized = true;
      debugLog('LocalDataProvider initialized successfully');
    } catch (error) {
      console.error('Failed to initialize LocalDataProvider:', error);
      throw error;
    }
  }

  // Sync cache ke localStorage
  private syncToLocalStorage(): void {
    if (!this.cache) return;

    try {
      window.localStorage.setItem('walisantri_data_cache', JSON.stringify(this.cache));
      debugLog('Data synced to localStorage');
    } catch (error) {
      console.error('Failed to sync to localStorage:', error);
    }
  }

  // Load cache dari localStorage (jika ada)
  private loadFromLocalStorage(): boolean {
    try {
      const cached = window.localStorage.getItem('walisantri_data_cache');
      if (cached) {
        this.cache = JSON.parse(cached);
        this.initialized = true;
        debugLog('Loaded cache from localStorage');
        return true;
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    return false;
  }

  // Ensure initialized
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      // Try to load from localStorage first
      if (!this.loadFromLocalStorage()) {
        // If not in localStorage, load from JSON files
        await this.initialize();
      }
    }
  }

  // Student operations
  async getStudent(studentId: string): Promise<any | null> {
    await this.ensureInitialized();
    return this.cache!.students.find(s => s.id === studentId) || null;
  }

  async getAllStudents(): Promise<any[]> {
    await this.ensureInitialized();
    return this.cache!.students;
  }

  async saveStudent(student: any): Promise<void> {
    await this.ensureInitialized();
    const index = this.cache!.students.findIndex(s => s.id === student.id);
    if (index >= 0) {
      this.cache!.students[index] = student;
    } else {
      this.cache!.students.push(student);
    }
    this.syncToLocalStorage();
  }

  async deleteStudent(studentId: string): Promise<void> {
    await this.ensureInitialized();
    this.cache!.students = this.cache!.students.filter(s => s.id !== studentId);
    this.syncToLocalStorage();
  }

  // Guardian operations
  async getGuardian(guardianId: string): Promise<any | null> {
    await this.ensureInitialized();
    return this.cache!.guardians.find(g => g.id === guardianId) || null;
  }

  async authenticateGuardian(email: string, password: string): Promise<any | null> {
    await this.ensureInitialized();
    return this.cache!.guardians.find(g =>
      (g.email === email || g.phone === email) && g.password === password
    ) || null;
  }

  async createGuardian(guardian: any): Promise<any> {
    await this.ensureInitialized();
    const newGuardian = {
      ...guardian,
      id: `guardian_${Date.now()}`,
      students: guardian.students || [],
    };
    this.cache!.guardians.push(newGuardian);
    this.syncToLocalStorage();
    return newGuardian;
  }

  // Admin operations
  async getAdmin(adminId: string): Promise<any | null> {
    await this.ensureInitialized();
    return this.cache!.admins.find(a => a.id === adminId) || null;
  }

  async authenticateAdmin(email: string, password: string): Promise<any | null> {
    await this.ensureInitialized();
    return this.cache!.admins.find(a =>
      (a.email === email || a.phone === email) && a.password === password
    ) || null;
  }

  // Payment operations
  async getPayments(studentId: string, status?: string): Promise<Payment[]> {
    await this.ensureInitialized();
    let filtered = this.cache!.payments.filter(p => p.studentId === studentId);
    if (status) {
      filtered = filtered.filter(p => p.status === status);
    }
    return filtered;
  }

  async savePayment(payment: Payment): Promise<void> {
    await this.ensureInitialized();
    const index = this.cache!.payments.findIndex(p => p.id === payment.id);
    if (index >= 0) {
      this.cache!.payments[index] = payment;
    } else {
      this.cache!.payments.push(payment);
    }
    this.syncToLocalStorage();
  }

  // Achievement operations
  async getAchievements(studentId: string, category?: string): Promise<Achievement[]> {
    await this.ensureInitialized();
    let filtered = this.cache!.achievements.filter(a => a.studentId === studentId);
    if (category) {
      filtered = filtered.filter(a => a.category === category);
    }
    return filtered;
  }

  async saveAchievement(achievement: Achievement): Promise<void> {
    await this.ensureInitialized();
    this.cache!.achievements.push(achievement);
    this.syncToLocalStorage();
  }

  // Academic score operations
  async getAcademicScores(studentId: string, semester?: string, year?: string): Promise<AcademicScore[]> {
    await this.ensureInitialized();
    let filtered = this.cache!.academicScores.filter(s => s.studentId === studentId);
    if (semester) {
      filtered = filtered.filter(s => s.semester === semester);
    }
    if (year) {
      filtered = filtered.filter(s => s.year === year);
    }
    return filtered;
  }

  async saveAcademicScore(score: AcademicScore): Promise<void> {
    await this.ensureInitialized();
    this.cache!.academicScores.push(score);
    this.syncToLocalStorage();
  }

  // Discipline operations
  async getDisciplineRecords(studentId: string, type?: 'violation' | 'reward'): Promise<DisciplineRecord[]> {
    await this.ensureInitialized();
    let filtered = this.cache!.discipline.filter(r => r.studentId === studentId);
    if (type) {
      filtered = filtered.filter(r => r.type === type);
    }
    return filtered;
  }

  async saveDisciplineRecord(record: DisciplineRecord): Promise<void> {
    await this.ensureInitialized();
    this.cache!.discipline.push(record);
    this.syncToLocalStorage();
  }

  // Attendance operations
  async getAttendanceRecords(studentId: string, date?: string): Promise<AttendanceRecord[]> {
    await this.ensureInitialized();
    let filtered = this.cache!.attendance.filter(r => r.studentId === studentId);
    if (date) {
      filtered = filtered.filter(r => r.date === date);
    }
    return filtered;
  }

  async saveAttendanceRecord(record: AttendanceRecord): Promise<void> {
    await this.ensureInitialized();
    this.cache!.attendance.push(record);
    this.syncToLocalStorage();
  }

  // E-money operations
  async getEmoneyBalance(studentId: string): Promise<number> {
    await this.ensureInitialized();
    const transactions = await this.getEmoneyTransactions(studentId);

    // Calculate balance from transactions
    let balance = 0;
    transactions.forEach(t => {
      if (t.type === 'topup' || t.type === 'credit') {
        balance += t.amount;
      } else if (t.type === 'spending' || t.type === 'debit') {
        balance -= t.amount;
      }
    });

    return balance;
  }

  async getEmoneyTransactions(studentId: string): Promise<EmoneyTransaction[]> {
    await this.ensureInitialized();
    return this.cache!.emoneyTransactions.filter(t => t.studentId === studentId);
  }

  async saveEmoneyTransaction(transaction: EmoneyTransaction): Promise<void> {
    await this.ensureInitialized();
    this.cache!.emoneyTransactions.push(transaction);
    this.syncToLocalStorage();
  }

  // Album operations
  async getAlbumPhotos(studentId: string, category?: string): Promise<AlbumPhoto[]> {
    await this.ensureInitialized();
    let filtered = this.cache!.albumPhotos.filter(p => p.studentId === studentId);
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    return filtered;
  }

  async saveAlbumPhoto(photo: AlbumPhoto): Promise<void> {
    await this.ensureInitialized();
    this.cache!.albumPhotos.push(photo);
    this.syncToLocalStorage();
  }

  // Notification operations
  async getNotifications(studentId: string, unreadOnly?: boolean): Promise<Notification[]> {
    await this.ensureInitialized();
    let filtered = this.cache!.notifications.filter(n => n.studentId === studentId);
    if (unreadOnly) {
      filtered = filtered.filter(n => !n.isRead);
    }
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async saveNotification(notification: Notification): Promise<void> {
    await this.ensureInitialized();
    this.cache!.notifications.push(notification);
    this.syncToLocalStorage();
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await this.ensureInitialized();
    const notification = this.cache!.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.syncToLocalStorage();
    }
  }

  // Chat operations (stub - not implemented in JSON files yet)
  async getChatContacts(studentId: string): Promise<ChatContact[]> {
    // TODO: Implement when needed
    return [];
  }

  async getChatMessages(studentId: string, contactId: string): Promise<ChatMessage[]> {
    // TODO: Implement when needed
    return [];
  }

  async saveChatMessage(message: ChatMessage): Promise<void> {
    // TODO: Implement when needed
  }

  // Server operations
  async getServers(): Promise<any[]> {
    return [
      {
        serverId: 'local_server_001',
        serverName: 'Pondok Pesantren Al-Munawwarah',
        isMainServer: true,
        isLocal: true,
      },
    ];
  }

  async saveServer(server: any): Promise<void> {
    // Servers are managed locally, no remote sync needed
    debugLog('Server saved locally:', server);
  }

  // Virtual Account operations
  async getVirtualAccount(studentId: string): Promise<any | null> {
    await this.ensureInitialized();
    return this.cache!.virtualAccounts.find(va => va.studentId === studentId) || null;
  }

  async getVirtualAccounts(studentId: string): Promise<any[]> {
    await this.ensureInitialized();
    return this.cache!.virtualAccounts.filter(va => va.studentId === studentId);
  }
}
