// Authentication Service
// Business logic untuk autentikasi guardian dan admin

import { getDataProvider } from '../data-access/DataProviderFactory';
import { debugLog } from '../config/environment';
import { getSupabaseClient, isSupabaseConfigured } from '../supabase/client';

export class AuthService {
  private dataProvider = getDataProvider();

  /**
   * Authenticate guardian
   */
  async authenticateGuardian(email: string, password: string): Promise<any | null> {
    debugLog('AuthService.authenticateGuardian', email);
    const supabase = getSupabaseClient();
    const identifier = email.trim().toLowerCase();
    if (!identifier.includes('@')) {
      throw new Error('Untuk sementara login wali menggunakan email.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email: identifier, password });

    if (error || !data.user) {
      throw new Error('Email/nomor telepon atau kata sandi tidak valid.');
    }

    const { data: guardian, error: guardianError } = await supabase
      .from('guardians')
      .select('id, full_name, phone_number, address, email')
      .eq('auth_user_id', data.user.id)
      .maybeSingle();

    if (guardianError) throw guardianError;
    if (!guardian) {
      throw new Error('Akun Auth belum ditautkan ke data wali. Hubungi administrator.');
    }

    return {
      id: data.user.id,
      authUserId: data.user.id,
      guardianId: guardian.id,
      name: guardian.full_name,
      email: data.user.email ?? '',
      phone: guardian.phone_number ?? '',
      address: guardian.address ?? '',
    };
  }

  async getCurrentGuardian(): Promise<any | null> {
    if (!isSupabaseConfigured) return null;

    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;

    const { data: guardian, error: guardianError } = await supabase
      .from('guardians')
      .select('id, full_name, phone_number, address, email')
      .eq('auth_user_id', data.user.id)
      .maybeSingle();

    if (guardianError) throw guardianError;
    if (!guardian) return null;

    return {
      id: data.user.id,
      authUserId: data.user.id,
      guardianId: guardian.id,
      name: guardian.full_name,
      email: data.user.email ?? '',
      phone: guardian.phone_number ?? '',
      address: guardian.address ?? '',
    };
  }

  async getPendingGuardianRegistrationEmail(): Promise<string | null> {
    if (!isSupabaseConfigured) return null;

    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user?.email || !user.email_confirmed_at) return null;

    const { data: guardian, error: guardianError } = await supabase
      .from('guardians')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (guardianError) throw guardianError;
    return guardian ? null : user.email;
  }

  async startGuardianEmailRegistration(email: string, password: string): Promise<{ email: string; confirmationRequired: boolean }> {
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error } = await getSupabaseClient().auth.signUp({
      email: normalizedEmail,
      password,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) throw new Error(error.message);
    return {
      email: data.user?.email ?? normalizedEmail,
      confirmationRequired: !data.user?.email_confirmed_at,
    };
  }

  async completeGuardianEmailRegistration(input: {
    email: string;
    childName: string;
    childBirthDate: string;
  }): Promise<any> {
    const supabase = getSupabaseClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    const email = input.email.trim().toLowerCase();

    if (userError || !user?.email || !user.email_confirmed_at || user.email.toLowerCase() !== email) {
      throw new Error('Konfirmasi email belum selesai. Buka tautan konfirmasi di email Anda, lalu coba lagi.');
    }

    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id, guardian_id')
      .eq('full_name', input.childName.trim())
      .eq('birth_date', input.childBirthDate)
      .maybeSingle();

    if (studentError) throw studentError;
    if (!student) {
      throw new Error('Data anak tidak cocok dengan email wali yang terdaftar. Periksa kembali atau hubungi admin.');
    }

    const { data: guardian, error: guardianError } = await supabase
      .from('guardians')
      .select('id, full_name, phone_number, address, email, auth_user_id')
      .eq('id', student.guardian_id)
      .eq('email', email)
      .maybeSingle();

    if (guardianError) throw guardianError;
    if (!guardian || (guardian.auth_user_id && guardian.auth_user_id !== user.id)) {
      throw new Error('Email belum dicatat atau sudah tertaut pada data wali yang disetujui. Hubungi administrator.');
    }

    if (!guardian.auth_user_id) {
      const { data: linkedGuardian, error: linkError } = await supabase
        .from('guardians')
        .update({ auth_user_id: user.id })
        .eq('id', guardian.id)
        .eq('email', email)
        .is('auth_user_id', null)
        .select('id, full_name, phone_number, address, email')
        .maybeSingle();

      if (linkError) throw linkError;
      if (!linkedGuardian) {
        throw new Error('Data wali sudah tertaut ke akun lain. Hubungi administrator.');
      }
    }

    return {
      id: user.id,
      authUserId: user.id,
      guardianId: guardian.id,
      name: guardian.full_name,
      email,
      phone: guardian.phone_number ?? '',
      address: guardian.address ?? '',
    };
  }

  async signOutGuardian(): Promise<void> {
    if (!isSupabaseConfigured) return;
    const { error } = await getSupabaseClient().auth.signOut();
    if (error) throw error;
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
