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
  diagnosis: 'ACL post-op (left knee)',
  dob: '1990-03-15',
  avatar: null,
}

export const ASSIGNED_DOCTOR = {
  id: 'doc-001',
  name: 'Dr. Sardor Rahimov',
  specialization: 'Orthopedic Surgeon',
  phone: '+998 71 200 11 22',
}

// ─── Treatment Plan ───────────────────────────────────────────────────────────

export const TREATMENT_PLAN = {
  id: 'plan-001',
  patient_id: 'pat-001',
  title: 'ACL Post-Op Rehabilitation',
  created_at: '2026-03-01',
  phases: [
    {
      id: 'phase-1',
      plan_id: 'plan-001',
      name: 'Phase 1 — Acute Recovery',
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
      name: 'Phase 2 — Strength & ROM',
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
      name: 'Phase 3 — Functional Training',
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
      name: 'Phase 4 — Return to Activity',
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
  { id: 'ex-001', title: 'Quad Sets', category: 'strength', default_sets: 3, default_reps: 15 },
  { id: 'ex-002', title: 'Straight Leg Raises', category: 'strength', default_sets: 3, default_reps: 12 },
  { id: 'ex-003', title: 'Mini Squats', category: 'strength', default_sets: 3, default_reps: 10 },
  // Mobility (3)
  { id: 'ex-004', title: 'Heel Slides', category: 'mobility', default_sets: 2, default_reps: 20 },
  { id: 'ex-005', title: 'Knee Flexion Stretch', category: 'mobility', default_sets: 2, default_reps: 15 },
  { id: 'ex-006', title: 'Prone Knee Bend', category: 'mobility', default_sets: 2, default_reps: 10 },
  // Balance (2)
  { id: 'ex-007', title: 'Single Leg Stance', category: 'balance', default_sets: 3, default_reps: 30 },
  { id: 'ex-008', title: 'Wobble Board Balance', category: 'balance', default_sets: 2, default_reps: 60 },
  // Circulation (2)
  { id: 'ex-009', title: 'Ankle Pumps', category: 'circulation', default_sets: 3, default_reps: 20 },
  { id: 'ex-010', title: 'Calf Raises', category: 'circulation', default_sets: 3, default_reps: 15 },
  // Other (2)
  { id: 'ex-011', title: 'Ice Application', category: 'other', default_sets: 1, default_reps: 1 },
  { id: 'ex-012', title: 'Breathing & Relaxation', category: 'other', default_sets: 1, default_reps: 1 },
]

// ─── Today's Exercises ────────────────────────────────────────────────────────

export const TODAY_EXERCISES: PlanExercise[] = [
  {
    phase_id: 'phase-2',
    exercise_id: 'ex-001',
    exercise: EXERCISE_LIBRARY[0],
    sets: 3,
    reps: 15,
    frequency: 'Daily',
    notes: 'Tighten quad, hold 5 sec',
    completedToday: true,
  },
  {
    phase_id: 'phase-2',
    exercise_id: 'ex-002',
    exercise: EXERCISE_LIBRARY[1],
    sets: 3,
    reps: 12,
    frequency: 'Daily',
    notes: 'Raise to 45°, hold 2 sec',
    completedToday: true,
  },
  {
    phase_id: 'phase-2',
    exercise_id: 'ex-004',
    exercise: EXERCISE_LIBRARY[3],
    sets: 2,
    reps: 20,
    frequency: 'Daily',
    notes: 'Slow and controlled motion',
    completedToday: true,
  },
  {
    phase_id: 'phase-2',
    exercise_id: 'ex-007',
    exercise: EXERCISE_LIBRARY[6],
    sets: 3,
    reps: 30,
    frequency: 'Daily',
    notes: 'Hold for 30 seconds each set',
    completedToday: false,
  },
  {
    phase_id: 'phase-2',
    exercise_id: 'ex-009',
    exercise: EXERCISE_LIBRARY[8],
    sets: 3,
    reps: 20,
    frequency: 'Daily',
    notes: 'Flex and point slowly',
    completedToday: false,
  },
  {
    phase_id: 'phase-2',
    exercise_id: 'ex-005',
    exercise: EXERCISE_LIBRARY[4],
    sets: 2,
    reps: 15,
    frequency: 'Daily',
    notes: 'Bend until mild tension, hold 20s',
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
  { id: 'sym-01', type: 'pain',      severity: 'moderate', intensity: 6, location: 'Left knee',       note: 'Sharp pain during flexion',            recorded_at: '2026-05-26T09:00:00' },
  { id: 'sym-02', type: 'swelling',  severity: 'mild',     intensity: 3, location: 'Left knee',       note: 'Minor puffiness in the morning',       recorded_at: '2026-05-27T08:30:00' },
  { id: 'sym-03', type: 'stiffness', severity: 'moderate', intensity: 5, location: 'Left knee joint', note: 'Hard to bend in the morning',           recorded_at: '2026-05-28T07:45:00' },
  { id: 'sym-04', type: 'fatigue',   severity: 'mild',     intensity: 4, location: 'General',         note: 'Tired after exercise session',          recorded_at: '2026-05-29T17:00:00' },
  { id: 'sym-05', type: 'pain',      severity: 'severe',   intensity: 8, location: 'Left knee',       note: 'Strong pain during single leg stance',  recorded_at: '2026-05-30T10:15:00' },
  { id: 'sym-06', type: 'numbness',  severity: 'mild',     intensity: 2, location: 'Lower leg',       note: 'Tingling after rest',                  recorded_at: '2026-05-31T06:50:00' },
  { id: 'sym-07', type: 'swelling',  severity: 'moderate', intensity: 5, location: 'Left knee',       note: 'Visible swelling after exercises',      recorded_at: '2026-06-01T12:00:00' },
  { id: 'sym-08', type: 'pain',      severity: 'mild',     intensity: 3, location: 'Left knee',       note: 'Dull ache at rest',                    recorded_at: '2026-06-02T14:30:00' },
  { id: 'sym-09', type: 'stiffness', severity: 'mild',     intensity: 3, location: 'Left knee joint', note: 'Slight stiffness after sitting long',   recorded_at: '2026-06-03T09:10:00' },
  { id: 'sym-10', type: 'pain',      severity: 'mild',     intensity: 3, location: 'Left knee',       note: 'Mild pain during heel slides',          recorded_at: '2026-06-04T10:00:00' },
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
      category: 'Protein Sources',
      items: ['Chicken breast', 'Eggs', 'Greek yogurt', 'Salmon', 'Lentils'],
    },
    {
      category: 'Anti-Inflammatory',
      items: ['Blueberries', 'Turmeric', 'Walnuts', 'Olive oil', 'Spinach'],
    },
    {
      category: 'Bone Health',
      items: ['Milk', 'Cheese', 'Fortified orange juice', 'Broccoli', 'Almonds'],
    },
  ],
  restricted_foods: [
    'Alcohol',
    'High-sodium processed foods',
    'Sugary beverages',
    'Fried fast food',
    'Grapefruit (interacts with Perindopril)',
  ],
  supplements: [
    { name: 'Calcium + D3',  dose: '500 mg / 400 IU', timing: 'With lunch'   },
    { name: 'Omega-3',       dose: '1000 mg',          timing: 'With dinner'  },
    { name: 'Vitamin C',     dose: '500 mg',           timing: 'With breakfast' },
  ],
  drug_food_warnings: [
    {
      drug: 'Perindopril',
      warning: 'Avoid grapefruit and grapefruit juice — may increase drug concentration in blood.',
    },
    {
      drug: 'Ibuprofen',
      warning: 'Take with food or milk. Avoid alcohol — increases risk of stomach bleeding.',
    },
  ],
}

// ─── Knowledge Articles ───────────────────────────────────────────────────────

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'art-01',
    category: 'condition',
    title: 'Understanding ACL Reconstruction',
    body: 'ACL reconstruction surgery replaces the torn anterior cruciate ligament with a graft. The graft takes 9–12 months to fully mature. During rehabilitation, it is important to follow your physiotherapist\'s instructions carefully to ensure the graft integrates properly and you regain full strength and stability.',
    source: 'Orthopaedic Journal of Sports Medicine',
    icon: '🦴',
    is_read: true,
  },
  {
    id: 'art-02',
    category: 'exercises',
    title: 'Why Quad Sets Matter in Early Recovery',
    body: 'Quadriceps sets are isometric contractions that activate your quad muscles without bending the knee. They are the foundation of Phase 1 and Phase 2 rehab because they prevent muscle atrophy while protecting the healing graft from stress.',
    source: 'Physical Therapy Journal',
    icon: '💪',
    is_read: true,
  },
  {
    id: 'art-03',
    category: 'medications',
    title: 'Using Ibuprofen Safely After Surgery',
    body: 'NSAIDs like Ibuprofen help manage post-operative inflammation and pain. Always take with food to protect your stomach lining. Do not exceed the prescribed dose. Long-term use should be discussed with your doctor, as it may affect kidney function and bone healing.',
    source: 'Pharmacist Review',
    icon: '💊',
    is_read: false,
  },
  {
    id: 'art-04',
    category: 'warning_signs',
    title: 'Red Flags: When to Contact Your Doctor',
    body: 'Contact your doctor immediately if you experience sudden increased swelling, redness with warmth around the knee, fever above 38.5°C, wound discharge, severe pain not relieved by medication, or numbness/tingling extending down the leg. These may indicate infection or deep vein thrombosis.',
    source: 'Post-Surgical Care Guidelines',
    icon: '⚠️',
    is_read: false,
  },
  {
    id: 'art-05',
    category: 'mental_health',
    title: 'Staying Motivated During Long Recovery',
    body: 'Recovering from ACL surgery is a marathon, not a sprint. It is normal to feel frustrated, especially when progress feels slow. Setting small weekly goals, celebrating milestones, and talking to others who have been through similar recoveries can help you stay mentally strong.',
    source: 'Sports Psychology Today',
    icon: '🧠',
    is_read: false,
  },
  {
    id: 'art-06',
    category: 'motivation',
    title: 'Your Recovery Journey: Week by Week',
    body: 'Every week of consistent effort brings you closer to returning to full activity. By Week 8, most patients report significantly reduced pain. By Week 16, strength often approaches pre-injury levels. Keep logging your exercises and vitals — the data shows your progress even when it does not feel like it.',
    source: 'MyRehab Health Team',
    icon: '🏆',
    is_read: true,
  },
]

