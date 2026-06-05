import { create } from 'zustand'
import { MESSAGES, type Message } from '@/data/patient-mock-data'

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

interface ConnectState {
  messages: Message[]
  notifications: ConnectNotification[]
  medications: ConnectMedication[]
  symptoms: ConnectSymptom[]
}

interface ConnectStore extends ConnectState {
  sendMessage: (from: Party, body: string) => void
  markThreadRead: (reader: Party) => void
  assignMedication: (med: Omit<ConnectMedication, 'id' | 'assigned_at'>) => void
  reportSymptom: (symptom: Omit<ConnectSymptom, 'id' | 'reported_at'>) => void
  addNotification: (n: Omit<ConnectNotification, 'id' | 'read' | 'created_at'>) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: (audience: NotificationAudience) => void
  clearNotifications: (audience: NotificationAudience) => void
}

const STORAGE_KEY = 'myrehab_connect'

function seed(): ConnectState {
  return { messages: [...MESSAGES], notifications: [], medications: [], symptoms: [] }
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
      }
    }
  } catch { /* ignore corrupt storage */ }
  return seed()
}

function persist(state: ConnectState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      messages: state.messages,
      notifications: state.notifications,
      medications: state.medications,
      symptoms: state.symptoms,
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
  sendMessage: (from, body) => {
    const text = body.trim()
    if (!text) return
    const now = new Date().toISOString()
    const msg: Message = { id: uid('msg'), sender_role: from, body: text, is_read: false, created_at: now }

    // Notify the *other* party of the new message.
    const audience: NotificationAudience = from === 'doctor' ? 'patient' : 'doctor'
    const notif: ConnectNotification = {
      id: uid('ntf'),
      audience,
      type: 'message',
      title: from === 'doctor' ? 'Shifokordan yangi xabar' : 'Bemordan yangi xabar',
      body: truncate(text),
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
