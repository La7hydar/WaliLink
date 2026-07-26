// Local Storage Service - Offline Data Management
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
  ChatContact,
  ChatMessage
} from '../types/api';

// Storage Keys
const STORAGE_KEYS = {
  STUDENT_PROFILES: 'walisantri_student_profiles',
  GUARDIANS: 'walisantri_guardians',
  ACHIEVEMENTS: 'walisantri_achievements',
  ACADEMIC_SCORES: 'walisantri_academic_scores',
  PERFORMANCE_DATA: 'walisantri_performance_data',
  DISCIPLINE_RECORDS: 'walisantri_discipline_records',
  PAYMENTS: 'walisantri_payments',
  EMONEY_TRANSACTIONS: 'walisantri_emoney_transactions',
  ATTENDANCE_RECORDS: 'walisantri_attendance_records',
  ALBUM_PHOTOS: 'walisantri_album_photos',
  NOTIFICATIONS: 'walisantri_notifications',
  CHAT_CONTACTS: 'walisantri_chat_contacts',
  CHAT_MESSAGES: 'walisantri_chat_messages',
  CURRENT_USER: 'walisantri_current_user',
  CURRENT_STUDENT_ID: 'walisantri_current_student_id',
  SERVERS: 'walisantri_servers',
  ADMINS: 'walisantri_admins',
  APP_SETTINGS: 'walisantri_app_settings',
  ADMIN_DATA_HISTORY: 'walisantri_admin_data_history',
};

// Helper Functions
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const removeFromStorage = (key: string): void => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Initialize default data if not exists
export const initializeDefaultData = (): void => {
  // Initialize with sample data only if no data exists
  if (!window.localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILES)) {
    const defaultProfile: StudentProfile = {
      student: {
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
        profilePhoto: ''
      },
      guardian: {
        id: 'guardian_001',
        title: 'Bapak',
        fullName: 'Amaluddin La Mani',
        relationship: 'Ayah Kandung',
        phone: '0812-3456-7890',
        whatsapp: '0812-3456-7890',
        email: 'demo@walisant.com',
        occupation: 'Wiraswasta',
        company: 'CV. Berkah Jaya'
      },
      address: {
        street: 'Jl. Raya Pondok No. 123',
        village: 'Kebayoran',
        district: 'Kebayoran Baru',
        regency: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        postalCode: '12180',
        region: 'Jakarta Selatan'
      },
      emergencyContact: {
        contactName: 'Ibu Siti Aminah',
        relationship: 'Ibu Kandung',
        phone: '0856-7890-1234'
      },
      virtualAccount: {
        bankName: 'Bank Syariah Indonesia',
        accountNumber: '7770012345678',
        accountName: 'Ahmad Rizki Maulana',
        swiftCode: 'BSYAIDJA',
        purpose: 'Transfer untuk kebutuhan santri dan pembayaran'
      },
      academicScores: [],
      performanceData: [],
      achievements: [],
      disciplineRecords: [],
      payments: [],
      emoneyBalance: 150000,
      emoneyTransactions: [],
      attendanceRecords: [],
      attendanceRate: 95,
      albumPhotos: [],
      notifications: [],
      chatContacts: []
    };

    saveToStorage(STORAGE_KEYS.STUDENT_PROFILES, [defaultProfile]);
    saveToStorage(STORAGE_KEYS.CURRENT_STUDENT_ID, 'student_001');
  }

  // Initialize guardians
  if (!window.localStorage.getItem(STORAGE_KEYS.GUARDIANS)) {
    const defaultGuardians = [{
      id: 'guardian_001',
      email: 'demo@walisant.com',
      phone: '0812-3456-7890',
      password: 'demo123',
      name: 'Amaluddin La Mani',
      address: 'Jl. Raya Pondok No. 123, Jakarta Selatan',
      photo: '',
      students: ['student_001']
    }];
    saveToStorage(STORAGE_KEYS.GUARDIANS, defaultGuardians);
  }

  // Initialize admins
  if (!window.localStorage.getItem(STORAGE_KEYS.ADMINS)) {
    const defaultAdmins = [
      {
        id: 'admin_001',
        email: 'admin@almunawwarah.com',
        phone: '0812-1111-2222',
        password: 'admin123',
        name: 'Admin Utama',
        role: 'super-admin',
        sections: ['all']
      },
      {
        id: 'admin_002',
        email: 'absensi@almunawwarah.com',
        password: 'admin123',
        name: 'Admin Absensi',
        role: 'admin',
        sections: ['attendance']
      },
      {
        id: 'admin_003',
        email: 'keuangan@almunawwarah.com',
        password: 'admin123',
        name: 'Admin Keuangan',
        role: 'admin',
        sections: ['payment']
      }
    ];
    saveToStorage(STORAGE_KEYS.ADMINS, defaultAdmins);
  }
};