// ─── Messages ─────────────────────────────────────────────────────────────────

export const MESSAGES: Message[] = [
  { id: 'msg-01', sender_role: 'doctor',  body: 'Good morning Murod! How is the knee feeling today?',                                                         is_read: true,  created_at: '2026-06-03T09:00:00' },
  { id: 'msg-02', sender_role: 'patient', body: 'Morning Doctor! A bit stiff when I woke up but better after the heel slides.',                               is_read: true,  created_at: '2026-06-03T09:15:00' },
  { id: 'msg-03', sender_role: 'doctor',  body: 'That morning stiffness is completely normal at this stage. Keep doing the heel slides before getting out of bed.', is_read: true,  created_at: '2026-06-03T09:22:00' },
  { id: 'msg-04', sender_role: 'patient', body: 'Understood. Should I skip the mini squats today? My knee feels a bit tender.',                                is_read: true,  created_at: '2026-06-03T09:30:00' },
  { id: 'msg-05', sender_role: 'doctor',  body: 'Yes, skip the squats today and do extra sets of ankle pumps instead. Ice for 15 min after.',                 is_read: true,  created_at: '2026-06-03T09:45:00' },
  { id: 'msg-06', sender_role: 'patient', body: 'Thank you! Will do. I also noticed some swelling after the balance exercises yesterday.',                     is_read: true,  created_at: '2026-06-03T18:00:00' },
  { id: 'msg-07', sender_role: 'doctor',  body: 'Swelling after balance work is expected at week 6. Apply ice and elevate the leg for 20 minutes.',            is_read: true,  created_at: '2026-06-03T18:30:00' },
  { id: 'msg-08', sender_role: 'patient', body: 'Got it. Pain intensity was 3/10 today, much better than last week!',                                         is_read: true,  created_at: '2026-06-04T08:00:00' },
  { id: 'msg-09', sender_role: 'doctor',  body: 'Excellent progress Murod! The pain trend is very encouraging. Keep it up.',                                   is_read: true,  created_at: '2026-06-04T08:30:00' },
  { id: 'msg-10', sender_role: 'patient', body: 'Should I start the single leg stance today? I feel ready.',                                                   is_read: true,  created_at: '2026-06-04T09:00:00' },
  { id: 'msg-11', sender_role: 'doctor',  body: 'Yes! Try 3 sets of 20 seconds each. Stand near a wall for safety and stop if you feel any sharp pain.',       is_read: true,  created_at: '2026-06-04T09:15:00' },
  { id: 'msg-12', sender_role: 'patient', body: 'Completed all exercises today! The single leg stance was challenging but I managed 25 seconds.',              is_read: true,  created_at: '2026-06-04T17:00:00' },
  { id: 'msg-13', sender_role: 'doctor',  body: 'That is fantastic! You are progressing ahead of schedule. I will review your progress at Thursday\'s appointment.', is_read: true,  created_at: '2026-06-04T17:30:00' },
  { id: 'msg-14', sender_role: 'patient', body: 'Looking forward to it! My recovery score hit 72 today according to the app.',                                 is_read: true,  created_at: '2026-06-05T08:00:00' },
  { id: 'msg-15', sender_role: 'doctor',  body: 'Great work! 72 is a solid score for week 6. Keep following the plan and we will reassess your phase progress on Thursday.', is_read: false, created_at: '2026-06-05T08:45:00' },
]

