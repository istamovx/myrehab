// ─── TypeScript Interfaces ───────────────────────────────────────────────────

export interface PlanPhase {
  id: string
  plan_id: string
  name: string
  order_index: number
  duration_weeks: number
  status: 'locked' | 'current' | 'completed'
  started_at: string | null
  completed_at: string | null
  progress_pct?: number
}

export interface Exercise {
  id: string
  title: string
  category: 'strength' | 'mobility' | 'balance' | 'circulation' | 'other'
  default_sets: number
  default_reps: number
}

export interface PlanExercise {
  phase_id: string
  exercise_id: string
  exercise: Exercise
  sets: number
  reps: number
  frequency: string
  notes: string
  completedToday: boolean
}

export interface ExerciseLog {
  log_date: string
  completed: boolean
}

export interface Medication {
  id: string
  name: string
  dose: string
  frequency_per_day: number
  schedule_times: string[]
  is_active: boolean
}

export interface MedicationLog {
  medication_id: string
  medication_name: string
  dose: string
  scheduled_time: string
  status: 'taken' | 'skipped' | 'pending'
}

export interface VitalReading {
  id: string
  systolic: number
  diastolic: number
  heart_rate: number
  temperature: number
  spo2: number
  weight: number
  recorded_at: string
}

export interface SymptomLog {
  id: string
  type: 'pain' | 'swelling' | 'stiffness' | 'fatigue' | 'numbness' | 'other'
  severity: 'mild' | 'moderate' | 'severe'
  intensity: number
  location: string
  note: string
  recorded_at: string
}

export interface MoodLog {
  log_date: string
  mood: 'happy' | 'neutral' | 'tired' | 'sad'
  note: string
}

export interface NutritionPlan {
  daily_calories: number
  daily_protein_g: number
  daily_calcium_mg: number
  daily_vitamin_d_mcg: number
  daily_water_l: number
  recommended_foods: { category: string; items: string[] }[]
  restricted_foods: string[]
  supplements: { name: string; dose: string; timing: string }[]
  drug_food_warnings: { drug: string; warning: string }[]
}

export interface KnowledgeArticle {
  id: string
  category: 'mental_health' | 'medications' | 'warning_signs' | 'motivation' | 'condition' | 'exercises'
  title: string
  body: string
  source: string
  icon: string
  is_read: boolean
}

export interface Message {
  id: string
  sender_role: 'patient' | 'doctor'
  body: string
  is_read: boolean
  created_at: string
}

export interface Appointment {
  id: string
  type: 'in_person' | 'teleconsult'
  scheduled_at: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'missed'
  notes: string
}

export interface RecoveryScore {
  date: string
  score: number
  adherence_pct: number
  streak_days: number
  computed_at: string
}

export interface WeeklyAdherence {
  week: number
  adherence_pct: number
  label: string
}

export interface PainHistory {
  date: string
  intensity: number
}

export interface TodaySummary {
  exercisesDone: number
  exercisesTotal: number
  medsDone: number
  medsTotal: number
  mood: null | 'happy' | 'neutral' | 'tired' | 'sad'
  streak: number
  recoveryScore: number
}

// ─── Patient & Doctor ─────────────────────────────────────────────────────────

export const PATIENT_PROFILE = {
  id: 'pat-001',
  name: 'Murod Aliyev',
  phone: '+998 90 123 45 67',
  diagnosis: 'ACL operatsiyadan keyin (chap tizza)',
  dob: '1990-03-15',
  avatar: null,
}

export const ASSIGNED_DOCTOR = {
  id: 'doc-001',
  name: 'Dr. Sardor Rahimov',
  specialization: 'Ortoped jarroh',
  phone: '+998 71 200 11 22',
}

// ─── Treatment Plan ───────────────────────────────────────────────────────────

