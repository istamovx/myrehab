import { create } from 'zustand'
import { MESSAGES, type Message, type MessageAttachment } from '@/data/patient-mock-data'
import { generateMeetLink } from '@/lib/meet'
import { formatUzDateTime } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Cross-role "connect" store
// ---------------------------------------------------------------------------
// A single shared state slice that links the doctor and patient roles in the
// demo (one patient ↔ one doctor). Persisted to localStorage and synced live
// across browser tabs, so an action on one role (e.g. doctor sends a message)
// is reflected on the other role's screen.
// ---------------------------------------------------------------------------

export type Party = 'doctor' | 'patient'
export type NotificationAudience = Party
export type NotificationType = 'message' | 'symptom' | 'medication' | 'appointment' | 'teleconsult'

export interface ConnectNotification {
  id: string
  audience: NotificationAudience   // who should see this notification
  type: NotificationType
  title: string
  body: string
  read: boolean
  created_at: string
  link?: string                    // route to open when clicked
}

// A medication the doctor assigns to the patient.
export interface ConnectMedication {
  id: string
  name: string
  dose: string
  schedule: string          // e.g. "08:00, 20:00"
  instructions?: string
  assigned_at: string
}

export type SymptomSeverity = 'mild' | 'moderate' | 'severe'

// A complaint/symptom the patient reports to the doctor.
export interface ConnectSymptom {
  id: string
  type: string
  severity: SymptomSeverity
  intensity: number
  location: string
  note: string
  reported_at: string
}

// A video consultation the doctor schedules with the patient.
export interface ConnectTeleconsult {
  id: string
  scheduledAt: string
  durationMin: number
  meetUrl: string
  reminderOffsets: number[]
  created_at: string
}

interface ConnectState {
  messages: Message[]
  notifications: ConnectNotification[]
  medications: ConnectMedication[]
  symptoms: ConnectSymptom[]
  teleconsults: ConnectTeleconsult[]
  telegramLinked: boolean
}

interface ConnectStore extends ConnectState {
  sendMessage: (from: Party, body: string, attachment?: MessageAttachment) => void
  markThreadRead: (reader: Party) => void
  assignMedication: (med: Omit<ConnectMedication, 'id' | 'assigned_at'>) => void
  reportSymptom: (symptom: Omit<ConnectSymptom, 'id' | 'reported_at'>) => void
  scheduleTeleconsult: (tc: Omit<ConnectTeleconsult, 'id' | 'created_at'>) => void
  setTelegramLinked: (linked: boolean) => void
  addNotification: (n: Omit<ConnectNotification, 'id' | 'read' | 'created_at'>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: (audience: NotificationAudience) => void
  clearNotifications: (audience: NotificationAudience) => void
}

const STORAGE_KEY = 'myrehab_connect'

function plusHours(h: number): string {
  const d = new Date()
  d.setHours(d.getHours() + h, 0, 0, 0)
  return d.toISOString()
}

// Two baseline upcoming video calls so the patient's teleconsult page isn't empty.
function seedTeleconsults(): ConnectTeleconsult[] {
  const now = new Date().toISOString()
  return [
    { id: 'tc-seed-1', scheduledAt: plusHours(2),  durationMin: 30, meetUrl: generateMeetLink(), reminderOffsets: [60, 10], created_at: now },
    { id: 'tc-seed-2', scheduledAt: plusHours(48), durationMin: 45, meetUrl: generateMeetLink(), reminderOffsets: [60, 10], created_at: now },
  ]
}

function seed(): ConnectState {
  return { messages: [...MESSAGES], notifications: [], medications: [], symptoms: [], teleconsults: seedTeleconsults(), telegramLinked: false }
}

function load(): ConnectState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ConnectState>
      return {
        messages: parsed.messages ?? seed().messages,
        notifications: parsed.notifications ?? [],
        medications: parsed.medications ?? [],
        symptoms: parsed.symptoms ?? [],
        teleconsults: parsed.teleconsults ?? seedTeleconsults(),
        telegramLinked: parsed.telegramLinked ?? false,
      }
    }
  } catch { /* ignore corrupt storage */ }
  // First run: persist the seed so both roles share the same baseline.
  const s = seed()
  persist(s)
  return s
}

