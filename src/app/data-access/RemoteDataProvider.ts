// Remote Data Provider
// Implementasi data provider untuk mode online menggunakan REST API

import type { IDataProvider } from './interfaces';
import type {
  Achievement,
  AcademicScore,
  DisciplineRecord,
  Payment,
  EmoneyTransaction,
  AttendanceRecord,
  AlbumPhoto,
  Notification,
  ChatContact,
  ChatMessage,
} from '../types/api';
import { ENV_CONFIG, debugLog } from '../config/environment';

export class RemoteDataProvider implements IDataProvider {
  private baseUrl: string;
  private apiKey: string;
  private timeout: number;

  constructor() {
    this.baseUrl = ENV_CONFIG.apiBaseUrl;
    this.apiKey = ENV_CONFIG.apiKey;
    this.timeout = ENV_CONFIG.apiTimeout;
  }

  // Helper untuk membuat API request
  private async apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    debugLog('API Request:', url, options);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      debugLog('API Response:', data);
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async initialize(): Promise<void> {
    debugLog('RemoteDataProvider initialized');
    // Test connection
    try {
      await this.apiRequest('/health');
    } catch (error) {
      console.warn('Failed to connect to API server:', error);
    }
  }

  // Student operations
  async getStudent(studentId: string): Promise<any | null> {
    return this.apiRequest(`/students/${studentId}`);
  }

  async getAllStudents(): Promise<any[]> {
    return this.apiRequest('/students');
  }

  async saveStudent(student: any): Promise<void> {
    await this.apiRequest(`/students/${student.id}`, {
      method: 'PUT',
      body: JSON.stringify(student),
    });
  }

  async deleteStudent(studentId: string): Promise<void> {
    await this.apiRequest(`/students/${studentId}`, {
      method: 'DELETE',
    });
  }

  // Guardian operations
  async getGuardian(guardianId: string): Promise<any | null> {
    return this.apiRequest(`/guardians/${guardianId}`);
  }

  async authenticateGuardian(email: string, password: string): Promise<any | null> {
    return this.apiRequest('/auth/guardian/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async createGuardian(guardian: any): Promise<any> {
    return this.apiRequest('/guardians', {
      method: 'POST',
      body: JSON.stringify(guardian),
    });
  }

  // Admin operations
  async getAdmin(adminId: string): Promise<any | null> {
    return this.apiRequest(`/admins/${adminId}`);
  }

  async authenticateAdmin(email: string, password: string): Promise<any | null> {
    return this.apiRequest('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Payment operations
  async getPayments(studentId: string, status?: string): Promise<Payment[]> {
    const params = new URLSearchParams({ studentId });
    if (status) params.append('status', status);
    return this.apiRequest(`/payments?${params}`);
  }

  async savePayment(payment: Payment): Promise<void> {
    await this.apiRequest(`/payments/${payment.id}`, {
      method: 'PUT',
      body: JSON.stringify(payment),
    });
  }

  // Achievement operations
  async getAchievements(studentId: string, category?: string): Promise<Achievement[]> {
    const params = new URLSearchParams({ studentId });
    if (category) params.append('category', category);
    return this.apiRequest(`/achievements?${params}`);
  }

  async saveAchievement(achievement: Achievement): Promise<void> {
    await this.apiRequest('/achievements', {
      method: 'POST',
      body: JSON.stringify(achievement),
    });
  }

  // Academic score operations
  async getAcademicScores(studentId: string, semester?: string, year?: string): Promise<AcademicScore[]> {
    const params = new URLSearchParams({ studentId });
    if (semester) params.append('semester', semester);
    if (year) params.append('year', year);
    return this.apiRequest(`/academic-scores?${params}`);
  }

  async saveAcademicScore(score: AcademicScore): Promise<void> {
    await this.apiRequest('/academic-scores', {
      method: 'POST',
      body: JSON.stringify(score),
    });
  }

  // Discipline operations
  async getDisciplineRecords(studentId: string, type?: 'violation' | 'reward'): Promise<DisciplineRecord[]> {
    const params = new URLSearchParams({ studentId });
    if (type) params.append('type', type);
    return this.apiRequest(`/discipline?${params}`);
  }

  async saveDisciplineRecord(record: DisciplineRecord): Promise<void> {
    await this.apiRequest('/discipline', {
      method: 'POST',
      body: JSON.stringify(record),
    });
  }

  // Attendance operations
  async getAttendanceRecords(studentId: string, date?: string): Promise<AttendanceRecord[]> {
    const params = new URLSearchParams({ studentId });
    if (date) params.append('date', date);
    return this.apiRequest(`/attendance?${params}`);
  }

  async saveAttendanceRecord(record: AttendanceRecord): Promise<void> {
    await this.apiRequest('/attendance', {
      method: 'POST',
      body: JSON.stringify(record),
    });
  }

  // E-money operations
  async getEmoneyBalance(studentId: string): Promise<number> {
    const result = await this.apiRequest<{ balance: number }>(`/emoney/${studentId}/balance`);
    return result.balance;
  }

  async getEmoneyTransactions(studentId: string): Promise<EmoneyTransaction[]> {
    return this.apiRequest(`/emoney/${studentId}/transactions`);
  }

  async saveEmoneyTransaction(transaction: EmoneyTransaction): Promise<void> {
    await this.apiRequest('/emoney/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  // Album operations
  async getAlbumPhotos(studentId: string, category?: string): Promise<AlbumPhoto[]> {
    const params = new URLSearchParams({ studentId });
    if (category) params.append('category', category);
    return this.apiRequest(`/album?${params}`);
  }

  async saveAlbumPhoto(photo: AlbumPhoto): Promise<void> {
    await this.apiRequest('/album', {
      method: 'POST',
      body: JSON.stringify(photo),
    });
  }

  // Notification operations
  async getNotifications(studentId: string, unreadOnly?: boolean): Promise<Notification[]> {
    const params = new URLSearchParams({ studentId });
    if (unreadOnly) params.append('unreadOnly', 'true');
    return this.apiRequest(`/notifications?${params}`);
  }

  async saveNotification(notification: Notification): Promise<void> {
    await this.apiRequest('/notifications', {
      method: 'POST',
      body: JSON.stringify(notification),
    });
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await this.apiRequest(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }

  // Chat operations
  async getChatContacts(studentId: string): Promise<ChatContact[]> {
    return this.apiRequest(`/chat/${studentId}/contacts`);
  }

  async getChatMessages(studentId: string, contactId: string): Promise<ChatMessage[]> {
    return this.apiRequest(`/chat/${studentId}/messages/${contactId}`);
  }

  async saveChatMessage(message: ChatMessage): Promise<void> {
    await this.apiRequest('/chat/messages', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  // Server operations
  async getServers(): Promise<any[]> {
    return this.apiRequest('/servers');
  }

  async saveServer(server: any): Promise<void> {
    await this.apiRequest('/servers', {
      method: 'POST',
      body: JSON.stringify(server),
    });
  }

  // Virtual Account operations
  async getVirtualAccount(studentId: string): Promise<any | null> {
    return this.apiRequest(`/virtual-accounts/${studentId}`);
  }
}