export const TREATMENT_PLAN = {
  id: 'plan-001',
  patient_id: 'pat-001',
  title: 'ACL operatsiyasidan keyingi reabilitatsiya',
  created_at: '2026-03-01',
  phases: [
    {
      id: 'phase-1',
      plan_id: 'plan-001',
      name: "1-faza — Boshlang'ich tiklanish",
      order_index: 1,
      duration_weeks: 4,
      status: 'completed' as const,
      started_at: '2026-03-01',
      completed_at: '2026-03-28',
      progress_pct: 100,
    },
    {
      id: 'phase-2',
      plan_id: 'plan-001',
      name: '2-faza — Kuch va harakatchanlik',
      order_index: 2,
      duration_weeks: 6,
      status: 'current' as const,
      started_at: '2026-03-29',
      completed_at: null,
      progress_pct: 65,
    },
    {
      id: 'phase-3',
      plan_id: 'plan-001',
      name: '3-faza — Funksional mashqlar',
      order_index: 3,
      duration_weeks: 6,
      status: 'locked' as const,
      started_at: null,
      completed_at: null,
      progress_pct: 0,
    },
    {
      id: 'phase-4',
      plan_id: 'plan-001',
      name: '4-faza — Faoliyatga qaytish',
      order_index: 4,
      duration_weeks: 4,
      status: 'locked' as const,
      started_at: null,
      completed_at: null,
      progress_pct: 0,
    },
  ] as PlanPhase[],
}

// ─── Exercise Library ─────────────────────────────────────────────────────────

export const EXERCISE_LIBRARY: Exercise[] = [
  // Strength (3)
  { id: 'ex-001', title: 'Son mushagini taranglashtirish', category: 'strength', default_sets: 3, default_reps: 15 },
  { id: 'ex-002', title: "To'g'ri oyoqni ko'tarish", category: 'strength', default_sets: 3, default_reps: 12 },
  { id: 'ex-003', title: "Yarim cho'kkalash", category: 'strength', default_sets: 3, default_reps: 10 },
  // Mobility (3)
  { id: 'ex-004', title: 'Tovonni sirpantirish', category: 'mobility', default_sets: 2, default_reps: 20 },
  { id: 'ex-005', title: "Tizzani bukib cho'zish", category: 'mobility', default_sets: 2, default_reps: 15 },
  { id: 'ex-006', title: 'Qorinda yotib tizzani bukish', category: 'mobility', default_sets: 2, default_reps: 10 },
  // Balance (2)
  { id: 'ex-007', title: 'Bir oyoqda turish', category: 'balance', default_sets: 3, default_reps: 30 },
  { id: 'ex-008', title: 'Muvozanat taxtasi mashqi', category: 'balance', default_sets: 2, default_reps: 60 },
  // Circulation (2)
  { id: 'ex-009', title: 'Oyoq panjasi mashqi', category: 'circulation', default_sets: 3, default_reps: 20 },
  { id: 'ex-010', title: "Boldirni ko'tarish", category: 'circulation', default_sets: 3, default_reps: 15 },
  // Other (2)
  { id: 'ex-011', title: "Muz qo'yish", category: 'other', default_sets: 1, default_reps: 1 },
  { id: 'ex-012', title: "Nafas olish va bo'shashish", category: 'other', default_sets: 1, default_reps: 1 },
]

// ─── Today's Exercises ────────────────────────────────────────────────────────

export const TODAY_EXERCISES: PlanExercise[] = [
  {
    phase_id: 'phase-2',
    exercise_id: 'ex-001',
    exercise: EXERCISE_LIBRARY[0],
    sets: 3,
    reps: 15,
    frequency: 'Har kuni',
    notes: "Son mushagini tarang qiling, 5 soniya ushlab turing",
    completedToday: true,
  },
  {
    phase_id: 'phase-2',
    exercise_id: 'ex-002',
    exercise: EXERCISE_LIBRARY[1],
    sets: 3,
    reps: 12,
    frequency: 'Har kuni',
    notes: "45° ga ko'taring, 2 soniya ushlab turing",
    completedToday: true,
  },
  {
    phase_id: 'phase-2',
    exercise_id: 'ex-004',
    exercise: EXERCISE_LIBRARY[3],
    sets: 2,
    reps: 20,
    frequency: 'Har kuni',
    notes: 'Sekin va nazoratli harakat',
    completedToday: true,
  },
  {
    phase_id: 'phase-2',
    exercise_id: 'ex-007',
    exercise: EXERCISE_LIBRARY[6],
    sets: 3,
    reps: 30,
    frequency: 'Har kuni',
    notes: 'Har bir takrorda 30 soniya ushlab turing',
    completedToday: false,
  },
  {
    phase_id: 'phase-2',
    exercise_id: 'ex-009',
    exercise: EXERCISE_LIBRARY[8],
    sets: 3,
    reps: 20,
    frequency: 'Har kuni',
    notes: 'Oyoq panjasini sekin bukib-yozing',
    completedToday: false,
  },
  {
    phase_id: 'phase-2',
    exercise_id: 'ex-005',
    exercise: EXERCISE_LIBRARY[4],
    sets: 2,
    reps: 15,
    frequency: 'Har kuni',
    notes: "Yengil tortishish sezilguncha buking, 20 soniya ushlang",
    completedToday: false,
  },
]