// Student Profile Functions
export const getStudentProfile = (studentId: string): StudentProfile | null => {
  const profiles = getFromStorage<StudentProfile[]>(STORAGE_KEYS.STUDENT_PROFILES, []);
  return profiles.find(p => p.student.id === studentId) || null;
};

export const getAllStudentProfiles = (): StudentProfile[] => {
  return getFromStorage<StudentProfile[]>(STORAGE_KEYS.STUDENT_PROFILES, []);
};

export const saveStudentProfile = (profile: StudentProfile): void => {
  const profiles = getFromStorage<StudentProfile[]>(STORAGE_KEYS.STUDENT_PROFILES, []);
  const index = profiles.findIndex(p => p.student.id === profile.student.id);
  
  if (index >= 0) {
    profiles[index] = profile;
  } else {
    profiles.push(profile);
  }
  
  saveToStorage(STORAGE_KEYS.STUDENT_PROFILES, profiles);
};

export const deleteStudentProfile = (studentId: string): void => {
  const profiles = getFromStorage<StudentProfile[]>(STORAGE_KEYS.STUDENT_PROFILES, []);
  const filtered = profiles.filter(p => p.student.id !== studentId);
  saveToStorage(STORAGE_KEYS.STUDENT_PROFILES, filtered);
};

// Guardian Functions
export const authenticateGuardian = (email: string, password: string): any | null => {
  const guardians = getFromStorage<any[]>(STORAGE_KEYS.GUARDIANS, []);
  return guardians.find(g => 
    (g.email === email || g.phone === email) && g.password === password
  ) || null;
};

export const createGuardianAccount = (guardianData: any): any => {
  const guardians = getFromStorage<any[]>(STORAGE_KEYS.GUARDIANS, []);
  const newGuardian = {
    ...guardianData,
    id: `guardian_${Date.now()}`,
    students: []
  };
  guardians.push(newGuardian);
  saveToStorage(STORAGE_KEYS.GUARDIANS, guardians);
  return newGuardian;
};

// Admin Functions
export const authenticateAdmin = (email: string, password: string): any | null => {
  const admins = getFromStorage<any[]>(STORAGE_KEYS.ADMINS, []);
  return admins.find(a => 
    (a.email === email || a.phone === email) && a.password === password
  ) || null;
};

// Current User Management
export const setCurrentUser = (user: any): void => {
  saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
};

export const getCurrentUser = (): any | null => {
  return getFromStorage(STORAGE_KEYS.CURRENT_USER, null);
};

export const clearCurrentUser = (): void => {
  removeFromStorage(STORAGE_KEYS.CURRENT_USER);
};

// Current Student Management
export const setCurrentStudentId = (studentId: string): void => {
  saveToStorage(STORAGE_KEYS.CURRENT_STUDENT_ID, studentId);
};

export const getCurrentStudentId = (): string => {
  return getFromStorage(STORAGE_KEYS.CURRENT_STUDENT_ID, 'student_001');
};

// Achievement Functions
export const getAchievements = (studentId: string, category?: string): Achievement[] => {
  const achievements = getFromStorage<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, []);
  let filtered = achievements.filter(a => a.studentId === studentId);
  
  if (category) {
    filtered = filtered.filter(a => a.category === category);
  }
  
  return filtered;
};

export const saveAchievement = (achievement: Achievement): void => {
  const achievements = getFromStorage<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, []);
  achievements.push(achievement);
  saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, achievements);
};

// Academic Score Functions
export const getAcademicScores = (studentId: string, semester?: string, year?: string): AcademicScore[] => {
  const scores = getFromStorage<AcademicScore[]>(STORAGE_KEYS.ACADEMIC_SCORES, []);
  let filtered = scores.filter(s => s.studentId === studentId);
  
  if (semester) {
    filtered = filtered.filter(s => s.semester === semester);
  }
  if (year) {
    filtered = filtered.filter(s => s.year === year);
  }
  
  return filtered;
};

