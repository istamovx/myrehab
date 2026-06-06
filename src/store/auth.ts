import { create } from 'zustand'
import { supabase, SUPABASE_ENABLED } from '@/lib/supabase'
import type { Profile } from '@/types/database.types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type Role = 'super_admin' | 'org_admin' | 'doctor' | 'patient'

export interface SessionUser {
  username: string
  role: Role
  name: string
  initials: string
  email?: string
  organizationId?: string
}

interface StoredAccount {
  username: string
  password: string
  role: Role
  name: string
  initials: string
  email: string
}

// Default credentials for every role (demo).
const DEFAULT_ACCOUNTS: StoredAccount[] = [
  { username: 'superadmin', password: 'admin123',    role: 'super_admin', name: 'Bosh Administrator',  initials: 'BA', email: 'superadmin@myrehab.uz' },
  { username: 'orgadmin',   password: 'orgadmin123', role: 'org_admin',   name: 'Sardor Xolmatov',     initials: 'SX', email: 'sardor.xolmatov@myrehab.uz' },
  { username: 'doctor',     password: 'doctor123',   role: 'doctor',      name: 'Dr. Muhrim Devonov',  initials: 'MD', email: 'muhrim.devonov@myrehab.uz' },
  { username: 'patient',    password: 'patient123',  role: 'patient',     name: 'Murod Aliyev',        initials: 'MA', email: 'murod.aliyev@myrehab.uz' },
]

const ACCOUNTS_KEY = 'myrehab_accounts'
const SESSION_KEY  = 'myrehab_session'

// ---------------------------------------------------------------------------
// Local storage helpers (demo mode)
// ---------------------------------------------------------------------------
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

// Derive initials from a display name ("Dr. John Doe" => "JD")
function initialsFromName(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// ---------------------------------------------------------------------------
// Error types
// ---------------------------------------------------------------------------
export type LoginError = 'empty' | 'not_found' | 'wrong_password'
export type ChangePasswordError = 'not_logged_in' | 'wrong_password' | 'too_short' | 'mismatch'

// ---------------------------------------------------------------------------
// Store interface
// ---------------------------------------------------------------------------
interface AuthStore {
  accounts: StoredAccount[]
  user: SessionUser | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ ok: boolean; role?: Role; error?: LoginError }>
  logout: () => void
  changePassword: (current: string, next: string, confirm: string) => { ok: boolean; error?: ChangePasswordError }
}