// ─── Medications ──────────────────────────────────────────────────────────────

export const MEDICATIONS: Medication[] = [
  {
    id: 'med-001',
    name: 'Perindopril',
    dose: '10 mg',
    frequency_per_day: 2,
    schedule_times: ['08:00', '20:00'],
    is_active: true,
  },
  {
    id: 'med-002',
    name: 'Ibuprofen',
    dose: '400 mg',
    frequency_per_day: 3,
    schedule_times: ['08:00', '14:00', '20:00'],
    is_active: true,
  },
  {
    id: 'med-003',
    name: 'Calcium + D3',
    dose: '500 mg',
    frequency_per_day: 1,
    schedule_times: ['12:00'],
    is_active: true,
  },
]

export const TODAY_MEDICATIONS: MedicationLog[] = [
  // Perindopril
  { medication_id: 'med-001', medication_name: 'Perindopril', dose: '10 mg', scheduled_time: '08:00', status: 'taken' },
  { medication_id: 'med-001', medication_name: 'Perindopril', dose: '10 mg', scheduled_time: '20:00', status: 'pending' },
  // Ibuprofen
  { medication_id: 'med-002', medication_name: 'Ibuprofen', dose: '400 mg', scheduled_time: '08:00', status: 'taken' },
  { medication_id: 'med-002', medication_name: 'Ibuprofen', dose: '400 mg', scheduled_time: '14:00', status: 'skipped' },
  { medication_id: 'med-002', medication_name: 'Ibuprofen', dose: '400 mg', scheduled_time: '20:00', status: 'pending' },
  // Calcium + D3
  { medication_id: 'med-003', medication_name: 'Calcium + D3', dose: '500 mg', scheduled_time: '12:00', status: 'taken' },
]

// ─── Vital Signs ──────────────────────────────────────────────────────────────

export const VITAL_NORMS = {
  systolic:    { min: 90,   max: 130  },
  diastolic:   { min: 60,   max: 85   },
  heartRate:   { min: 60,   max: 100  },
  temperature: { min: 36.0, max: 37.5 },
  spo2:        { min: 95,   max: 100  },
  weight:      { min: 55,   max: 95   },
}