export const saveAcademicScore = (score: AcademicScore): void => {
  const scores = getFromStorage<AcademicScore[]>(STORAGE_KEYS.ACADEMIC_SCORES, []);
  scores.push(score);
  saveToStorage(STORAGE_KEYS.ACADEMIC_SCORES, scores);
};

// Performance Data Functions
export const getPerformanceData = (studentId: string): PerformanceData[] => {
  const data = getFromStorage<PerformanceData[]>(STORAGE_KEYS.PERFORMANCE_DATA, []);
  return data.filter(d => d.studentId === studentId);
};

export const savePerformanceData = (data: PerformanceData): void => {
  const allData = getFromStorage<PerformanceData[]>(STORAGE_KEYS.PERFORMANCE_DATA, []);
  allData.push(data);
  saveToStorage(STORAGE_KEYS.PERFORMANCE_DATA, allData);
};

// Discipline Record Functions
export const getDisciplineRecords = (studentId: string, type?: 'violation' | 'reward'): DisciplineRecord[] => {
  const records = getFromStorage<DisciplineRecord[]>(STORAGE_KEYS.DISCIPLINE_RECORDS, []);
  let filtered = records.filter(r => r.studentId === studentId);
  
  if (type) {
    filtered = filtered.filter(r => r.type === type);
  }
  
  return filtered;
};

export const saveDisciplineRecord = (record: DisciplineRecord): void => {
  const records = getFromStorage<DisciplineRecord[]>(STORAGE_KEYS.DISCIPLINE_RECORDS, []);
  records.push(record);
  saveToStorage(STORAGE_KEYS.DISCIPLINE_RECORDS, records);
};

// Payment Functions
export const getPayments = (studentId: string, status?: string): Payment[] => {
  const payments = getFromStorage<Payment[]>(STORAGE_KEYS.PAYMENTS, []);
  let filtered = payments.filter(p => p.studentId === studentId);
  
  if (status) {
    filtered = filtered.filter(p => p.status === status);
  }
  
  return filtered;
};

export const savePayment = (payment: Payment): void => {
  const payments = getFromStorage<Payment[]>(STORAGE_KEYS.PAYMENTS, []);
  const index = payments.findIndex(p => p.id === payment.id);
  
  if (index >= 0) {
    payments[index] = payment;
  } else {
    payments.push(payment);
  }
  
  saveToStorage(STORAGE_KEYS.PAYMENTS, payments);
};

// E-money Functions
export const getEmoneyBalance = (studentId: string): number => {
  const profile = getStudentProfile(studentId);
  return profile?.emoneyBalance || 0;
};

export const setEmoneyBalance = (studentId: string, balance: number): void => {
  const profile = getStudentProfile(studentId);
  if (profile) {
    profile.emoneyBalance = balance;
    saveStudentProfile(profile);
  }
};

export const getEmoneyTransactions = (studentId: string): EmoneyTransaction[] => {
  const transactions = getFromStorage<EmoneyTransaction[]>(STORAGE_KEYS.EMONEY_TRANSACTIONS, []);
  return transactions.filter(t => t.studentId === studentId);
};

export const saveEmoneyTransaction = (transaction: EmoneyTransaction): void => {
  const transactions = getFromStorage<EmoneyTransaction[]>(STORAGE_KEYS.EMONEY_TRANSACTIONS, []);
  transactions.push(transaction);
  saveToStorage(STORAGE_KEYS.EMONEY_TRANSACTIONS, transactions);
  
  // Update balance
  const currentBalance = getEmoneyBalance(transaction.studentId);
  const newBalance = transaction.type === 'credit' 
    ? currentBalance + transaction.amount 
    : currentBalance - transaction.amount;
  setEmoneyBalance(transaction.studentId, newBalance);
};

// Attendance Functions
export const getAttendanceRecords = (studentId: string, date?: string): AttendanceRecord[] => {
  const records = getFromStorage<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE_RECORDS, []);
  let filtered = records.filter(r => r.studentId === studentId);
  
  if (date) {
    filtered = filtered.filter(r => r.date === date);
  }
  
  return filtered;
};

