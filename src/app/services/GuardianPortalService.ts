import { getSupabaseClient } from '../supabase/client';

export interface GuardianSppBill {
  id: string;
  student_id: string;
  month: number;
  year: number;
  amount: number;
  status: string;
  payment_date: string | null;
  proof_of_payment_url: string | null;
  created_at: string;
}

export interface GuardianWalletTransaction {
  id: string;
  account_id: string;
  transaction_type: string;
  amount: number;
  merchant_or_notes: string | null;
  created_at: string;
}

export interface GuardianAchievement {
  id: string;
  student_id: string;
  title: string;
  category: string | null;
  date_achieved: string | null;
  description: string | null;
}

export interface GuardianAcademicScore {
  id: string;
  student_id: string;
  subject_name: string;
  score: number | null;
  semester: number | null;
  academic_year: string | null;
}

export interface GuardianEvaluation {
  id: string;
  student_id: string;
  manner_score: number | null;
  discipline_score: number | null;
  attendance_score: number | null;
  cleanliness_score: number | null;
  worship_score: number | null;
  activity_score: number | null;
  period: string | null;
  created_at: string;
}

export interface GuardianAlbumItem {
  id: string;
  type: string;
  student_id: string;
  title: string;
  media_url: string | null;
  created_at: string;
}

export interface GuardianNewsEvent {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  event_date: string | null;
  created_at: string;
}

export async function getGuardianPaymentData(studentId: string): Promise<{
  balance: number | null;
  bills: GuardianSppBill[];
  transactions: GuardianWalletTransaction[];
}> {
  const supabase = getSupabaseClient();
  const [billsResult, accountResult] = await Promise.all([
    supabase
      .from('spp_bills')
      .select('id, student_id, month, year, amount, status, payment_date, proof_of_payment_url, created_at')
      .eq('student_id', studentId)
      .order('year', { ascending: false })
      .order('month', { ascending: false }),
    supabase
      .from('emoney_accounts')
      .select('id, balance')
      .eq('student_id', studentId)
      .maybeSingle(),
  ]);

  if (billsResult.error) throw billsResult.error;
  if (accountResult.error) throw accountResult.error;

  let transactions: GuardianWalletTransaction[] = [];
  if (accountResult.data) {
    const transactionsResult = await supabase
      .from('emoney_transactions')
      .select('id, account_id, transaction_type, amount, merchant_or_notes, created_at')
      .eq('account_id', accountResult.data.id)
      .order('created_at', { ascending: false });

    if (transactionsResult.error) throw transactionsResult.error;
    transactions = (transactionsResult.data ?? []).map((transaction) => ({
      ...transaction,
      amount: Number(transaction.amount),
    }));
  }

  return {
    balance: accountResult.data?.balance == null || !Number.isFinite(Number(accountResult.data.balance))
      ? null
      : Number(accountResult.data.balance),
    bills: (billsResult.data ?? []).map((bill) => ({
      ...bill,
      amount: Number(bill.amount),
    })),
    transactions,
  };
}

export async function getGuardianAchievementData(studentId: string): Promise<{
  achievements: GuardianAchievement[];
  scores: GuardianAcademicScore[];
  evaluations: GuardianEvaluation[];
}> {
  const supabase = getSupabaseClient();
  const [achievementsResult, scoresResult, evaluationsResult] = await Promise.all([
    supabase
      .from('achievements')
      .select('id, student_id, title, category, date_achieved, description')
      .eq('student_id', studentId)
      .order('date_achieved', { ascending: false }),
    supabase
      .from('academic_scores')
      .select('id, student_id, subject_name, score, semester, academic_year')
      .eq('student_id', studentId)
      .order('academic_year', { ascending: false })
      .order('semester', { ascending: false }),
    supabase
      .from('student_evaluations')
      .select('id, student_id, manner_score, discipline_score, attendance_score, cleanliness_score, worship_score, activity_score, period, created_at')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false }),
  ]);

  const queryError = achievementsResult.error ?? scoresResult.error ?? evaluationsResult.error;
  if (queryError) throw queryError;

  return {
    achievements: achievementsResult.data ?? [],
    scores: (scoresResult.data ?? []).map((score) => ({
      ...score,
      score: score.score === null ? null : Number(score.score),
    })),
    evaluations: (evaluationsResult.data ?? []).map((evaluation) => ({
      ...evaluation,
      manner_score: evaluation.manner_score === null ? null : Number(evaluation.manner_score),
      discipline_score: evaluation.discipline_score === null ? null : Number(evaluation.discipline_score),
      attendance_score: evaluation.attendance_score === null ? null : Number(evaluation.attendance_score),
      cleanliness_score: evaluation.cleanliness_score === null ? null : Number(evaluation.cleanliness_score),
      worship_score: evaluation.worship_score === null ? null : Number(evaluation.worship_score),
      activity_score: evaluation.activity_score === null ? null : Number(evaluation.activity_score),
    })),
  };
}

export async function getGuardianAlbumData(studentId: string): Promise<{
  personalAlbums: GuardianAlbumItem[];
  sharedAlbums: GuardianAlbumItem[];
  events: GuardianNewsEvent[];
  eventsError: string;
}> {
  const supabase = getSupabaseClient();
  const [personalAlbumsResult, sharedAlbumsResult, eventsResult] = await Promise.all([
    supabase
      .from('albums')
      .select('id, type, student_id, title, media_url, created_at')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false }),
    supabase
      .from('albums')
      .select('id, type, student_id, title, media_url, created_at')
      .is('student_id', null)
      .order('created_at', { ascending: false }),
    supabase
      .from('news_events')
      .select('id, title, content, image_url, event_date, created_at')
      .order('event_date', { ascending: true }),
  ]);

  if (personalAlbumsResult.error) throw personalAlbumsResult.error;
  if (sharedAlbumsResult.error) throw sharedAlbumsResult.error;

  return {
    personalAlbums: personalAlbumsResult.data ?? [],
    sharedAlbums: sharedAlbumsResult.data ?? [],
    events: eventsResult.data ?? [],
    eventsError: eventsResult.error?.message ?? '',
  };
}

export async function getGuardianEvents(): Promise<GuardianNewsEvent[]> {
  const { data, error } = await getSupabaseClient()
    .from('news_events')
    .select('id, title, content, image_url, event_date, created_at')
    .order('event_date', { ascending: true });

  if (error) throw error;
  return data ?? [];
}
