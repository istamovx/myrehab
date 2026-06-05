export type OrgType = 'org' | 'private_clinic'
export type PlanType = 'contract' | 'subscription'
export type OrgStatus = 'active' | 'pending' | 'suspended'
export type UserRole = 'admin' | 'doctor' | 'patient'
export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'failed'
export type PaymentMethod = 'bank_transfer' | 'card'

export interface Organization {
  id: number
  name: string
  type: OrgType
  plan: PlanType
  plan_name: string
  status: OrgStatus
  doctors_count: number
  patients_count: number
  monthly_fee: number
  contract_start: string
  contract_end: string
  logo_initial: string
  logo_color: string
  city: string
  contact_person: string
  contact_email: string
  contact_phone: string
  created_at: string
}

export interface OrgUser {
  id: number
  org_id: number
  org_name: string
  name: string
  role: UserRole
  email: string
  initial: string
  color: string
  last_active: string
}

export interface Payment {
  id: number
  org_id: number
  org_name: string
  amount: number
  status: PaymentStatus
  date: string
  period: string
  method: PaymentMethod
  invoice_number: string
}

export const PLATFORM_STATS = {
  total_orgs: 24,
  active_orgs: 19,
  pending_orgs: 3,
  suspended_orgs: 2,
  total_users: 1247,
  total_patients: 894,
  total_doctors: 312,
  mrr: 48_500_000,
  arr: 582_000_000,
  churn_rate: 2.1,
  growth_rate: 8.4,
}

export const MONTHLY_REVENUE = [
  { month: 'Yan', revenue: 32_000_000 },
  { month: 'Fev', revenue: 35_500_000 },
  { month: 'Mar', revenue: 38_000_000 },
  { month: 'Apr', revenue: 41_500_000 },
  { month: 'May', revenue: 44_000_000 },
  { month: 'Iyn', revenue: 48_500_000 },
]

export const ORGANIZATIONS: Organization[] = [
  {
    id: 1, name: 'MyRehab Medical Center', type: 'org',
    plan: 'contract', plan_name: 'Enterprise', status: 'active',
    doctors_count: 28, patients_count: 142, monthly_fee: 4_500_000,
    contract_start: '2024-01-01', contract_end: '2025-12-31',
    logo_initial: 'MM', logo_color: 'from-blue-500 to-blue-700',
    city: 'Toshkent', contact_person: 'Akbar Rahimov',
    contact_email: 'akbar@myrehab.uz', contact_phone: '+998901234567',
    created_at: '2024-01-01',
  },
  {
    id: 2, name: 'Darmon Med Klinikasi', type: 'private_clinic',
    plan: 'subscription', plan_name: 'Pro', status: 'active',
    doctors_count: 12, patients_count: 67, monthly_fee: 2_200_000,
    contract_start: '2024-03-15', contract_end: '2025-03-14',
    logo_initial: 'DM', logo_color: 'from-teal-500 to-teal-700',
    city: 'Samarqand', contact_person: 'Dilnoza Yusupova',
    contact_email: 'info@darmonmed.uz', contact_phone: '+998931234567',
    created_at: '2024-03-15',
  },
  {
    id: 3, name: 'Salomatlik Markazı', type: 'org',
    plan: 'subscription', plan_name: 'Standard', status: 'active',
    doctors_count: 8, patients_count: 45, monthly_fee: 1_500_000,
    contract_start: '2024-06-01', contract_end: '2025-05-31',
    logo_initial: 'SM', logo_color: 'from-purple-500 to-purple-700',
    city: 'Namangan', contact_person: 'Jasur Toshmatov',
    contact_email: 'jasur@salomatlik.uz', contact_phone: '+998941234567',
    created_at: '2024-06-01',
  },
  {
    id: 4, name: 'Shifo Plus', type: 'private_clinic',
    plan: 'subscription', plan_name: 'Pro', status: 'pending',
    doctors_count: 5, patients_count: 0, monthly_fee: 2_200_000,
    contract_start: '2025-06-01', contract_end: '2026-05-31',
    logo_initial: 'SP', logo_color: 'from-orange-500 to-orange-700',
    city: 'Buxoro', contact_person: 'Malika Sobirova',
    contact_email: 'info@shifoplas.uz', contact_phone: '+998951234567',
    created_at: '2025-06-01',
  },
  {
    id: 5, name: 'Toshkent Ortopediya Klinikasi', type: 'private_clinic',
    plan: 'contract', plan_name: 'Enterprise', status: 'active',
    doctors_count: 22, patients_count: 98, monthly_fee: 3_800_000,
    contract_start: '2023-09-01', contract_end: '2025-08-31',
    logo_initial: 'TO', logo_color: 'from-indigo-500 to-indigo-700',
    city: 'Toshkent', contact_person: 'Baxtiyor Ergashev',
    contact_email: 'info@tashortho.uz', contact_phone: '+998961234567',
    created_at: '2023-09-01',
  },
  {
    id: 6, name: 'Hayot Klinikasi', type: 'private_clinic',
    plan: 'subscription', plan_name: 'Starter', status: 'suspended',
    doctors_count: 3, patients_count: 12, monthly_fee: 900_000,
    contract_start: '2024-02-01', contract_end: '2025-01-31',
    logo_initial: 'HK', logo_color: 'from-red-500 to-red-700',
    city: 'Andijon', contact_person: 'Nodira Karimova',
    contact_email: 'info@hayot.uz', contact_phone: '+998971234567',
    created_at: '2024-02-01',
  },
  {
    id: 7, name: 'Rehabilitatsiya Markazi', type: 'org',
    plan: 'contract', plan_name: 'Professional', status: 'active',
    doctors_count: 15, patients_count: 76, monthly_fee: 3_200_000,
    contract_start: '2024-05-01', contract_end: '2026-04-30',
    logo_initial: 'RM', logo_color: 'from-cyan-500 to-cyan-700',
    city: 'Toshkent', contact_person: 'Sherzod Xolmatov',
    contact_email: 'info@rehab.uz', contact_phone: '+998981234567',
    created_at: '2024-05-01',
  },
  {
    id: 8, name: 'Yangi Shifoxona', type: 'private_clinic',
    plan: 'subscription', plan_name: 'Starter', status: 'pending',
    doctors_count: 2, patients_count: 0, monthly_fee: 900_000,
    contract_start: '2025-06-05', contract_end: '2026-06-04',
    logo_initial: 'YS', logo_color: 'from-emerald-500 to-emerald-700',
    city: "Farg'ona", contact_person: 'Umida Nazarova',
    contact_email: 'info@yangi.uz', contact_phone: '+998991234567',
    created_at: '2025-06-05',
  },
]

