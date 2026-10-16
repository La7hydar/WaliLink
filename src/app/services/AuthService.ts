// Authentication Service
// Business logic untuk autentikasi guardian dan admin

import { getDataProvider } from '../data-access/DataProviderFactory';
import { debugLog } from '../config/environment';

export class AuthService {
  private dataProvider = getDataProvider();

  /**
   * Authenticate guardian
   */
  async authenticateGuardian(email: string, password: string): Promise<any | null> {
    debugLog('AuthService.authenticateGuardian', email);
    return this.dataProvider.authenticateGuardian(email, password);
  }

  /**
   * Create guardian account
   */
  async createGuardianAccount(guardianData: any): Promise<any> {
    debugLog('AuthService.createGuardianAccount', guardianData.email);
    return this.dataProvider.createGuardian(guardianData);
  }

  /**
   * Authenticate admin
   */
  async authenticateAdmin(email: string, password: string): Promise<any | null> {
    debugLog('AuthService.authenticateAdmin', email);
    return this.dataProvider.authenticateAdmin(email, password);
  }

  /**
   * Get guardian by ID
   */
  async getGuardian(guardianId: string): Promise<any | null> {
    return this.dataProvider.getGuardian(guardianId);
  }

  /**
   * Get admin by ID
   */
  async getAdmin(adminId: string): Promise<any | null> {
    return this.dataProvider.getAdmin(adminId);
  }

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone format (Indonesia)
   */
  validatePhone(phone: string): boolean {
    // Indonesian phone number format: 08xx-xxxx-xxxx or 08xxxxxxxxxx
    const phoneRegex = /^08\d{8,11}$/;
    const cleanPhone = phone.replace(/[-\s]/g, '');
    return phoneRegex.test(cleanPhone);
  }

  /**
   * Validate password strength
   */
  validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('Password minimal 6 karakter');
    }

    if (!/[a-zA-Z]/.test(password)) {
      errors.push('Password harus mengandung huruf');
    }

    if (!/\d/.test(password)) {
      errors.push('Password harus mengandung angka');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Singleton instance
let authServiceInstance: AuthService | null = null;

export const getAuthService = (): AuthService => {
  if (!authServiceInstance) {
    authServiceInstance = new AuthService();
  }
  return authServiceInstance;
};