export const VITAL_HISTORY: VitalReading[] = [
  { id: 'v-01', systolic: 128, diastolic: 82, heart_rate: 74, temperature: 36.7, spo2: 98, weight: 78.5, recorded_at: '2026-05-23T08:10:00' },
  { id: 'v-02', systolic: 125, diastolic: 80, heart_rate: 72, temperature: 36.6, spo2: 98, weight: 78.4, recorded_at: '2026-05-24T08:05:00' },
  { id: 'v-03', systolic: 130, diastolic: 84, heart_rate: 76, temperature: 36.8, spo2: 97, weight: 78.6, recorded_at: '2026-05-25T08:15:00' },
  { id: 'v-04', systolic: 122, diastolic: 79, heart_rate: 70, temperature: 36.5, spo2: 99, weight: 78.3, recorded_at: '2026-05-26T08:00:00' },
  { id: 'v-05', systolic: 118, diastolic: 76, heart_rate: 68, temperature: 36.6, spo2: 99, weight: 78.2, recorded_at: '2026-05-27T08:20:00' },
  { id: 'v-06', systolic: 121, diastolic: 78, heart_rate: 71, temperature: 36.7, spo2: 98, weight: 78.1, recorded_at: '2026-05-28T08:10:00' },
  { id: 'v-07', systolic: 126, diastolic: 81, heart_rate: 73, temperature: 36.6, spo2: 98, weight: 78.0, recorded_at: '2026-05-29T08:05:00' },
  { id: 'v-08', systolic: 119, diastolic: 77, heart_rate: 69, temperature: 36.5, spo2: 99, weight: 77.9, recorded_at: '2026-05-30T08:15:00' },
  { id: 'v-09', systolic: 124, diastolic: 80, heart_rate: 72, temperature: 36.7, spo2: 98, weight: 77.8, recorded_at: '2026-05-31T08:10:00' },
  { id: 'v-10', systolic: 120, diastolic: 78, heart_rate: 70, temperature: 36.6, spo2: 99, weight: 77.7, recorded_at: '2026-06-01T08:05:00' },
  { id: 'v-11', systolic: 117, diastolic: 75, heart_rate: 67, temperature: 36.5, spo2: 99, weight: 77.6, recorded_at: '2026-06-02T08:20:00' },
  { id: 'v-12', systolic: 123, diastolic: 79, heart_rate: 71, temperature: 36.6, spo2: 98, weight: 77.5, recorded_at: '2026-06-03T08:00:00' },
  { id: 'v-13', systolic: 121, diastolic: 77, heart_rate: 70, temperature: 36.7, spo2: 98, weight: 77.4, recorded_at: '2026-06-04T08:15:00' },
  { id: 'v-14', systolic: 119, diastolic: 76, heart_rate: 68, temperature: 36.6, spo2: 99, weight: 77.3, recorded_at: '2026-06-05T08:10:00' },
]

export const LATEST_VITAL: VitalReading = VITAL_HISTORY[VITAL_HISTORY.length - 1]

// ─── Symptom Logs ─────────────────────────────────────────────────────────────

export const SYMPTOM_LOGS: SymptomLog[] = [
  { id: 'sym-01', type: 'pain',      severity: 'moderate', intensity: 6, location: 'Chap tizza',        note: "Bukilganda o'tkir og'riq",             recorded_at: '2026-05-26T09:00:00' },
  { id: 'sym-02', type: 'swelling',  severity: 'mild',     intensity: 3, location: 'Chap tizza',        note: 'Ertalab yengil shish',                 recorded_at: '2026-05-27T08:30:00' },
  { id: 'sym-03', type: 'stiffness', severity: 'moderate', intensity: 5, location: "Chap tizza bo'g'imi", note: 'Ertalab bukish qiyin',                recorded_at: '2026-05-28T07:45:00' },
  { id: 'sym-04', type: 'fatigue',   severity: 'mild',     intensity: 4, location: 'Umumiy',            note: "Mashqdan keyin charchoq",              recorded_at: '2026-05-29T17:00:00' },
  { id: 'sym-05', type: 'pain',      severity: 'severe',   intensity: 8, location: 'Chap tizza',        note: "Bir oyoqda turganda kuchli og'riq",    recorded_at: '2026-05-30T10:15:00' },
  { id: 'sym-06', type: 'numbness',  severity: 'mild',     intensity: 2, location: 'Boldir',            note: "Dam olgandan keyin uvishish",          recorded_at: '2026-05-31T06:50:00' },
  { id: 'sym-07', type: 'swelling',  severity: 'moderate', intensity: 5, location: 'Chap tizza',        note: "Mashqlardan keyin ko'rinarli shish",   recorded_at: '2026-06-01T12:00:00' },
  { id: 'sym-08', type: 'pain',      severity: 'mild',     intensity: 3, location: 'Chap tizza',        note: "Dam olishda zaif og'riq",              recorded_at: '2026-06-02T14:30:00' },
  { id: 'sym-09', type: 'stiffness', severity: 'mild',     intensity: 3, location: "Chap tizza bo'g'imi", note: "Uzoq o'tirgandan keyin qotishlik",    recorded_at: '2026-06-03T09:10:00' },
  { id: 'sym-10', type: 'pain',      severity: 'mild',     intensity: 3, location: 'Chap tizza',        note: "Tovon sirpantirganda yengil og'riq",   recorded_at: '2026-06-04T10:00:00' },
]

