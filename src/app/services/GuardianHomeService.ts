import { getSupabaseClient } from '../supabase/client';

export interface GuardianHomeChild {
  id: string;
  stanbuk: string;
  name: string;
  class: string;
  room: string;
  photo?: string;
  birthDate: string;
  status: 'active' | 'graduated' | 'alumni';
  violations: number | null;
  evaluations: GuardianHomeEvaluation[];
  attendanceRecords: GuardianHomeAttendance[];
  disciplineRecords: GuardianHomeDisciplineRecord[];
  sppStatus: string;
  attendanceRate: number | null;
  emoneyBalance: number | null;
  lastPayment: string;
  recentAchievement: string;
  recentActivities: GuardianHomeActivity[];
  performanceData: Array<{ subject: string; score: number }>;
}

export interface GuardianHomeActivity {
  id: string;
  type: 'achievement' | 'payment' | 'wallet' | 'evaluation' | 'academic';
  title: string;
  description: string;
  occurredAt: string;
}

export interface GuardianHomeEvaluation {
  id: string;
  manner_score: number | null;
  discipline_score: number | null;
  attendance_score: number | null;
  cleanliness_score: number | null;
  worship_score: number | null;
  activity_score: number | null;
  period: string | null;
  created_at: string;
}

export type GuardianAttendanceStatus = 'present' | 'late' | 'permission' | 'sick' | 'absent';

export interface GuardianHomeAttendance {
  id: string;
  attendance_date: string;
  status: GuardianAttendanceStatus;
  check_in_at: string | null;
  check_out_at: string | null;
  note: string | null;
  is_demo: boolean;
}

export interface GuardianHomeDisciplineRecord {
  id: string;
  occurred_at: string;
  category: string;
  description: string;
  severity: 'minor' | 'moderate' | 'serious';
  points: number;
  resolution_status: 'open' | 'resolved';
  is_demo: boolean;
}

export interface GuardianHomeNotification {
  id: string;
  title: string;
  message: string;
  category: string | null;
  created_at: string;
  read_at: string | null;
}

export interface GuardianHomeEvent {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  event_date: string | null;
  created_at: string;
}

