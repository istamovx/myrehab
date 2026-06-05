import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  Eye, EyeOff, Lock, User, ShieldCheck, Stethoscope, HeartPulse,
  Globe, ChevronDown, Check, ArrowLeft, Sparkles, TrendingUp, Users, Shield,
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
  label: string
  color: string
  bg: string
  border: string
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'super_admin',
    username: 'superadmin',
    password: 'admin123',
    icon: ShieldCheck,
    label: 'Super Admin',
    color: '#818cf8',
    bg: 'rgba(99,102,241,0.12)',
    border: 'rgba(99,102,241,0.25)',
  },
  {
    role: 'doctor',
    username: 'doctor',
    password: 'doctor123',
    icon: Stethoscope,
    label: 'Shifokor',
    color: '#22d3ee',
    bg: 'rgba(6,182,212,0.12)',
    border: 'rgba(6,182,212,0.25)',
  },
  {
    role: 'patient',
    username: 'patient',
    password: 'patient123',
    icon: HeartPulse,
    label: 'Bemor',
    color: '#34d399',
    bg: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.25)',
  },
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setTimeout(() => {
      const res = login(username, password)
      setLoading(false)
      if (res.ok && res.role) {
        navigate({ to: homePathForRole(res.role) })
      } else {
        setError(
          res.error === 'empty'     ? t('auth.fillAllFields')
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
    <div
      className="min-h-screen flex overflow-hidden"
      style={{ background: '#020817', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* ── Left panel ──────────────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(145deg,#0f172a 0%,#1e1b4b 60%,#0c1425 100%)' }}
      >
        {/* Orbs */}
        <div className="absolute rounded-full pointer-events-none" style={{ width: 500, height: 500, top: -100, left: -100, background: 'radial-gradient(circle,rgba(99,102,241,0.28) 0%,transparent 65%)', filter: 'blur(60px)', animation: 'float 10s ease-in-out infinite' }} />
        <div className="absolute rounded-full pointer-events-none" style={{ width: 400, height: 400, bottom: -80, right: -80, background: 'radial-gradient(circle,rgba(139,92,246,0.22) 0%,transparent 65%)', filter: 'blur(50px)', animation: 'float 13s ease-in-out infinite reverse' }} />
        <div className="absolute rounded-full pointer-events-none" style={{ width: 250, height: 250, top: '50%', left: '55%', background: 'radial-gradient(circle,rgba(6,182,212,0.15) 0%,transparent 65%)', filter: 'blur(40px)', animation: 'float 11s ease-in-out infinite 4s' }} />

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3" style={{ animation: 'heroFadeUp 0.6s ease-out both' }}>
          <img src="/logo.svg" alt="" className="w-11 h-11 shrink-0" />
          <div>
            <p className="text-[20px] font-extrabold text-white tracking-tight leading-none">My<span style={{ color: '#818cf8' }}>Rehab</span></p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(248,250,252,0.45)' }}>{t('auth.platformSubtitle')}</p>
          </div>
        </div>

        {/* Main content */}
        <div className="relative" style={{ animation: 'heroFadeUp 0.6s ease-out 0.1s both' }}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 text-xs font-bold"
               style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
            <Sparkles size={12} /> 2025 yilning #1 reabilitatsiya platformasi
          </div>

          <h1 className="text-[38px] font-extrabold leading-tight mb-4">
            <span className="text-white">{t('auth.heroTitle')}</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg,#a5b4fc 0%,#c4b5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              aqlli platformasi
            </span>
          </h1>
          <p className="text-[15px] leading-relaxed mb-8 max-w-sm" style={{ color: 'rgba(248,250,252,0.55)' }}>
            {t('auth.heroSubtitle')}
          </p>

          <div className="space-y-3">
            {[
              { icon: Shield,     color: '#818cf8', text: t('auth.feature1') },
              { icon: TrendingUp, color: '#34d399', text: t('auth.feature2') },
              { icon: Users,      color: '#22d3ee', text: t('auth.feature3') },
            ].map(f => {
              const Icon = f.icon
              return (
                <div key={f.text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                    <Icon size={14} style={{ color: f.color }} />
                  </div>
                  <span className="text-sm" style={{ color: 'rgba(248,250,252,0.7)' }}>{f.text}</span>
                </div>
              )
            })}
          </div>

          {/* Mini stats */}
          <div className="flex gap-6 mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {[['24+', 'Tashkilot'], ['1200+', 'Bemor'], ['98%', 'Muvaffaqiyat']].map(([v, l]) => (
              <div key={l}>
                <div className="text-lg font-black" style={{ color: '#818cf8' }}>{v}</div>
                <div className="text-xs" style={{ color: 'rgba(248,250,252,0.35)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs" style={{ color: 'rgba(248,250,252,0.3)' }}>© 2025 MyRehab. {t('auth.allRights')}</p>
      </div>

      {/* ── Right panel ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col" style={{ background: 'rgba(255,255,255,0.015)', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-1.5 text-sm transition-colors"
             style={{ color: 'rgba(248,250,252,0.45)' }}
             onMouseEnter={e => (e.currentTarget.style.color = 'rgba(248,250,252,0.8)')}
             onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,250,252,0.45)')}>
            <ArrowLeft size={14} />
            <span>Bosh sahifa</span>
          </a>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2">
            <img src="/logo.svg" alt="" className="w-7 h-7 shrink-0" />
            <span className="font-bold text-[15px] text-white">My<span style={{ color: '#818cf8' }}>Rehab</span></span>
          </div>

          {/* Language switcher */}
          <Menu>
            <MenuTrigger className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-sm outline-none cursor-pointer transition-all"
                         style={{ color: 'rgba(248,250,252,0.5)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Globe size={14} />
              <span className="uppercase font-bold" style={{ fontSize: 11 }}>{lang}</span>
              <ChevronDown size={12} />
            </MenuTrigger>
            <MenuContent>
              {LANGS.map(l => (
                <MenuItem key={l.code} onClick={() => setLang(l.code)}>
                  <span className="w-6 text-[12px] font-bold uppercase" style={{ color: 'rgba(248,250,252,0.4)' }}>{l.code}</span>
                  <span className="flex-1">{l.label}</span>
                  {lang === l.code && <Check size={14} style={{ color: '#818cf8' }} />}
                </MenuItem>
              ))}
            </MenuContent>
          </Menu>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-[380px]" style={{ animation: 'heroFadeUp 0.6s ease-out 0.15s both' }}>
            <div className="mb-8">
              <h2 className="text-[26px] font-extrabold text-white mb-1.5 tracking-tight">{t('auth.welcome')} 👋</h2>
              <p className="text-sm" style={{ color: 'rgba(248,250,252,0.5)' }}>{t('auth.signInToContinue')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(248,250,252,0.6)' }}>
                  {t('auth.username')}
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(248,250,252,0.3)' }} />
                  <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoFocus
                    autoComplete="username"
                    placeholder={t('auth.usernamePlaceholder')}
                    className="w-full h-11 pl-10 pr-4 rounded-xl text-sm text-white outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      caretColor: '#818cf8',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(248,250,252,0.6)' }}>
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(248,250,252,0.3)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full h-11 pl-10 pr-11 rounded-xl text-sm text-white outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      caretColor: '#818cf8',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'rgba(248,250,252,0.35)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(248,250,252,0.7)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,250,252,0.35)')}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm font-medium"
                     style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
                  <span className="shrink-0 mt-0.5">⚠</span>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  boxShadow: '0 0 24px rgba(99,102,241,0.4)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 36px rgba(99,102,241,0.6)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' } }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(99,102,241,0.4)'; (e.currentTarget as HTMLButtonElement).style.transform = 'none' }}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                    {t('auth.signingIn')}
                  </>
                ) : t('auth.signIn')}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(248,250,252,0.3)' }}>
                  {t('auth.demoAccounts')}
                </span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
              </div>

              <div className="space-y-2">
                {DEMO_ACCOUNTS.map(acct => (
                  <button
                    key={acct.username}
                    type="button"
                    onClick={() => fillDemo(acct)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all group"
                    style={{ background: acct.bg, border: `1px solid ${acct.border}` }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLButtonElement
                      el.style.borderColor = acct.color + '55'
                      el.style.background = acct.bg.replace('0.12', '0.18')
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLButtonElement
                      el.style.borderColor = acct.border
                      el.style.background = acct.bg
                    }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: acct.color + '25', border: `1px solid ${acct.color}35` }}>
                      <acct.icon size={17} style={{ color: acct.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white">{acct.label}</p>
                      <p className="text-xs font-mono" style={{ color: 'rgba(248,250,252,0.45)' }}>
                        {acct.username} · {acct.password}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0" style={{ color: acct.color }}>
                      {t('auth.use')} →
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
