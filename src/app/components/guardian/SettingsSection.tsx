import { useState } from 'react';
import { X, Database, WifiOff, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { DataBackupManager } from '../DataBackupManager';
import { OfflineModeIndicator } from '../OfflineModeIndicator';
import { config } from '../../config/environment';

interface SettingsSectionProps {
  guardianData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    photo?: string;
  };
  onClose: () => void;
  onLogout: () => void;
}

export function SettingsSection({ guardianData, onClose, onLogout }: SettingsSectionProps) {
  const [showBackupManager, setShowBackupManager] = useState(false);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[80vh] overflow-auto">
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b p-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Pengaturan</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Offline Mode Info */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <WifiOff className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-sm">Mode Offline</h3>
                      <OfflineModeIndicator variant="badge" className="text-xs" />
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
                      Aplikasi berjalan sepenuhnya offline. Semua data disimpan di perangkat lokal Anda.
                    </p>
                    <div className="space-y-1 text-xs text-blue-600 dark:text-blue-400">
                      <p>• Tidak memerlukan koneksi internet</p>
                      <p>• Data tersimpan di browser lokal</p>
                      <p>• Backup data secara berkala</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Backup Manager */}
            <Card className="hover:border-green-500 transition-all cursor-pointer" onClick={() => setShowBackupManager(true)}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">Kelola Data</h3>
                    <p className="text-xs text-muted-foreground">
                      Backup, restore, atau hapus data lokal
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* App Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">Informasi Aplikasi</h3>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>Nama: {config.app.name}</p>
                      <p>Versi: {config.app.version}</p>
                      <p>Mode: {config.app.mode}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logout */}
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={onLogout}
            >
              Keluar
            </Button>
          </div>
        </div>
      </div>

      {/* Data Backup Manager Modal */}
      <DataBackupManager 
        isOpen={showBackupManager}
        onClose={() => setShowBackupManager(false)}
      />
    </>
  );
}