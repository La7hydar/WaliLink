// Services Index
// Export semua services untuk kemudahan import

export { StudentService, getStudentService } from './StudentService';
export { PaymentService, getPaymentService } from './PaymentService';
export { AchievementService, getAchievementService } from './AchievementService';
export { AttendanceService, getAttendanceService } from './AttendanceService';
export { AlbumService, getAlbumService } from './AlbumService';
export { AuthService, getAuthService } from './AuthService';
export { NotificationService, getNotificationService } from './NotificationService';

// Initialize all services
export const initializeServices = async (): Promise<void> => {
  // Services will be initialized lazily when first accessed
  console.log('Services initialized');
};