export const saveAttendanceRecord = (record: AttendanceRecord): void => {
  const records = getFromStorage<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE_RECORDS, []);
  records.push(record);
  saveToStorage(STORAGE_KEYS.ATTENDANCE_RECORDS, records);
};

export const calculateAttendanceRate = (studentId: string): number => {
  const records = getAttendanceRecords(studentId);
  if (records.length === 0) return 0;
  
  const presentCount = records.filter(r => r.status === 'present').length;
  return Math.round((presentCount / records.length) * 100);
};

// Album Functions
export const getAlbumPhotos = (studentId: string, category?: string): AlbumPhoto[] => {
  const photos = getFromStorage<AlbumPhoto[]>(STORAGE_KEYS.ALBUM_PHOTOS, []);
  let filtered = photos.filter(p => p.studentId === studentId);
  
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }
  
  return filtered;
};

export const saveAlbumPhoto = (photo: AlbumPhoto): void => {
  const photos = getFromStorage<AlbumPhoto[]>(STORAGE_KEYS.ALBUM_PHOTOS, []);
  photos.push(photo);
  saveToStorage(STORAGE_KEYS.ALBUM_PHOTOS, photos);
};

// Notification Functions
export const getNotifications = (studentId: string, unreadOnly?: boolean): Notification[] => {
  const notifications = getFromStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  let filtered = notifications.filter(n => n.studentId === studentId);
  
  if (unreadOnly) {
    filtered = filtered.filter(n => !n.isRead);
  }
  
  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const markNotificationAsRead = (notificationId: string): void => {
  const notifications = getFromStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  const notification = notifications.find(n => n.id === notificationId);
  
  if (notification) {
    notification.isRead = true;
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }
};

export const saveNotification = (notification: Notification): void => {
  const notifications = getFromStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  notifications.push(notification);
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
};

// Chat Functions
export const getChatContacts = (studentId: string): ChatContact[] => {
  const contacts = getFromStorage<ChatContact[]>(STORAGE_KEYS.CHAT_CONTACTS, []);
  return contacts.filter(c => c.studentId === studentId);
};

export const getChatMessages = (studentId: string, contactId: string): ChatMessage[] => {
  const messages = getFromStorage<ChatMessage[]>(STORAGE_KEYS.CHAT_MESSAGES, []);
  return messages.filter(m => 
    m.studentId === studentId && 
    (m.senderId === contactId || m.receiverId === contactId)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const saveChatMessage = (message: ChatMessage): void => {
  const messages = getFromStorage<ChatMessage[]>(STORAGE_KEYS.CHAT_MESSAGES, []);
  messages.push(message);
  saveToStorage(STORAGE_KEYS.CHAT_MESSAGES, messages);
};

// Server Management (for offline mode, servers are stored locally)
export const getServers = (): any[] => {
  return getFromStorage<any[]>(STORAGE_KEYS.SERVERS, [
    {
      serverId: 'local_server_001',
      serverName: 'Pondok Pesantren Al-Munawwarah',
      isMainServer: true,
      isLocal: true
    }
  ]);
};

export const saveServer = (server: any): void => {
  const servers = getFromStorage<any[]>(STORAGE_KEYS.SERVERS, []);
  servers.push(server);
  saveToStorage(STORAGE_KEYS.SERVERS, servers);
};

// Data Change History (for admin tracking)
export const saveDataChangeHistory = (change: any): void => {
  const history = getFromStorage<any[]>(STORAGE_KEYS.ADMIN_DATA_HISTORY, []);
  history.push({
    ...change,
    timestamp: new Date().toISOString()
  });
  saveToStorage(STORAGE_KEYS.ADMIN_DATA_HISTORY, history);
};

export const getDataChangeHistory = (): any[] => {
  return getFromStorage<any[]>(STORAGE_KEYS.ADMIN_DATA_HISTORY, []);
};

// Clear all data (for testing/reset)
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeFromStorage(key);
  });
};

// Export all storage data (for backup)
export const exportAllData = (): string => {
  const data: any = {};
  Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
    data[key] = getFromStorage(storageKey, null);
  });
  return JSON.stringify(data, null, 2);
};

// Import all storage data (for restore)
export const importAllData = (jsonData: string): void => {
  try {
    const data = JSON.parse(jsonData);
    Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
      if (data[key]) {
        saveToStorage(storageKey, data[key]);
      }
    });
  } catch (error) {
    console.error('Error importing data:', error);
  }
};