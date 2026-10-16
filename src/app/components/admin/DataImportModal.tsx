import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  AlertCircle, 
  CheckCircle2,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface DataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataType: 'attendance' | 'discipline' | 'achievement' | 'payment' | 'santri';
  onImport: (data: any[]) => void;
}

interface TemplateColumn {
  field: string;
  label: string;
  type: string;
  example: string;
  required: boolean;
  description: string;
}

export function DataImportModal({ isOpen, onClose, dataType, onImport }: DataImportModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Template definitions for different data types
  const templates: Record<string, TemplateColumn[]> = {
    attendance: [
      { field: 'stanbuk', label: 'Stanbuk', type: 'text', example: '2023001', required: true, description: 'Nomor induk santri' },
      { field: 'santri_name', label: 'Nama Santri', type: 'text', example: 'Ahnaf Haidar', required: true, description: 'Nama lengkap santri (auto-fill dari Stanbuk)' },
      { field: 'date', label: 'Tanggal', type: 'date', example: '2025-01-08', required: true, description: 'Format: YYYY-MM-DD' },
      { field: 'status', label: 'Status', type: 'select', example: 'Hadir', required: true, description: 'Hadir/Izin/Sakit/Alpa' },
      { field: 'time', label: 'Waktu', type: 'time', example: '07:30', required: true, description: 'Format: HH:MM' },
      { field: 'notes', label: 'Catatan', type: 'text', example: 'Tepat waktu', required: false, description: 'Keterangan tambahan' }
    ],
    discipline: [
      { field: 'stanbuk', label: 'Stanbuk', type: 'text', example: '2023001', required: true, description: 'Nomor induk santri' },
      { field: 'santri_name', label: 'Nama Santri', type: 'text', example: 'Ahnaf Haidar', required: true, description: 'Nama lengkap santri (auto-fill dari Stanbuk)' },
      { field: 'date', label: 'Tanggal', type: 'date', example: '2025-01-08', required: true, description: 'Format: YYYY-MM-DD' },
      { field: 'type', label: 'Jenis', type: 'select', example: 'Pelanggaran', required: true, description: 'Pelanggaran/Penghargaan' },
      { field: 'category', label: 'Kategori', type: 'text', example: 'Kedisiplinan', required: true, description: 'Kategori pelanggaran/penghargaan' },
      { field: 'description', label: 'Deskripsi', type: 'text', example: 'Terlambat masuk kelas', required: true, description: 'Detail kejadian' },
      { field: 'points', label: 'Poin', type: 'number', example: '-10', required: true, description: 'Poin minus untuk pelanggaran, plus untuk penghargaan' }
    ],
    achievement: [
      { field: 'stanbuk', label: 'Stanbuk', type: 'text', example: '2023001', required: true, description: 'Nomor induk santri' },
      { field: 'santri_name', label: 'Nama Santri', type: 'text', example: 'Ahnaf Haidar', required: true, description: 'Nama lengkap santri (auto-fill dari Stanbuk)' },
      { field: 'achievement_type', label: 'Jenis Prestasi', type: 'select', example: 'Akademik', required: true, description: 'Akademik/Non-Akademik/Hafalan' },
      { field: 'title', label: 'Judul Prestasi', type: 'text', example: 'Juara 1 MTQ', required: true, description: 'Nama lomba/prestasi' },
      { field: 'date', label: 'Tanggal', type: 'date', example: '2025-01-08', required: true, description: 'Format: YYYY-MM-DD' },
      { field: 'level', label: 'Tingkat', type: 'select', example: 'Kabupaten', required: true, description: 'Pondok/Kabupaten/Provinsi/Nasional' },
      { field: 'rank', label: 'Peringkat', type: 'text', example: 'Juara 1', required: true, description: 'Juara 1/2/3 atau Peserta' }
    ],
    payment: [
      { field: 'stanbuk', label: 'Stanbuk', type: 'text', example: '2023001', required: true, description: 'Nomor induk santri' },
      { field: 'santri_name', label: 'Nama Santri', type: 'text', example: 'Ahnaf Haidar', required: true, description: 'Nama lengkap santri (auto-fill dari Stanbuk)' },
      { field: 'payment_type', label: 'Jenis Pembayaran', type: 'select', example: 'SPP', required: true, description: 'SPP/Syahriyah/Daftar Ulang/Lainnya' },
      { field: 'amount', label: 'Jumlah', type: 'number', example: '500000', required: true, description: 'Nominal pembayaran (tanpa pemisah ribuan)' },
      { field: 'month', label: 'Bulan', type: 'text', example: 'Januari 2025', required: true, description: 'Periode pembayaran' },
      { field: 'due_date', label: 'Jatuh Tempo', type: 'date', example: '2025-01-10', required: true, description: 'Format: YYYY-MM-DD' },
      { field: 'status', label: 'Status', type: 'select', example: 'Belum Dibayar', required: true, description: 'Lunas/Belum Dibayar/Terlambat' }
    ],
    santri: [
      { field: 'stanbuk', label: 'Stanbuk', type: 'text', example: '2023001', required: true, description: 'Nomor induk santri (Primary Key)' },
      { field: 'name', label: 'Nama Lengkap', type: 'text', example: 'Ahnaf Haidar', required: true, description: 'Nama lengkap santri' },
      { field: 'class', label: 'Kelas', type: 'text', example: '2 Wusta', required: true, description: 'Tingkat kelas santri' },
      { field: 'gender', label: 'Jenis Kelamin', type: 'select', example: 'L', required: true, description: 'L untuk Laki-laki, P untuk Perempuan' },
      { field: 'room', label: 'Kamar', type: 'text', example: 'Kamar 1A', required: true, description: 'Nama kamar santri' },
      { field: 'birth_date', label: 'Tanggal Lahir', type: 'date', example: '2008-05-15', required: true, description: 'Format: YYYY-MM-DD' },
      { field: 'parent_name', label: 'Nama Wali', type: 'text', example: 'Ahmad Suryanto', required: true, description: 'Nama lengkap wali' },
      { field: 'parent_phone', label: 'No. HP Wali', type: 'text', example: '081234567890', required: true, description: 'Nomor telepon wali' }
    ]
  };

  const currentTemplate = templates[dataType] || templates.santri;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast.error('Format file harus CSV (.csv)');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDownloadTemplate = () => {
    // Generate CSV template
    const headers = currentTemplate.map(col => col.label).join(',');
    const examples = currentTemplate.map(col => col.example).join(',');
    const csvContent = `${headers}\n${examples}\n`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `template_${dataType}_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Template berhasil diunduh');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Pilih file terlebih dahulu');
      return;
    }

    setIsUploading(true);

    try {
      // Simulate file processing
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n').filter(row => row.trim());
        
        if (rows.length < 2) {
          toast.error('File kosong atau tidak valid');
          setIsUploading(false);
          return;
        }

        // Parse CSV (simple implementation)
        const headers = rows[0].split(',').map(h => h.trim());
        const data = rows.slice(1).map(row => {
          const values = row.split(',').map(v => v.trim());
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = values[index];
          });
          return obj;
        });

        setTimeout(() => {
          onImport(data);
          toast.success(`Berhasil mengimport ${data.length} data`);
          setIsUploading(false);
          setSelectedFile(null);
          onClose();
        }, 1000);
      };

      reader.readAsText(selectedFile);
    } catch (error) {
      toast.error('Gagal mengimport data');
      setIsUploading(false);
    }
  };

  const getTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      attendance: 'Absensi',
      discipline: 'Kedisiplinan',
      achievement: 'Prestasi',
      payment: 'Pembayaran',
      santri: 'Data Santri'
    };
    return labels[type] || 'Data';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Import Data {getTypeLabel(dataType)}
          </DialogTitle>
          <DialogDescription>
            Upload file CSV untuk mengimport data secara massal. Pastikan format sesuai dengan template.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 py-4">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">1. Upload File CSV</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <label htmlFor="file-upload" className="flex-1">
                    <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        {selectedFile ? selectedFile.name : 'Klik untuk pilih file CSV'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Format: CSV (*.csv)
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
                {selectedFile && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800 dark:text-green-200 flex-1">
                      File siap diupload: {selectedFile.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Template Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">2. Template & Format Data</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadTemplate}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg mb-4 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-800 dark:text-amber-200">
                    <p className="font-medium mb-1">Petunjuk Penggunaan:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Download template terlebih dahulu</li>
                      <li>Isi data sesuai format yang diberikan</li>
                      <li>Kolom dengan tanda (*) wajib diisi</li>
                      <li>Simpan dalam format CSV</li>
                      <li>Upload file yang sudah diisi</li>
                    </ul>
                  </div>
                </div>

                {/* Template Table - Horizontal Scroll */}
                <div className="border rounded-lg overflow-x-auto">
                  <div className="min-w-[800px]">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium w-32">Field</th>
                          <th className="px-3 py-2 text-left font-medium w-24">Tipe</th>
                          <th className="px-3 py-2 text-left font-medium w-40">Contoh</th>
                          <th className="px-3 py-2 text-left font-medium">Keterangan</th>
                          <th className="px-3 py-2 text-center font-medium w-20">Wajib</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {currentTemplate.map((col, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="px-3 py-2 font-mono text-xs">
                              {col.label}
                            </td>
                            <td className="px-3 py-2">
                              <Badge variant="outline" className="text-xs">
                                {col.type}
                              </Badge>
                            </td>
                            <td className="px-3 py-2 font-mono text-xs text-blue-600 dark:text-blue-400">
                              {col.example}
                            </td>
                            <td className="px-3 py-2 text-xs text-muted-foreground">
                              {col.description}
                            </td>
                            <td className="px-3 py-2 text-center">
                              {col.required ? (
                                <Badge variant="destructive" className="text-xs">*</Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Batal
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Mengimport...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