// ─── Nutrition Plan ───────────────────────────────────────────────────────────

export const NUTRITION_PLAN: NutritionPlan = {
  daily_calories: 2200,
  daily_protein_g: 120,
  daily_calcium_mg: 1000,
  daily_vitamin_d_mcg: 20,
  daily_water_l: 2.5,
  recommended_foods: [
    {
      category: 'Oqsil manbalari',
      items: ["Tovuq ko'kragi", 'Tuxum', 'Yunon yogurti', 'Losos', 'Yasmiq'],
    },
    {
      category: 'Yallig\'lanishga qarshi',
      items: ['Ko\'k qulupnay', 'Zarchava', 'Yong\'oq', 'Zaytun moyi', 'Ismaloq'],
    },
    {
      category: 'Suyak salomatligi',
      items: ['Sut', 'Pishloq', 'Apelsin sharbati', 'Brokkoli', 'Bodom'],
    },
  ],
  restricted_foods: [
    'Spirtli ichimliklar',
    'Tuz miqdori yuqori tayyor mahsulotlar',
    'Shakarli ichimliklar',
    'Qovurilgan fast-food',
    'Greypfrut (Perindopril bilan ta\'sirlashadi)',
  ],
  supplements: [
    { name: 'Kalsiy + D3',   dose: '500 mg / 400 IU', timing: 'Tushlik bilan'   },
    { name: 'Omega-3',       dose: '1000 mg',          timing: 'Kechki ovqat bilan'  },
    { name: 'Vitamin C',     dose: '500 mg',           timing: 'Nonushta bilan' },
  ],
  drug_food_warnings: [
    {
      drug: 'Perindopril',
      warning: "Greypfrut va uning sharbatidan saqlaning — qondagi dori miqdorini oshirishi mumkin.",
    },
    {
      drug: 'Ibuprofen',
      warning: "Ovqat yoki sut bilan iching. Spirtli ichimliklardan saqlaning — oshqozon qonashi xavfini oshiradi.",
    },
  ],
}