function persist(state: ConnectState) {
  try {
    // Strip blob URLs from attachments — they don't survive page reload.
    const messages = state.messages.map(m =>
      m.attachment?.url.startsWith('blob:') ? { ...m, attachment: { ...m.attachment, url: '' } } : m
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      messages,
      notifications: state.notifications,
      medications: state.medications,
      symptoms: state.symptoms,
      teleconsults: state.teleconsults,
      telegramLinked: state.telegramLinked,
    }))
  } catch { /* ignore quota / serialization errors */ }
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

const truncate = (s: string, n = 80) => (s.length > n ? s.slice(0, n) + '…' : s)

export const useConnectStore = create<ConnectStore>((set, get) => ({
  ...load(),

  // -- Messaging --------------------------------------------------------------
  sendMessage: (from, body, attachment) => {
    const text = body.trim()
    if (!text && !attachment) return
    const now = new Date().toISOString()
    const msg: Message = { id: uid('msg'), sender_role: from, body: text, is_read: false, created_at: now, attachment }

    // Notify the *other* party of the new message.
    const audience: NotificationAudience = from === 'doctor' ? 'patient' : 'doctor'
    const notif: ConnectNotification = {
      id: uid('ntf'),
      audience,
      type: 'message',
      title: from === 'doctor' ? 'Shifokordan yangi xabar' : 'Bemordan yangi xabar',
      body: text ? truncate(text) : attachment?.kind === 'audio' ? '🎤 Ovozli xabar' : attachment?.kind === 'video' ? '🎬 Video xabar' : attachment?.kind === 'image' ? '📷 Rasm' : '📎 Fayl',
      read: false,
      created_at: now,
      link: audience === 'doctor' ? '/messages' : '/patient/messages',
    }

    const next: ConnectState = {
      ...get(),
      messages: [...get().messages, msg],
      notifications: [notif, ...get().notifications],
    }
    persist(next)
    set({ messages: next.messages, notifications: next.notifications })
  },

  // Mark the other party's messages (and message notifications) as read.
  markThreadRead: (reader) => {
    const other: Party = reader === 'doctor' ? 'patient' : 'doctor'
    const messages = get().messages.map(m => (m.sender_role === other && !m.is_read ? { ...m, is_read: true } : m))
    const notifications = get().notifications.map(n =>
      n.audience === reader && n.type === 'message' && !n.read ? { ...n, read: true } : n,
    )
    persist({ ...get(), messages, notifications })
    set({ messages, notifications })
  },

  // -- Medication assignment (doctor → patient) -------------------------------
  assignMedication: (med) => {
    const now = new Date().toISOString()
    const medication: ConnectMedication = { ...med, id: uid('med'), assigned_at: now }
    const notif: ConnectNotification = {
      id: uid('ntf'),
      audience: 'patient',
      type: 'medication',
      title: 'Yangi dori tayinlandi',
      body: `${medication.name} · ${medication.dose}${medication.schedule ? ' · ' + medication.schedule : ''}`,
      read: false,
      created_at: now,
      link: '/patient/today',
    }
    const next: ConnectState = {
      ...get(),
      medications: [medication, ...get().medications],
      notifications: [notif, ...get().notifications],
    }
    persist(next)
    set({ medications: next.medications, notifications: next.notifications })
  },

  // -- Symptom / complaint (patient → doctor) ---------------------------------
  reportSymptom: (symptom) => {
    const now = new Date().toISOString()
    const entry: ConnectSymptom = { ...symptom, id: uid('sym'), reported_at: now }
    const severe = entry.severity === 'severe'
    const notif: ConnectNotification = {
      id: uid('ntf'),
      audience: 'doctor',
      type: 'symptom',
      title: severe ? '⚠️ Shoshilinch: og\'ir shikoyat' : 'Bemordan yangi shikoyat',
      body: truncate(`${entry.type} · ${entry.location || 'umumiy'} · ${entry.intensity}/10`),
      read: false,
      created_at: now,
      link: '/messages',
    }
    const next: ConnectState = {
      ...get(),
      symptoms: [entry, ...get().symptoms],
      notifications: [notif, ...get().notifications],
    }
    persist(next)
    set({ symptoms: next.symptoms, notifications: next.notifications })
  },

  // -- Teleconsultation (doctor → patient) ------------------------------------
  scheduleTeleconsult: (tc) => {
    const now = new Date().toISOString()
    const entry: ConnectTeleconsult = { ...tc, id: uid('tc'), created_at: now }
    const notif: ConnectNotification = {
      id: uid('ntf'),
      audience: 'patient',
      type: 'teleconsult',
      title: 'Yangi video qabul rejalashtirildi',
      body: `${formatUzDateTime(entry.scheduledAt)} · ${entry.durationMin} daqiqa`,
      read: false,
      created_at: now,
      link: '/patient/teleconsultation',
    }
    const next: ConnectState = {
      ...get(),
      teleconsults: [entry, ...get().teleconsults].sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt)),
      notifications: [notif, ...get().notifications],
    }
    persist(next)
    set({ teleconsults: next.teleconsults, notifications: next.notifications })
  },

  // -- Telegram link (patient ↔ doctor visibility) ----------------------------
  setTelegramLinked: (linked) => {
    const extra = linked
      ? [{
          id: uid('ntf'),
          audience: 'doctor' as NotificationAudience,
          type: 'message' as NotificationType,
          title: 'Bemor Telegram\'ga ulandi',
          body: 'Eslatmalar endi Telegram orqali ham yetkaziladi',
          read: false,
          created_at: new Date().toISOString(),
        }]
      : []
    const notifications = [...extra, ...get().notifications]
    persist({ ...get(), telegramLinked: linked, notifications })
    set({ telegramLinked: linked, notifications })
  },

  // -- Notifications ----------------------------------------------------------
  addNotification: (n) => {
    const notif: ConnectNotification = { ...n, id: uid('ntf'), read: false, created_at: new Date().toISOString() }
    const notifications = [notif, ...get().notifications]
    persist({ ...get(), notifications })
    set({ notifications })
  },

  markNotificationRead: (id) => {
    const notifications = get().notifications.map(n => (n.id === id ? { ...n, read: true } : n))
    persist({ ...get(), notifications })
    set({ notifications })
  },

  markAllNotificationsRead: (audience) => {
    const notifications = get().notifications.map(n => (n.audience === audience ? { ...n, read: true } : n))
    persist({ ...get(), notifications })
    set({ notifications })
  },

  clearNotifications: (audience) => {
    const notifications = get().notifications.filter(n => n.audience !== audience)
    persist({ ...get(), notifications })
    set({ notifications })
  },
}))

// -- Live cross-tab sync ------------------------------------------------------
// The `storage` event fires only in *other* tabs, so this never loops back on
// the tab that performed the write.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue) as ConnectState
        useConnectStore.setState({
          messages: parsed.messages ?? [],
          notifications: parsed.notifications ?? [],
          medications: parsed.medications ?? [],
          symptoms: parsed.symptoms ?? [],
          teleconsults: parsed.teleconsults ?? [],
          telegramLinked: parsed.telegramLinked ?? false,
        })
      } catch { /* ignore */ }
    }
  })
}

// -- Selectors ----------------------------------------------------------------
export const selectUnreadNotifications = (audience: NotificationAudience) => (s: ConnectStore) =>
  s.notifications.filter(n => n.audience === audience && !n.read).length

export const selectUnreadMessages = (reader: Party) => (s: ConnectStore) => {
  const other: Party = reader === 'doctor' ? 'patient' : 'doctor'
  return s.messages.filter(m => m.sender_role === other && !m.is_read).length
}