// ---------------------------------------------------------------------------
// Demo-mode login helper (pure synchronous check)
// ---------------------------------------------------------------------------
function demoLogin(
  accounts: StoredAccount[],
  username: string,
  password: string,
): { ok: boolean; role?: Role; error?: LoginError; user?: SessionUser } {
  const u = username.trim().toLowerCase()
  if (!u || !password) return { ok: false, error: 'empty' }
  const acct = accounts.find(a => a.username === u)
  if (!acct) return { ok: false, error: 'not_found' }
  if (acct.password !== password) return { ok: false, error: 'wrong_password' }
  const user: SessionUser = {
    username: acct.username,
    role: acct.role,
    name: acct.name,
    initials: acct.initials,
    email: acct.email,
  }
  return { ok: true, role: acct.role, user }
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
export const useAuthStore = create<AuthStore>((set, get) => {
  // On initialization, if Supabase is enabled, attempt to restore an existing
  // session asynchronously.  Runs once when the module is first imported.
  if (SUPABASE_ENABLED && supabase) {
    // Capture the non-null reference so closures below retain the type.
    const sb = supabase
    void sb.auth.getSession().then(async ({ data }) => {
      if (!data.session) return
      const sbUser = data.session.user
      const { data: profileData } = await sb
        .from('profiles')
        .select('name, role, organization_id')
        .eq('id', sbUser.id)
        .single()
      const profile = profileData as Pick<Profile, 'name' | 'role' | 'organization_id'> | null
      if (profile) {
        const user: SessionUser = {
          username: sbUser.email?.replace('@myrehab.demo', '') ?? sbUser.id,
          role: profile.role as Role,
          name: profile.name,
          initials: initialsFromName(profile.name),
          email: sbUser.email ?? undefined,
          organizationId: profile.organization_id ?? undefined,
        }
        localStorage.setItem(SESSION_KEY, JSON.stringify(user))
        set({ user, isLoading: false })
      } else {
        set({ isLoading: false })
      }
    }).catch(() => set({ isLoading: false }))
  }

  return {
    accounts: loadAccounts(),
    user: loadSession(),
    isLoading: false,

    // -----------------------------------------------------------------------
    // login
    // -----------------------------------------------------------------------
    login: async (username: string, password: string) => {
      set({ isLoading: true })

      // -- Supabase path --
      if (SUPABASE_ENABLED && supabase) {
        const sb = supabase
        const email = username.trim().toLowerCase() + '@myrehab.demo'
        const { data: sbData, error: sbError } = await sb.auth.signInWithPassword({
          email,
          password,
        })

        if (!sbError && sbData.session) {
          const { data: profileData } = await sb
            .from('profiles')
            .select('name, role, organization_id')
            .eq('id', sbData.session.user.id)
            .single()
          const profile = profileData as Pick<Profile, 'name' | 'role' | 'organization_id'> | null

          if (profile) {
            const user: SessionUser = {
              username: username.trim().toLowerCase(),
              role: profile.role as Role,
              name: profile.name,
              initials: initialsFromName(profile.name),
              email: sbData.session.user.email ?? undefined,
              organizationId: profile.organization_id ?? undefined,
            }
            localStorage.setItem(SESSION_KEY, JSON.stringify(user))
            set({ user, isLoading: false })
            return { ok: true, role: user.role }
          }
        }

        // Supabase sign-in failed — fall back to demo account check
        const demo = demoLogin(get().accounts, username, password)
        if (demo.ok && demo.user) {
          localStorage.setItem(SESSION_KEY, JSON.stringify(demo.user))
          set({ user: demo.user, isLoading: false })
          return { ok: true, role: demo.role }
        }
        set({ isLoading: false })
        return { ok: false, error: demo.error }
      }

      // -- Demo-only path (SUPABASE_ENABLED === false) --
      const result = demoLogin(get().accounts, username, password)
      if (result.ok && result.user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(result.user))
        set({ user: result.user, isLoading: false })
        return { ok: true, role: result.role }
      }
      set({ isLoading: false })
      return { ok: false, error: result.error }
    },

    // -----------------------------------------------------------------------
    // logout
    // -----------------------------------------------------------------------
    logout: () => {
      localStorage.removeItem(SESSION_KEY)
      set({ user: null })
      if (SUPABASE_ENABLED && supabase) {
        void supabase.auth.signOut()
      }
    },

    // -----------------------------------------------------------------------
    // changePassword  (operates on demo accounts only; Supabase users manage
    // passwords through Supabase's own auth flows)
    // -----------------------------------------------------------------------
    changePassword: (current: string, next: string, confirm: string) => {
      const { user, accounts } = get()
      if (!user) return { ok: false, error: 'not_logged_in' }
      const acct = accounts.find(a => a.username === user.username)
      if (!acct) return { ok: false, error: 'not_logged_in' }
      if (acct.password !== current) return { ok: false, error: 'wrong_password' }
      if (!next || next.length < 4) return { ok: false, error: 'too_short' }
      if (next !== confirm) return { ok: false, error: 'mismatch' }
      const updated = accounts.map(a =>
        a.username === user.username ? { ...a, password: next } : a,
      )
      persistAccounts(updated)
      set({ accounts: updated })
      return { ok: true }
    },
  }
})

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
export function homePathForRole(role: Role): string {
  if (role === 'patient') return '/patient/today'
  if (role === 'super_admin') return '/super-admin/dashboard'
  if (role === 'org_admin') return '/org-admin/dashboard'
  return '/dashboard'
}
