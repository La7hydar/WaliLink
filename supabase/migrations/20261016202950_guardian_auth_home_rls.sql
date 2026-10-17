ALTER TABLE public.guardians
  ADD COLUMN auth_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX guardians_auth_user_id_key
  ON public.guardians (auth_user_id)
  WHERE auth_user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS students_guardian_id_idx ON public.students (guardian_id);
CREATE INDEX IF NOT EXISTS academic_scores_student_id_idx ON public.academic_scores (student_id);
CREATE INDEX IF NOT EXISTS achievements_student_id_idx ON public.achievements (student_id);
CREATE INDEX IF NOT EXISTS student_evaluations_student_id_idx ON public.student_evaluations (student_id);
CREATE INDEX IF NOT EXISTS spp_bills_student_id_idx ON public.spp_bills (student_id);
CREATE INDEX IF NOT EXISTS emoney_accounts_student_id_idx ON public.emoney_accounts (student_id);
CREATE INDEX IF NOT EXISTS emoney_transactions_account_id_idx ON public.emoney_transactions (account_id);

ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spp_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emoney_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emoney_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.guardians, public.students, public.academic_scores,
  public.achievements, public.student_evaluations, public.spp_bills,
  public.emoney_accounts, public.emoney_transactions, public.albums FROM anon;
GRANT SELECT ON TABLE public.guardians, public.students, public.academic_scores,
  public.achievements, public.student_evaluations, public.spp_bills,
  public.emoney_accounts, public.emoney_transactions, public.albums TO authenticated;

CREATE POLICY guardian_home_read_own_guardian ON public.guardians
  FOR SELECT TO authenticated
  USING (auth_user_id = (SELECT auth.uid()));

CREATE POLICY guardian_home_read_own_students ON public.students
  FOR SELECT TO authenticated
  USING (
    guardian_id IN (
      SELECT g.id FROM public.guardians AS g
      WHERE g.auth_user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY guardian_home_read_own_scores ON public.academic_scores
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students AS s
      JOIN public.guardians AS g ON g.id = s.guardian_id
      WHERE s.id = academic_scores.student_id
        AND g.auth_user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY guardian_home_read_own_achievements ON public.achievements
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students AS s
      JOIN public.guardians AS g ON g.id = s.guardian_id
      WHERE s.id = achievements.student_id
        AND g.auth_user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY guardian_home_read_own_evaluations ON public.student_evaluations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students AS s
      JOIN public.guardians AS g ON g.id = s.guardian_id
      WHERE s.id = student_evaluations.student_id
        AND g.auth_user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY guardian_home_read_own_spp_bills ON public.spp_bills
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students AS s
      JOIN public.guardians AS g ON g.id = s.guardian_id
      WHERE s.id = spp_bills.student_id
        AND g.auth_user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY guardian_home_read_own_emoney_accounts ON public.emoney_accounts
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students AS s
      JOIN public.guardians AS g ON g.id = s.guardian_id
      WHERE s.id = emoney_accounts.student_id
        AND g.auth_user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY guardian_home_read_own_emoney_transactions ON public.emoney_transactions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.emoney_accounts AS ea
      JOIN public.students AS s ON s.id = ea.student_id
      JOIN public.guardians AS g ON g.id = s.guardian_id
      WHERE ea.id = emoney_transactions.account_id
        AND g.auth_user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY guardian_home_read_own_albums ON public.albums
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.students AS s
      JOIN public.guardians AS g ON g.id = s.guardian_id
      WHERE s.id = albums.student_id
        AND g.auth_user_id = (SELECT auth.uid())
    )
  );