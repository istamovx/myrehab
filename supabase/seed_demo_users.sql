-- =============================================================================
-- MyRehab — demo foydalanuvchilar, bemorlar va qabullar
-- =============================================================================
-- Bu fayl auth.users (login uchun), profiles, doctors, patients va appointments
-- jadvallarini to'ldiradi. seed.sql (icd10 + org + exercises) dan KEYIN ishga
-- tushiriladi.
--
-- DIQQAT: auth.users ga to'g'ridan-to'g'ri yozish Supabase versiyasiga bog'liq.
-- Agar xato bersa — Supabase Dashboard → Authentication → Add User orqali
-- quyidagi emaillar bilan foydalanuvchi yarating (auto-confirm), keyin pastdagi
-- profiles/patients qismini ishga tushiring.
--
-- Login: doctor@myrehab.demo / doctor123
-- =============================================================================

-- Fixed UUID'lar (idempotent — qayta ishga tushirsa takrorlanmaydi)
-- demo org: 00000000-0000-0000-0000-000000000001 (seed.sql da yaratilgan)

-- ── 1. auth.users (login foydalanuvchilari) ────────────────────────────────
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  confirmation_token, recovery_token, email_change_token_new, email_change
) VALUES
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-0000000000d1',
   'authenticated', 'authenticated', 'doctor@myrehab.demo',
   crypt('doctor123', gen_salt('bf')), NOW(), NOW(), NOW(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"name":"Dr. Muhrim Devonov"}'::jsonb, '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-00000000a001',
   'authenticated', 'authenticated', 'jasur@myrehab.demo',
   crypt('patient123', gen_salt('bf')), NOW(), NOW(), NOW(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"name":"Jasur Mirzayev"}'::jsonb, '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-00000000a002',
   'authenticated', 'authenticated', 'malika@myrehab.demo',
   crypt('patient123', gen_salt('bf')), NOW(), NOW(), NOW(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"name":"Malika Yusupova"}'::jsonb, '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-00000000a003',
   'authenticated', 'authenticated', 'bobur@myrehab.demo',
   crypt('patient123', gen_salt('bf')), NOW(), NOW(), NOW(),
   '{"provider":"email","providers":["email"]}'::jsonb,
   '{"name":"Bobur Toshmatov"}'::jsonb, '', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- ── 2. auth.identities (email provider) — versiyaga chidamli ────────────────
DO $$
DECLARE
  u RECORD;
BEGIN
  FOR u IN
    SELECT id, email FROM auth.users
    WHERE email IN ('doctor@myrehab.demo','jasur@myrehab.demo','malika@myrehab.demo','bobur@myrehab.demo')
  LOOP
    BEGIN
      INSERT INTO auth.identities (
        provider_id, user_id, identity_data, provider, created_at, updated_at, last_sign_in_at
      ) VALUES (
        u.id::text, u.id,
        jsonb_build_object('sub', u.id::text, 'email', u.email),
        'email', NOW(), NOW(), NOW()
      ) ON CONFLICT DO NOTHING;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'identities (% ) o''tkazib yuborildi: %', u.email, SQLERRM;
    END;
  END LOOP;
END $$;

-- ── 3. profiles ─────────────────────────────────────────────────────────────
INSERT INTO public.profiles (id, organization_id, role, name, phone, is_active) VALUES
  ('00000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-000000000001', 'doctor',  'Dr. Muhrim Devonov', '+998901234567', TRUE),
  ('00000000-0000-0000-0000-00000000a001', '00000000-0000-0000-0000-000000000001', 'patient', 'Jasur Mirzayev',     '+998901112233', TRUE),
  ('00000000-0000-0000-0000-00000000a002', '00000000-0000-0000-0000-000000000001', 'patient', 'Malika Yusupova',    '+998901112244', TRUE),
  ('00000000-0000-0000-0000-00000000a003', '00000000-0000-0000-0000-000000000001', 'patient', 'Bobur Toshmatov',    '+998901112255', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ── 4. doctors ──────────────────────────────────────────────────────────────
INSERT INTO public.doctors (id, organization_id, specialization, license_number, experience_years, consultation_fee) VALUES
  ('00000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-000000000001',
   'Reabilitolog · Travmatolog', 'UZ-REH-00471', 12, 250000)
ON CONFLICT (id) DO NOTHING;

-- ── 5. patients ─────────────────────────────────────────────────────────────
INSERT INTO public.patients
  (id, organization_id, date_of_birth, gender, blood_type, height_cm, weight_kg,
   assigned_doctor_id, diagnosis_primary, diagnosis_icd10) VALUES
  ('00000000-0000-0000-0000-00000000a001', '00000000-0000-0000-0000-000000000001',
   '1985-03-12', 'male', 'O+', 178, 82,
   '00000000-0000-0000-0000-0000000000d1', 'Bel sohasidagi surunkali og''riq', ARRAY['M54.5']),
  ('00000000-0000-0000-0000-00000000a002', '00000000-0000-0000-0000-000000000001',
   '1992-07-28', 'female', 'A+', 165, 60,
   '00000000-0000-0000-0000-0000000000d1', 'Tizza bo''g''imi osteoartrozi', ARRAY['M17.1']),
  ('00000000-0000-0000-0000-00000000a003', '00000000-0000-0000-0000-000000000001',
   '1970-11-05', 'male', 'B+', 172, 90,
   '00000000-0000-0000-0000-0000000000d1', 'Insultdan keyingi reabilitatsiya', ARRAY['I69.3','G81.1'])
ON CONFLICT (id) DO NOTHING;

-- ── 6. appointments (bugun va kelasi kunlar) ────────────────────────────────
INSERT INTO public.appointments
  (patient_id, doctor_id, organization_id, scheduled_at, duration_minutes, type, status, reason) VALUES
  ('00000000-0000-0000-0000-00000000a001', '00000000-0000-0000-0000-0000000000d1',
   '00000000-0000-0000-0000-000000000001', NOW() + INTERVAL '2 hours', 30, 'in_person', 'confirmed', 'Birlamchi ko''rik'),
  ('00000000-0000-0000-0000-00000000a002', '00000000-0000-0000-0000-0000000000d1',
   '00000000-0000-0000-0000-000000000001', NOW() + INTERVAL '1 day', 45, 'video', 'scheduled', 'Nazorat konsultatsiyasi'),
  ('00000000-0000-0000-0000-00000000a003', '00000000-0000-0000-0000-0000000000d1',
   '00000000-0000-0000-0000-000000000001', NOW() + INTERVAL '3 days', 30, 'in_person', 'scheduled', 'Mashqlar dasturini ko''rib chiqish')
ON CONFLICT DO NOTHING;
