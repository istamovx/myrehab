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
    name: 'Emma Johnson',
    gender: 'Female',
    dateOfBirth: '1990-03-15',
    location: 'Tashkent, Uzbekistan',
    procedure: 'Hip replacement',
    procedureCode: 'OPS 5-820.00',
    status: 'Ready',
    procedureDate: '2025-04-28',
    surgeryDate: '2025-04-28',
    attendingPhysician: 'Dr. Michael Adams',
    physioTherapist: 'Dr. Wade Warren',
    tags: ['#ASA II', '#ICU needed', '#High Risk'],
    language: 'Native uzbek speaker',
    allergies: ['Latex', 'Penicillin'],
    preExistingConditions: ['Diabetes Typ II', 'Hypertonie'],
    medications: ['Apixaban', 'Metformin'],
    dnr: true,
    asaClassification: 'ASA III',
    asaUploadDate: '21.03.2025',
    icuNeed: 'Required',
    icuStatus: 'Confirmation pending',
    lastLabDate: 'Hb/INR',
    lastLabUpdated: '12.01.2025',
    alerts: [
      { id: 'a1', type: 'high', message: 'Blood thinner - Apixaban: Pause confirmed 12.05.2025' },
      { id: 'a2', type: 'high', message: 'DNR - Yes' },
      { id: 'a3', type: 'low', message: 'Lab tests - Update Hb/INR' },
    ],
    documents: [
      {
        group: 'Consent & Legal',
        expanded: true,
        files: [
          { id: 'd1', name: 'Consent form.txt', type: 'txt' },
          { id: 'd2', name: 'Risk certification.pdf', type: 'pdf' },
          { id: 'd3', name: 'DNRForm.txt', type: 'txt' },
        ],
      },
      {
        group: 'Diagnostics',
        expanded: true,
        files: [
          { id: 'd4', name: 'Labs12.05.pdf', type: 'pdf' },
          { id: 'd5', name: 'X-rayPelvis.txt', type: 'txt' },
        ],
      },
      {
        group: 'Medication & Risk',
        expanded: false,
        files: [],
      },
    ],
    checklist: [
      { id: 'c1', name: 'Case planning', totalTasks: 8, completedTasks: 8, status: 'done' },
      { id: 'c2', name: 'Diagnostics & Risk review', totalTasks: 5, completedTasks: 5, status: 'done' },
      { id: 'c3', name: 'Consent', totalTasks: 5, completedTasks: 5, status: 'done' },
      { id: 'c4', name: 'Anesthesia clearance', totalTasks: 7, completedTasks: 7, status: 'done' },
      { id: 'c5', name: 'Final surgical clearance', totalTasks: 7, completedTasks: 1, status: 'in-progress' },
    ],
  },
  {
    id: '1002',
    name: 'Jacob Miller',
    gender: 'Male',
    dateOfBirth: '1985-07-22',
    location: 'Samarkand, Uzbekistan',
    procedure: 'Knee Rehabilitation',
    status: 'At-Risk',
    procedureDate: '2025-05-01',
    attendingPhysician: 'Dr. Laura Parker',
    tags: ['#ASA IV', '#High Risk', '#ICU required'],
    language: 'Russian speaker',
    allergies: ['NSAIDs'],
    preExistingConditions: ['Hypertonie', 'Obesity'],
    medications: ['Warfarin', 'Lisinopril'],
    dnr: false,
    asaClassification: 'ASA IV',
    icuNeed: 'Required',
  },
  {
    id: '1003',
    name: 'Olivia Davis',
    gender: 'Female',
    dateOfBirth: '1995-11-08',
    location: 'Bukhara, Uzbekistan',
    procedure: 'Shoulder Rehabilitation',
    status: 'In Progress',
    procedureDate: '2025-05-08',
    attendingPhysician: 'Dr. Daniel Wilson',
    tags: ['#ASA I'],
    language: 'Uzbek speaker',
    allergies: [],
    preExistingConditions: [],
    medications: ['Ibuprofen'],
    dnr: false,
    asaClassification: 'ASA I',
    icuNeed: 'Not required',
  },
  {
    id: '1004',
    name: 'Ethan Moore',
    gender: 'Male',
    dateOfBirth: '1978-04-30',
    location: 'Namangan, Uzbekistan',
    procedure: 'Spinal Rehabilitation',
    status: 'At-Risk',
    procedureDate: '2025-05-09',
    attendingPhysician: 'Dr. Jennifer Lewis',
    tags: ['#ASA II', '#ICU needed'],
    language: 'Russian speaker',
    allergies: ['Morphine'],
    preExistingConditions: ['Chronic back pain', 'Hypertension'],
    medications: ['Gabapentin', 'Amlodipine'],
    dnr: false,
    asaClassification: 'ASA II',
    icuNeed: 'Required',
  },
  {
    id: '1005',
    name: 'Sofia Martinez',
    gender: 'Female',
    dateOfBirth: '2000-01-17',
    location: 'Fergana, Uzbekistan',
    procedure: 'ACL Recovery Program',
    status: 'Ready',
    procedureDate: '2025-05-15',
    attendingPhysician: 'Dr. Michael Adams',
    tags: ['#ASA I'],
    asaClassification: 'ASA I',
    icuNeed: 'Not required',
  },
  {
    id: '1006',
    name: 'Lucas Brown',
    gender: 'Male',
    dateOfBirth: '1965-09-03',
    location: 'Andijan, Uzbekistan',
    procedure: 'Post-stroke Rehabilitation',
    status: 'Awaiting clearance',
    procedureDate: '2025-05-20',
    attendingPhysician: 'Dr. Laura Parker',
    tags: ['#ASA III', '#High Risk', '#ICU needed'],
    asaClassification: 'ASA III',
    icuNeed: 'Required',
  },
  {
    id: '1007',
    name: 'Mia Thompson',
    gender: 'Female',
    dateOfBirth: '1992-06-25',
    location: 'Tashkent, Uzbekistan',
    procedure: 'Ankle Ligament Recovery',
    status: 'Done',
    procedureDate: '2025-04-10',
    attendingPhysician: 'Dr. Daniel Wilson',
    tags: ['#ASA I'],
    asaClassification: 'ASA I',
    icuNeed: 'Not required',
  },
  {
    id: '1008',
    name: 'Noah Garcia',
    gender: 'Male',
    dateOfBirth: '1988-12-11',
    location: 'Tashkent, Uzbekistan',
    procedure: 'Elbow Tendon Repair',
    status: 'In Progress',
    procedureDate: '2025-05-12',
    attendingPhysician: 'Dr. Jennifer Lewis',
    tags: ['#ASA II'],
    asaClassification: 'ASA II',
    icuNeed: 'Not required',
  },
]

