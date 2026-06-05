export const SPECIALIZATIONS = [
  'Ortopediya',
  'Kardiologiya',
  'Fizioterapiya',
  'Nevrologiya',
  'Bolalar reabilitatsiyasi',
  'Sport tibbiyoti',
  'Pulmonologik reabilitatsiya',
  'Geriatrik reabilitatsiya',
]

export const DIAGNOSES = [
  'ACL operatsiyadan keyin',
  'Tizza almashtirish (TKR)',
  'Son-chanoq artroskopiyasi',
  'Bel disk churrasi',
  'Rotator manjet yirtilishi',
  'Insult reabilitatsiyasi — II bosqich',
  'Axilles tendinopatiyasi',
  'Plantar fastsiit',
  'Servikal radikulopatiya',
  'Muzlagan yelka',
]

// ─── Clinic Doctors ───────────────────────────────────────────────────────────

export type DoctorStatus = 'confirmed' | 'pending' | 'rejected'

export interface ClinicDoctor {
  id: string
  name: string
  phone: string
  specialization: string
  status: DoctorStatus
  joinedAt: string
  patientCount: number
}

export const CLINIC_DOCTORS: ClinicDoctor[] = [
  { id: 'd1', name: 'Dr. Jasur Karimov',      phone: '+998 90 123-45-67', specialization: 'Ortopediya',    status: 'confirmed', joinedAt: '15.01.2024', patientCount: 12 },
  { id: 'd2', name: 'Dr. Nodira Yusupova',    phone: '+998 90 234-56-78', specialization: 'Fizioterapiya',  status: 'confirmed', joinedAt: '20.02.2024', patientCount: 8  },
  { id: 'd3', name: 'Dr. Sarvar Toshmatov',   phone: '+998 90 345-67-89', specialization: 'Nevrologiya',      status: 'confirmed', joinedAt: '10.03.2024', patientCount: 5  },
  { id: 'd4', name: 'Dr. Dilnoza Rahimova',   phone: '+998 90 456-78-90', specialization: 'Kardiologiya',     status: 'confirmed', joinedAt: '05.04.2024', patientCount: 9  },
  { id: 'd5', name: 'Dr. Mirzo Ismoilov',     phone: '+998 90 567-89-01', specialization: 'Sport tibbiyoti', status: 'pending',  joinedAt: '18.05.2024', patientCount: 0  },
  { id: 'd6', name: 'Dr. Shahlo Nazarova',    phone: '+998 90 678-90-12', specialization: 'Bolalar reabilitatsiyasi', status: 'pending',  joinedAt: '20.05.2024', patientCount: 0  },
  { id: 'd7', name: 'Dr. Bobur Xolmatov',     phone: '+998 90 789-01-23', specialization: 'Pulmonologik reabilitatsiya', status: 'confirmed', joinedAt: '01.06.2024', patientCount: 3  },
  { id: 'd8', name: 'Dr. Zulfiya Abdullayeva',phone: '+998 90 890-12-34', specialization: 'Geriatrik reabilitatsiya', status: 'confirmed', joinedAt: '15.06.2024', patientCount: 6  },
]

// ─── Clinic Patients ──────────────────────────────────────────────────────────

export type ClinicPatientStatus = 'active' | 'unassigned' | 'no_plan'

export interface ClinicPatient {
  id: string
  name: string
  phone: string
  diagnosis: string
  status: ClinicPatientStatus
  doctorId?: string
  doctorName?: string
  registeredAt: string
}

export const CLINIC_PATIENTS: ClinicPatient[] = [
  { id: 'cp1',  name: 'Murod Aliyev',       phone: '+998 90 111-22-33', diagnosis: 'ACL operatsiyadan keyin',             status: 'active',      doctorId: 'd1', doctorName: 'Dr. Jasur Karimov',       registeredAt: '10.03.2024' },
  { id: 'cp2',  name: 'Zilola Hasanova',     phone: '+998 90 222-33-44', diagnosis: 'Tizza almashtirish (TKR)', status: 'active',      doctorId: 'd2', doctorName: 'Dr. Nodira Yusupova',     registeredAt: '15.03.2024' },
  { id: 'cp3',  name: 'Anvar Rashidov',      phone: '+998 90 333-44-55', diagnosis: 'Insult reabilitatsiyasi — II bosqich',status: 'active',      doctorId: 'd3', doctorName: 'Dr. Sarvar Toshmatov',    registeredAt: '20.03.2024' },
  { id: 'cp4',  name: "Feruza Yo'ldosheva",  phone: '+998 90 444-55-66', diagnosis: 'Rotator manjet yirtilishi',      status: 'active',      doctorId: 'd4', doctorName: 'Dr. Dilnoza Rahimova',    registeredAt: '01.04.2024' },
  { id: 'cp5',  name: 'Eldor Mirzayev',      phone: '+998 90 555-66-77', diagnosis: 'Son-chanoq artroskopiyasi',        status: 'active',      doctorId: 'd7', doctorName: 'Dr. Bobur Xolmatov',      registeredAt: '10.04.2024' },
  { id: 'cp6',  name: 'Mohira Tursunova',    phone: '+998 90 666-77-88', diagnosis: 'Bel disk churrasi', status: 'unassigned',                                                          registeredAt: '15.04.2024' },
  { id: 'cp7',  name: 'Sherzod Nazarov',     phone: '+998 90 777-88-99', diagnosis: 'Servikal radikulopatiya', status: 'unassigned',                                                          registeredAt: '20.04.2024' },
  { id: 'cp8',  name: 'Sarvinoz Ibragimova', phone: '+998 90 888-99-00', diagnosis: 'Axilles tendinopatiyasi',  status: 'unassigned',                                                          registeredAt: '25.04.2024' },
  { id: 'cp9',  name: 'Otabek Qodirov',      phone: '+998 90 999-00-11', diagnosis: 'Plantar fastsiit',      status: 'unassigned',                                                          registeredAt: '01.05.2024' },
  { id: 'cp10', name: 'Barno Xasanova',      phone: '+998 90 000-11-22', diagnosis: 'Muzlagan yelka',        status: 'no_plan',     doctorId: 'd8', doctorName: 'Dr. Zulfiya Abdullayeva', registeredAt: '05.05.2024' },
  { id: 'cp11', name: 'Javlon Turobov',      phone: '+998 90 112-23-34', diagnosis: 'Son-chanoq artroskopiyasi',        status: 'no_plan',     doctorId: 'd1', doctorName: 'Dr. Jasur Karimov',       registeredAt: '10.05.2024' },
  { id: 'cp12', name: "Gulnora Xo'jayeva",   phone: '+998 90 223-34-45', diagnosis: 'ACL operatsiyadan keyin',            status: 'no_plan',     doctorId: 'd2', doctorName: 'Dr. Nodira Yusupova',     registeredAt: '15.05.2024' },
]

