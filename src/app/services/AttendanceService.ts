// Attendance & Discipline Service
// Business logic untuk kehadiran dan kedisiplinan

import { getDataProvider } from '../data-access/DataProviderFactory';
import { debugLog } from '../config/environment';
import type { AttendanceRecord, DisciplineRecord } from '../types/api';

export class AttendanceService {
  private dataProvider = getDataProvider();

  /**
   * Get attendance records
   */
  async getAttendanceRecords(studentId: string, date?: string): Promise<AttendanceRecord[]> {
    debugLog('AttendanceService.getAttendanceRecords', studentId, date);
    return this.dataProvider.getAttendanceRecords(studentId, date);
  }

  /**
   * Get attendance untuk bulan tertentu
   */
  async getMonthlyAttendance(studentId: string, year: number, month: number): Promise<AttendanceRecord[]> {
    const allRecords = await this.getAttendanceRecords(studentId);

    return allRecords.filter(record => {
      const [recordYear, recordMonth] = record.date.split('-').map(Number);
      return recordYear === year && recordMonth === month;
    });
  }

  /**
   * Save attendance record
   */
  async saveAttendanceRecord(record: AttendanceRecord): Promise<void> {
    debugLog('AttendanceService.saveAttendanceRecord', record);
    return this.dataProvider.saveAttendanceRecord(record);
  }

  /**
   * Calculate attendance rate
   */
  async calculateAttendanceRate(studentId: string): Promise<number> {
    const records = await this.getAttendanceRecords(studentId);

    if (records.length === 0) return 0;

    const presentCount = records.filter(r => r.status === 'present').length;
    return Math.round((presentCount / records.length) * 100);
  }

  /**
   * Get discipline records
   */
  async getDisciplineRecords(studentId: string, type?: 'violation' | 'reward'): Promise<DisciplineRecord[]> {
    debugLog('AttendanceService.getDisciplineRecords', studentId, type);
    return this.dataProvider.getDisciplineRecords(studentId, type);
  }

  /**
   * Get pelanggaran
   */
  async getViolations(studentId: string): Promise<DisciplineRecord[]> {
    return this.getDisciplineRecords(studentId, 'violation');
  }

  /**
   * Get penghargaan
   */
  async getRewards(studentId: string): Promise<DisciplineRecord[]> {
    return this.getDisciplineRecords(studentId, 'reward');
  }

  /**
   * Save discipline record
   */
  async saveDisciplineRecord(record: DisciplineRecord): Promise<void> {
    debugLog('AttendanceService.saveDisciplineRecord', record);
    return this.dataProvider.saveDisciplineRecord(record);
  }

  /**
   * Calculate discipline points
   */
  async calculateDisciplinePoints(studentId: string): Promise<{
    totalPoints: number;
    violationPoints: number;
    rewardPoints: number;
  }> {
    const records = await this.getDisciplineRecords(studentId);

    const violationPoints = records
      .filter(r => r.type === 'violation')
      .reduce((sum, r) => sum + Math.abs(r.points || 0), 0);

    const rewardPoints = records
      .filter(r => r.type === 'reward')
      .reduce((sum, r) => sum + (r.points || 0), 0);

    return {
      totalPoints: rewardPoints - violationPoints,
      violationPoints,
      rewardPoints,
    };
  }

  /**
   * Get summary kehadiran dan kedisiplinan
   */
  async getAttendanceSummary(studentId: string): Promise<{
    attendanceRate: number;
    totalPresent: number;
    totalAbsent: number;
    totalLate: number;
    disciplinePoints: number;
    totalViolations: number;
    totalRewards: number;
  }> {
    const [attendanceRecords, disciplineRecords, points] = await Promise.all([
      this.getAttendanceRecords(studentId),
      this.getDisciplineRecords(studentId),
      this.calculateDisciplinePoints(studentId),
    ]);

    const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
    const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
    const lateCount = attendanceRecords.filter(r => r.status === 'late').length;

    return {
      attendanceRate: attendanceRecords.length > 0
        ? Math.round((presentCount / attendanceRecords.length) * 100)
        : 0,
      totalPresent: presentCount,
      totalAbsent: absentCount,
      totalLate: lateCount,
      disciplinePoints: points.totalPoints,
      totalViolations: disciplineRecords.filter(r => r.type === 'violation').length,
      totalRewards: disciplineRecords.filter(r => r.type === 'reward').length,
    };
  }
}

// Singleton instance
let attendanceServiceInstance: AttendanceService | null = null;

export const getAttendanceService = (): AttendanceService => {
  if (!attendanceServiceInstance) {
    attendanceServiceInstance = new AttendanceService();
  }
  return attendanceServiceInstance;
};
