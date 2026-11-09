import { CheckCircle, TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type {
  GuardianHomeAttendance,
  GuardianHomeDisciplineRecord,
  GuardianHomeEvaluation,
} from '../../services/GuardianHomeService';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface DisciplineSectionProps {
  studentData: {
    name: string;
    evaluations: GuardianHomeEvaluation[];
    attendanceRecords: GuardianHomeAttendance[];
    disciplineRecords: GuardianHomeDisciplineRecord[];
  };
  onShowDisciplineProgress?: () => void;
}

const aspects: Array<{ key: keyof GuardianHomeEvaluation; label: string }> = [
  { key: 'manner_score', label: 'Adab' },
  { key: 'discipline_score', label: 'Disiplin' },
  { key: 'attendance_score', label: 'Kehadiran' },
  { key: 'cleanliness_score', label: 'Kebersihan' },
  { key: 'worship_score', label: 'Ibadah' },
  { key: 'activity_score', label: 'Aktivitas' },
];

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};

const attendanceLabels: Record<GuardianHomeAttendance['status'], string> = {
  present: 'Hadir',
  late: 'Terlambat',
  permission: 'Izin',
  sick: 'Sakit',
  absent: 'Alpa',
};

const severityLabels: Record<GuardianHomeDisciplineRecord['severity'], string> = {
  minor: 'Ringan',
  moderate: 'Sedang',
  serious: 'Berat',
};

const formatTime = (value: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(date);
};

export function DisciplineSection({ studentData, onShowDisciplineProgress }: DisciplineSectionProps) {
  const evaluations = studentData.evaluations;
  const attendanceRecords = studentData.attendanceRecords;
  const disciplineRecords = studentData.disciplineRecords;
  const latest = evaluations[0];
  const chartData = [...evaluations].reverse().map((evaluation, index) => ({
    period: evaluation.period || formatDate(evaluation.created_at) || `Evaluasi ${index + 1}`,
    discipline: evaluation.discipline_score,
    attendance: evaluation.attendance_score,
  }));
  const scores = latest
    ? aspects.flatMap(({ key, label }) => {
        const score = latest[key];
        return typeof score === 'number' && Number.isFinite(score) ? [{ label, score }] : [];
      })
    : [];

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle className="text-base">Evaluasi Kedisiplinan</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{studentData.name}</p>
          </div>
          {onShowDisciplineProgress && (
            <Button variant="outline" size="sm" onClick={onShowDisciplineProgress}>
              <TrendingUp className="mr-1 h-4 w-4" />
              Detail
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {scores.length ? (
            <>
              <p className="mb-3 text-xs text-muted-foreground">
                Skor evaluasi terbaru{latest?.period ? ` · ${latest.period}` : latest ? ` · ${formatDate(latest.created_at)}` : ''}
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {scores.map(({ label, score }) => (
                  <div key={label} className="rounded-xl border border-border/70 bg-card/70 p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-1 text-xl font-semibold">{score}</p>
                    <p className="text-xs text-muted-foreground">dari 100</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Belum ada evaluasi kedisiplinan untuk santri ini di database.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Presensi Harian</CardTitle>
        </CardHeader>
        <CardContent>
          {attendanceRecords.length ? (
            <div className="space-y-3">
              {attendanceRecords.slice(0, 7).map((record) => {
                const checkIn = formatTime(record.check_in_at);
                const checkOut = formatTime(record.check_out_at);
                return (
                  <div key={record.id} className="flex items-start justify-between gap-3 border-b border-border/70 pb-3 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{formatDate(record.attendance_date)}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {[checkIn && `Masuk ${checkIn}`, checkOut && `Pulang ${checkOut}`, record.note]
                          .filter(Boolean)
                          .join(' · ') || 'Tidak ada catatan tambahan'}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge variant={record.status === 'absent' ? 'destructive' : 'secondary'}>
                        {attendanceLabels[record.status]}
                      </Badge>
                      {record.is_demo && <Badge variant="outline">SIMULASI</Badge>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Belum ada presensi harian untuk santri ini di database.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Catatan Pelanggaran</CardTitle>
        </CardHeader>
        <CardContent>
          {disciplineRecords.length ? (
            <div className="space-y-3">
              {disciplineRecords.slice(0, 10).map((record) => (
                <div key={record.id} className="space-y-2 border-b border-border/70 pb-3 last:border-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-sm">{record.category}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={record.resolution_status === 'resolved' ? 'secondary' : 'destructive'}>
                        {record.resolution_status === 'resolved' ? 'Ditindaklanjuti' : 'Perlu tindak lanjut'}
                      </Badge>
                      {record.is_demo && <Badge variant="outline">SIMULASI</Badge>}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{record.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(record.occurred_at)} · Poin: {record.points} · Tingkat: {severityLabels[record.severity]}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Belum ada catatan pelanggaran untuk santri ini di database.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Riwayat Evaluasi</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length >= 2 ? (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="period" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="discipline" name="Disiplin" stroke="#34d399" connectNulls />
                  <Line type="monotone" dataKey="attendance" name="Kehadiran" stroke="#fbbf24" connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Grafik tren akan muncul setelah tersedia minimal dua evaluasi di database.
            </p>
          )}
          {evaluations.length > 0 && (
            <div className="mt-4 space-y-2">
              {evaluations.map((evaluation) => (
                <div key={evaluation.id} className="flex items-center justify-between gap-3 border-t border-border/70 pt-3 text-sm">
                  <span>{evaluation.period || formatDate(evaluation.created_at) || 'Evaluasi'}</span>
                  <span className="text-muted-foreground">
                    Disiplin: {evaluation.discipline_score ?? '-'} · Kehadiran: {evaluation.attendance_score ?? '-'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {latest && scores.length === 0 && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle className="h-4 w-4" />
          Data evaluasi berasal dari database pondok.
        </p>
      )}
    </div>
  );
}
