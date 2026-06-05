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

export interface DoctorReview {
  id: string
  author: string
  date: string
  rating: number
  text: string
}

export interface ClinicDoctor {
  id: string
  name: string
  phone: string
  specialization: string
  specializations?: string[]
  status: DoctorStatus
  joinedAt: string
  patientCount: number
  // Extended profile fields
  category?: string
  experienceYears?: number
  rating?: number
  reviewCount?: number
  bio?: string
  instagram?: string
  telegram?: string
  consultationPrice?: number
  consultationPriceOld?: number
  reviews?: DoctorReview[]
}

export const CLINIC_DOCTORS: ClinicDoctor[] = [
  {
    id: 'd1',
    name: 'Dr. Jasur Karimov',
    phone: '+998 90 123-45-67',
    specialization: 'Ortopediya',
    specializations: ['Ortopediya', 'Sport tibbiyoti'],
    status: 'confirmed',
    joinedAt: '15.01.2024',
    patientCount: 12,
    category: 'Oliy toifali shifokor',
    experienceYears: 14,
    rating: 4.8,
    reviewCount: 27,
    bio: "O'n to'rt yillik tajribaga ega ortoped shifokor. Sport travmalari va tizza-son bo'g'imi operatsiyalarida ixtisoslashgan. Har bir bemorga individual yondashuv va to'liq tuzalishga qaratilgan reabilitatsiya rejasini tuzadi.",
    instagram: 'dr.jasur_karimov',
    telegram: 'dr_jasur',
    consultationPrice: 150000,
    consultationPriceOld: 200000,
    reviews: [
      { id: 'r1', author: 'Murod A.', date: '12.04.2025', rating: 5, text: "Juda professional shifokor. Tizzam operatsiyasidan keyin to'liq tuzalib ketdim. Rahmat!" },
      { id: 'r2', author: 'Zilola H.', date: '28.03.2025', rating: 5, text: 'Shifokor juda diqqatli va mehribon. Har bir savolimga aniq javob berdi.' },
      { id: 'r3', author: 'Anvar R.', date: '10.03.2025', rating: 4, text: "Yaxshi shifokor, lekin navbat birozgina uzoq bo'ldi." },
    ],
  },
  {
    id: 'd2',
    name: 'Dr. Nodira Yusupova',
    phone: '+998 90 234-56-78',
    specialization: 'Fizioterapiya',
    specializations: ['Fizioterapiya', 'Reabilitatsiya'],
    status: 'confirmed',
    joinedAt: '20.02.2024',
    patientCount: 8,
    category: 'Birinchi toifali shifokor',
    experienceYears: 9,
    rating: 4.9,
    reviewCount: 18,
    bio: "Fizioterapiya va reabilitatsiya sohasida 9 yillik tajriba. Insult va ortopedik operatsiyalardan keyingi tiklash jarayonlarida yuqori natijalar ko'rsatgan mutaxassis.",
    telegram: 'nodira_physio',
    consultationPrice: 120000,
    reviews: [
      { id: 'r1', author: 'Feruza Y.', date: '15.05.2025', rating: 5, text: "Insultdan keyin 3 oyda yura boshladim. Dr. Nodiraning sayi harakati bilan!" },
      { id: 'r2', author: 'Eldor M.', date: '02.05.2025', rating: 5, text: 'Juda tajribali va mehribon shifokor.' },
    ],
  },
  {
    id: 'd3',
    name: 'Dr. Sarvar Toshmatov',
    phone: '+998 90 345-67-89',
    specialization: 'Nevrologiya',
    specializations: ['Nevrologiya', 'Umurtqa po\'g\'onasi'],
    status: 'confirmed',
    joinedAt: '10.03.2024',
    patientCount: 5,
    category: 'Oliy toifali shifokor',
    experienceYears: 16,
    rating: 4.7,
    reviewCount: 12,
    bio: "Nevrologiya va umurtqa po'g'onasi kasalliklari bo'yicha mutaxassis. Bel osteoxondrozi, disk churrasi va servikal radikulopatiyalarni davolashda 16 yillik tajriba.",
    instagram: 'sarvar_neuro',
    consultationPrice: 180000,
    consultationPriceOld: 220000,
    reviews: [
      { id: 'r1', author: 'Sherzod N.', date: '20.04.2025', rating: 5, text: "Bel og'rig'im 2 yildan beri davom etardi. Dr. Sarvar 3 oyda to'liq davoladi." },
    ],
  },
  {
    id: 'd4',
    name: 'Dr. Dilnoza Rahimova',
    phone: '+998 90 456-78-90',
    specialization: 'Kardiologiya',
    specializations: ['Kardiologiya', 'Ichki kasalliklar'],
    status: 'confirmed',
    joinedAt: '05.04.2024',
    patientCount: 9,
    category: 'Birinchi toifali shifokor',
    experienceYears: 11,
    rating: 4.6,
    reviewCount: 21,
    bio: "Kardiologiya va ichki kasalliklar bo'yicha mutaxassis. Yurak-qon tomir tizimi kasalliklarini profilaktika va davolash, reabilitatsiya jarayonini boshqarishda katta tajribaga ega.",
    telegram: 'dilnoza_cardio',
    consultationPrice: 160000,
    reviews: [],
  },
  {
    id: 'd5',
    name: 'Dr. Mirzo Ismoilov',
    phone: '+998 90 567-89-01',
    specialization: 'Sport tibbiyoti',
    specializations: ['Sport tibbiyoti'],
    status: 'pending',
    joinedAt: '18.05.2024',
    patientCount: 0,
    experienceYears: 5,
    rating: 0,
    reviewCount: 0,
  },
  {
    id: 'd6',
    name: 'Dr. Shahlo Nazarova',
    phone: '+998 90 678-90-12',
    specialization: 'Bolalar reabilitatsiyasi',
    specializations: ['Bolalar reabilitatsiyasi', 'Pediatriya'],
    status: 'pending',
    joinedAt: '20.05.2024',
    patientCount: 0,
    experienceYears: 7,
    rating: 0,
    reviewCount: 0,
  },
  {
    id: 'd7',
    name: 'Dr. Bobur Xolmatov',
    phone: '+998 90 789-01-23',
    specialization: 'Pulmonologik reabilitatsiya',
    specializations: ['Pulmonologiya', 'Nafas yo\'li kasalliklari'],
    status: 'confirmed',
    joinedAt: '01.06.2024',
    patientCount: 3,
    category: 'Mutaxassis',
    experienceYears: 6,
    rating: 4.5,
    reviewCount: 8,
    bio: "Pulmonologiya va nafas yo'li kasalliklari bo'yicha mutaxassis. BOPT va astma reabilitatsiyasida tajribali.",
    consultationPrice: 130000,
    reviews: [],
  },
  {
    id: 'd8',
    name: 'Dr. Zulfiya Abdullayeva',
    phone: '+998 90 890-12-34',
    specialization: 'Geriatrik reabilitatsiya',
    specializations: ['Geriatrik reabilitatsiya', 'Gerontologiya'],
    status: 'confirmed',
    joinedAt: '15.06.2024',
    patientCount: 6,
    category: 'Oliy toifali shifokor',
    experienceYears: 18,
    rating: 4.9,
    reviewCount: 14,
    bio: "Keksa yoshdagi bemorlarni reabilitatsiya qilishda 18 yillik tajriba. Suyak-bo'g'im kasalliklari, muvozanat buzilishi va yiqilishlarning oldini olishda ixtisoslashgan.",
    instagram: 'dr.zulfiya_rehab',
    telegram: 'zulfiya_geriatric',
    consultationPrice: 140000,
    reviews: [
      { id: 'r1', author: 'Barno X.', date: '01.05.2025', rating: 5, text: "Onam 72 yoshda, Dr. Zulfiya yordamida yaxshi harakat qila boshladi." },
    ],
  },
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