// ─── Knowledge Articles ───────────────────────────────────────────────────────

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'art-01',
    category: 'condition',
    title: 'ACL tiklash operatsiyasi haqida',
    body: "ACL tiklash operatsiyasida yirtilgan oldingi xochsimon boylam transplantat bilan almashtiriladi. Transplantat to'liq mustahkamlanishi uchun 9–12 oy kerak bo'ladi. Reabilitatsiya davrida transplantat to'g'ri birikishi hamda kuch va barqarorlikni tiklash uchun fizioterapevt ko'rsatmalariga qat'iy amal qilish muhim.",
    source: 'Orthopaedic Journal of Sports Medicine',
    icon: '🦴',
    is_read: true,
  },
  {
    id: 'art-02',
    category: 'exercises',
    title: "Boshlang'ich bosqichda son mushaklari mashqi nega muhim",
    body: "Son mushaklarini taranglashtirish — tizzani bukmasdan son mushaklarini ishga soluvchi izometrik mashqdir. Bu 1- va 2-faza reabilitatsiyasining asosi hisoblanadi, chunki u mushak atrofiyasining oldini oladi va ayni paytda bitayotgan transplantatni zo'riqishdan himoya qiladi.",
    source: 'Physical Therapy Journal',
    icon: '💪',
    is_read: true,
  },
  {
    id: 'art-03',
    category: 'medications',
    title: 'Operatsiyadan keyin Ibuprofenni xavfsiz qabul qilish',
    body: "Ibuprofen kabi nosteroid yallig'lanishga qarshi dorilar operatsiyadan keyingi yallig'lanish va og'riqni kamaytiradi. Oshqozon shilliq qavatini himoya qilish uchun doimo ovqat bilan iching. Belgilangan dozadan oshirmang. Uzoq muddatli qabul qilishni shifokor bilan maslahatlashing, chunki u buyrak faoliyati va suyak bitishiga ta'sir qilishi mumkin.",
    source: 'Pharmacist Review',
    icon: '💊',
    is_read: false,
  },
  {
    id: 'art-04',
    category: 'warning_signs',
    title: 'Xavfli belgilar: qachon shifokorga murojaat qilish kerak',
    body: "Agar to'satdan shish kuchaysa, tizza atrofida qizarish va issiqlik bo'lsa, harorat 38.5°C dan oshsa, yaradan suyuqlik chiqsa, dori yordam bermaydigan kuchli og'riq yoki oyoq bo'ylab tarqaladigan uvishish sezsangiz, darhol shifokorga murojaat qiling. Bular infeksiya yoki chuqur vena trombozi belgisi bo'lishi mumkin.",
    source: 'Post-Surgical Care Guidelines',
    icon: '⚠️',
    is_read: false,
  },
  {
    id: 'art-05',
    category: 'mental_health',
    title: "Uzoq tiklanish davrida motivatsiyani saqlash",
    body: "ACL operatsiyasidan tiklanish — bu sprint emas, marafon. Ayniqsa, jarayon sekin ketayotgandek tuyulganda, hafsalasi pir bo'lish tabiiy holat. Kichik haftalik maqsadlar qo'yish, erishilgan natijalarni nishonlash va shunday yo'lni bosib o'tgan boshqalar bilan suhbatlashish ruhiy jihatdan kuchli bo'lib qolishga yordam beradi.",
    source: 'Sports Psychology Today',
    icon: '🧠',
    is_read: false,
  },
  {
    id: 'art-06',
    category: 'motivation',
    title: "Tiklanish yo'lingiz: haftama-hafta",
    body: "Har bir izchil mehnat haftasi sizni to'liq faoliyatga qaytishga yaqinlashtiradi. 8-haftaga kelib ko'pchilik bemorlar og'riq sezilarli kamayganini qayd etadi. 16-haftaga kelib kuch ko'pincha jarohatdan oldingi darajaga yaqinlashadi. Mashqlar va sog'liq ko'rsatkichlarini qayd etishda davom eting — ma'lumotlar siz sezmasangiz ham o'sishingizni ko'rsatadi.",
    source: 'MyRehab Health Team',
    icon: '🏆',
    is_read: true,
  },
]

// ─── Messages ─────────────────────────────────────────────────────────────────

