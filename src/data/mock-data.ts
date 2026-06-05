export type PatientStatus =
  | 'Ready'
  | 'At-Risk'
  | 'In Progress'
  | 'Awaiting clearance'
  | 'Done'

export interface Patient {
  id: string
  name: string
  gender: 'Male' | 'Female'
  dateOfBirth: string
  location: string
  photo?: string
  procedure: string
  procedureCode?: string
  status: PatientStatus
  procedureDate: string
  surgeryDate?: string
  attendingPhysician: string
  physioTherapist?: string
  statusDetail?: string
  tags: string[]
  language?: string
  allergies?: string[]
  preExistingConditions?: string[]
  medications?: string[]
  dnr?: boolean
  asaClassification?: string
  asaUploadDate?: string
  icuNeed?: 'Required' | 'Not required'
  icuStatus?: string
  lastLabDate?: string
  lastLabUpdated?: string
  alerts?: Alert[]
  documents?: DocumentGroup[]
  checklist?: ChecklistGroup[]
}

export interface Alert {
  id: string
  type: 'high' | 'medium' | 'low'
  message: string
  date?: string
}

export interface DocumentGroup {
  group: string
  expanded?: boolean
  files: DocFile[]
}

export interface DocFile {
  id: string
  name: string
  type: 'pdf' | 'txt' | 'img'
}

export interface ChecklistGroup {
  id: string
  name: string
  totalTasks: number
  completedTasks: number
  status: 'done' | 'in-progress' | 'pending'
}

export interface Doctor {
  id: string
  name: string
  role: string
  photo?: string
  availableFrom?: string
  availableTo?: string
  schedule?: ScheduleBlock[]
}

export interface ScheduleBlock {
  type: 'surgery' | 'ward-round' | 'consent-talk' | 'break'
  startHour: number
  startMin: number
  endHour: number
  endMin: number
  label: string
}

