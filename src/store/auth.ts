import { create } from 'zustand'

export type Role = 'super_admin' | 'doctor' | 'patient'

export interface SessionUser {
  username: string
  role: Role
  name: string
  initials: string
}

interface StoredAccount {
  username: string
  password: string
  role: Role
  name: string
  initials: string
}

// Default credentials for every role (demo).
const DEFAULT_ACCOUNTS: StoredAccount[] = [
  { username: 'superadmin', password: 'admin123',   role: 'super_admin', name: 'Super Admin',        initials: 'SA' },
  { username: 'doctor',     password: 'doctor123',  role: 'doctor',      name: 'Dr. Muhrim Devonov', initials: 'MD' },
  { username: 'patient',    password: 'patient123', role: 'patient',     name: 'Murod Aliyev',       initials: 'MA' },
]

const ACCOUNTS_KEY = 'myrehab_accounts'
const SESSION_KEY  = 'myrehab_session'

// Merge saved passwords over the defaults so changed credentials survive refresh.
function loadAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    if (raw) {
      const saved = JSON.parse(raw) as { username: string; password: string }[]
      return DEFAULT_ACCOUNTS.map(def => {
        const s = saved.find(a => a.username === def.username)
        return s ? { ...def, password: s.password } : def
      })
    }
  } catch { /* ignore corrupt storage */ }
  return DEFAULT_ACCOUNTS
}

function persistAccounts(accounts: StoredAccount[]) {
  const minimal = accounts.map(a => ({ username: a.username, password: a.password }))
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(minimal))
}

function loadSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (raw) return JSON.parse(raw) as SessionUser
  } catch { /* ignore */ }
  return null
}

export type LoginError = 'empty' | 'not_found' | 'wrong_password'
export type ChangePasswordError = 'not_logged_in' | 'wrong_password' | 'too_short' | 'mismatch'

interface AuthStore {
  accounts: StoredAccount[]
  user: SessionUser | null
  login: (username: string, password: string) => { ok: boolean; role?: Role; error?: LoginError }
  logout: () => void
  changePassword: (current: string, next: string, confirm: string) => { ok: boolean; error?: ChangePasswordError }
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  accounts: loadAccounts(),
  user: loadSession(),

  login: (username, password) => {
    const u = username.trim().toLowerCase()
    if (!u || !password) return { ok: false, error: 'empty' }
    const acct = get().accounts.find(a => a.username === u)
    if (!acct) return { ok: false, error: 'not_found' }
    if (acct.password !== password) return { ok: false, error: 'wrong_password' }
    const user: SessionUser = { username: acct.username, role: acct.role, name: acct.name, initials: acct.initials }
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    set({ user })
    return { ok: true, role: acct.role }
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY)
    set({ user: null })
  },

  changePassword: (current, next, confirm) => {
    const { user, accounts } = get()
    if (!user) return { ok: false, error: 'not_logged_in' }
    const acct = accounts.find(a => a.username === user.username)
    if (!acct) return { ok: false, error: 'not_logged_in' }
    if (acct.password !== current) return { ok: false, error: 'wrong_password' }
    if (!next || next.length < 4) return { ok: false, error: 'too_short' }
    if (next !== confirm) return { ok: false, error: 'mismatch' }
    const updated = accounts.map(a => a.username === user.username ? { ...a, password: next } : a)
    persistAccounts(updated)
    set({ accounts: updated })
    return { ok: true }
  },
}))

export function homePathForRole(role: Role): string {
  if (role === 'patient') return '/patient/today'
  if (role === 'super_admin') return '/super-admin/dashboard'
  return '/dashboard'
}
