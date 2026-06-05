-- =============================================================================
-- MyRehab seed data
-- =============================================================================

-- ICD-10 / MKB-10 codes (common rehabilitation codes)
-- =============================================================================
INSERT INTO public.icd10_codes (code, description_uz, description_ru, description_en, category) VALUES
-- Orthopaedic / musculoskeletal
('M54.5', 'Bel og''rig''i', 'Боль в пояснице', 'Low back pain', 'M00-M99'),
('M54.4', 'Radiakulopatiya', 'Радикулопатия', 'Radiculopathy', 'M00-M99'),
('M47.8', 'Spondiloz', 'Спондилёз', 'Spondylosis', 'M00-M99'),
('M75.1', 'Yelka rotator manjetining zararlanishi', 'Повреждение ротаторной манжеты плеча', 'Rotator cuff injury', 'M00-M99'),
('M17.1', 'Tizza bo''g''imi osteoartrozi', 'Остеоартроз коленного сустава', 'Osteoarthritis of knee', 'M00-M99'),
('M16.1', 'Son-chanoq osteoartrozi', 'Остеоартроз тазобедренного сустава', 'Osteoarthritis of hip', 'M00-M99'),
('M79.3', 'Panniculit', 'Паннулит', 'Panniculitis', 'M00-M99'),
('M62.8', 'Mushak kasalliklari', 'Болезни мышц', 'Disorders of muscle', 'M00-M99'),
('M25.5', 'Bo''g''im og''rig''i', 'Боль в суставе', 'Pain in joint', 'M00-M99'),
('M96.8', 'Ortopedik jarrohlik asoratlari', 'Осложнения ортопедических процедур', 'Post-procedural musculoskeletal disorders', 'M00-M99'),
-- Neurological
('G81.1', 'Spastik gemiplegia', 'Спастическая гемиплегия', 'Spastic hemiplegia', 'G00-G99'),
('G82.4', 'Spastik tetraplegia', 'Спастическая тетраплегия', 'Spastic tetraplegia', 'G00-G99'),
('G35',   'Ko''p skleroz', 'Рассеянный склероз', 'Multiple sclerosis', 'G00-G99'),
('G62.9', 'Polineyropatiya', 'Полинейропатия', 'Polyneuropathy', 'G00-G99'),
('G20',   'Parkinson kasalligi', 'Болезнь Паркинсона', 'Parkinson''s disease', 'G00-G99'),
-- Stroke / cardio
('I63.9', 'Insult', 'Инсульт', 'Cerebral infarction', 'I60-I69'),
('I69.3', 'Insult oqibatida falajlik', 'Последствия инфаркта мозга', 'Sequelae of cerebral infarction', 'I60-I69'),
-- Respiratory
('J44.1', 'YOPK keskinlashishi', 'Обострение ХОБЛ', 'COPD exacerbation', 'J40-J47'),
-- Trauma
('T14.3', 'Ligament shikastlanishi', 'Травма связок', 'Injury of ligament', 'T00-T98'),
('T14.2', 'Suyak sinishi', 'Перелом кости', 'Fracture of bone', 'T00-T98'),
-- Post-surgical
('Z96.6', 'Tizza protezi', 'Протезирование коленного сустава', 'Knee joint prosthesis', 'Z00-Z99'),
('Z96.7', 'Son-chanoq protezi', 'Тазобедренный протез', 'Hip joint prosthesis', 'Z00-Z99')
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
-- Default exercise library (Uzbek)
-- =============================================================================
-- (exercises table stores org-level exercises; NULL org = shared library)
-- These would normally be inserted with NULL organization_id to serve as
-- templates, but since exercises.organization_id is NOT NULL in the schema,
-- we bind them to the demo org.
INSERT INTO public.exercises
  (id, organization_id, name, description, category, difficulty, duration_minutes, muscle_groups, equipment_needed, video_url)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Orqa muskuli cho''zish',
    'Erda yoting, tizzalarni ko''kragingizga tortib, 30 soniya ushlab turing. Har bir oyoq uchun 3 marta takrorlang.',
    'flexibility', 'beginner', 5,
    ARRAY['umurtqa pog''onasi', 'orqa muskuli'],
    ARRAY[]::text[], NULL
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Tizza bükme mashqi',
    'O''tirib, oyoqni tizzadan to''g''rilang va 5 soniya ushlab turing. 10 marta takrorlang.',
    'strength', 'beginner', 10,
    ARRAY['son muskullar', 'tizza atrofi'],
    ARRAY[]::text[], NULL
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Yelka aylantirish',
    'Yelkalarni sekin oldinga va orqaga aylantiring. 10 marta har yo''nalishda.',
    'mobility', 'beginner', 5,
    ARRAY['yelka muskullar', 'trapetsiya'],
    ARRAY[]::text[], NULL
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'Qo''l kuchini mustahkamlash',
    'Dumbbell yoki rezinkali tasmadan foydalanib qo''lni tizzaga qo''yib buking. 3x15 takrorlang.',
    'strength', 'intermediate', 15,
    ARRAY['bizeps', 'forearm'],
    ARRAY['dumbbell yoki rezinka'], NULL
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'Muvozanat mashqi',
    'Bir oyoqda 30 soniya turing. Ko''zlarni ochiq holda, so''ng yoping. Har oyoq 3 marta.',
    'balance', 'intermediate', 10,
    ARRAY['baldır muskuli', 'muvozanat muskullar'],
    ARRAY[]::text[], NULL
  ),
  (
    '10000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'Aerob yurish',
    'Bir soat davomida tez sur''atda yuring. Yurak tezligi maksimalning 60-70% bo''lishi kerak.',
    'cardio', 'beginner', 60,
    ARRAY['butun tana'],
    ARRAY[]::text[], NULL
  ),
  (
    '10000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    'Nafas olish mashqi',
    'Qorin nafasi: burun orqali 4 soniya olin, 2 soniya ushlab, og''iz orqali 6 soniya chiqarin. 10 marta.',
    'breathing', 'beginner', 10,
    ARRAY['nafas muskullar', 'diafragma'],
    ARRAY[]::text[], NULL
  )
ON CONFLICT (id) DO NOTHING;