const formatDate = (value: string | null): string => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export async function getGuardianHomeData(authUserId: string) {
  const supabase = getSupabaseClient();
  const { data: guardian, error: guardianError } = await supabase
    .from('guardians')
    .select('id, full_name, phone_number, address')
    .eq('auth_user_id', authUserId)
    .maybeSingle();

  if (guardianError) throw guardianError;
  if (!guardian) {
    throw new Error('Akun login belum ditautkan ke data wali di database. Hubungi administrator.');
  }

  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('id, stambuk, full_name, class_name, dormitory, room, birth_date, status, photo_url')
    .eq('guardian_id', guardian.id)
    .order('full_name');

  if (studentsError) throw studentsError;
  if (!students?.length) {
    return {
      guardian,
      children: [] as GuardianHomeChild[],
      notifications: [] as GuardianHomeNotification[],
      unreadNotificationCount: 0,
      upcomingEvents: [] as GuardianHomeEvent[],
    };
  }

  const studentIds = students.map((student) => student.id);
  const today = new Date().toISOString().slice(0, 10);
  const [
    scoresResult,
    evaluationsResult,
    attendanceResult,
    disciplineRecordsResult,
    achievementsResult,
    billsResult,
    accountsResult,
    notificationsResult,
    unreadNotificationsResult,
    eventsResult,
  ] = await Promise.all([
    supabase
      .from('academic_scores')
      .select('student_id, subject_name, score, created_at')
      .in('student_id', studentIds)
      .order('created_at', { ascending: false }),
    supabase
      .from('student_evaluations')
      .select('student_id, manner_score, discipline_score, attendance_score, cleanliness_score, worship_score, activity_score, period, created_at')
      .in('student_id', studentIds)
      .order('created_at', { ascending: false }),
    supabase
      .from('student_attendance')
      .select('id, student_id, attendance_date, status, check_in_at, check_out_at, note, is_demo')
      .in('student_id', studentIds)
      .order('attendance_date', { ascending: false }),
    supabase
      .from('student_discipline_records')
      .select('id, student_id, occurred_at, category, description, severity, points, resolution_status, is_demo')
      .in('student_id', studentIds)
      .order('occurred_at', { ascending: false })
      .limit(50),
    supabase
      .from('achievements')
      .select('id, student_id, title, category, date_achieved, created_at')
      .in('student_id', studentIds)
      .order('date_achieved', { ascending: false }),
    supabase
      .from('spp_bills')
      .select('student_id, month, year, status, payment_date, created_at')
      .in('student_id', studentIds)
      .order('year', { ascending: false })
      .order('month', { ascending: false }),
    supabase
      .from('emoney_accounts')
      .select('id, student_id, balance')
      .in('student_id', studentIds),
    supabase
      .from('guardian_notifications')
      .select('id, title, message, category, created_at, read_at')
      .eq('guardian_id', guardian.id)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('guardian_notifications')
      .select('id', { count: 'exact', head: true })
      .eq('guardian_id', guardian.id)
      .is('read_at', null),
    supabase
      .from('news_events')
      .select('id, title, content, image_url, event_date, created_at')
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .limit(5),
  ]);

  const queryError = [
    scoresResult.error,
    evaluationsResult.error,
    attendanceResult.error,
    disciplineRecordsResult.error,
    achievementsResult.error,
    billsResult.error,
    accountsResult.error,
    notificationsResult.error,
    unreadNotificationsResult.error,
    eventsResult.error,
  ].find(Boolean);
  if (queryError) throw queryError;

  const accountIds = (accountsResult.data ?? []).map((account) => account.id).filter(Boolean);
  let transactions: Array<{
    id: string;
    account_id: string;
    transaction_type: string;
    amount: number | string;
    merchant_or_notes: string | null;
    created_at: string;
  }> = [];
  if (accountIds.length > 0) {
    const transactionsResult = await supabase
      .from('emoney_transactions')
      .select('id, account_id, transaction_type, amount, merchant_or_notes, created_at')
      .in('account_id', accountIds)
      .order('created_at', { ascending: false })
      .limit(50);

    if (transactionsResult.error) throw transactionsResult.error;
    transactions = transactionsResult.data ?? [];
  }

  const children = students.map((student): GuardianHomeChild => {
    const latestEvaluation = evaluationsResult.data?.find((item) => item.student_id === student.id);
    const latestAchievement = achievementsResult.data?.find((item) => item.student_id === student.id);
    const latestBill = billsResult.data?.find((item) => item.student_id === student.id);
    const latestPaidBill = billsResult.data?.find((item) =>
      item.student_id === student.id && item.status?.toLowerCase() === 'paid' && item.payment_date,
    );
    const account = accountsResult.data?.find((item) => item.student_id === student.id);
    const attendanceRecords = (attendanceResult.data ?? [])
      .filter((item) => item.student_id === student.id)
      .map((item) => ({
        ...item,
        status: item.status as GuardianAttendanceStatus,
      }));
    const disciplineRecords = (disciplineRecordsResult.data ?? [])
      .filter((item) => item.student_id === student.id)
      .map((item) => ({
        ...item,
        points: Number(item.points),
        severity: item.severity as GuardianHomeDisciplineRecord['severity'],
        resolution_status: item.resolution_status as GuardianHomeDisciplineRecord['resolution_status'],
      }));
    const attendedDays = attendanceRecords.filter((item) =>
      item.status === 'present' || item.status === 'late',
    ).length;
    const billStatus = latestBill?.status?.toLowerCase();
    const sppStatus = !latestBill
      ? 'Belum ada tagihan'
      : billStatus === 'paid'
        ? 'Lunas'
        : billStatus === 'unpaid'
          ? 'Belum dibayar'
          : billStatus === 'pending'
            ? 'Menunggu konfirmasi'
            : latestBill.status || 'Status belum tersedia';
    const seenSubjects = new Set<string>();
    const academicPerformanceData = (scoresResult.data ?? [])
      .filter((item) => item.student_id === student.id && item.score !== null)
      .flatMap((item) => {
        const subject = item.subject_name?.trim() ?? '';
        const subjectKey = subject.toLocaleLowerCase('id-ID');
        if (!subject || seenSubjects.has(subjectKey)) return [];
        seenSubjects.add(subjectKey);
        const score = Number(item.score);
        return Number.isFinite(score) ? [{ subject, score }] : [];
      });
    const evaluationPerformanceData = latestEvaluation
      ? [
          { subject: 'Adab', value: latestEvaluation.manner_score },
          { subject: 'Disiplin', value: latestEvaluation.discipline_score },
          { subject: 'Kehadiran', value: latestEvaluation.attendance_score },
          { subject: 'Kebersihan', value: latestEvaluation.cleanliness_score },
          { subject: 'Ibadah', value: latestEvaluation.worship_score },
          { subject: 'Aktivitas', value: latestEvaluation.activity_score },
        ].flatMap(({ subject, value }) =>
          value === null ? [] : [{ subject, score: Number(value) }],
        )
      : [];
    const performanceData = [
      ...evaluationPerformanceData.filter((item) => Number.isFinite(item.score)),
      ...academicPerformanceData,
    ];
    const childAccountIds = new Set(
      (accountsResult.data ?? [])
        .filter((account) => account.student_id === student.id)
        .map((account) => account.id),
    );
    const childTransactions = transactions.filter((item) => childAccountIds.has(item.account_id));
    const activities: GuardianHomeActivity[] = [
      ...(achievementsResult.data ?? [])
        .filter((item) => item.student_id === student.id)
        .map((item) => ({
          id: `achievement-${item.id}`,
          type: 'achievement' as const,
          title: item.title,
          description: item.category ?? 'Prestasi tercatat',
          occurredAt: item.date_achieved ?? item.created_at,
        })),
      ...(billsResult.data ?? [])
        .filter((item) => item.student_id === student.id)
        .slice(0, 1)
        .map((item) => ({
          id: `bill-${student.id}-${item.year}-${item.month}`,
          type: 'payment' as const,
          title: 'Tagihan SPP',
          description: `${new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date(item.year, item.month - 1))} · ${item.status ?? 'Status belum tersedia'}`,
          occurredAt: item.payment_date ?? item.created_at,
        })),
      ...childTransactions.map((item) => {
        const transactionType = item.transaction_type.toLowerCase();
        const isOutgoing = ['spending', 'transfer_out'].includes(transactionType);
        const amount = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          maximumFractionDigits: 0,
        }).format(Number(item.amount));

        return {
          id: `wallet-${item.id}`,
          type: 'wallet' as const,
          title: isOutgoing ? 'Pengeluaran dompet' : 'Dana masuk dompet',
          description: [item.merchant_or_notes, amount].filter(Boolean).join(' · '),
          occurredAt: item.created_at,
        };
      }),
      ...(evaluationsResult.data ?? [])
        .filter((item) => item.student_id === student.id)
        .slice(0, 1)
        .map((item) => ({
          id: `evaluation-${student.id}-${item.created_at}`,
          type: 'evaluation' as const,
          title: 'Evaluasi santri',
          description: item.period ?? 'Evaluasi tercatat di database',
          occurredAt: item.created_at,
        })),
      ...(scoresResult.data ?? [])
        .filter((item) => item.student_id === student.id)
        .slice(0, 1)
        .map((item) => ({
          id: `academic-${student.id}-${item.created_at}`,
          type: 'academic' as const,
          title: 'Nilai akademik',
          description: item.subject_name,
          occurredAt: item.created_at,
        })),
    ]
      .filter((item) => Boolean(item.occurredAt))
      .sort((first, second) =>
        new Date(second.occurredAt).getTime() - new Date(first.occurredAt).getTime(),
      )
      .slice(0, 5);

    return {
      id: student.id,
      stanbuk: student.stambuk ?? '',
      name: student.full_name,
      class: student.class_name ?? '-',
      room: student.room ?? student.dormitory ?? '-',
      photo: student.photo_url ?? '',
      birthDate: student.birth_date ?? '',
      status: (student.status ?? 'active').toLowerCase() as GuardianHomeChild['status'],
      violations: disciplineRecords.length,
      evaluations: (evaluationsResult.data ?? [])
        .filter((item) => item.student_id === student.id)
        .map((item) => ({
          id: `${student.id}-${item.created_at}`,
          manner_score: item.manner_score === null ? null : Number(item.manner_score),
          discipline_score: item.discipline_score === null ? null : Number(item.discipline_score),
          attendance_score: item.attendance_score === null ? null : Number(item.attendance_score),
          cleanliness_score: item.cleanliness_score === null ? null : Number(item.cleanliness_score),
          worship_score: item.worship_score === null ? null : Number(item.worship_score),
          activity_score: item.activity_score === null ? null : Number(item.activity_score),
          period: item.period,
          created_at: item.created_at,
        })),
      attendanceRecords,
      disciplineRecords,
      sppStatus,
      attendanceRate: attendanceRecords.length
        ? Math.round((attendedDays / attendanceRecords.length) * 100)
        : latestEvaluation?.attendance_score == null
          ? null
          : Number(latestEvaluation.attendance_score),
      emoneyBalance: account?.balance == null || !Number.isFinite(Number(account.balance))
        ? null
        : Number(account.balance),
      lastPayment: formatDate(latestPaidBill?.payment_date ?? null),
      recentAchievement: latestAchievement?.title ?? '',
      recentActivities: activities,
      performanceData,
    };
  });

  return {
    guardian,
    children,
    notifications: (notificationsResult.data ?? []) as GuardianHomeNotification[],
    unreadNotificationCount: unreadNotificationsResult.count ?? 0,
    upcomingEvents: (eventsResult.data ?? []) as GuardianHomeEvent[],
  };
}