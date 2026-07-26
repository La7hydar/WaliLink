import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Download, Upload, AlertCircle, CheckCircle2, Database, FileJson } from 'lucide-react';
import { toast } from 'sonner';
import { exportAllData, importAllData, clearAllData } from '../services/localStorage';

interface DataBackupManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DataBackupManager({ isOpen, onClose }: DataBackupManagerProps) {
  const [importing, setImporting] = useState(false);

  const handleExportData = () => {
    try {
      const data = exportAllData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `walisantri-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Data berhasil diekspor!');
    } catch (error) {
      toast.error('Gagal mengekspor data');
      console.error('Export error:', error);
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        importAllData(content);
        toast.success('Data berhasil diimpor! Silakan refresh halaman.');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        toast.error('Gagal mengimpor data. Pastikan file valid.');
        console.error('Import error:', error);
      } finally {
        setImporting(false);
      }
    };

    reader.onerror = () => {
      toast.error('Gagal membaca file');
      setImporting(false);
    };

    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.')) {
      try {
        clearAllData();
        toast.success('Semua data berhasil dihapus');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        toast.error('Gagal menghapus data');
        console.error('Clear data error:', error);
      }
    }
  };

  const getStorageSize = () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return (total / 1024).toFixed(2); // KB
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Kelola Data Lokal
          </DialogTitle>
          <DialogDescription>
            Backup, restore, atau hapus data yang tersimpan di perangkat
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Storage Info */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  Ukuran Data Tersimpan
                </span>
                <Badge variant="outline" className="text-blue-700 border-blue-300">
                  {getStorageSize()} KB
                </Badge>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Semua data disimpan secara lokal di perangkat Anda
              </p>
            </CardContent>
          </Card>

          {/* Export Data */}
          <Card className="hover:border-green-500 transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">Ekspor Data</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Simpan semua data ke file JSON sebagai backup
                  </p>
                  <Button 
                    onClick={handleExportData}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Ekspor ke File
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Import Data */}
          <Card className="hover:border-blue-500 transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">Impor Data</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Restore data dari file backup sebelumnya
                  </p>
                  <Label htmlFor="import-file">
                    <Button 
                      size="sm"
                      variant="outline"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      disabled={importing}
                      asChild
                    >
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        {importing ? 'Mengimpor...' : 'Pilih File'}
                      </span>
                    </Button>
                  </Label>
                  <input
                    id="import-file"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportData}
                    disabled={importing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clear Data */}
          <Card className="border-red-200 hover:border-red-500 transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">Hapus Semua Data</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Hapus semua data dari perangkat. Pastikan sudah backup!
                  </p>
                  <Button 
                    onClick={handleClearData}
                    size="sm"
                    variant="destructive"
                  >
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Hapus Semua
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warning */}
          <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200">
            <CardContent className="p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-300">
                <strong>Penting:</strong> Data hanya tersimpan di perangkat ini. Jika browser data dihapus atau perangkat bermasalah, 
                data akan hilang. Lakukan backup secara berkala.
              </p>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
