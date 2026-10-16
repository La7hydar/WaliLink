import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  ArrowLeft, 
  TrendingUp,
  TrendingDown,
  Shield,
  Calendar,
  Target,
  Award,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  LineChart as LineChartIcon
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Legend, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface DisciplineProgressScreenProps {
  onBack: () => void;
}

export function DisciplineProgressScreen({ onBack }: DisciplineProgressScreenProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'semester' | 'year'>('month');

  // Data perkembangan kedisiplinan bulanan
  const monthlyProgress = [
    { month: 'Sep', score: 78, violations: 3, attendance: 95 },
    { month: 'Okt', score: 82, violations: 2, attendance: 96 },
    { month: 'Nov', score: 85, violations: 1, attendance: 97 },
    { month: 'Des', score: 88, violations: 2, attendance: 98 }
  ];

  // Data detail per aspek kedisiplinan
  const disciplineAspects = [
    { aspect: 'Sholat', score: 92, target: 95, trend: 'up' },
    { aspect: 'Kerapian', score: 85, target: 90, trend: 'stable' },
    { aspect: 'Ketepatan Waktu', score: 80, target: 85, trend: 'up' },
    { aspect: 'Kebersihan', score: 88, target: 90, trend: 'up' },
    { aspect: 'Adab & Sopan Santun', score: 95, target: 95, trend: 'stable' }
  ];

  // Radar chart data
  const radarData = [
    { aspect: 'Sholat', current: 92, target: 95 },
    { aspect: 'Kerapian', current: 85, target: 90 },
    { aspect: 'Waktu', current: 80, target: 85 },
    { aspect: 'Kebersihan', current: 88, target: 90 },
    { aspect: 'Adab', current: 95, target: 95 }
  ];

  // Weekly comparison data
  const weeklyComparison = [
    { week: 'W1', thisMonth: 82, lastMonth: 78, average: 80 },
    { week: 'W2', thisMonth: 85, lastMonth: 80, average: 82 },
    { week: 'W3', thisMonth: 87, lastMonth: 82, average: 84 },
    { week: 'W4', thisMonth: 88, lastMonth: 85, average: 86 }
  ];

  // Achievement milestones
  const milestones = [
    {
      title: 'Tidak Ada Pelanggaran',
      description: '7 hari berturut-turut tanpa pelanggaran',
      achieved: true,
      date: '15 Des 2024',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Kehadiran Sempurna',
      description: '1 bulan kehadiran 100%',
      achieved: false,
      progress: 85,
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'Sholat Berjamaah',
      description: '30 hari sholat tepat waktu',
      achieved: false,
      progress: 60,
      icon: Target,
      color: 'text-purple-600'
    }
  ];

  // Improvement recommendations
  const recommendations = [
    {
      area: 'Ketepatan Waktu Sholat',
      current: 80,
      target: 90,
      tips: [
        'Atur alarm 10 menit sebelum adzan',
        'Segera berwudhu setelah mendengar adzan',
        'Jangan tunda-tunda ke masjid'
      ]
    },
    {
      area: 'Kerapian Seragam',
      current: 85,
      target: 95,
      tips: [
        'Cek seragam sebelum berangkat',
        'Gunakan cermin untuk memastikan kerapian',
        'Rapikan seragam setelah setiap aktivitas'
      ]
    }
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const currentScore = monthlyProgress[monthlyProgress.length - 1].score;
  const previousScore = monthlyProgress[monthlyProgress.length - 2].score;
  const scoreChange = currentScore - previousScore;

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
              Perkembangan Kedisiplinan
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Analisis detail progress disiplin
            </p>
          </div>
        </div>

        {/* Current Score Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">
                  Skor Kedisiplinan Saat Ini
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                    {currentScore}
                  </p>
                  <Badge className={scoreChange >= 0 ? 'bg-green-500' : 'bg-red-500'}>
                    {scoreChange >= 0 ? '+' : ''}{scoreChange} poin
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                {scoreChange >= 0 ? (
                  <TrendingUp className="w-12 h-12 text-green-500 mb-1" />
                ) : (
                  <TrendingDown className="w-12 h-12 text-red-500 mb-1" />
                )}
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  dari bulan lalu
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <ScrollArea className="h-full">
        <div className="p-4 pb-20 space-y-4">
          {/* Progress Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <LineChartIcon className="w-5 h-5" />
                Grafik Perkembangan 4 Bulan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="Skor Disiplin"
                      dot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="attendance" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      name="Kehadiran %"
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Radar Chart - Aspect Breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Analisis per Aspek</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="aspect" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar
                      name="Skor Saat Ini"
                      dataKey="current"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Target"
                      dataKey="target"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.1}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Aspects */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Detail Aspek Kedisiplinan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {disciplineAspects.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.aspect}</span>
                      {getTrendIcon(item.trend)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${getScoreColor(item.score)}`}>
                        {item.score}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        / {item.target}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <Progress value={(item.score / item.target) * 100} className="h-3" />
                    <div 
                      className="absolute top-0 h-3 w-1 bg-green-500 rounded-full"
                      style={{ left: `${(item.target / 100) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Kurang {item.target - item.score} poin untuk mencapai target
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weekly Comparison */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Perbandingan Mingguan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="thisMonth" fill="#3b82f6" name="Bulan Ini" />
                    <Bar dataKey="lastMonth" fill="#94a3b8" name="Bulan Lalu" />
                    <Bar dataKey="average" fill="#22c55e" name="Rata-rata" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Milestones & Achievements */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="w-5 h-5" />
                Pencapaian & Target
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                return (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border-2 ${
                      milestone.achieved 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200' 
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        milestone.achieved 
                          ? 'bg-green-100 dark:bg-green-900' 
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          milestone.achieved 
                            ? 'text-green-600 dark:text-green-300' 
                            : milestone.color
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{milestone.title}</h4>
                          {milestone.achieved && (
                            <Badge className="bg-green-500">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Tercapai
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {milestone.description}
                        </p>
                        {milestone.achieved ? (
                          <p className="text-xs text-green-600 dark:text-green-400">
                            Dicapai pada: {milestone.date}
                          </p>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Progress:</span>
                              <span className="font-medium">{milestone.progress}%</span>
                            </div>
                            <Progress value={milestone.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-5 h-5" />
                Rekomendasi Peningkatan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-sm text-blue-900 dark:text-blue-100">
                      {rec.area}
                    </h4>
                    <Badge variant="outline">
                      {rec.current} → {rec.target}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Tips untuk Peningkatan:
                    </p>
                    {rec.tips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                        <p className="text-xs text-blue-700 dark:text-blue-300">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Ringkasan Statistik</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                  </div>
                  <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                    {monthlyProgress.reduce((acc, m) => acc + m.violations, 0)}
                  </p>
                  <p className="text-xs text-purple-700 dark:text-purple-300">
                    Total Pelanggaran
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
                  </div>
                  <p className="text-xl font-bold text-green-900 dark:text-green-100">
                    {Math.round(monthlyProgress.reduce((acc, m) => acc + m.attendance, 0) / monthlyProgress.length)}%
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Rata-rata Kehadiran
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}