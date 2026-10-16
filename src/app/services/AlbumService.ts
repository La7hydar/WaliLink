// Album Service
// Business logic untuk album dan dokumentasi

import { getDataProvider } from '../data-access/DataProviderFactory';
import { debugLog } from '../config/environment';
import type { AlbumPhoto } from '../types/api';

export class AlbumService {
  private dataProvider = getDataProvider();

  /**
   * Get album photos
   */
  async getAlbumPhotos(studentId: string, category?: string): Promise<AlbumPhoto[]> {
    debugLog('AlbumService.getAlbumPhotos', studentId, category);
    return this.dataProvider.getAlbumPhotos(studentId, category);
  }

  /**
   * Get photos by category
   */
  async getPhotosByCategory(studentId: string): Promise<Record<string, AlbumPhoto[]>> {
    const allPhotos = await this.getAlbumPhotos(studentId);

    const photosByCategory: Record<string, AlbumPhoto[]> = {};

    allPhotos.forEach(photo => {
      if (!photosByCategory[photo.category]) {
        photosByCategory[photo.category] = [];
      }
      photosByCategory[photo.category].push(photo);
    });

    return photosByCategory;
  }

  /**
   * Save album photo
   */
  async saveAlbumPhoto(photo: AlbumPhoto): Promise<void> {
    debugLog('AlbumService.saveAlbumPhoto', photo);
    return this.dataProvider.saveAlbumPhoto(photo);
  }

  /**
   * Get latest photos
   */
  async getLatestPhotos(studentId: string, limit: number = 10): Promise<AlbumPhoto[]> {
    const allPhotos = await this.getAlbumPhotos(studentId);

    // Sort by date (newest first)
    const sorted = allPhotos.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return sorted.slice(0, limit);
  }

  /**
   * Search photos by tags or title
   */
  async searchPhotos(studentId: string, query: string): Promise<AlbumPhoto[]> {
    const allPhotos = await this.getAlbumPhotos(studentId);
    const lowerQuery = query.toLowerCase();

    return allPhotos.filter(photo =>
      photo.title.toLowerCase().includes(lowerQuery) ||
      photo.description?.toLowerCase().includes(lowerQuery) ||
      photo.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get album summary
   */
  async getAlbumSummary(studentId: string): Promise<{
    totalPhotos: number;
    byCategory: Record<string, number>;
    latestPhotos: AlbumPhoto[];
  }> {
    const [allPhotos, latest] = await Promise.all([
      this.getAlbumPhotos(studentId),
      this.getLatestPhotos(studentId, 5),
    ]);

    const byCategory: Record<string, number> = {};
    allPhotos.forEach(photo => {
      byCategory[photo.category] = (byCategory[photo.category] || 0) + 1;
    });

    return {
      totalPhotos: allPhotos.length,
      byCategory,
      latestPhotos: latest,
    };
  }
}

// Singleton instance
let albumServiceInstance: AlbumService | null = null;

export const getAlbumService = (): AlbumService => {
  if (!albumServiceInstance) {
    albumServiceInstance = new AlbumService();
  }
  return albumServiceInstance;
};