export const MESSAGES: Message[] = [
  { id: 'msg-01', sender_role: 'doctor',  body: "Xayrli tong, Murod! Bugun tizzangiz qanday?",                                                                is_read: true,  created_at: '2026-06-03T09:00:00' },
  { id: 'msg-02', sender_role: 'patient', body: "Xayrli tong, doktor! Uyg'onganimda biroz qotgan edi, lekin tovon sirpantirish mashqidan keyin yaxshi bo'ldi.",   is_read: true,  created_at: '2026-06-03T09:15:00' },
  { id: 'msg-03', sender_role: 'doctor',  body: "Ertalabki qotishlik bu bosqichda mutlaqo normal holat. To'shakdan turishdan oldin tovon sirpantirishni davom eting.", is_read: true,  created_at: '2026-06-03T09:22:00' },
  { id: 'msg-04', sender_role: 'patient', body: "Tushunarli. Bugun yarim cho'kkalashni o'tkazib yuborsam bo'ladimi? Tizzam biroz og'riyapti.",                  is_read: true,  created_at: '2026-06-03T09:30:00' },
  { id: 'msg-05', sender_role: 'doctor',  body: "Ha, bugun cho'kkalashni o'tkazib yuboring va o'rniga oyoq panjasi mashqini qo'shimcha bajaring. Keyin 15 daqiqa muz qo'ying.", is_read: true,  created_at: '2026-06-03T09:45:00' },
  { id: 'msg-06', sender_role: 'patient', body: "Rahmat! Shunday qilaman. Kecha muvozanat mashqlaridan keyin biroz shish borligini ham sezdim.",                is_read: true,  created_at: '2026-06-03T18:00:00' },
  { id: 'msg-07', sender_role: 'doctor',  body: "Muvozanat mashqidan keyin 6-haftada shish bo'lishi kutilgan holat. Muz qo'ying va oyoqni 20 daqiqa baland qo'ying.", is_read: true,  created_at: '2026-06-03T18:30:00' },
  { id: 'msg-08', sender_role: 'patient', body: "Tushundim. Bugun og'riq darajasi 3/10 bo'ldi, o'tgan haftadan ancha yaxshi!",                                 is_read: true,  created_at: '2026-06-04T08:00:00' },
  { id: 'msg-09', sender_role: 'doctor',  body: "Ajoyib natija, Murod! Og'riq dinamikasi juda quvonarli. Shu zaylda davom eting.",                              is_read: true,  created_at: '2026-06-04T08:30:00' },
  { id: 'msg-10', sender_role: 'patient', body: "Bugun bir oyoqda turish mashqini boshlasam bo'ladimi? O'zimni tayyor his qilyapman.",                         is_read: true,  created_at: '2026-06-04T09:00:00' },
  { id: 'msg-11', sender_role: 'doctor',  body: "Ha! Har biri 20 soniyadan 3 marta bajarib ko'ring. Xavfsizlik uchun devor yonida turing va o'tkir og'riq sezsangiz to'xtang.", is_read: true,  created_at: '2026-06-04T09:15:00' },
  { id: 'msg-12', sender_role: 'patient', body: "Bugun barcha mashqlarni bajardim! Bir oyoqda turish qiyin bo'ldi, lekin 25 soniya ushlab turdim.",            is_read: true,  created_at: '2026-06-04T17:00:00' },
  { id: 'msg-13', sender_role: 'doctor',  body: "Bu ajoyib! Siz rejadan oldinda ketyapsiz. Payshanba kungi qabulda o'sishingizni ko'rib chiqaman.",            is_read: true,  created_at: '2026-06-04T17:30:00' },
  { id: 'msg-14', sender_role: 'patient', body: "Intizorlik bilan kutaman! Ilovaga ko'ra bugun tiklanish balim 72 ga yetdi.",                                  is_read: true,  created_at: '2026-06-05T08:00:00' },
  { id: 'msg-15', sender_role: 'doctor',  body: "Zo'r ish! 72 — 6-hafta uchun yaxshi ko'rsatkich. Rejaga amal qilishda davom eting, payshanba kuni faza o'sishini qayta baholaymiz.", is_read: false, created_at: '2026-06-05T08:45:00' },
]

// ─── Appointments ─────────────────────────────────────────────────────────────

export const APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-01',
    type: 'in_person',
    scheduled_at: '2026-06-08T10:00:00',
    status: 'scheduled',
    notes: "2-faza o'sishini baholash va yurish tahlili",
  },
  {
    id: 'apt-02',
    type: 'teleconsult',
    scheduled_at: '2026-06-15T14:00:00',
    status: 'scheduled',
    notes: "Dorilarni ko'rib chiqish va mashqlar rejasini yangilash",
  },
  {
    id: 'apt-03',
    type: 'in_person',
    scheduled_at: '2026-06-22T11:00:00',
    status: 'scheduled',
    notes: "2-faza yakunini baholash va 3-fazani rejalashtirish",
  },
  {
    id: 'apt-04',
    type: 'in_person',
    scheduled_at: '2026-05-15T10:00:00',
    status: 'completed',
    notes: "1-faza yakunini tekshirish — 2-fazaga ruxsat berildi",
  },
  {
    id: 'apt-05',
    type: 'teleconsult',
    scheduled_at: '2026-05-28T14:00:00',
    status: 'completed',
    notes: "2-faza o'rtasidagi nazorat, shish muhokama qilindi, muz qo'yish tartibi sozlandi",
  },
]

// ─── Weekly Adherence ─────────────────────────────────────────────────────────

