// Notification Service
// Business logic untuk notifikasi

import { getDataProvider } from '../data-access/DataProviderFactory';
import { debugLog } from '../config/environment';
import type { Notification } from '../types/api';

export class NotificationService {
  private dataProvider = getDataProvider();

  /**
   * Get notifications
   */
  async getNotifications(studentId: string, unreadOnly?: boolean): Promise<Notification[]> {
    debugLog('NotificationService.getNotifications', studentId, unreadOnly);
    return this.dataProvider.getNotifications(studentId, unreadOnly);
  }

  /**
   * Get unread notifications
   */
  async getUnreadNotifications(studentId: string): Promise<Notification[]> {
    return this.getNotifications(studentId, true);
  }

  /**
   * Get unread count
   */
  async getUnreadCount(studentId: string): Promise<number> {
    const unread = await this.getUnreadNotifications(studentId);
    return unread.length;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    debugLog('NotificationService.markAsRead', notificationId);
    return this.dataProvider.markNotificationAsRead(notificationId);
  }

  /**
   * Mark all as read
   */
  async markAllAsRead(studentId: string): Promise<void> {
    const unread = await this.getUnreadNotifications(studentId);

    await Promise.all(
      unread.map(notification => this.markAsRead(notification.id))
    );

    debugLog('All notifications marked as read for student:', studentId);
  }

  /**
   * Create notification
   */
  async createNotification(notification: Notification): Promise<void> {
    debugLog('NotificationService.createNotification', notification);
    return this.dataProvider.saveNotification(notification);
  }

  /**
   * Get notifications by type
   */
  async getNotificationsByType(studentId: string, type: string): Promise<Notification[]> {
    const allNotifications = await this.getNotifications(studentId);
    return allNotifications.filter(n => n.type === type);
  }

  /**
   * Get notifications by priority
   */
  async getNotificationsByPriority(studentId: string, priority: string): Promise<Notification[]> {
    const allNotifications = await this.getNotifications(studentId);
    return allNotifications.filter(n => n.priority === priority);
  }

  /**
   * Get high priority notifications
   */
  async getHighPriorityNotifications(studentId: string): Promise<Notification[]> {
    return this.getNotificationsByPriority(studentId, 'high');
  }

  /**
   * Get notification summary
   */
  async getNotificationSummary(studentId: string): Promise<{
    total: number;
    unread: number;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    const [all, unread] = await Promise.all([
      this.getNotifications(studentId),
      this.getUnreadNotifications(studentId),
    ]);

    const byType: Record<string, number> = {};
    const byPriority: Record<string, number> = {};

    all.forEach(notification => {
      byType[notification.type] = (byType[notification.type] || 0) + 1;
      byPriority[notification.priority] = (byPriority[notification.priority] || 0) + 1;
    });

    return {
      total: all.length,
      unread: unread.length,
      byType,
      byPriority,
    };
  }
}

// Singleton instance
let notificationServiceInstance: NotificationService | null = null;

export const getNotificationService = (): NotificationService => {
  if (!notificationServiceInstance) {
    notificationServiceInstance = new NotificationService();
  }
  return notificationServiceInstance;
};
