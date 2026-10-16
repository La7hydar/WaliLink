import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Calendar,
  FileText,
  TrendingDown,
  TrendingUp,
  Filter
} from 'lucide-react';

interface ViolationDetailScreenProps {
  onBack: () => void;
}

export function ViolationDetailScreen({ onBack }: ViolationDetailScreenProps) {
  const [selectedTab, setSelectedTab] = useState('all');

  const violations = [
    {
      id: 1,
      date: '20 Des 2024',
      time: '18:05',
      type: 'Terlambat Sholat',
      category: 'ringan',
      description: 'Terlambat 5 menit untuk sholat maghrib berjamaah di masjid',
      punishment: 'Membersihkan masjid setelah sholat isya',
      status: 'completed',
      notes: 'Santri telah menyelesaikan hukuman dengan baik dan berjanji untuk lebih disiplin',
      reportedBy: 'Ustadz Muhammad',
      semester: 'Semester 1 2024/2025'
    },
    {
      id: 2,
      date: '18 Des 2024',
      time: '07:30',
      type: 'Tidak Rapi',
      category: 'ringan',
      description: 'Seragam tidak rapi dan tidak memakai peci saat upacara bendera',
      punishment: 'Menulis surat pernyataan dan membaca di depan kelas',
      status: 'completed',
      notes: 'Santri telah membuat surat pernyataan dan membacanya di depan kelas dengan baik',
      reportedBy: 'Ustadz Abdullah',
      semester: 'Semester 1 2024/2025'
    },
    {
      id: 3,
      date: '15 Des 2024',
      time: '21:30',
      type: 'Keluar Kamar',
      category: 'sedang',
      description: 'Keluar kamar setelah jam malam (21:00) tanpa izin',
      punishment: 'Tidak boleh keluar pondok selama 1 minggu',
      status: 'ongoing',
      notes: 'Hukuman masih berjalan, santri menunjukkan penyesalan',
      reportedBy: 'Pengurus Kamar',
      semester: 'Semester 1 2024/2025'
    },
    {
      id: 4,
      date: '10 Des 2024',
      time: '13:00',
      type: 'Tidur di Kelas',
      category: 'ringan',
      description: 'Tertidur saat pembelajaran siang hari',
      punishment: 'Berdiri di depan kelas selama 30 menit',
      status: 'completed',
      notes: 'Santri mengakui kesalahan dan berjanji untuk istirahat lebih cukup',
      reportedBy: 'Ustadzah Fatimah',
      semester: 'Semester 1 2024/2025'
    },
    {
      id: 5,
      date: '05 Des 2024',
      time: '06:15',
      type: 'Terlambat Bangun',
      category: 'ringan',
      description: 'Terlambat bangun untuk sholat subuh berjamaah',
      punishment: 'Menjadi imam sholat dhuha selama 3 hari',
      status: 'completed',
      notes: 'Hukuman selesai, santri melaksanakan dengan baik',
      reportedBy: 'Pengurus Kamar',
      semester: 'Semester 1 2024/2025'
    },
    // Semester sebelumnya
    {
      id: 6,
      date: '25 Nov 2024',
      time: '14:00',
      type: 'Gaduh di Perpustakaan',
      category: 'ringan',
      description: 'Berbicara keras dan mengganggu santri lain yang sedang belajar',
      punishment: 'Membersihkan perpustakaan selama 1 minggu',
      status: 'completed',
      notes: 'Hukuman selesai dilaksanakan',
      reportedBy: 'Pengurus Perpustakaan',
      semester: 'Semester 1 2024/2025'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ringan': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'sedang': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'berat': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return (
        <Badge variant="default" className="bg-green-500">
          <CheckCircle className="w-3 h-3 mr-1" />
          Selesai
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <Clock className="w-3 h-3 mr-1" />
        Berjalan
      </Badge>
    );
  };

  const filteredViolations = violations.filter(v => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'completed') return v.status === 'completed';
    if (selectedTab === 'ongoing') return v.status === 'ongoing';
    return true;
  });

  const stats = {
    total: violations.length,
    completed: violations.filter(v => v.status === 'completed').length,
    ongoing: violations.filter(v => v.status === 'ongoing').length,
    ringan: violations.filter(v => v.category === 'ringan').length,
    sedang: violations.filter(v => v.category === 'sedang').length,
    berat: violations.filter(v => v.category === 'berat').length
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b p-4 safe-area-top">
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Detail Pelanggaran
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Riwayat lengkap pelanggaran
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Selesai</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-orange-600">{stats.ongoing}</p>
              <p className="text-xs text-muted-foreground">Berjalan</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b px-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="all">Semua ({stats.total})</TabsTrigger>
            <TabsTrigger value="completed">Selesai ({stats.completed})</TabsTrigger>
            <TabsTrigger value="ongoing">Berjalan ({stats.ongoing})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <ScrollArea className="h-full">
        <div className="p-4 pb-20 space-y-4">
          {/* Category Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Ringkasan Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-yellow-700 dark:text-yellow-300 font-bold">{stats.ringan}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Ringan</p>
                </div>
                <div>
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-orange-700 dark:text-orange-300 font-bold">{stats.sedang}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Sedang</p>
                </div>
                <div>
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-red-700 dark:text-red-300 font-bold">{stats.berat}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Berat</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Violations List */}
          {filteredViolations.map((violation) => (
            <Card key={violation.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getCategoryColor(violation.category)}>
                        {violation.type}
                      </Badge>
                      {getStatusBadge(violation.status)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{violation.date}</span>
                      <Clock className="w-3 h-3 ml-2" />
                      <span>{violation.time}</span>
                    </div>
                  </div>
                  <AlertTriangle className={`w-5 h-5 ${
                    violation.category === 'berat' ? 'text-red-500' :
                    violation.category === 'sedang' ? 'text-orange-500' :
                    'text-yellow-500'
                  }`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Deskripsi:</p>
                  <p className="text-sm text-muted-foreground">{violation.description}</p>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-1">
                    Hukuman:
                  </p>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    {violation.punishment}
                  </p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Catatan:
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {violation.notes}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>Dilaporkan oleh: {violation.reportedBy}</span>
                  </div>
                  <span>{violation.semester}</span>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredViolations.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Tidak ada pelanggaran dalam kategori ini
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}