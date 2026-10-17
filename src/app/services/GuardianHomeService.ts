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
  notifications: number;
  violations: number | null;
  sppStatus: string;
  attendanceRate: number | null;
  emoneyBalance: number;
  lastPayment: string;
  recentAchievement: string;
  performanceData: Array<{ subject: string; score: number }>;
}

const formatDate = (value: string | null): string => {
  if (!value) return '';

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
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
  if (!students?.length) return { guardian, children: [] as GuardianHomeChild[] };

  const studentIds = students.map((student) => student.id);
  const [scoresResult, evaluationsResult, achievementsResult, billsResult, accountsResult] = await Promise.all([
    supabase
      .from('academic_scores')
      .select('student_id, subject_name, score, created_at')
      .in('student_id', studentIds)
      .order('created_at', { ascending: false }),
    supabase
      .from('student_evaluations')
      .select('student_id, attendance_score, created_at')
      .in('student_id', studentIds)
      .order('created_at', { ascending: false }),
    supabase
      .from('achievements')
      .select('student_id, title, date_achieved')
      .in('student_id', studentIds)
      .order('date_achieved', { ascending: false }),
    supabase
      .from('spp_bills')
      .select('student_id, month, year, status, payment_date')
      .in('student_id', studentIds)
      .order('year', { ascending: false })
      .order('month', { ascending: false }),
    supabase
      .from('emoney_accounts')
      .select('student_id, balance')
      .in('student_id', studentIds),
  ]);

  const queryError = [
    scoresResult.error,
    evaluationsResult.error,
    achievementsResult.error,
    billsResult.error,
    accountsResult.error,
  ].find(Boolean);
  if (queryError) throw queryError;

  const children = students.map((student): GuardianHomeChild => {
    const latestEvaluation = evaluationsResult.data?.find((item) => item.student_id === student.id);
    const latestAchievement = achievementsResult.data?.find((item) => item.student_id === student.id);
    const latestBill = billsResult.data?.find((item) => item.student_id === student.id);
    const latestPaidBill = billsResult.data?.find((item) =>
      item.student_id === student.id && item.status?.toLowerCase() === 'paid' && item.payment_date,
    );
    const account = accountsResult.data?.find((item) => item.student_id === student.id);
    const billStatus = latestBill?.status?.toLowerCase();
    const performanceData = (scoresResult.data ?? [])
      .filter((item) => item.student_id === student.id && item.score !== null)
      .map((item) => ({ subject: item.subject_name, score: Number(item.score) }));

    return {
      id: student.id,
      stanbuk: student.stambuk ?? '',
      name: student.full_name,
      class: student.class_name ?? '-',
      room: student.room ?? student.dormitory ?? '-',
      photo: student.photo_url ?? '',
      birthDate: student.birth_date ?? '',
      status: (student.status ?? 'active').toLowerCase() as GuardianHomeChild['status'],
      notifications: 0,
      violations: null,
      sppStatus: billStatus === 'paid'
        ? 'Lunas'
        : billStatus
          ? 'Menunggu pembayaran'
          : 'Belum ada tagihan',
      attendanceRate: latestEvaluation ? Number(latestEvaluation.attendance_score) : null,
      emoneyBalance: Number(account?.balance ?? 0),
      lastPayment: formatDate(latestPaidBill?.payment_date ?? null),
      recentAchievement: latestAchievement?.title ?? '',
      performanceData,
    };
  });

  return { guardian, children };
}