import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { 
  Trophy, 
  Award, 
  BookOpen, 
  Target, 
  TrendingUp,
  Star,
  Medal,
  Book,
  Users,
  Calendar,
  Paintbrush,
  Dumbbell
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import {
  getGuardianAchievementData,
  type GuardianAchievement,
  type GuardianAcademicScore,
  type GuardianEvaluation,
} from '../../services/GuardianPortalService';

interface AchievementSectionProps {
  studentId: string;
  studentData: {
    name: string;
    recentAchievement: string;
  };
}

export function AchievementSection({ studentId, studentData }: AchievementSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [achievements, setAchievements] = useState<GuardianAchievement[]>([]);
  const [academicScores, setAcademicScores] = useState<GuardianAcademicScore[]>([]);
  const [evaluations, setEvaluations] = useState<GuardianEvaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setLoadError('');
    getGuardianAchievementData(studentId)
      .then((data) => {
        if (!isCurrent) return;
        setAchievements(data.achievements);
        setAcademicScores(data.scores);
        setEvaluations(data.evaluations);
      })
      .catch((error) => {
        if (isCurrent) setLoadError(error instanceof Error ? error.message : 'Data prestasi gagal dimuat.');
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [studentId]);

  // Categories for filtering
  const categories = [
    { id: '', label: 'Semua', icon: Trophy },
    { id: 'academic', label: 'Akademik', icon: BookOpen },
    { id: 'religious', label: 'Keagamaan', icon: Star },
    { id: 'sports', label: 'Olahraga', icon: Dumbbell },
    { id: 'arts', label: 'Seni', icon: Paintbrush },
    { id: 'leadership', label: 'Kepemimpinan', icon: Users }
  ];

  const scoreGroups = new Map<string, { period: string; total: number; count: number }>();
  academicScores.forEach((item) => {
    if (item.score === null) return;
    const key = `${item.academic_year ?? ''}-${item.semester ?? ''}`;
    const group = scoreGroups.get(key) ?? {
      period: [item.academic_year, item.semester ? `Semester ${item.semester}` : ''].filter(Boolean).join(' · '),
      total: 0,
      count: 0,
    };
    group.total += Number(item.score);
    group.count += 1;
    scoreGroups.set(key, group);
  });
  const scoreProgress = Array.from(scoreGroups.entries())
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([, group]) => ({ period: group.period, score: group.total / group.count }));
  const latestEvaluation = evaluations[0];
  const radarData = latestEvaluation ? [
    { aspect: 'Sopan Santun', score: latestEvaluation.manner_score },
    { aspect: 'Kedisiplinan', score: latestEvaluation.discipline_score },
    { aspect: 'Kehadiran', score: latestEvaluation.attendance_score },
    { aspect: 'Kebersihan', score: latestEvaluation.cleanliness_score },
    { aspect: 'Ibadah', score: latestEvaluation.worship_score },
    { aspect: 'Keaktifan', score: latestEvaluation.activity_score },
  ].filter((item): item is { aspect: string; score: number } => item.score !== null) : [];
  const visibleAchievements = selectedCategory
    ? achievements.filter((item) => item.category?.toLowerCase() === selectedCategory)
    : achievements;
  const latestAchievement = achievements[0];
  const formatDate = (value: string | null) => value
    ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
    : '';

  if (isLoading) return <div className="p-6 text-center text-sm text-muted-foreground">Memuat data prestasi...</div>;
  if (loadError) return <div className="p-6 text-center text-sm text-destructive">{loadError}</div>;

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-300';
    if (score >= 80) return 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-300';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900 dark:text-yellow-300';
    return 'text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-300';
  };

  const getGradeLetter = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    return 'D';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      academic: BookOpen,
      religious: Star,
      sports: Dumbbell,
      arts: Paintbrush,
      leadership: Users
    };
    return icons[category as keyof typeof icons] || Trophy;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      academic: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
      religious: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
      sports: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
      arts: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
      leadership: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
  };

  return (
    <div className="p-4 space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">Prestasi</span>
            </div>
            <p className="text-2xl font-bold">{achievements?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Total prestasi</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Rata-rata</span>
            </div>
            <p className="text-2xl font-bold">
              {academicScores.length > 0
                ? (academicScores.reduce((acc, curr) => acc + Number(curr.score ?? 0), 0) / academicScores.length).toFixed(1)
                : '0.0'}
            </p>
            <p className="text-xs text-muted-foreground">Nilai ujian</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievement Highlight */}
      <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-emerald-900">{latestAchievement ? 'Prestasi Terbaru' : 'Belum Ada Prestasi'}</h3>
              <p className="text-sm text-emerald-700">{latestAchievement?.title ?? 'Data prestasi belum tersedia.'}</p>
              {latestAchievement?.date_achieved && <p className="text-xs text-emerald-600">{formatDate(latestAchievement.date_achieved)}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Performance Chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Perkembangan Nilai</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {scoreProgress.length > 0 ? <LineChart data={scoreProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Rata-rata Nilai"
                />
              </LineChart> : <p className="flex h-full items-center justify-center text-sm text-muted-foreground">Belum ada data nilai.</p>}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Discipline, Attendance & Activity Performance Radar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Perkembangan Kedisiplinan & Keaktifan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {radarData.length > 0 ? <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="aspect" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10 }}
                />
                <Radar
                  name="Skor"
                  dataKey="score"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart> : <p className="flex h-full items-center justify-center text-sm text-muted-foreground">Belum ada evaluasi siswa.</p>}
            </ResponsiveContainer>
          </div>
          
          {/* Detailed Breakdown */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {radarData.map((item, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">{item.aspect}</span>
                  <span className={`text-sm font-bold ${
                    item.score >= 90 ? 'text-green-600' : 
                    item.score >= 80 ? 'text-blue-600' : 
                    item.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {item.score}
                  </span>
                </div>
                <Progress value={item.score} className="h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Exam Scores */}
      <Card>
        <CardHeader className="pb-3">
              <CardTitle className="text-base">Nilai Akademik</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {academicScores.length > 0 ? academicScores.map((subject) => (
            <div key={subject.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{subject.subject_name}</h4>
                <Badge className={getGradeColor(Number(subject.score ?? 0))}>
                  {getGradeLetter(Number(subject.score ?? 0))}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <p className="text-xs text-muted-foreground">{[subject.academic_year, subject.semester ? `Semester ${subject.semester}` : ''].filter(Boolean).join(' · ')}</p>
                <p className="font-medium text-green-600">{subject.score ?? '-'}</p>
              </div>
              <Progress value={Number(subject.score ?? 0)} className="h-2 mt-2" />
            </div>
          )) : (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Belum ada data nilai</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievements List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Daftar Prestasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {visibleAchievements.length > 0 ? visibleAchievements.map((achievement) => {
            const category = achievement.category ?? '';
            const Icon = getCategoryIcon(category);
            const categoryColor = getCategoryColor(category);
            return (
              <div key={achievement.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-sm">{achievement.title}</h4>
                      <span className="text-xs text-muted-foreground">{formatDate(achievement.date_achieved)}</span>
                    </div>
                    {achievement.description && <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>}
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {category || 'Lainnya'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Belum ada prestasi</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}