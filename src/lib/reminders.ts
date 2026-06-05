// Appointment reminder scheduling (client side).
//
// Fires browser notifications a set number of minutes before an appointment —
// by default 60 minutes and 10 minutes ahead, as required for teleconsultation
// reminders. While this runs in the browser tab via setTimeout, the same
// `offsets` contract is what a server-side scheduler (Supabase Edge Function +
// Telegram push) would consume, so the wiring is a drop-in replacement.

export const DEFAULT_OFFSETS_MIN = [60, 10] as const

export interface ScheduledReminder {
  appointmentId: string
  title: string
  body: string
  startsAt: string      // ISO
  offsetsMin: number[]
  meetUrl?: string
}

const STORAGE_KEY = 'myrehab.reminders'
const timers = new Map<string, number[]>()

function loadStore(): Record<string, ScheduledReminder> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function saveStore(store: Record<string, ScheduledReminder>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

/** Ask the browser for notification permission. Returns true if granted. */
export async function ensureNotificationPermission(): Promise<boolean> {
  if (typeof Notification === 'undefined') return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

function fire(title: string, body: string, meetUrl?: string) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
  const n = new Notification(title, { body, icon: '/logo.svg', tag: meetUrl ?? title })
  if (meetUrl) {
    n.onclick = () => { window.open(meetUrl, '_blank'); n.close() }
  }
}

/**
 * Schedule reminders for an appointment. Replaces any existing reminders for
 * the same appointment id. Returns the offsets that were actually armed
 * (offsets already in the past are skipped).
 */
export function scheduleReminders(r: ScheduledReminder): number[] {
  cancelReminders(r.appointmentId)

  const start = new Date(r.startsAt).getTime()
  const now = Date.now()
  const armed: number[] = []
  const ids: number[] = []

  for (const offset of r.offsetsMin) {
    const fireAt = start - offset * 60_000
    const delay = fireAt - now
    if (delay <= 0) continue
    const label = offset >= 60 ? `${offset / 60} soat` : `${offset} daqiqa`
    const id = window.setTimeout(() => {
      fire(r.title, `${r.body} (${label} qoldi)`, r.meetUrl)
    }, delay)
    ids.push(id)
    armed.push(offset)
  }

  timers.set(r.appointmentId, ids)

  const store = loadStore()
  store[r.appointmentId] = { ...r, offsetsMin: armed }
  saveStore(store)

  return armed
}

/** Cancel any pending reminders for an appointment. */
export function cancelReminders(appointmentId: string) {
  const ids = timers.get(appointmentId)
  if (ids) ids.forEach(clearTimeout)
  timers.delete(appointmentId)

  const store = loadStore()
  if (store[appointmentId]) {
    delete store[appointmentId]
    saveStore(store)
  }
}

/** All reminders persisted in this browser (for showing scheduled state). */
export function listReminders(): ScheduledReminder[] {
  return Object.values(loadStore())
}

/** Human label for an offset list, e.g. "1 soat va 10 daqiqa oldin". */
export function offsetsLabel(offsetsMin: number[]): string {
  const parts = offsetsMin.map(o => (o >= 60 ? `${o / 60} soat` : `${o} daqiqa`))
  return parts.length ? `${parts.join(' va ')} oldin` : '—'
}
