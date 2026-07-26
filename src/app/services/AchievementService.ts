// Achievement Service
// Business logic untuk prestasi dan nilai akademik

import { getDataProvider } from '../data-access/DataProviderFactory';
import { debugLog } from '../config/environment';
import type { Achievement, AcademicScore } from '../types/api';

export class AchievementService {
  private dataProvider = getDataProvider();

  /**
   * Get semua prestasi untuk student
   */
  async getAchievements(studentId: string, category?: string): Promise<Achievement[]> {
    debugLog('AchievementService.getAchievements', studentId, category);
    return this.dataProvider.getAchievements(studentId, category);
  }

  /**
   * Get prestasi berdasarkan kategori
   */
  async getAchievementsByCategory(studentId: string): Promise<{
    religious: Achievement[];
    academic: Achievement[];
    sports: Achievement[];
    arts: Achievement[];
    other: Achievement[];
  }> {
    const allAchievements = await this.getAchievements(studentId);

    return {
      religious: allAchievements.filter(a => a.category === 'religious'),
      academic: allAchievements.filter(a => a.category === 'academic'),
      sports: allAchievements.filter(a => a.category === 'sports'),
      arts: allAchievements.filter(a => a.category === 'arts'),
      other: allAchievements.filter(a => !['religious', 'academic', 'sports', 'arts'].includes(a.category)),
    };
  }

  /**
   * Save achievement
   */
  async saveAchievement(achievement: Achievement): Promise<void> {
    debugLog('AchievementService.saveAchievement', achievement);
    return this.dataProvider.saveAchievement(achievement);
  }

  /**
   * Get nilai akademik
   */
  async getAcademicScores(studentId: string, semester?: string, year?: string): Promise<AcademicScore[]> {
    debugLog('AchievementService.getAcademicScores', studentId, semester, year);
    return this.dataProvider.getAcademicScores(studentId, semester, year);
  }

  /**
   * Get nilai akademik terbaru (semester saat ini)
   */
  async getLatestAcademicScores(studentId: string): Promise<AcademicScore[]> {
    const currentYear = new Date().getFullYear().toString();
    return this.getAcademicScores(studentId, undefined, currentYear);
  }

  /**
   * Save academic score
   */
  async saveAcademicScore(score: AcademicScore): Promise<void> {
    debugLog('AchievementService.saveAcademicScore', score);
    return this.dataProvider.saveAcademicScore(score);
  }

  /**
   * Calculate rata-rata nilai
   */
  calculateAverageScore(scores: AcademicScore[]): number {
    if (scores.length === 0) return 0;
    const total = scores.reduce((sum, s) => sum + s.score, 0);
    return Math.round((total / scores.length) * 100) / 100;
  }

  /**
   * Get ranking berdasarkan grade
   */
  getRanking(scores: AcademicScore[]): {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
  } {
    const ranking = { A: 0, B: 0, C: 0, D: 0, E: 0 };

    scores.forEach(score => {
      const firstGrade = score.grade.charAt(0).toUpperCase();
      if (firstGrade in ranking) {
        ranking[firstGrade as keyof typeof ranking]++;
      }
    });

    return ranking;
  }

  /**
   * Get summary achievement
   */
  async getAchievementSummary(studentId: string): Promise<{
    totalAchievements: number;
    byCategory: Record<string, number>;
    byLevel: Record<string, number>;
    averageScore: number;
    gradeDistribution: Record<string, number>;
  }> {
    const [achievements, scores] = await Promise.all([
      this.getAchievements(studentId),
      this.getLatestAcademicScores(studentId),
    ]);

    // Count by category
    const byCategory: Record<string, number> = {};
    achievements.forEach(a => {
      byCategory[a.category] = (byCategory[a.category] || 0) + 1;
    });

    // Count by level
    const byLevel: Record<string, number> = {};
    achievements.forEach(a => {
      byLevel[a.level] = (byLevel[a.level] || 0) + 1;
    });

    return {
      totalAchievements: achievements.length,
      byCategory,
      byLevel,
      averageScore: this.calculateAverageScore(scores),
      gradeDistribution: this.getRanking(scores),
    };
  }
}

// Singleton instance
let achievementServiceInstance: AchievementService | null = null;

export const getAchievementService = (): AchievementService => {
  if (!achievementServiceInstance) {
    achievementServiceInstance = new AchievementService();
  }
  return achievementServiceInstance;
};
