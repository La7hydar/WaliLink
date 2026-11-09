CREATE TABLE public.student_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students (id) ON DELETE CASCADE,
  attendance_date date NOT NULL,
  status text NOT NULL CHECK (status IN ('present', 'late', 'permission', 'sick', 'absent')),
  check_in_at timestamptz,
  check_out_at timestamptz,
  note text,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT student_attendance_student_date_key UNIQUE (student_id, attendance_date),
  CONSTRAINT student_attendance_time_order_check
    CHECK (check_in_at IS NULL OR check_out_at IS NULL OR check_out_at >= check_in_at)
);

CREATE TABLE public.student_discipline_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students (id) ON DELETE CASCADE,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  category text NOT NULL,
  description text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('minor', 'moderate', 'serious')),
  points integer NOT NULL DEFAULT 0 CHECK (points BETWEEN 0 AND 100),
  resolution_status text NOT NULL DEFAULT 'open' CHECK (resolution_status IN ('open', 'resolved')),
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX student_discipline_records_student_occurred_idx
  ON public.student_discipline_records (student_id, occurred_at DESC);

ALTER TABLE public.student_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_discipline_records ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.student_attendance, public.student_discipline_records FROM anon, authenticated;
GRANT SELECT ON TABLE public.student_attendance, public.student_discipline_records TO authenticated;
GRANT ALL ON TABLE public.student_attendance, public.student_discipline_records TO service_role;

CREATE POLICY guardian_read_own_student_attendance
  ON public.student_attendance
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.students AS s
      JOIN public.guardians AS g ON g.id = s.guardian_id
      WHERE s.id = student_attendance.student_id
        AND g.auth_user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY guardian_read_own_student_discipline_records
  ON public.student_discipline_records
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.students AS s
      JOIN public.guardians AS g ON g.id = s.guardian_id
      WHERE s.id = student_discipline_records.student_id
        AND g.auth_user_id = (SELECT auth.uid())
    )
  );