export const PATIENTS: Patient[] = [
  {
    id: '1001',
    name: 'Dilnoza Karimova',
    gender: 'Female',
    dateOfBirth: '1990-03-15',
    location: 'Toshkent, O\'zbekiston',
    procedure: 'Son-chanoq bo\'g\'imini almashtirish',
    procedureCode: 'OPS 5-820.00',
    status: 'Ready',
    procedureDate: '2025-04-28',
    surgeryDate: '2025-04-28',
    attendingPhysician: 'Dr. Akmal Karimov',
    physioTherapist: 'Dr. Bobur Toshmatov',
    tags: ['#ASA II', '#Reanimatsiya kerak', '#Yuqori xavf'],
    language: 'Ona tili — o\'zbek',
    allergies: ['Lateks', 'Penitsillin'],
    preExistingConditions: ['Qandli diabet II tip', 'Gipertoniya'],
    medications: ['Apiksaban', 'Metformin'],
    dnr: true,
    asaClassification: 'ASA III',
    asaUploadDate: '21.03.2025',
    icuNeed: 'Required',
    icuStatus: 'Tasdiqlash kutilmoqda',
    lastLabDate: 'Hb/INR',
    lastLabUpdated: '12.01.2025',
    alerts: [
      { id: 'a1', type: 'high', message: 'Qon suyultiruvchi — Apiksaban: 12.05.2025 da to\'xtatish tasdiqlangan' },
      { id: 'a2', type: 'high', message: 'Jonlantirmaslik (DNR) — Ha' },
      { id: 'a3', type: 'low', message: 'Laboratoriya — Hb/INR yangilansin' },
    ],
    documents: [
      {
        group: 'Rozilik va huquqiy',
        expanded: true,
        files: [
          { id: 'd1', name: 'Rozilik_varaqasi.txt', type: 'txt' },
          { id: 'd2', name: 'Xavf_sertifikati.pdf', type: 'pdf' },
          { id: 'd3', name: 'DNR_varaqasi.txt', type: 'txt' },
        ],
      },
      {
        group: 'Diagnostika',
        expanded: true,
        files: [
          { id: 'd4', name: 'Tahlillar_12.05.pdf', type: 'pdf' },
          { id: 'd5', name: 'Rentgen_tos.txt', type: 'txt' },
        ],
      },
      {
        group: 'Dori va xavf',
        expanded: false,
        files: [],
      },
    ],
    checklist: [
      { id: 'c1', name: 'Holatni rejalashtirish', totalTasks: 8, completedTasks: 8, status: 'done' },
      { id: 'c2', name: 'Diagnostika va xavf tahlili', totalTasks: 5, completedTasks: 5, status: 'done' },
      { id: 'c3', name: 'Rozilik', totalTasks: 5, completedTasks: 5, status: 'done' },
      { id: 'c4', name: 'Anesteziya ruxsati', totalTasks: 7, completedTasks: 7, status: 'done' },
      { id: 'c5', name: 'Yakuniy jarrohlik ruxsati', totalTasks: 7, completedTasks: 1, status: 'in-progress' },
    ],
  },
  {
    id: '1002',
    name: 'Sardor Aliyev',
    gender: 'Male',
    dateOfBirth: '1985-07-22',
    location: 'Samarqand, O\'zbekiston',
    procedure: 'Tizza reabilitatsiyasi',
    status: 'At-Risk',
    procedureDate: '2025-05-01',
    attendingPhysician: 'Dr. Nodira Yusupova',
    tags: ['#ASA IV', '#Yuqori xavf', '#Reanimatsiya zarur'],
    language: 'Rus tilida so\'zlashuvchi',
    allergies: ['Nosteroid preparatlar'],
    preExistingConditions: ['Gipertoniya', 'Semizlik'],
    medications: ['Varfarin', 'Lizinopril'],
    dnr: false,
    asaClassification: 'ASA IV',
    icuNeed: 'Required',
  },
  {
    id: '1003',
    name: 'Gulnora Saidova',
    gender: 'Female',
    dateOfBirth: '1995-11-08',
    location: 'Buxoro, O\'zbekiston',
    procedure: 'Yelka reabilitatsiyasi',
    status: 'In Progress',
    procedureDate: '2025-05-08',
    attendingPhysician: 'Dr. Sherzod Nazarov',
    tags: ['#ASA I'],
    language: 'O\'zbek tilida so\'zlashuvchi',
    allergies: [],
    preExistingConditions: [],
    medications: ['Ibuprofen'],
    dnr: false,
    asaClassification: 'ASA I',
    icuNeed: 'Not required',
  },
  {
    id: '1004',
    name: 'Jasur Tursunov',
    gender: 'Male',
    dateOfBirth: '1978-04-30',
    location: 'Namangan, O\'zbekiston',
    procedure: 'Umurtqa reabilitatsiyasi',
    status: 'At-Risk',
    procedureDate: '2025-05-09',
    attendingPhysician: 'Dr. Malika Rahimova',
    tags: ['#ASA II', '#Reanimatsiya kerak'],
    language: 'Rus tilida so\'zlashuvchi',
    allergies: ['Morfin'],
    preExistingConditions: ['Surunkali bel og\'rig\'i', 'Arterial gipertenziya'],
    medications: ['Gabapentin', 'Amlodipin'],
    dnr: false,
    asaClassification: 'ASA II',
    icuNeed: 'Required',
  },
  {
    id: '1005',
    name: 'Nilufar Rahimova',
    gender: 'Female',
    dateOfBirth: '2000-01-17',
    location: 'Farg\'ona, O\'zbekiston',
    procedure: 'Tizza boylamlari tiklanish dasturi',
    status: 'Ready',
    procedureDate: '2025-05-15',
    attendingPhysician: 'Dr. Akmal Karimov',
    tags: ['#ASA I'],
    asaClassification: 'ASA I',
    icuNeed: 'Not required',
  },
  {
    id: '1006',
    name: 'Otabek Yusupov',
    gender: 'Male',
    dateOfBirth: '1965-09-03',
    location: 'Andijon, O\'zbekiston',
    procedure: 'Insultdan keyingi reabilitatsiya',
    status: 'Awaiting clearance',
    procedureDate: '2025-05-20',
    attendingPhysician: 'Dr. Nodira Yusupova',
    tags: ['#ASA III', '#Yuqori xavf', '#Reanimatsiya kerak'],
    asaClassification: 'ASA III',
    icuNeed: 'Required',
  },
  {
    id: '1007',
    name: 'Sevara Ibragimova',
    gender: 'Female',
    dateOfBirth: '1992-06-25',
    location: 'Toshkent, O\'zbekiston',
    procedure: 'To\'piq boylamlari tiklanishi',
    status: 'Done',
    procedureDate: '2025-04-10',
    attendingPhysician: 'Dr. Sherzod Nazarov',
    tags: ['#ASA I'],
    asaClassification: 'ASA I',
    icuNeed: 'Not required',
  },
  {
    id: '1008',
    name: 'Bekzod Qodirov',
    gender: 'Male',
    dateOfBirth: '1988-12-11',
    location: 'Toshkent, O\'zbekiston',
    procedure: 'Tirsak payini tiklash',
    status: 'In Progress',
    procedureDate: '2025-05-12',
    attendingPhysician: 'Dr. Malika Rahimova',
    tags: ['#ASA II'],
    asaClassification: 'ASA II',
    icuNeed: 'Not required',
  },
]

