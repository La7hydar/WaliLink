import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Calendar,
  Eye,
  FileText,
  Target,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DisciplineSectionProps {
  studentData: {
    name: string;
    violations: number | null;
    attendanceRate: number | null;
  };
  onShowViolationDetail?: () => void;
  onShowWeeklyReports?: () => void;
  onShowDisciplineProgress?: () => void;
}

export function DisciplineSection({ studentData, onShowViolationDetail, onShowWeeklyReports, onShowDisciplineProgress }: DisciplineSectionProps) {
  const disciplineData = [
    { week: 'Minggu 1', violations: 0, attendance: 100 },
    { week: 'Minggu 2', violations: 1, attendance: 95 },
    { week: 'Minggu 3', violations: 0, attendance: 98 },
    { week: 'Minggu 4', violations: 2, attendance: 92 },
  ];

  const attendanceData = [
    { month: 'Sep', hadir: 22, sakit: 1, izin: 0, alpha: 0 },
    { month: 'Okt', hadir: 24, sakit: 0, izin: 1, alpha: 0 },
    { month: 'Nov', hadir: 21, sakit: 2, izin: 1, alpha: 1 },
    { month: 'Des', hadir: 20, sakit: 1, izin: 0, alpha: 0 },
  ];

  const recentViolations = [
    {
      date: '20 Des 2024',
      type: 'Terlambat Sholat',
      description: 'Terlambat 5 menit untuk sholat maghrib',
      punishment: 'Membersihkan masjid',
      status: 'completed'
    },
    {
      date: '18 Des 2024',
      type: 'Tidak Rapi',
      description: 'Seragam tidak rapi saat upacara',
      punishment: 'Menulis surat pernyataan',
      status: 'completed'
    },
  ];

  const weeklyReports = [
    {
      week: 'Minggu ke-4 Desember',
      date: '23-29 Des 2024',
      behavior: 85,
      activity: 90,
      discipline: 80,
      notes: 'Ahmad menunjukkan peningkatan dalam kedisiplinan. Perlu lebih konsisten dalam ketepatan waktu sholat.'
    },
    {
      week: 'Minggu ke-3 Desember',
      date: '16-22 Des 2024',
      behavior: 88,
      activity: 85,
      discipline: 75,
      notes: 'Partisipasi dalam kegiatan pondok sangat baik. Ada beberapa pelanggaran kecil terkait kedisiplinan.'
    },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium">Pelanggaran</span>
            </div>
            <p className="text-2xl font-bold">{studentData.violations ?? '-'}</p>
            <p className="text-xs text-muted-foreground">
              {studentData.violations === null ? 'Data belum tersedia' : 'Bulan ini'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Kehadiran</span>
            </div>
            <p className="text-2xl font-bold">
              {studentData.attendanceRate === null ? '-' : `${studentData.attendanceRate}%`}
            </p>
            <p className="text-xs text-muted-foreground">
              {studentData.attendanceRate === null ? 'Data belum tersedia' : 'Rata-rata bulanan'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Discipline Chart */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Perkembangan Kedisiplinan</CardTitle>
            {onShowDisciplineProgress && (
              <Button variant="ghost" size="sm" onClick={onShowDisciplineProgress}>
                <TrendingUp className="h-4 w-4 mr-1" />
                Lihat Detail
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={disciplineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Line 
                  type="monotone" 
                  dataKey="violations" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Pelanggaran"
                />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Kehadiran (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Detail */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Detail Kehadiran (4 Bulan Terakhir)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Bar dataKey="hadir" fill="#22c55e" name="Hadir" />
                <Bar dataKey="sakit" fill="#f59e0b" name="Sakit" />
                <Bar dataKey="izin" fill="#3b82f6" name="Izin" />
                <Bar dataKey="alpha" fill="#ef4444" name="Alpha" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-green-500 rounded mb-1"></div>
              <span className="text-xs">Hadir</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mb-1"></div>
              <span className="text-xs">Sakit</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mb-1"></div>
              <span className="text-xs">Izin</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-red-500 rounded mb-1"></div>
              <span className="text-xs">Alpha</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Violations */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Pelanggaran Terbaru</CardTitle>
            {onShowViolationDetail && (
              <Button variant="ghost" size="sm" onClick={onShowViolationDetail}>
                <Eye className="h-4 w-4 mr-1" />
                Lihat Semua
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentViolations.length > 0 ? (
            recentViolations.map((violation, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="destructive" className="text-xs">
                        {violation.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{violation.date}</span>
                    </div>
                    <p className="text-sm">{violation.description}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Hukuman:</strong> {violation.punishment}
                    </p>
                  </div>
                  <Badge variant={violation.status === 'completed' ? 'default' : 'secondary'}>
                    {violation.status === 'completed' ? 'Selesai' : 'Berjalan'}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Tidak ada pelanggaran bulan ini</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Reports */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Laporan Mingguan</CardTitle>
            {onShowWeeklyReports && (
              <Button variant="ghost" size="sm" onClick={onShowWeeklyReports}>
                <FileText className="h-4 w-4 mr-1" />
                Lihat Semua
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {weeklyReports.map((report, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-sm">{report.week}</h4>
                  <p className="text-xs text-muted-foreground">{report.date}</p>
                </div>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Perilaku</span>
                  <span className="text-sm font-medium">{report.behavior}%</span>
                </div>
                <Progress value={report.behavior} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Keaktifan</span>
                  <span className="text-sm font-medium">{report.activity}%</span>
                </div>
                <Progress value={report.activity} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Kedisiplinan</span>
                  <span className="text-sm font-medium">{report.discipline}%</span>
                </div>
                <Progress value={report.discipline} className="h-2" />
              </div>
              
              <div className="bg-gray-50 rounded p-3">
                <p className="text-sm text-muted-foreground">
                  <strong>Catatan:</strong> {report.notes}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}