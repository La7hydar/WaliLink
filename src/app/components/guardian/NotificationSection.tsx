import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Trophy,
  CreditCard,
  Calendar,
  MessageSquare,
  Trash2,
  Check,
  X
} from 'lucide-react';

interface NotificationSectionProps {
  notificationCount: number;
  onClose: () => void;
}

export function NotificationSection({ notificationCount, onClose }: NotificationSectionProps) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'achievement',
      title: 'Prestasi Baru!',
      message: 'Ahmad Rizki meraih Juara 2 dalam lomba Tahfidz Al-Quran',
      time: '2 jam lalu',
      read: false,
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Pembayaran Berhasil',
      message: 'SPP bulan Desember 2024 telah dibayar dan diterima',
      time: '1 hari lalu',
      read: false,
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Peringatan Kedisiplinan',
      message: 'Ahmad terlambat ke sholat subuh berjamaah hari ini',
      time: '2 hari lalu',
      read: true,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 4,
      type: 'info',
      title: 'Kegiatan Besok',
      message: 'Jangan lupa bawa perlengkapan untuk kegiatan outbound',
      time: '3 hari lalu',
      read: true,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 5,
      type: 'message',
      title: 'Pesan dari Ustadz',
      message: 'Ada tugas tambahan untuk hafalan surat Al-Mulk',
      time: '1 minggu lalu',
      read: true,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="h-full bg-gray-50">
      {/* Header Actions */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">Notifikasi</h2>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 px-2">
                {unreadCount}
              </Badge>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-emerald-600 hover:bg-emerald-50 text-xs"
              >
                <Check className="h-4 w-4 mr-1" />
                Baca Semua
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-destructive"
            >
              <ArrowLeft className="h-4 w-4" />
              Tutup
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-medium mb-2">Tidak ada notifikasi</h3>
              <p className="text-sm text-muted-foreground">
                Semua notifikasi akan muncul di sini
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {/* Clear All Button */}
            {notifications.length > 0 && (
              <div className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Hapus Semua
                </Button>
              </div>
            )}

            {/* Notifications List */}
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <Card
                  key={notification.id}
                  className={`transition-colors ${
                    !notification.read ? 'border-emerald-200 bg-emerald-50/30' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 ${notification.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-5 w-5 ${notification.color}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">{notification.title}</h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notification.time}
                            </p>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-muted-foreground hover:text-emerald-600 p-1"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-muted-foreground hover:text-destructive p-1"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}