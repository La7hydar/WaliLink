import { 
  ApiResponse, 
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
  ChatMessage
} from '../types/api';
import * as localStorage from './localStorage';

// Simulate async operations for consistency with previous API
const simulateAsync = <T,>(data: T, delay: number = 100): Promise<ApiResponse<T>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: data,
        message: 'Success (Offline Mode)'
      });
    }, delay);
  });
};

// API Client Class (now using local storage)
class OfflineApiClient {
  // Student Profile APIs
  async getStudentProfile(studentId: string): Promise<ApiResponse<StudentProfile>> {
    const profile = localStorage.getStudentProfile(studentId);
    if (!profile) {
      return simulateAsync(null as any, 100).then(res => ({
        ...res,
        success: false,
        error: 'Student profile not found'
      }));
    }
    return simulateAsync(profile);
  }

  // Academic APIs
  async getAcademicScores(studentId: string, semester?: string, year?: string): Promise<ApiResponse<AcademicScore[]>> {
    const scores = localStorage.getAcademicScores(studentId, semester, year);
    return simulateAsync(scores);
  }

  async getPerformanceData(studentId: string): Promise<ApiResponse<PerformanceData[]>> {
    const data = localStorage.getPerformanceData(studentId);
    return simulateAsync(data);
  }

  // Achievement APIs
  async getAchievements(studentId: string, category?: string): Promise<ApiResponse<Achievement[]>> {
    const achievements = localStorage.getAchievements(studentId, category);
    return simulateAsync(achievements);
  }

  async createAchievement(studentId: string, achievement: Partial<Achievement>): Promise<ApiResponse<Achievement>> {
    const newAchievement: Achievement = {
      id: `achievement_${Date.now()}`,
      studentId,
      ...achievement
    } as Achievement;
    localStorage.saveAchievement(newAchievement);
    return simulateAsync(newAchievement);
  }

  // Discipline APIs
  async getDisciplineRecords(studentId: string, type?: 'violation' | 'reward'): Promise<ApiResponse<DisciplineRecord[]>> {
    const records = localStorage.getDisciplineRecords(studentId, type);
    return simulateAsync(records);
  }

  // Payment APIs
  async getPayments(studentId: string, status?: string): Promise<ApiResponse<Payment[]>> {
    const payments = localStorage.getPayments(studentId, status);
    return simulateAsync(payments);
  }

  async processPayment(studentId: string, paymentId: string, method: string): Promise<ApiResponse<Payment>> {
    const payments = localStorage.getPayments(studentId);
    const payment = payments.find(p => p.id === paymentId);
    
    if (payment) {
      payment.status = 'paid';
      payment.paidDate = new Date().toISOString();
      payment.paymentMethod = method;
      localStorage.savePayment(payment);
      return simulateAsync(payment);
    }
    
    return simulateAsync(null as any).then(res => ({
      ...res,
      success: false,
      error: 'Payment not found'
    }));
  }

  // E-money APIs
  async getEmoneyBalance(studentId: string): Promise<ApiResponse<{ balance: number }>> {
    const balance = localStorage.getEmoneyBalance(studentId);
    return simulateAsync({ balance });
  }

  async getEmoneyTransactions(studentId: string): Promise<ApiResponse<EmoneyTransaction[]>> {
    const transactions = localStorage.getEmoneyTransactions(studentId);
    return simulateAsync(transactions);
  }

  async topupEmoney(studentId: string, amount: number): Promise<ApiResponse<EmoneyTransaction>> {
    const transaction: EmoneyTransaction = {
      id: `emoney_${Date.now()}`,
      studentId,
      amount,
      type: 'credit',
      description: 'Top Up Saldo',
      timestamp: new Date().toISOString(),
      balance: localStorage.getEmoneyBalance(studentId) + amount
    };
    localStorage.saveEmoneyTransaction(transaction);
    return simulateAsync(transaction);
  }

  // Attendance APIs
  async getAttendanceRecords(studentId: string, date?: string): Promise<ApiResponse<AttendanceRecord[]>> {
    const records = localStorage.getAttendanceRecords(studentId, date);
    return simulateAsync(records);
  }

  async getAttendanceRate(studentId: string): Promise<ApiResponse<{ rate: number }>> {
    const rate = localStorage.calculateAttendanceRate(studentId);
    return simulateAsync({ rate });
  }

  // Album APIs
  async getAlbumPhotos(studentId: string, category?: string): Promise<ApiResponse<AlbumPhoto[]>> {
    const photos = localStorage.getAlbumPhotos(studentId, category);
    return simulateAsync(photos);
  }

  // Notification APIs
  async getNotifications(studentId: string, unreadOnly?: boolean): Promise<ApiResponse<Notification[]>> {
    const notifications = localStorage.getNotifications(studentId, unreadOnly);
    return simulateAsync(notifications);
  }

  async markNotificationAsRead(studentId: string, notificationId: string): Promise<ApiResponse<void>> {
    localStorage.markNotificationAsRead(notificationId);
    return simulateAsync(undefined as any);
  }

  // Chat APIs
  async getChatContacts(studentId: string): Promise<ApiResponse<ChatContact[]>> {
    const contacts = localStorage.getChatContacts(studentId);
    return simulateAsync(contacts);
  }

  async getChatMessages(studentId: string, contactId: string, limit?: number): Promise<ApiResponse<ChatMessage[]>> {
    let messages = localStorage.getChatMessages(studentId, contactId);
    if (limit) {
      messages = messages.slice(-limit);
    }
    return simulateAsync(messages);
  }

  async sendMessage(studentId: string, contactId: string, content: string, type: 'text' | 'image' | 'file' = 'text'): Promise<ApiResponse<ChatMessage>> {
    const message: ChatMessage = {
      id: `message_${Date.now()}`,
      studentId,
      senderId: studentId,
      receiverId: contactId,
      content,
      type,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    localStorage.saveChatMessage(message);
    return simulateAsync(message);
  }
}

// Create singleton instance
export const apiClient = new OfflineApiClient();

// Mock API Responses for Demo (Keep for backward compatibility)
export const createMockApiResponse = function <T,>(data: T, delay: number = 100): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: data,
        message: 'Success (Offline Mode)'
      });
    }, delay);
  });
};

// Export API methods for easier imports
export const {
  getStudentProfile,
  getAcademicScores,
  getPerformanceData,
  getAchievements,
  createAchievement,
  getDisciplineRecords,
  getPayments,
  processPayment,
  getEmoneyBalance,
  getEmoneyTransactions,
  topupEmoney,
  getAttendanceRecords,
  getAttendanceRate,
  getAlbumPhotos,
  getNotifications,
  markNotificationAsRead,
  getChatContacts,
  getChatMessages,
  sendMessage
} = apiClient;