export const DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Jamshid Karimov',
    role: 'Ortoped jarroh',
    availableFrom: '09:00',
    availableTo: '19:00',
    schedule: [
      { type: 'surgery', startHour: 9, startMin: 0, endHour: 11, endMin: 30, label: 'Jarrohlik' },
      { type: 'break', startHour: 11, startMin: 30, endHour: 12, endMin: 0, label: 'Tanaffus' },
      { type: 'consent-talk', startHour: 12, startMin: 0, endHour: 13, endMin: 30, label: 'Suhbat' },
      { type: 'ward-round', startHour: 13, startMin: 30, endHour: 15, endMin: 0, label: 'Bo\'lim ko\'rigi' },
    ],
  },
  {
    id: 'd2',
    name: 'Dr. Dilnoza Saidova',
    role: 'Fizioterapevt',
    availableFrom: '08:00',
    availableTo: '18:00',
    schedule: [
      { type: 'consent-talk', startHour: 8, startMin: 0, endHour: 9, endMin: 0, label: 'Suhbat' },
      { type: 'ward-round', startHour: 9, startMin: 0, endHour: 10, endMin: 30, label: 'Bo\'lim ko\'rigi' },
      { type: 'break', startHour: 10, startMin: 30, endHour: 11, endMin: 0, label: 'Tanaffus' },
      { type: 'surgery', startHour: 11, startMin: 0, endHour: 12, endMin: 30, label: 'Seans' },
      { type: 'consent-talk', startHour: 13, startMin: 0, endHour: 14, endMin: 30, label: 'Suhbat' },
    ],
  },
  {
    id: 'd3',
    name: 'Dr. Bobur Toshmatov',
    role: 'Reabilitolog',
    availableFrom: '09:00',
    availableTo: '19:00',
    schedule: [
      { type: 'ward-round', startHour: 8, startMin: 30, endHour: 10, endMin: 0, label: 'Bo\'lim ko\'rigi' },
      { type: 'break', startHour: 10, startMin: 0, endHour: 10, endMin: 30, label: 'Tanaffus' },
      { type: 'consent-talk', startHour: 12, startMin: 0, endHour: 13, endMin: 30, label: 'Suhbat' },
    ],
  },
  {
    id: 'd4',
    name: 'Dr. Zarina Abdullayeva',
    role: 'Ortoped mutaxassis',
    availableFrom: '08:00',
    availableTo: '17:00',
    schedule: [
      { type: 'surgery', startHour: 9, startMin: 0, endHour: 12, endMin: 0, label: 'Jarrohlik' },
      { type: 'break', startHour: 12, startMin: 0, endHour: 12, endMin: 30, label: 'Tanaffus' },
      { type: 'ward-round', startHour: 13, startMin: 0, endHour: 14, endMin: 0, label: 'Ko\'rik' },
    ],
  },
  {
    id: 'd5',
    name: 'Dr. Rustam Ismoilov',
    role: 'Radiolog',
    availableFrom: '09:00',
    availableTo: '18:00',
    schedule: [
      { type: 'consent-talk', startHour: 11, startMin: 0, endHour: 12, endMin: 30, label: 'Suhbat' },
      { type: 'surgery', startHour: 13, startMin: 0, endHour: 15, endMin: 0, label: 'Jarrohlik' },
    ],
  },
  {
    id: 'd6',
    name: 'Dr. Gulnoza Tursunova',
    role: 'Infeksionist',
    availableFrom: '09:00',
    availableTo: '17:00',
    schedule: [
      { type: 'surgery', startHour: 11, startMin: 0, endHour: 13, endMin: 0, label: 'Jarrohlik' },
    ],
  },
]

