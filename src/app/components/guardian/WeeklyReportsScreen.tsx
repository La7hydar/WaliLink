import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  ArrowLeft, 
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  Star,
  Users,
  BookOpen,
  Shield,
  Activity,
  CheckCircle,
  Download
} from 'lucide-react';

interface WeeklyReportsScreenProps {
  onBack: () => void;
}

export function WeeklyReportsScreen({ onBack }: WeeklyReportsScreenProps) {
  const [selectedSemester, setSelectedSemester] = useState<'current' | 'previous'>('current');

  const weeklyReports = [
    {
      id: 1,
      week: 'Minggu ke-4 Desember',
      date: '23-29 Des 2024',
      semester: 'Semester 1 2024/2025',
      behavior: 85,
      activity: 90,
      discipline: 80,
      academic: 87,
      religious: 92,
      notes: 'Ahmad menunjukkan peningkatan yang signifikan dalam kedisiplinan. Partisipasi aktif dalam kegiatan pondok sangat baik. Perlu lebih konsisten dalam ketepatan waktu sholat berjamaah.',
      achievements: [
        'Menjadi imam sholat dhuha 3x',
        'Menyelesaikan hafalan 2 halaman Al-Quran',
        'Aktif dalam diskusi kelas'
      ],
      improvements: [
        'Ketepatan waktu sholat perlu ditingkatkan',
        'Konsistensi dalam menjaga kebersihan kamar'
      ],
      teacherName: 'Ustadz Muhammad Ali',
      trend: 'up'
    },
    {
      id: 2,
      week: 'Minggu ke-3 Desember',
      date: '16-22 Des 2024',
      semester: 'Semester 1 2024/2025',
      behavior: 88,
      activity: 85,
      discipline: 75,
      academic: 85,
      religious: 90,
      notes: 'Partisipasi dalam kegiatan pondok sangat baik. Ada beberapa pelanggaran kecil terkait kedisiplinan waktu. Prestasi akademik stabil dan baik.',
      achievements: [
        'Juara 2 lomba kaligrafi',
        'Membantu mengajar adik kelas',
        'Mengikuti semua kajian dengan aktif'
      ],
      improvements: [
        'Perlu lebih disiplin dalam waktu sholat',
        'Menjaga kerapian seragam'
      ],
      teacherName: 'Ustadzah Fatimah',
      trend: 'down'
    },
    {
      id: 3,
      week: 'Minggu ke-2 Desember',
      date: '9-15 Des 2024',
      semester: 'Semester 1 2024/2025',
      behavior: 90,
      activity: 88,
      discipline: 85,
      academic: 88,
      religious: 88,
      notes: 'Minggu yang sangat produktif. Ahmad menunjukkan perilaku yang baik dan konsisten. Tidak ada pelanggaran yang dicatat. Terus pertahankan!',
      achievements: [
        'Tidak ada pelanggaran selama seminggu',
        'Nilai ujian meningkat',
        'Memimpin diskusi kelompok'
      ],
      improvements: [
        'Terus tingkatkan hafalan Al-Quran',
        'Lebih aktif dalam kegiatan olahraga'
      ],
      teacherName: 'Ustadz Abdullah',
      trend: 'up'
    },
    {
      id: 4,
      week: 'Minggu ke-1 Desember',
      date: '2-8 Des 2024',
      semester: 'Semester 1 2024/2025',
      behavior: 82,
      activity: 80,
      discipline: 78,
      academic: 83,
      religious: 85,
      notes: 'Awal bulan yang cukup baik namun perlu peningkatan. Beberapa keterlambatan kecil yang perlu diperhatikan. Semangat belajar cukup baik.',
      achievements: [
        'Menyelesaikan tugas tepat waktu',
        'Aktif dalam kerja bakti',
      ],
      improvements: [
        'Bangun lebih pagi untuk sholat subuh',
        'Lebih fokus saat pembelajaran',
        'Menjaga konsistensi dalam beribadah'
      ],
      teacherName: 'Ustadz Muhammad Ali',
      trend: 'stable'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Sangat Baik';
    if (score >= 80) return 'Baik';
    if (score >= 70) return 'Cukup';
    return 'Perlu Perbaikan';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const calculateAverage = (report: typeof weeklyReports[0]) => {
    return ((report.behavior + report.activity + report.discipline + report.academic + report.religious) / 5).toFixed(1);
  };

  const filteredReports = weeklyReports.filter(r => 
    selectedSemester === 'current' ? r.semester.includes('2024/2025') : r.semester.includes('2023/2024')
  );

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
              Laporan Mingguan
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Evaluasi perkembangan santri
            </p>
          </div>
        </div>

        {/* Semester Tabs */}
        <Tabs value={selectedSemester} onValueChange={(v) => setSelectedSemester(v as 'current' | 'previous')}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="current">Semester Saat Ini</TabsTrigger>
            <TabsTrigger value="previous">Semester Sebelumnya</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <ScrollArea className="h-full">
        <div className="p-4 pb-20 space-y-4">
          {/* Overall Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-600" />
                Rata-rata Keseluruhan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-blue-600">
                    {(filteredReports.reduce((acc, r) => acc + r.behavior, 0) / filteredReports.length).toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Perilaku</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">
                    {(filteredReports.reduce((acc, r) => acc + r.activity, 0) / filteredReports.length).toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Keaktifan</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-orange-600">
                    {(filteredReports.reduce((acc, r) => acc + r.discipline, 0) / filteredReports.length).toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Disiplin</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-purple-600">
                    {(filteredReports.reduce((acc, r) => acc + r.academic, 0) / filteredReports.length).toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Akademik</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-emerald-600">
                    {(filteredReports.reduce((acc, r) => acc + r.religious, 0) / filteredReports.length).toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Keagamaan</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Reports List */}
          {filteredReports.map((report) => (
            <Card key={report.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-5 h-5 text-primary" />
                      <CardTitle className="text-base">{report.week}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{report.date}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {getTrendIcon(report.trend)}
                    <Badge variant="outline" className={getScoreColor(parseFloat(calculateAverage(report)))}>
                      {calculateAverage(report)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Score Breakdown */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Perilaku
                      </span>
                      <span className={`text-sm font-medium ${getScoreColor(report.behavior)}`}>
                        {report.behavior}%
                      </span>
                    </div>
                    <Progress value={report.behavior} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Keaktifan
                      </span>
                      <span className={`text-sm font-medium ${getScoreColor(report.activity)}`}>
                        {report.activity}%
                      </span>
                    </div>
                    <Progress value={report.activity} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Kedisiplinan
                      </span>
                      <span className={`text-sm font-medium ${getScoreColor(report.discipline)}`}>
                        {report.discipline}%
                      </span>
                    </div>
                    <Progress value={report.discipline} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Akademik
                      </span>
                      <span className={`text-sm font-medium ${getScoreColor(report.academic)}`}>
                        {report.academic}%
                      </span>
                    </div>
                    <Progress value={report.academic} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Keagamaan
                      </span>
                      <span className={`text-sm font-medium ${getScoreColor(report.religious)}`}>
                        {report.religious}%
                      </span>
                    </div>
                    <Progress value={report.religious} className="h-2" />
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Catatan Ustadz/Ustadzah:
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {report.notes}
                  </p>
                </div>

                {/* Achievements */}
                {report.achievements.length > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Pencapaian:
                    </p>
                    <ul className="space-y-1">
                      {report.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-sm text-green-700 dark:text-green-300 flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {report.improvements.length > 0 && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                    <p className="text-sm font-medium text-orange-900 dark:text-orange-100 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Perlu Ditingkatkan:
                    </p>
                    <ul className="space-y-1">
                      {report.improvements.map((improvement, idx) => (
                        <li key={idx} className="text-sm text-orange-700 dark:text-orange-300 flex items-start gap-2">
                          <span className="text-orange-500">•</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
                  <span>Dinilai oleh: {report.teacherName}</span>
                  <Button variant="ghost" size="sm">
                    <Download className="w-3 h-3 mr-1" />
                    Unduh PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredReports.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Belum ada laporan untuk semester ini
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}