export const DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Leslie Alexander',
    role: 'Orthopedic surgeon',
    availableFrom: '09AM',
    availableTo: '19PM',
    schedule: [
      { type: 'surgery', startHour: 9, startMin: 0, endHour: 11, endMin: 30, label: 'Surgery' },
      { type: 'break', startHour: 11, startMin: 30, endHour: 12, endMin: 0, label: 'Br.' },
      { type: 'consent-talk', startHour: 12, startMin: 0, endHour: 13, endMin: 30, label: 'Consent talk' },
      { type: 'ward-round', startHour: 13, startMin: 30, endHour: 15, endMin: 0, label: 'Ward round' },
    ],
  },
  {
    id: 'd2',
    name: 'Dr. Jane Cooper',
    role: 'Physical therapist',
    availableFrom: '08AM',
    availableTo: '18PM',
    schedule: [
      { type: 'consent-talk', startHour: 8, startMin: 0, endHour: 9, endMin: 0, label: 'Consent talk' },
      { type: 'ward-round', startHour: 9, startMin: 0, endHour: 10, endMin: 30, label: 'Ward round' },
      { type: 'break', startHour: 10, startMin: 30, endHour: 11, endMin: 0, label: 'Br.' },
      { type: 'surgery', startHour: 11, startMin: 0, endHour: 12, endMin: 30, label: 'Session' },
      { type: 'consent-talk', startHour: 13, startMin: 0, endHour: 14, endMin: 30, label: 'Consent talk' },
    ],
  },
  {
    id: 'd3',
    name: 'Dr. Wade Warren',
    role: 'Physiotherapist',
    availableFrom: '09AM',
    availableTo: '19PM',
    schedule: [
      { type: 'ward-round', startHour: 8, startMin: 30, endHour: 10, endMin: 0, label: 'Ward round' },
      { type: 'break', startHour: 10, startMin: 0, endHour: 10, endMin: 30, label: 'Br.' },
      { type: 'consent-talk', startHour: 12, startMin: 0, endHour: 13, endMin: 30, label: 'Consent talk' },
    ],
  },
  {
    id: 'd4',
    name: 'Dr. Esther Howard',
    role: 'Orthopedic specialist',
    availableFrom: '08AM',
    availableTo: '17PM',
    schedule: [
      { type: 'surgery', startHour: 9, startMin: 0, endHour: 12, endMin: 0, label: 'Surgery' },
      { type: 'break', startHour: 12, startMin: 0, endHour: 12, endMin: 30, label: 'Br.' },
      { type: 'ward-round', startHour: 13, startMin: 0, endHour: 14, endMin: 0, label: 'Ward r.' },
    ],
  },
  {
    id: 'd5',
    name: 'Dr. Cameron Williamson',
    role: 'Radiologist',
    availableFrom: '09AM',
    availableTo: '18PM',
    schedule: [
      { type: 'consent-talk', startHour: 11, startMin: 0, endHour: 12, endMin: 30, label: 'Consent talk' },
      { type: 'surgery', startHour: 13, startMin: 0, endHour: 15, endMin: 0, label: 'Surgery' },
    ],
  },
  {
    id: 'd6',
    name: 'Dr. Jenny Wilson',
    role: 'Infectious disease',
    availableFrom: '09AM',
    availableTo: '17PM',
    schedule: [
      { type: 'surgery', startHour: 11, startMin: 0, endHour: 13, endMin: 0, label: 'Surgery' },
    ],
  },
]

