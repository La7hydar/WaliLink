DO $$
DECLARE
  demo_student_id uuid;
  demo_guardian_id uuid;
  demo_account_id uuid;
BEGIN
  SELECT s.id, s.guardian_id, a.id
  INTO demo_student_id, demo_guardian_id, demo_account_id
  FROM public.students AS s
  JOIN public.emoney_accounts AS a ON a.student_id = s.id
  WHERE s.stambuk = 'DEMO-WL-2026-001';

  IF demo_student_id IS NULL OR demo_guardian_id IS NULL OR demo_account_id IS NULL THEN
    RAISE EXCEPTION 'WaliLink demo student, guardian, or wallet account is missing';
  END IF;

  INSERT INTO public.student_attendance (
    student_id, attendance_date, status, check_in_at, check_out_at, note, is_demo
  )
  SELECT demo_student_id, seed.attendance_date, seed.status, seed.check_in_at,
    seed.check_out_at, seed.note, true
  FROM (VALUES
    (DATE '2026-11-02', 'present', TIMESTAMPTZ '2026-11-02 06:55:00+07', TIMESTAMPTZ '2026-11-02 15:05:00+07', '[SIMULASI] Contoh presensi, bukan catatan resmi.'),
    (DATE '2026-11-03', 'present', TIMESTAMPTZ '2026-11-03 06:58:00+07', TIMESTAMPTZ '2026-11-03 15:02:00+07', '[SIMULASI] Contoh presensi, bukan catatan resmi.'),
    (DATE '2026-11-04', 'late', TIMESTAMPTZ '2026-11-04 07:18:00+07', TIMESTAMPTZ '2026-11-04 15:10:00+07', '[SIMULASI] Contoh keterlambatan ringan.'),
    (DATE '2026-11-05', 'present', TIMESTAMPTZ '2026-11-05 06:52:00+07', TIMESTAMPTZ '2026-11-05 15:08:00+07', '[SIMULASI] Contoh presensi, bukan catatan resmi.'),
    (DATE '2026-11-06', 'permission', NULL, NULL, '[SIMULASI] Contoh izin, bukan catatan resmi.')
  ) AS seed(attendance_date, status, check_in_at, check_out_at, note)
  ON CONFLICT (student_id, attendance_date) DO NOTHING;

  INSERT INTO public.student_discipline_records (
    student_id, occurred_at, category, description, severity, points, resolution_status, is_demo
  )
  SELECT
    demo_student_id,
    TIMESTAMPTZ '2026-11-04 07:18:00+07',
    'Keterlambatan ringan',
    '[SIMULASI] Contoh catatan pembinaan untuk uji aplikasi; bukan catatan resmi santri.',
    'minor',
    1,
    'resolved',
    true
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.student_discipline_records
    WHERE student_id = demo_student_id
      AND occurred_at = TIMESTAMPTZ '2026-11-04 07:18:00+07'
      AND category = 'Keterlambatan ringan'
      AND is_demo
  );

  INSERT INTO public.emoney_transactions (
    account_id, transaction_type, amount, merchant_or_notes, created_at
  )
  SELECT demo_account_id, seed.transaction_type, seed.amount, seed.note, seed.created_at
  FROM (VALUES
    ('topup', 200000::numeric, '[SIMULASI] Isi saldo via transfer bank (bukan transaksi bank)', TIMESTAMPTZ '2026-11-02 07:10:00+07'),
    ('spending', 12000::numeric, '[SIMULASI] Kantin asrama - makan siang', TIMESTAMPTZ '2026-11-03 12:16:00+07'),
    ('spending', 8000::numeric, '[SIMULASI] Koperasi - perlengkapan belajar', TIMESTAMPTZ '2026-11-05 12:20:00+07'),
    ('topup', 20000::numeric, '[SIMULASI] Isi saldo melalui loket demo (bukan transaksi nyata)', TIMESTAMPTZ '2026-11-06 10:30:00+07')
  ) AS seed(transaction_type, amount, note, created_at)
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.emoney_transactions AS existing
    WHERE existing.account_id = demo_account_id
      AND existing.transaction_type = seed.transaction_type
      AND existing.merchant_or_notes = seed.note
  );

  INSERT INTO public.guardian_notifications (
    guardian_id, student_id, title, message, category, created_at
  )
  SELECT demo_guardian_id, demo_student_id, seed.title, seed.message, seed.category, seed.created_at
  FROM (VALUES
    ('[SIMULASI] Aktivitas dompet', 'Contoh transaksi dompet untuk demonstrasi. Bukan transaksi bank.', 'payment', TIMESTAMPTZ '2026-11-06 10:31:00+07'),
    ('[SIMULASI] Ringkasan presensi', 'Data presensi contoh tersedia untuk uji tampilan, bukan catatan resmi.', 'general', TIMESTAMPTZ '2026-11-06 15:15:00+07'),
    ('[SIMULASI] Catatan pembinaan', 'Contoh data pembinaan tersedia untuk demonstrasi, bukan catatan resmi.', 'discipline', TIMESTAMPTZ '2026-11-06 15:20:00+07')
  ) AS seed(title, message, category, created_at)
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.guardian_notifications AS existing
    WHERE existing.guardian_id = demo_guardian_id
      AND existing.student_id = demo_student_id
      AND existing.title = seed.title
      AND existing.message = seed.message
  );
END
$$;