export const ORG_USERS: OrgUser[] = [
  { id: 1,  org_id: 1, org_name: 'MyRehab Medical Center',       name: 'Akbar Rahimov',      role: 'admin',   email: 'akbar@myrehab.uz',     initial: 'AR', color: 'from-blue-400 to-blue-600',     last_active: 'Hozir' },
  { id: 2,  org_id: 1, org_name: 'MyRehab Medical Center',       name: 'Dr. Muhrim Devonov', role: 'doctor',  email: 'muhrim@myrehab.uz',    initial: 'MD', color: 'from-teal-400 to-teal-600',     last_active: '5 daqiqa oldin' },
  { id: 3,  org_id: 1, org_name: 'MyRehab Medical Center',       name: 'Murod Aliyev',        role: 'patient', email: 'murod@gmail.com',      initial: 'MA', color: 'from-green-400 to-green-600',   last_active: '2 soat oldin' },
  { id: 4,  org_id: 1, org_name: 'MyRehab Medical Center',       name: 'Dr. Feruza Nazarova', role: 'doctor',  email: 'feruza@myrehab.uz',    initial: 'FN', color: 'from-rose-400 to-rose-600',     last_active: '1 soat oldin' },
  { id: 5,  org_id: 2, org_name: 'Darmon Med Klinikasi',         name: 'Dilnoza Yusupova',    role: 'admin',   email: 'dilnoza@darmonmed.uz', initial: 'DY', color: 'from-purple-400 to-purple-600', last_active: '1 soat oldin' },
  { id: 6,  org_id: 2, org_name: 'Darmon Med Klinikasi',         name: 'Dr. Aziz Karimov',   role: 'doctor',  email: 'aziz@darmonmed.uz',    initial: 'AK', color: 'from-orange-400 to-orange-600', last_active: '30 daqiqa oldin' },
  { id: 7,  org_id: 2, org_name: 'Darmon Med Klinikasi',         name: 'Sarvinoz Tosheva',   role: 'patient', email: 'sarvinoz@gmail.com',   initial: 'ST', color: 'from-pink-400 to-pink-600',     last_active: '1 kun oldin' },
  { id: 8,  org_id: 3, org_name: 'Salomatlik Markazı',           name: 'Jasur Toshmatov',    role: 'admin',   email: 'jasur@salomatlik.uz',  initial: 'JT', color: 'from-indigo-400 to-indigo-600', last_active: '3 soat oldin' },
  { id: 9,  org_id: 5, org_name: 'Toshkent Ortopediya Klinikasi', name: 'Baxtiyor Ergashev', role: 'admin',   email: 'baxtiyor@tashortho.uz', initial: 'BE', color: 'from-cyan-400 to-cyan-600',    last_active: '15 daqiqa oldin' },
  { id: 10, org_id: 5, org_name: 'Toshkent Ortopediya Klinikasi', name: 'Dr. Kamola Mirzaeva', role: 'doctor', email: 'kamola@tashortho.uz', initial: 'KM', color: 'from-rose-400 to-rose-600',     last_active: '2 soat oldin' },
  { id: 11, org_id: 7, org_name: 'Rehabilitatsiya Markazi',      name: 'Sherzod Xolmatov',   role: 'admin',   email: 'sherzod@rehab.uz',     initial: 'SX', color: 'from-amber-400 to-amber-600',   last_active: '45 daqiqa oldin' },
  { id: 12, org_id: 7, org_name: 'Rehabilitatsiya Markazi',      name: 'Dr. Bobur Umarov',   role: 'doctor',  email: 'bobur@rehab.uz',       initial: 'BU', color: 'from-lime-400 to-lime-600',     last_active: '20 daqiqa oldin' },
]