export const WEEKLY_ADHERENCE: WeeklyAdherence[] = [
  { week: 1, adherence_pct: 60, label: '1-h' },
  { week: 2, adherence_pct: 68, label: '2-h' },
  { week: 3, adherence_pct: 72, label: '3-h' },
  { week: 4, adherence_pct: 75, label: '4-h' },
  { week: 5, adherence_pct: 80, label: '5-h' },
  { week: 6, adherence_pct: 85, label: '6-h' },
  { week: 7, adherence_pct: 88, label: '7-h' },
  { week: 8, adherence_pct: 92, label: '8-h' },
]

// ─── Pain History ─────────────────────────────────────────────────────────────

export const PAIN_HISTORY: PainHistory[] = [
  { date: '2026-05-23', intensity: 7 },
  { date: '2026-05-24', intensity: 7 },
  { date: '2026-05-25', intensity: 6 },
  { date: '2026-05-26', intensity: 6 },
  { date: '2026-05-27', intensity: 6 },
  { date: '2026-05-28', intensity: 5 },
  { date: '2026-05-29', intensity: 5 },
  { date: '2026-05-30', intensity: 5 },
  { date: '2026-05-31', intensity: 4 },
  { date: '2026-06-01', intensity: 4 },
  { date: '2026-06-02', intensity: 4 },
  { date: '2026-06-03', intensity: 3 },
  { date: '2026-06-04', intensity: 3 },
  { date: '2026-06-05', intensity: 3 },
]

// ─── Recovery Scores ──────────────────────────────────────────────────────────

export const RECOVERY_SCORES: RecoveryScore[] = [
  { date: '2026-05-23', score: 55, adherence_pct: 60, streak_days: 1,  computed_at: '2026-05-23T23:59:00' },
  { date: '2026-05-24', score: 56, adherence_pct: 62, streak_days: 2,  computed_at: '2026-05-24T23:59:00' },
  { date: '2026-05-25', score: 57, adherence_pct: 65, streak_days: 3,  computed_at: '2026-05-25T23:59:00' },
  { date: '2026-05-26', score: 58, adherence_pct: 67, streak_days: 4,  computed_at: '2026-05-26T23:59:00' },
  { date: '2026-05-27', score: 59, adherence_pct: 70, streak_days: 5,  computed_at: '2026-05-27T23:59:00' },
  { date: '2026-05-28', score: 61, adherence_pct: 72, streak_days: 6,  computed_at: '2026-05-28T23:59:00' },
  { date: '2026-05-29', score: 62, adherence_pct: 75, streak_days: 7,  computed_at: '2026-05-29T23:59:00' },
  { date: '2026-05-30', score: 64, adherence_pct: 78, streak_days: 8,  computed_at: '2026-05-30T23:59:00' },
  { date: '2026-05-31', score: 65, adherence_pct: 80, streak_days: 9,  computed_at: '2026-05-31T23:59:00' },
  { date: '2026-06-01', score: 66, adherence_pct: 82, streak_days: 10, computed_at: '2026-06-01T23:59:00' },
  { date: '2026-06-02', score: 68, adherence_pct: 85, streak_days: 11, computed_at: '2026-06-02T23:59:00' },
  { date: '2026-06-03', score: 69, adherence_pct: 87, streak_days: 12, computed_at: '2026-06-03T23:59:00' },
  { date: '2026-06-04', score: 71, adherence_pct: 90, streak_days: 13, computed_at: '2026-06-04T23:59:00' },
  { date: '2026-06-05', score: 72, adherence_pct: 92, streak_days: 14, computed_at: '2026-06-05T23:59:00' },
]

// ─── Today's Summary ──────────────────────────────────────────────────────────

export const TODAY_SUMMARY: TodaySummary = {
  exercisesDone:  TODAY_EXERCISES.filter(e => e.completedToday).length,
  exercisesTotal: TODAY_EXERCISES.length,
  medsDone:       TODAY_MEDICATIONS.filter(m => m.status === 'taken').length,
  medsTotal:      TODAY_MEDICATIONS.length,
  mood:           null,
  streak:         14,
  recoveryScore:  72,
}

// ─── Mood ─────────────────────────────────────────────────────────────────────

export const MOOD_TODAY: MoodLog | null = null