// ─── Appointments ─────────────────────────────────────────────────────────────

export const APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-01',
    type: 'in_person',
    scheduled_at: '2026-06-08T10:00:00',
    status: 'scheduled',
    notes: 'Phase 2 progress assessment and gait analysis',
  },
  {
    id: 'apt-02',
    type: 'teleconsult',
    scheduled_at: '2026-06-15T14:00:00',
    status: 'scheduled',
    notes: 'Medication review and exercise plan update',
  },
  {
    id: 'apt-03',
    type: 'in_person',
    scheduled_at: '2026-06-22T11:00:00',
    status: 'scheduled',
    notes: 'Phase 2 completion evaluation and Phase 3 planning',
  },
  {
    id: 'apt-04',
    type: 'in_person',
    scheduled_at: '2026-05-15T10:00:00',
    status: 'completed',
    notes: 'Phase 1 completion check — cleared for Phase 2',
  },
  {
    id: 'apt-05',
    type: 'teleconsult',
    scheduled_at: '2026-05-28T14:00:00',
    status: 'completed',
    notes: 'Mid Phase 2 check-in, swelling discussed, icing protocol adjusted',
  },
]

// ─── Weekly Adherence ─────────────────────────────────────────────────────────

export const WEEKLY_ADHERENCE: WeeklyAdherence[] = [
  { week: 1, adherence_pct: 60, label: 'Wk 1' },
  { week: 2, adherence_pct: 68, label: 'Wk 2' },
  { week: 3, adherence_pct: 72, label: 'Wk 3' },
  { week: 4, adherence_pct: 75, label: 'Wk 4' },
  { week: 5, adherence_pct: 80, label: 'Wk 5' },
  { week: 6, adherence_pct: 85, label: 'Wk 6' },
  { week: 7, adherence_pct: 88, label: 'Wk 7' },
  { week: 8, adherence_pct: 92, label: 'Wk 8' },
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
