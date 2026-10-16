import { useState } from 'react';
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
import { useAchievements, useAcademicScores, LoadingWrapper } from '../../hooks/useApi';
import { getCurrentStudentId } from '../../services/mockData';
import { Achievement } from '../../types/api';

interface AchievementSectionProps {
  studentData: {
    name: string;
    recentAchievement: string;
  };
}

export function AchievementSection({ studentData }: AchievementSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // Get current student ID
  const studentId = getCurrentStudentId();
  
  // API Hooks
  const { data: achievements, loading: achievementsLoading, error: achievementsError } = useAchievements(studentId, selectedCategory);
  const { data: academicScores, loading: scoresLoading } = useAcademicScores(studentId);

  // Categories for filtering
  const categories = [
    { id: '', label: 'Semua', icon: Trophy },
    { id: 'academic', label: 'Akademik', icon: BookOpen },
    { id: 'religious', label: 'Keagamaan', icon: Star },
    { id: 'sports', label: 'Olahraga', icon: Dumbbell },
    { id: 'arts', label: 'Seni', icon: Paintbrush },
    { id: 'leadership', label: 'Kepemimpinan', icon: Users }
  ];

  // Generate mock score progress from academic scores
  const scoreProgress = [
    { month: 'Sep', score: 82 },
    { month: 'Okt', score: 85 },
    { month: 'Nov', score: 83 },
    { month: 'Des', score: 87 },
  ];

  // Data radar untuk kedisiplinan, kehadiran, keaktifan
  const radarData = [
    { aspect: 'Kedisiplinan', score: 88, fullMark: 100 },
    { aspect: 'Kehadiran', score: 95, fullMark: 100 },
    { aspect: 'Keaktifan', score: 82, fullMark: 100 },
    { aspect: 'Ibadah', score: 92, fullMark: 100 },
    { aspect: 'Kebersihan', score: 85, fullMark: 100 },
    { aspect: 'Sopan Santun', score: 90, fullMark: 100 },
  ];

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
              {academicScores && academicScores.length > 0 
                ? (academicScores.reduce((acc, curr) => acc + curr.average, 0) / academicScores.length).toFixed(1)
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
              <h3 className="font-medium text-emerald-900">Prestasi Terbaru!</h3>
              <p className="text-sm text-emerald-700">{studentData.recentAchievement}</p>
              <p className="text-xs text-emerald-600">20 Des 2024</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Performance Chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Perkembangan Nilai (4 Bulan Terakhir)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 12 }} />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Rata-rata Nilai"
                />
              </LineChart>
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
              <RadarChart data={radarData}>
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
              </RadarChart>
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
          <CardTitle className="text-base">Nilai Ujian Lengkap</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {academicScores && academicScores.length > 0 ? academicScores.map((subject, index) => (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{subject.subject}</h4>
                <Badge className={getGradeColor(subject.average)}>
                  {getGradeLetter(subject.average)}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">UTS</p>
                  <p className="font-medium">{subject.mid}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">UAS</p>
                  <p className="font-medium">{subject.final}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Rata-rata</p>
                  <p className="font-medium text-green-600">{subject.average}</p>
                </div>
              </div>
              <Progress value={subject.average} className="h-2 mt-2" />
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
          {achievements && achievements.length > 0 ? achievements.map((achievement, index) => {
            const Icon = getCategoryIcon(achievement.category);
            const categoryColor = getCategoryColor(achievement.category);
            return (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-sm">{achievement.title}</h4>
                      <span className="text-xs text-muted-foreground">{achievement.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {achievement.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {achievement.level}
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