// ─── Membership Requests ──────────────────────────────────────────────────────

export type MembershipStatus = 'pending' | 'approved' | 'rejected' | 'expired'

export interface MembershipRequest {
  id: string
  direction: 'incoming' | 'outgoing'
  doctorName: string
  doctorPhone: string
  specialization: string
  status: MembershipStatus
  requestedAt: string
  expiresAt?: string
}

export const MEMBERSHIP_REQUESTS: MembershipRequest[] = [
  { id: 'mr1', direction: 'incoming', doctorName: 'Dr. Kamola Razzaqova',   doctorPhone: '+998 90 321-54-76', specialization: 'Nevrologiya',      status: 'pending',  requestedAt: '28.05.2024' },
  { id: 'mr2', direction: 'incoming', doctorName: 'Dr. Ulmas Ergashev',     doctorPhone: '+998 90 432-65-87', specialization: 'Fizioterapiya',  status: 'pending',  requestedAt: '30.05.2024' },
  { id: 'mr3', direction: 'incoming', doctorName: 'Dr. Nozima Baxtiyorova', doctorPhone: '+998 90 543-76-98', specialization: 'Sport tibbiyoti',status: 'pending',  requestedAt: '01.06.2024' },
  { id: 'mr4', direction: 'incoming', doctorName: 'Dr. Akmal Tursunov',     doctorPhone: '+998 90 654-87-09', specialization: 'Ortopediya',    status: 'approved', requestedAt: '15.05.2024' },
  { id: 'mr5', direction: 'incoming', doctorName: 'Dr. Manzura Sobirova',   doctorPhone: '+998 90 765-98-20', specialization: 'Kardiologiya',     status: 'rejected', requestedAt: '10.05.2024' },
  { id: 'mr6', direction: 'outgoing', doctorName: 'Dr. Mirzo Ismoilov',     doctorPhone: '+998 90 567-89-01', specialization: 'Sport tibbiyoti',status: 'pending',  requestedAt: '18.05.2024', expiresAt: '20.05.2024' },
  { id: 'mr7', direction: 'outgoing', doctorName: 'Dr. Shahlo Nazarova',    doctorPhone: '+998 90 678-90-12', specialization: 'Bolalar reabilitatsiyasi',status: 'pending',  requestedAt: '20.05.2024', expiresAt: '22.05.2024' },
  { id: 'mr8', direction: 'outgoing', doctorName: 'Dr. Ravshan Qosimov',    doctorPhone: '+998 90 876-54-32', specialization: 'Geriatrik reabilitatsiya',status: 'approved', requestedAt: '01.05.2024', expiresAt: '03.05.2024' },
  { id: 'mr9', direction: 'outgoing', doctorName: 'Dr. Dilshod Yusupov',    doctorPhone: '+998 90 765-43-21', specialization: 'Pulmonologik reabilitatsiya',status: 'expired',  requestedAt: '15.04.2024', expiresAt: '17.04.2024' },
]

// ─── Aggregate Stats ──────────────────────────────────────────────────────────

export const CLINIC_STATS = {
  totalPatients:   CLINIC_PATIENTS.length,
  activePlans:     CLINIC_PATIENTS.filter(p => p.status === 'active').length,
  totalDoctors:    CLINIC_DOCTORS.length,
  unassigned:      CLINIC_PATIENTS.filter(p => p.status === 'unassigned').length,
  pendingRequests: MEMBERSHIP_REQUESTS.filter(r => r.status === 'pending').length,
  draftPlans:      CLINIC_PATIENTS.filter(p => p.status === 'no_plan').length,
}
