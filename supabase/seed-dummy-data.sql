DO $$
DECLARE
  guardian_nadia_id uuid;
  guardian_rizky_id uuid;
  nadia_id uuid;
  rizky_id uuid;
  nadia_account_id uuid;
  rizky_account_id uuid;
BEGIN
  SELECT id INTO guardian_nadia_id
  FROM public.guardians
  WHERE full_name = 'Siti Aminah Dummy'
  ORDER BY created_at NULLS LAST
  LIMIT 1;

  IF guardian_nadia_id IS NULL THEN
    INSERT INTO public.guardians (full_name, address, district, gender, occupation, age, relationship_to_student, marital_status)
    VALUES ('Siti Aminah Dummy', 'Jl. Contoh Melati No. 1, Bandung', 'Coblong', 'Perempuan', 'Guru', 38, 'Ibu', 'Menikah')
    RETURNING id INTO guardian_nadia_id;
  END IF;

  SELECT id INTO guardian_rizky_id
  FROM public.guardians
  WHERE full_name = 'Budi Santoso Dummy'
  ORDER BY created_at NULLS LAST
  LIMIT 1;

  IF guardian_rizky_id IS NULL THEN
    INSERT INTO public.guardians (full_name, address, district, gender, occupation, age, relationship_to_student, marital_status)
    VALUES ('Budi Santoso Dummy', 'Jl. Contoh Kenanga No. 2, Yogyakarta', 'Umbulharjo', 'Laki-laki', 'Wiraswasta', 42, 'Ayah', 'Menikah')
    RETURNING id INTO guardian_rizky_id;
  END IF;

  INSERT INTO public.students (stambuk, guardian_id, full_name, class_name, gender, dormitory, room, origin_region, address, birth_date, status, entry_year)
  VALUES ('DUMMY-2026-001', guardian_nadia_id, 'Nadia Putri Dummy', 'VIII-A', 'Perempuan', 'Asrama Melati', 'A-12', 'Bandung, Jawa Barat', 'Bandung, Jawa Barat', DATE '2010-04-12', 'Active', 2024)
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
  RETURNING id INTO nadia_id;

  INSERT INTO public.students (stambuk, guardian_id, full_name, class_name, gender, dormitory, room, origin_region, address, birth_date, status, entry_year)
  VALUES ('DUMMY-2026-002', guardian_rizky_id, 'Rizky Pratama Dummy', 'VII-B', 'Laki-laki', 'Asrama Cendekia', 'B-07', 'Yogyakarta, DI Yogyakarta', 'Yogyakarta, DI Yogyakarta', DATE '2011-09-03', 'Active', 2025)
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
  RETURNING id INTO rizky_id;

  INSERT INTO public.teachers (full_name, alumni_from, service_type, service_start_year, age, origin_region, birth_date, position)
  SELECT 'Dewi Lestari Dummy', 'Universitas Pendidikan Indonesia', 'Tetap', 2016, 35, 'Bandung, Jawa Barat', DATE '1991-02-14', 'Guru Matematika'
  WHERE NOT EXISTS (SELECT 1 FROM public.teachers WHERE full_name = 'Dewi Lestari Dummy');

  INSERT INTO public.teachers (full_name, alumni_from, service_type, service_start_year, age, origin_region, birth_date, position)
  SELECT 'Ahmad Fauzan Dummy', 'Universitas Negeri Yogyakarta', 'Tetap', 2018, 33, 'Sleman, DI Yogyakarta', DATE '1993-06-21', 'Guru Bahasa Indonesia'
  WHERE NOT EXISTS (SELECT 1 FROM public.teachers WHERE full_name = 'Ahmad Fauzan Dummy');

  INSERT INTO public.academic_scores (student_id, subject_name, score, semester, academic_year)
  SELECT nadia_id, 'Matematika', 88.5, 1, '2026/2027'
  WHERE NOT EXISTS (SELECT 1 FROM public.academic_scores WHERE student_id = nadia_id AND subject_name = 'Matematika' AND semester = 1 AND academic_year = '2026/2027');

  INSERT INTO public.academic_scores (student_id, subject_name, score, semester, academic_year)
  SELECT nadia_id, 'Bahasa Indonesia', 91, 1, '2026/2027'
  WHERE NOT EXISTS (SELECT 1 FROM public.academic_scores WHERE student_id = nadia_id AND subject_name = 'Bahasa Indonesia' AND semester = 1 AND academic_year = '2026/2027');

  INSERT INTO public.academic_scores (student_id, subject_name, score, semester, academic_year)
  SELECT rizky_id, 'Matematika', 84, 1, '2026/2027'
  WHERE NOT EXISTS (SELECT 1 FROM public.academic_scores WHERE student_id = rizky_id AND subject_name = 'Matematika' AND semester = 1 AND academic_year = '2026/2027');

  INSERT INTO public.student_evaluations (student_id, manner_score, discipline_score, attendance_score, cleanliness_score, worship_score, activity_score, period)
  SELECT nadia_id, 92, 90, 96, 88, 94, 85, 'Semester Ganjil 2026/2027'
  WHERE NOT EXISTS (SELECT 1 FROM public.student_evaluations WHERE student_id = nadia_id AND period = 'Semester Ganjil 2026/2027');

  INSERT INTO public.student_evaluations (student_id, manner_score, discipline_score, attendance_score, cleanliness_score, worship_score, activity_score, period)
  SELECT rizky_id, 89, 93, 91, 90, 88, 92, 'Semester Ganjil 2026/2027'
  WHERE NOT EXISTS (SELECT 1 FROM public.student_evaluations WHERE student_id = rizky_id AND period = 'Semester Ganjil 2026/2027');

  INSERT INTO public.achievements (student_id, title, category, date_achieved, description)
  SELECT nadia_id, 'Juara 2 Olimpiade Sains Kabupaten', 'Akademik', DATE '2026-08-17', 'Data simulasi untuk contoh prestasi siswa.'
  WHERE NOT EXISTS (SELECT 1 FROM public.achievements WHERE student_id = nadia_id AND title = 'Juara 2 Olimpiade Sains Kabupaten');

  INSERT INTO public.emoney_accounts (student_id, card_id, fingerprint_id, balance, daily_spending_limit, status)
  VALUES (nadia_id, 'DUMMY-CARD-001', 'DUMMY-FP-001', 185000, 75000, 'Active')
  ON CONFLICT (student_id) DO NOTHING;

  SELECT id INTO nadia_account_id
  FROM public.emoney_accounts
  WHERE student_id = nadia_id;

  INSERT INTO public.emoney_accounts (student_id, card_id, fingerprint_id, balance, daily_spending_limit, status)
  VALUES (rizky_id, 'DUMMY-CARD-002', 'DUMMY-FP-002', 150000, 75000, 'Active')
  ON CONFLICT (student_id) DO NOTHING;

  SELECT id INTO rizky_account_id
  FROM public.emoney_accounts
  WHERE student_id = rizky_id;

  INSERT INTO public.emoney_transactions (account_id, transaction_type, amount, merchant_or_notes)
  SELECT nadia_account_id, 'topup', 200000, 'Simulasi isi saldo melalui transfer bank'
  WHERE NOT EXISTS (SELECT 1 FROM public.emoney_transactions WHERE account_id = nadia_account_id AND transaction_type = 'topup' AND merchant_or_notes = 'Simulasi isi saldo melalui transfer bank');

  INSERT INTO public.emoney_transactions (account_id, transaction_type, amount, merchant_or_notes)
  SELECT nadia_account_id, 'spending', 15000, 'Simulasi pembelian di kantin sekolah'
  WHERE NOT EXISTS (SELECT 1 FROM public.emoney_transactions WHERE account_id = nadia_account_id AND transaction_type = 'spending' AND merchant_or_notes = 'Simulasi pembelian di kantin sekolah');

  INSERT INTO public.emoney_transactions (account_id, transaction_type, amount, merchant_or_notes)
  SELECT rizky_account_id, 'topup', 150000, 'Simulasi isi saldo melalui loket sekolah'
  WHERE NOT EXISTS (SELECT 1 FROM public.emoney_transactions WHERE account_id = rizky_account_id AND transaction_type = 'topup' AND merchant_or_notes = 'Simulasi isi saldo melalui loket sekolah');

  INSERT INTO public.spp_bills (student_id, month, year, amount, status, payment_date)
  SELECT nadia_id, 10, 2026, 500000, 'pending', NULL
  WHERE NOT EXISTS (SELECT 1 FROM public.spp_bills WHERE student_id = nadia_id AND month = 10 AND year = 2026);

  INSERT INTO public.spp_bills (student_id, month, year, amount, status, payment_date)
  SELECT rizky_id, 10, 2026, 500000, 'paid', TIMESTAMPTZ '2026-10-05 10:00:00+07'
  WHERE NOT EXISTS (SELECT 1 FROM public.spp_bills WHERE student_id = rizky_id AND month = 10 AND year = 2026);

  INSERT INTO public.albums (type, student_id, title, media_url)
  SELECT 'Foto', nadia_id, 'Kegiatan Belajar - Dummy', 'https://example.com/dummy/kegiatan-belajar.jpg'
  WHERE NOT EXISTS (SELECT 1 FROM public.albums WHERE student_id = nadia_id AND title = 'Kegiatan Belajar - Dummy');

  INSERT INTO public.news_events (title, content, image_url, event_date)
  SELECT 'Pentas Seni Sekolah - Dummy', 'Contoh berita kegiatan sekolah. Seluruh data pada record ini bersifat simulasi.', 'https://example.com/dummy/pentas-seni.jpg', TIMESTAMPTZ '2026-10-28 08:00:00+07'
  WHERE NOT EXISTS (SELECT 1 FROM public.news_events WHERE title = 'Pentas Seni Sekolah - Dummy');

  INSERT INTO public."Link" (title, url, is_active)
  VALUES ('Portal Contoh WaliLink', 'https://example.com/portal-walilink', true)
  ON CONFLICT (title) DO UPDATE SET url = EXCLUDED.url, is_active = EXCLUDED.is_active;
END $$;