export const PAYMENTS: Payment[] = [
  { id: 1,  org_id: 1, org_name: 'MyRehab Medical Center',        amount: 4_500_000, status: 'paid',    date: '2025-06-01', period: 'Iyun 2025', method: 'bank_transfer', invoice_number: 'INV-2025-0601' },
  { id: 2,  org_id: 2, org_name: 'Darmon Med Klinikasi',          amount: 2_200_000, status: 'paid',    date: '2025-06-01', period: 'Iyun 2025', method: 'card',          invoice_number: 'INV-2025-0602' },
  { id: 3,  org_id: 3, org_name: 'Salomatlik Markazı',            amount: 1_500_000, status: 'pending', date: '2025-06-01', period: 'Iyun 2025', method: 'bank_transfer', invoice_number: 'INV-2025-0603' },
  { id: 4,  org_id: 5, org_name: 'Toshkent Ortopediya Klinikasi', amount: 3_800_000, status: 'paid',    date: '2025-06-01', period: 'Iyun 2025', method: 'bank_transfer', invoice_number: 'INV-2025-0604' },
  { id: 5,  org_id: 7, org_name: 'Rehabilitatsiya Markazi',       amount: 3_200_000, status: 'paid',    date: '2025-06-01', period: 'Iyun 2025', method: 'card',          invoice_number: 'INV-2025-0605' },
  { id: 6,  org_id: 6, org_name: 'Hayot Klinikasi',               amount: 900_000,   status: 'overdue', date: '2025-05-01', period: 'May 2025',  method: 'bank_transfer', invoice_number: 'INV-2025-0506' },
  { id: 7,  org_id: 1, org_name: 'MyRehab Medical Center',        amount: 4_500_000, status: 'paid',    date: '2025-05-01', period: 'May 2025',  method: 'bank_transfer', invoice_number: 'INV-2025-0501' },
  { id: 8,  org_id: 2, org_name: 'Darmon Med Klinikasi',          amount: 2_200_000, status: 'paid',    date: '2025-05-01', period: 'May 2025',  method: 'card',          invoice_number: 'INV-2025-0502' },
  { id: 9,  org_id: 3, org_name: 'Salomatlik Markazı',            amount: 1_500_000, status: 'paid',    date: '2025-05-01', period: 'May 2025',  method: 'bank_transfer', invoice_number: 'INV-2025-0503' },
  { id: 10, org_id: 5, org_name: 'Toshkent Ortopediya Klinikasi', amount: 3_800_000, status: 'paid',    date: '2025-05-01', period: 'May 2025',  method: 'bank_transfer', invoice_number: 'INV-2025-0504' },
  { id: 11, org_id: 7, org_name: 'Rehabilitatsiya Markazi',       amount: 3_200_000, status: 'paid',    date: '2025-05-01', period: 'May 2025',  method: 'card',          invoice_number: 'INV-2025-0505' },
  { id: 12, org_id: 6, org_name: 'Hayot Klinikasi',               amount: 900_000,   status: 'failed',  date: '2025-04-01', period: 'Aprel 2025', method: 'bank_transfer', invoice_number: 'INV-2025-0406' },
]

export const PLAN_DISTRIBUTION = [
  { name: 'Enterprise', value: 2, color: '#2970FF' },
  { name: 'Professional', value: 1, color: '#6366f1' },
  { name: 'Pro', value: 2, color: '#0d9488' },
  { name: 'Standard', value: 1, color: '#8b5cf6' },
  { name: 'Starter', value: 2, color: '#f59e0b' },
]
