import { ArrowLeft } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { GuardianHomeEvaluation } from '../../services/GuardianHomeService';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';

interface DisciplineProgressScreenProps {
  onBack: () => void;
  evaluations: GuardianHomeEvaluation[];
}

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};

export function DisciplineProgressScreen({ onBack, evaluations }: DisciplineProgressScreenProps) {
  const latest = evaluations[0];
  const radarData = latest ? [
    { aspect: 'Adab', score: latest.manner_score },
    { aspect: 'Disiplin', score: latest.discipline_score },
    { aspect: 'Kehadiran', score: latest.attendance_score },
    { aspect: 'Kebersihan', score: latest.cleanliness_score },
    { aspect: 'Ibadah', score: latest.worship_score },
    { aspect: 'Aktivitas', score: latest.activity_score },
  ].filter((item): item is { aspect: string; score: number } => item.score !== null) : [];
  const history = [...evaluations].reverse().map((evaluation, index) => ({
    period: evaluation.period || formatDate(evaluation.created_at) || `Evaluasi ${index + 1}`,
    discipline: evaluation.discipline_score,
    attendance: evaluation.attendance_score,
  }));

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="flex items-center gap-3 border-b border-border bg-card p-4">
        <Button variant="ghost" size="icon" onClick={onBack} aria-label="Kembali ke kedisiplinan">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-semibold">Perkembangan Evaluasi</h1>
          <p className="text-sm text-muted-foreground">Data evaluasi yang tercatat di database</p>
        </div>
      </header>

      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 p-4 pb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Skor Terbaru per Aspek</CardTitle>
            </CardHeader>
            <CardContent>
              {radarData.length >= 3 ? (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} outerRadius="72%">
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis dataKey="aspect" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }} />
                      <Tooltip />
                      <Radar dataKey="score" name="Skor" stroke="#34d399" fill="#34d399" fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  {radarData.length
                    ? 'Grafik radar memerlukan minimal tiga aspek penilaian yang tersedia.'
                    : 'Belum ada skor evaluasi yang tercatat di database.'}
                </p>
              )}
              {latest && (
                <p className="text-center text-xs text-muted-foreground">
                  {latest.period || formatDate(latest.created_at)}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tren Evaluasi</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length >= 2 ? (
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="period" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="discipline" name="Disiplin" stroke="#34d399" connectNulls />
                      <Line type="monotone" dataKey="attendance" name="Kehadiran" stroke="#fbbf24" connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Tren akan ditampilkan setelah minimal dua evaluasi tersedia.
                </p>
              )}
            </CardContent>
          </Card>

        </div>
      </ScrollArea>
    </div>
  );
}
