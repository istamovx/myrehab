-- =============================================================================
-- MyRehab seed data
-- =============================================================================

-- ICD-10 / MKB-10 codes (common rehabilitation codes)
-- category = matnli guruh, chapter = bitta harf (app COMMON_REHAB_CODES bilan mos)
-- =============================================================================
INSERT INTO public.icd10_codes (code, description_uz, description_ru, description_en, category, chapter) VALUES
-- Orthopaedic / musculoskeletal (M)
('M54.5', 'Bel og''rig''i', 'Боль в пояснице', 'Low back pain', 'Muskuloskelet', 'M'),
('M54.4', 'Lumbago siyatika bilan', 'Люмбаго с ишиасом', 'Lumbago with sciatica', 'Muskuloskelet', 'M'),
('M47.8', 'Spondiloz', 'Спондилёз', 'Spondylosis', 'Muskuloskelet', 'M'),
('M75.1', 'Yelka rotator manjetining zararlanishi', 'Повреждение ротаторной манжеты плеча', 'Rotator cuff injury', 'Muskuloskelet', 'M'),
('M17.1', 'Tizza bo''g''imi osteoartrozi', 'Остеоартроз коленного сустава', 'Osteoarthritis of knee', 'Muskuloskelet', 'M'),
('M16.1', 'Son-chanoq osteoartrozi', 'Остеоартроз тазобедренного сустава', 'Osteoarthritis of hip', 'Muskuloskelet', 'M'),
('M79.3', 'Panniculit', 'Паннулит', 'Panniculitis', 'Muskuloskelet', 'M'),
('M62.8', 'Mushak kasalliklari', 'Болезни мышц', 'Disorders of muscle', 'Muskuloskelet', 'M'),
('M25.5', 'Bo''g''im og''rig''i', 'Боль в суставе', 'Pain in joint', 'Muskuloskelet', 'M'),
('M96.8', 'Ortopedik jarrohlik asoratlari', 'Осложнения ортопедических процедур', 'Post-procedural musculoskeletal disorders', 'Muskuloskelet', 'M'),
-- Neurological (G)
('G81.1', 'Spastik gemiplegia', 'Спастическая гемиплегия', 'Spastic hemiplegia', 'Nevrologik', 'G'),
('G82.4', 'Spastik tetraplegia', 'Спастическая тетраплегия', 'Spastic tetraplegia', 'Nevrologik', 'G'),
('G35',   'Ko''p skleroz', 'Рассеянный склероз', 'Multiple sclerosis', 'Nevrologik', 'G'),
('G62.9', 'Polineyropatiya', 'Полинейропатия', 'Polyneuropathy', 'Nevrologik', 'G'),
('G20',   'Parkinson kasalligi', 'Болезнь Паркинсона', 'Parkinson''s disease', 'Nevrologik', 'G'),
-- Stroke / cardio (I)
('I63.9', 'Insult', 'Инсульт', 'Cerebral infarction', 'Yurak-qon tomir', 'I'),
('I69.3', 'Insult oqibatida falajlik', 'Последствия инфаркта мозга', 'Sequelae of cerebral infarction', 'Yurak-qon tomir', 'I'),
-- Respiratory (J)
('J44.1', 'YOPK keskinlashishi', 'Обострение ХОБЛ', 'COPD exacerbation', 'Nafas olish', 'J'),
-- Trauma (T)
('T14.3', 'Ligament shikastlanishi', 'Травма связок', 'Injury of ligament', 'Shikastlanish', 'T'),
('T14.2', 'Suyak sinishi', 'Перелом кости', 'Fracture of bone', 'Shikastlanish', 'T'),
-- Post-surgical (Z)
('Z96.6', 'Tizza protezi', 'Протезирование коленного сустава', 'Knee joint prosthesis', 'Z-kodlar', 'Z'),
('Z96.7', 'Son-chanoq protezi', 'Тазобедренный протез', 'Hip joint prosthesis', 'Z-kodlar', 'Z')
ON CONFLICT (code) DO NOTHING;

-- =============================================================================
-- Demo organisation
-- =============================================================================
INSERT INTO public.organizations (id, name, slug, subscription_tier, subscription_status, max_doctors, max_patients)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'MyRehab Demo Klinikasi',
  'demo-clinic',
  'business',
  'active',
  20,
  500
)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- Default exercise library
-- =============================================================================
-- category faqat quyidagilardan biri bo'lishi mumkin:
--   strength | flexibility | cardio | balance | coordination
INSERT INTO public.exercises
  (id, organization_id, name, description, category, difficulty, duration_minutes, muscle_groups)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Orqa muskuli cho''zish',
    'Erda yoting, tizzalarni ko''kragingizga tortib, 30 soniya ushlab turing. Har bir oyoq uchun 3 marta takrorlang.',
    'flexibility', 'beginner', 5,
    ARRAY['umurtqa pog''onasi', 'orqa muskuli']
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Tizza bukish mashqi',
    'O''tirib, oyoqni tizzadan to''g''rilang va 5 soniya ushlab turing. 10 marta takrorlang.',
    'strength', 'beginner', 10,
    ARRAY['son muskullar', 'tizza atrofi']
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Yelka aylantirish',
    'Yelkalarni sekin oldinga va orqaga aylantiring. 10 marta har yo''nalishda.',
    'flexibility', 'beginner', 5,
    ARRAY['yelka muskullar', 'trapetsiya']
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'Qo''l kuchini mustahkamlash',
    'Dumbbell yoki rezinkali tasmadan foydalanib qo''lni tizzaga qo''yib buking. 3x15 takrorlang.',
    'strength', 'intermediate', 15,
    ARRAY['bizeps', 'bilak']
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'Muvozanat mashqi',
    'Bir oyoqda 30 soniya turing. Ko''zlarni ochiq holda, so''ng yoping. Har oyoq 3 marta.',
    'balance', 'intermediate', 10,
    ARRAY['boldir muskuli', 'muvozanat muskullar']
  ),
  (
    '10000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'Aerob yurish',
    'Bir soat davomida tez sur''atda yuring. Yurak tezligi maksimalning 60-70% bo''lishi kerak.',
    'cardio', 'beginner', 60,
    ARRAY['butun tana']
  ),
  (
    '10000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    'Nafas olish mashqi',
    'Qorin nafasi: burun orqali 4 soniya olin, 2 soniya ushlab, og''iz orqali 6 soniya chiqarin. 10 marta.',
    'cardio', 'beginner', 10,
    ARRAY['nafas muskullar', 'diafragma']
  )
ON CONFLICT (id) DO NOTHING;
