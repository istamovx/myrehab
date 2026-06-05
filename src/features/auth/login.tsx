import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  Eye, EyeOff, Lock, User, ShieldCheck, Stethoscope, HeartPulse,
  Globe, ChevronDown, Activity, Check,
} from 'lucide-react'
import { useAuthStore, homePathForRole, type Role } from '@/store/auth'
import { useLangStore } from '@/store/lang'
import { Menu, MenuTrigger, MenuContent, MenuItem } from '@/components/ui/menu'

const LANGS = [
  { code: 'uz', label: "O'zbekcha" },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
] as const

interface DemoAccount {
  role: Role
  username: string
  password: string
  icon: React.ElementType
  color: string
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  { role: 'super_admin', username: 'superadmin', password: 'admin123',   icon: ShieldCheck,  color: 'from-indigo-500 to-indigo-700' },
  { role: 'doctor',      username: 'doctor',     password: 'doctor123',  icon: Stethoscope,  color: 'from-blue-500 to-blue-700' },
  { role: 'patient',     username: 'patient',    password: 'patient123', icon: HeartPulse,   color: 'from-teal-500 to-teal-700' },
]

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const login = useAuthStore(s => s.login)
  const { lang, setLang } = useLangStore()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const roleLabel = (role: Role) =>
    role === 'super_admin' ? t('auth.superAdmin')
      : role === 'doctor' ? t('auth.doctor')
      : t('auth.patient')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Tiny delay to simulate a request and show the loading state.
    setTimeout(() => {
      const res = login(username, password)
      setLoading(false)
      if (res.ok && res.role) {
        navigate({ to: homePathForRole(res.role) })
      } else {
        setError(
          res.error === 'empty' ? t('auth.fillAllFields')
            : res.error === 'not_found' ? t('auth.userNotFound')
            : t('auth.wrongPassword'),
        )
      }
    }, 350)
  }

  function fillDemo(acct: DemoAccount) {
    setUsername(acct.username)
    setPassword(acct.password)
    setError(null)
  }

  return (
    <div className="min-h-screen flex bg-[var(--bg-secondary)]">
      {/* Left brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#2970FF] to-[#1f4fcc] flex-col justify-between p-12 text-white">
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-32 -left-16 size-96 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex items-center gap-3">
          <div className="size-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <Activity size={24} className="text-white" />
          </div>
          <div>
            <p className="text-xl font-extrabold tracking-tight leading-none">MyRehab</p>
            <p className="text-[12px] text-white/70 font-medium mt-0.5">{t('auth.platformSubtitle')}</p>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-[34px] font-extrabold leading-tight">{t('auth.heroTitle')}</h1>
          <p className="text-[15px] text-white/80 mt-3 max-w-md leading-relaxed">{t('auth.heroSubtitle')}</p>

          <div className="mt-8 space-y-3">
            {[t('auth.feature1'), t('auth.feature2'), t('auth.feature3')].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="size-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-white" />
                </div>
                <span className="text-[14px] text-white/90">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-[12px] text-white/50">© 2026 MyRehab. {t('auth.allRights')}</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col">
        {/* Top bar: language switcher */}
        <div className="flex items-center justify-between p-5">
          <div className="lg:hidden flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-to-br from-[#2970FF] to-[#1f4fcc] flex items-center justify-center">
              <Activity size={18} className="text-white" />
            </div>
            <span className="font-extrabold text-[15px] text-[var(--text-primary)]">MyRehab</span>
          </div>
          <div className="ml-auto">
            <Menu>
              <MenuTrigger className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] cursor-pointer outline-none transition-colors">
                <Globe size={16} />
                <span className="text-[13px] font-semibold uppercase">{lang}</span>
                <ChevronDown size={13} className="text-[var(--text-quaternary)]" />
              </MenuTrigger>
              <MenuContent>
                {LANGS.map(l => (
                  <MenuItem key={l.code} onClick={() => setLang(l.code)}>
                    <span className="w-6 text-[12px] font-bold uppercase text-[var(--text-quaternary)]">{l.code}</span>
                    <span className="flex-1">{l.label}</span>
                    {lang === l.code && <Check size={15} className="text-[var(--fg-brand-primary)]" />}
                  </MenuItem>
                ))}
              </MenuContent>
            </Menu>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-5 pb-10">
          <div className="w-full max-w-sm">
            <div className="mb-7">
              <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">{t('auth.welcome')}</h2>
              <p className="text-[14px] text-[var(--text-tertiary)] mt-1">{t('auth.signInToContinue')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)]">{t('auth.username')}</label>
                <div className="relative mt-1.5">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-quaternary)] pointer-events-none" />
                  <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoFocus
                    autoComplete="username"
                    placeholder={t('auth.usernamePlaceholder')}
                    className="w-full h-11 pl-9 pr-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-secondary)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--fg-brand-primary)] focus:[box-shadow:0_0_0_3px_rgba(41,112,255,0.12)] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)]">{t('auth.password')}</label>
                <div className="relative mt-1.5">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-quaternary)] pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full h-11 pl-9 pr-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-secondary)] text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--fg-brand-primary)] focus:[box-shadow:0_0_0_3px_rgba(41,112,255,0.12)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-quaternary)] hover:text-[var(--text-secondary)] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="px-3.5 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-[13px] font-medium text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-[var(--fg-brand-primary)] text-white text-[14px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    {t('auth.signingIn')}
                  </>
                ) : t('auth.signIn')}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-[var(--border-secondary)]" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-quaternary)]">{t('auth.demoAccounts')}</span>
                <div className="flex-1 h-px bg-[var(--border-secondary)]" />
              </div>
              <div className="space-y-2">
                {DEMO_ACCOUNTS.map(acct => (
                  <button
                    key={acct.username}
                    type="button"
                    onClick={() => fillDemo(acct)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-secondary)] hover:border-[var(--fg-brand-primary)] transition-colors text-left group"
                  >
                    <div className={`size-9 rounded-lg bg-gradient-to-br ${acct.color} flex items-center justify-center shrink-0`}>
                      <acct.icon size={17} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[var(--text-primary)]">{roleLabel(acct.role)}</p>
                      <p className="text-[11px] text-[var(--text-tertiary)] font-mono">{acct.username} · {acct.password}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-[var(--fg-brand-primary)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      {t('auth.use')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
