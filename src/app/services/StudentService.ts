// Student Service
// Business logic untuk operasi student

import { getDataProvider } from '../data-access/DataProviderFactory';
import { debugLog } from '../config/environment';

export class StudentService {
  private dataProvider = getDataProvider();

  /**
   * Get student profile lengkap dengan semua data terkait
   */
  async getStudentProfile(studentId: string): Promise<any> {
    debugLog('StudentService.getStudentProfile', studentId);

    const [
      student,
      guardian,
      payments,
      achievements,
      academicScores,
      discipline,
      attendance,
      emoneyTransactions,
      albumPhotos,
      notifications,
      virtualAccount,
    ] = await Promise.all([
      this.dataProvider.getStudent(studentId),
      this.getStudentGuardian(studentId),
      this.dataProvider.getPayments(studentId),
      this.dataProvider.getAchievements(studentId),
      this.dataProvider.getAcademicScores(studentId),
      this.dataProvider.getDisciplineRecords(studentId),
      this.dataProvider.getAttendanceRecords(studentId),
      this.dataProvider.getEmoneyTransactions(studentId),
      this.dataProvider.getAlbumPhotos(studentId),
      this.dataProvider.getNotifications(studentId),
      this.dataProvider.getVirtualAccount(studentId),
    ]);

    if (!student) {
      throw new Error(`Student not found: ${studentId}`);
    }

    const emoneyBalance = await this.dataProvider.getEmoneyBalance(studentId);
    const attendanceRate = this.calculateAttendanceRate(attendance);

    return {
      student,
      guardian,
      address: guardian?.address || {},
      emergencyContact: guardian?.emergencyContact || {},
      virtualAccount,
      academicScores,
      performanceData: [], // TODO: Calculate from scores
      achievements,
      disciplineRecords: discipline,
      payments,
      emoneyBalance,
      emoneyTransactions,
      attendanceRecords: attendance,
      attendanceRate,
      albumPhotos,
      notifications,
      chatContacts: [], // TODO: Implement
    };
  }

  /**
   * Get guardian untuk student
   */
  private async getStudentGuardian(studentId: string): Promise<any> {
    const student = await this.dataProvider.getStudent(studentId);
    if (!student || !student.guardianId) return null;

    return this.dataProvider.getGuardian(student.guardianId);
  }

  /**
   * Calculate attendance rate
   */
  private calculateAttendanceRate(records: any[]): number {
    if (records.length === 0) return 0;

    const presentCount = records.filter(r => r.status === 'present').length;
    return Math.round((presentCount / records.length) * 100);
  }

  /**
   * Get all students
   */
  async getAllStudents(): Promise<any[]> {
    return this.dataProvider.getAllStudents();
  }

  /**
   * Save student
   */
  async saveStudent(student: any): Promise<void> {
    return this.dataProvider.saveStudent(student);
  }

  /**
   * Delete student
   */
  async deleteStudent(studentId: string): Promise<void> {
    return this.dataProvider.deleteStudent(studentId);
  }
}

// Singleton instance
let studentServiceInstance: StudentService | null = null;

export const getStudentService = (): StudentService => {
  if (!studentServiceInstance) {
    studentServiceInstance = new StudentService();
  }
  return studentServiceInstance;
};