export const DASHBOARD_ALERTS = [
  {
    id: 'da1',
    type: 'high' as const,
    title: 'Yuqori xavfli bemor',
    message: 'Bemor ID #1002 da xavf omillari yuqori. Hujjatlarni zudlik bilan ko\'rib chiqing.',
    time: '30 daqiqa oldin',
  },
  {
    id: 'da2',
    type: 'medium' as const,
    title: 'Xodimlar yetishmovchiligi',
    message: 'Bugungi seanslar uchun faqat 2 ta fizioterapevt mavjud.',
    time: '1 soat oldin',
  },
  {
    id: 'da3',
    type: 'low' as const,
    title: 'Jihoz nosozligi',
    message: 'B bo\'limidagi ultratovush qurilmasi ishlamayapti. Kechikish kutilmoqda.',
    time: '3 soat oldin',
  },
]

export const INSIGHTS_BAR_DATA = [
  { month: 'Fev', week: '1-h', value: 48 },
  { month: 'Fev', week: '2-h', value: 32 },
  { month: 'Fev', week: '3-h', value: 28 },
  { month: 'Fev', week: '4-h', value: 38 },
  { month: 'Mar', week: '1-h', value: 55 },
  { month: 'Mar', week: '2-h', value: 22 },
  { month: 'Mar', week: '3-h', value: 15 },
  { month: 'Mar', week: '4-h', value: 10 },
  { month: 'Apr', week: '1-h', value: 42 },
  { month: 'Apr', week: '2-h', value: 50 },
  { month: 'Apr', week: '3-h', value: 35 },
]

export const PROMS_DATA = [
  { week: 'Fev 1-h', satisfaction: 7.5, mobility: 6.0, pain: 2.0 },
  { week: 'Fev 2-h', satisfaction: 7.0, mobility: 5.5, pain: 2.5 },
  { week: 'Fev 3-h', satisfaction: 6.5, mobility: 5.0, pain: 3.0 },
  { week: 'Fev 4-h', satisfaction: 6.0, mobility: 4.8, pain: 3.5 },
  { week: 'Mar 1-h', satisfaction: 5.5, mobility: 5.0, pain: 4.0 },
  { week: 'Mar 2-h', satisfaction: 6.0, mobility: 5.0, pain: 4.0 },
  { week: 'Mar 3-h', satisfaction: 7.0, mobility: 6.0, pain: 3.5 },
  { week: 'Mar 4-h', satisfaction: 7.5, mobility: 6.5, pain: 3.0 },
  { week: 'Apr 1-h', satisfaction: 8.0, mobility: 7.0, pain: 2.5 },
  { week: 'Apr 2-h', satisfaction: 8.5, mobility: 7.5, pain: 2.0 },
  { week: 'Apr 3-h', satisfaction: 9.0, mobility: 8.0, pain: 1.5 },
]

export const DELAY_DATA = [
  { week: 'Fev 1-h', delay: 7 },
  { week: 'Fev 2-h', delay: 9 },
  { week: 'Fev 3-h', delay: 8 },
  { week: 'Fev 4-h', delay: 10 },
  { week: 'Mar 1-h', delay: 11 },
  { week: 'Mar 2-h', delay: 12 },
  { week: 'Mar 3-h', delay: 10 },
  { week: 'Mar 4-h', delay: 11 },
  { week: 'Apr 1-h', delay: 9 },
  { week: 'Apr 2-h', delay: 10 },
  { week: 'Apr 3-h', delay: 8 },
]

export const COMPLICATIONS_HEATMAP = {
  teams: ['A jamoa', 'B jamoa', 'C jamoa', 'D jamoa', 'E jamoa', 'F jamoa'],
  bodyParts: ['Qo\'l', 'Oyoq', 'To\'piq', 'Yelka', 'Tizza', 'Son'],
  values: [
    [0, 70, 0, 0, 80, 0],
    [0, 0, 50, 0, 0, 60],
    [30, 0, 40, 0, 0, 90],
    [0, 0, 0, 60, 0, 0],
    [85, 0, 75, 0, 80, 0],
    [0, 50, 0, 0, 0, 40],
  ],
}
