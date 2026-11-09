DO $$
DECLARE
  demo_guardian_id uuid;
  demo_student_id uuid;
  demo_account_id uuid;
BEGIN
  SELECT id INTO demo_guardian_id
  FROM public.guardians
  WHERE lower(email) = 'demo.walilink@example.com';

  IF demo_guardian_id IS NULL THEN
    INSERT INTO public.guardians (full_name, email, phone_number, address, district, gender, occupation, age, relationship_to_student, marital_status)
    VALUES (
      'Wali Demo WaliLink',
      'demo.walilink@example.com',
      '080000000001',
      'Alamat Contoh, Bandung',
      'Coblong',
      'Perempuan',
      'Data Demo',
      40,
      'Orang tua',
      'Menikah'
    )
    RETURNING id INTO demo_guardian_id;
  END IF;

  INSERT INTO public.students (
    stambuk, guardian_id, full_name, class_name, gender, dormitory,
    room, origin_region, address, birth_date, status, entry_year
  )
  VALUES (
    'DEMO-WL-2026-001',
    demo_guardian_id,
    'Santri Demo WaliLink',
    'IX-A',
    'Laki-laki',
    'Asrama Contoh',
    'D-01',
    'Bandung, Jawa Barat',
    'Alamat Contoh, Bandung',
    DATE '2010-04-12',
    'Active',
    2024
  )
  ON CONFLICT (stambuk) DO UPDATE SET
    guardian_id = EXCLUDED.guardian_id,
    full_name = EXCLUDED.full_name,
    class_name = EXCLUDED.class_name,
    gender = EXCLUDED.gender,
    dormitory = EXCLUDED.dormitory,
    room = EXCLUDED.room,
    origin_region = EXCLUDED.origin_region,
    address = EXCLUDED.address,
    birth_date = EXCLUDED.birth_date,
    status = EXCLUDED.status,
    entry_year = EXCLUDED.entry_year
  RETURNING id INTO demo_student_id;

  INSERT INTO public.academic_scores (student_id, subject_name, score, semester, academic_year)
  SELECT demo_student_id, 'Matematika', 88.5, 1, '2026/2027'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.academic_scores
    WHERE student_id = demo_student_id AND subject_name = 'Matematika'
      AND semester = 1 AND academic_year = '2026/2027'
  );

  INSERT INTO public.academic_scores (student_id, subject_name, score, semester, academic_year)
  SELECT demo_student_id, 'Bahasa Indonesia', 91, 1, '2026/2027'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.academic_scores
    WHERE student_id = demo_student_id AND subject_name = 'Bahasa Indonesia'
      AND semester = 1 AND academic_year = '2026/2027'
  );

  INSERT INTO public.student_evaluations (
    student_id, manner_score, discipline_score, attendance_score,
    cleanliness_score, worship_score, activity_score, period
  )
  SELECT demo_student_id, 92, 90, 96, 88, 94, 85, 'Semester Ganjil 2026/2027'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.student_evaluations
    WHERE student_id = demo_student_id AND period = 'Semester Ganjil 2026/2027'
  );

  INSERT INTO public.achievements (student_id, title, category, date_achieved, description)
  SELECT demo_student_id, 'Juara 2 Olimpiade Sains Contoh', 'Akademik',
    DATE '2026-08-17', 'Data fiktif untuk demonstrasi aplikasi.'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.achievements
    WHERE student_id = demo_student_id AND title = 'Juara 2 Olimpiade Sains Contoh'
  );

  INSERT INTO public.spp_bills (student_id, month, year, amount, status)
  SELECT demo_student_id, 11, 2026, 500000, 'pending'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.spp_bills
    WHERE student_id = demo_student_id AND month = 11 AND year = 2026
  );

  INSERT INTO public.emoney_accounts (
    student_id, card_id, fingerprint_id, balance, daily_spending_limit, status
  )
  VALUES (demo_student_id, 'DEMO-WL-CARD-001', 'DEMO-WL-FP-001', 185000, 75000, 'Active')
  ON CONFLICT (student_id) DO NOTHING;

  SELECT id INTO demo_account_id
  FROM public.emoney_accounts
  WHERE student_id = demo_student_id;

  INSERT INTO public.emoney_transactions (account_id, transaction_type, amount, merchant_or_notes)
  SELECT demo_account_id, 'spending', 15000, 'Transaksi kantin contoh'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.emoney_transactions
    WHERE account_id = demo_account_id AND merchant_or_notes = 'Transaksi kantin contoh'
  );

  INSERT INTO public.albums (type, student_id, title, media_url)
  SELECT 'Kegiatan', demo_student_id, 'Kegiatan Belajar - Data Demo', 'https://example.com/demo-image'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.albums
    WHERE student_id = demo_student_id AND title = 'Kegiatan Belajar - Data Demo'
  );
END
$$;
