import { ArrowLeft, Bell } from 'lucide-react';
import type { GuardianHomeNotification } from '../../services/GuardianHomeService';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface NotificationSectionProps {
  onClose: () => void;
  notifications: GuardianHomeNotification[];
}

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export function NotificationSection({ onClose, notifications }: NotificationSectionProps) {
  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="border-b border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
            <h2 className="font-semibold">Notifikasi</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Tutup
          </Button>
        </div>
      </div>

      <div className="space-y-3 p-4">
        {notifications.length ? notifications.map((notification) => (
          <Card key={notification.id} className={notification.read_at ? '' : 'border-emerald-500/40'}>
            <CardContent className="flex items-start gap-3 p-4">
              <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                <Bell className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{notification.title}</p>
                  {!notification.read_at && (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-300">
                      Baru
                    </span>
                  )}
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{notification.message}</p>
                <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>{notification.category ?? 'Informasi pondok'}</span>
                  <span>{formatDate(notification.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="mx-auto mb-4 h-10 w-10 text-muted-foreground opacity-50" />
              <h3 className="font-medium">Belum ada notifikasi</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Notifikasi yang dikirim pondok akan muncul di sini.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