export const DASHBOARD_ALERTS = [
  {
    id: 'da1',
    type: 'high' as const,
    title: 'High-Risk Patient',
    message: 'Patient ID #1002 has elevated risk factors. Review documentation immediately.',
    time: '30 min ago',
  },
  {
    id: 'da2',
    type: 'medium' as const,
    title: 'Staffing shortage',
    message: 'Only 2 available physiotherapists for today\'s sessions.',
    time: '1 h ago',
  },
  {
    id: 'da3',
    type: 'low' as const,
    title: 'Equipment issue',
    message: 'Ultrasound device in Dept B is out of service. Delay expected.',
    time: '3 h ago',
  },
]

export const INSIGHTS_BAR_DATA = [
  { month: 'Feb', week: 'W1', value: 48 },
  { month: 'Feb', week: 'W2', value: 32 },
  { month: 'Feb', week: 'W3', value: 28 },
  { month: 'Feb', week: 'W4', value: 38 },
  { month: 'Mar', week: 'W1', value: 55 },
  { month: 'Mar', week: 'W2', value: 22 },
  { month: 'Mar', week: 'W3', value: 15 },
  { month: 'Mar', week: 'W4', value: 10 },
  { month: 'Apr', week: 'W1', value: 42 },
  { month: 'Apr', week: 'W2', value: 50 },
  { month: 'Apr', week: 'W3', value: 35 },
]

export const PROMS_DATA = [
  { week: 'Feb W1', satisfaction: 7.5, mobility: 6.0, pain: 2.0 },
  { week: 'Feb W2', satisfaction: 7.0, mobility: 5.5, pain: 2.5 },
  { week: 'Feb W3', satisfaction: 6.5, mobility: 5.0, pain: 3.0 },
  { week: 'Feb W4', satisfaction: 6.0, mobility: 4.8, pain: 3.5 },
  { week: 'Mar W1', satisfaction: 5.5, mobility: 5.0, pain: 4.0 },
  { week: 'Mar W2', satisfaction: 6.0, mobility: 5.0, pain: 4.0 },
  { week: 'Mar W3', satisfaction: 7.0, mobility: 6.0, pain: 3.5 },
  { week: 'Mar W4', satisfaction: 7.5, mobility: 6.5, pain: 3.0 },
  { week: 'Apr W1', satisfaction: 8.0, mobility: 7.0, pain: 2.5 },
  { week: 'Apr W2', satisfaction: 8.5, mobility: 7.5, pain: 2.0 },
  { week: 'Apr W3', satisfaction: 9.0, mobility: 8.0, pain: 1.5 },
]

export const DELAY_DATA = [
  { week: 'Feb W1', delay: 7 },
  { week: 'Feb W2', delay: 9 },
  { week: 'Feb W3', delay: 8 },
  { week: 'Feb W4', delay: 10 },
  { week: 'Mar W1', delay: 11 },
  { week: 'Mar W2', delay: 12 },
  { week: 'Mar W3', delay: 10 },
  { week: 'Mar W4', delay: 11 },
  { week: 'Apr W1', delay: 9 },
  { week: 'Apr W2', delay: 10 },
  { week: 'Apr W3', delay: 8 },
]

export const COMPLICATIONS_HEATMAP = {
  teams: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E', 'Team F'],
  bodyParts: ['Hand', 'Foot', 'Ankle', 'Shoulder', 'Knee', 'Hip'],
  values: [
    [0, 70, 0, 0, 80, 0],
    [0, 0, 50, 0, 0, 60],
    [30, 0, 40, 0, 0, 90],
    [0, 0, 0, 60, 0, 0],
    [85, 0, 75, 0, 80, 0],
    [0, 50, 0, 0, 0, 40],
  ],
}
