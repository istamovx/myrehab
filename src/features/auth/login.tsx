import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  Eye, EyeOff, Lock, User, ShieldCheck, Stethoscope, HeartPulse, Building2,
  Globe, ChevronDown, Check, ArrowLeft, Sparkles, TrendingUp, Users, Shield,
  Sun, Moon,
} from 'lucide-react'
import { useAuthStore, homePathForRole, type Role } from '@/store/auth'
import { useLangStore } from '@/store/lang'
import { useThemeStore } from '@/store/theme'
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
    color: '#528BFF',
    bg: 'rgba(21,94,239,0.12)',
    border: 'rgba(21,94,239,0.25)',
  },
  {
    role: 'org_admin',
    username: 'orgadmin',
    password: 'orgadmin123',
    icon: Building2,
    label: 'Tashkilot admini',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.12)',
    border: 'rgba(168,85,247,0.25)',
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
  const { theme, toggle } = useThemeStore()
  const isDark = theme === 'dark'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = await login(username, password)
    setLoading(false)
    if (res.ok && res.role) {
      navigate({ to: homePathForRole(res.role) })
    } else {
      setError(
        res.error === 'empty'       ? t('auth.fillAllFields')
        : res.error === 'not_found' ? t('auth.userNotFound')
        : t('auth.wrongPassword'),
      )
    }
  }

  function fillDemo(acct: DemoAccount) {
    setUsername(acct.username)
    setPassword(acct.password)
    setError(null)
  }

  const rp = {
    bg:          isDark ? 'rgba(255,255,255,0.015)' : '#ffffff',
    border:      isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0',
    textPrimary: isDark ? '#f8fafc' : '#0f172a',
    textMuted:   isDark ? 'rgba(248,250,252,0.5)' : '#64748b',
    labelColor:  isDark ? 'rgba(248,250,252,0.6)' : '#475569',
    inputBg:     isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
    inputBorder: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
    inputText:   isDark ? '#f8fafc' : '#0f172a',
    iconColor:   isDark ? 'rgba(248,250,252,0.3)' : '#94a3b8',
    divider:     isDark ? 'rgba(255,255,255,0.07)' : '#e2e8f0',
    dividerText: isDark ? 'rgba(248,250,252,0.3)' : '#94a3b8',
    topLink:     isDark ? 'rgba(248,250,252,0.45)' : '#64748b',
    langBg:      isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
    langBorder:  isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
    langText:    isDark ? 'rgba(248,250,252,0.5)' : '#475569',
    toggleBg:    isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9',
    toggleBorder:isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0',
  }

  return (
    <div
      className="min-h-screen flex overflow-hidden"
      style={{ background: isDark ? '#020817' : '#f1f5f9', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* ── Left panel ──────────────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(145deg,#0f172a 0%,#1e1b4b 60%,#0c1425 100%)' }}
      >
        {/* Orbs */}
        <div className="absolute rounded-full pointer-events-none" style={{ width: 500, height: 500, top: -100, left: -100, background: 'radial-gradient(circle,rgba(21,94,239,0.28) 0%,transparent 65%)', filter: 'blur(60px)', animation: 'float 10s ease-in-out infinite' }} />
        <div className="absolute rounded-full pointer-events-none" style={{ width: 400, height: 400, bottom: -80, right: -80, background: 'radial-gradient(circle,rgba(139,92,246,0.22) 0%,transparent 65%)', filter: 'blur(50px)', animation: 'float 13s ease-in-out infinite reverse' }} />
        <div className="absolute rounded-full pointer-events-none" style={{ width: 250, height: 250, top: '50%', left: '55%', background: 'radial-gradient(circle,rgba(6,182,212,0.15) 0%,transparent 65%)', filter: 'blur(40px)', animation: 'float 11s ease-in-out infinite 4s' }} />

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3" style={{ animation: 'heroFadeUp 0.6s ease-out both' }}>
          <img src="/logo.svg" alt="" className="w-11 h-11 shrink-0" />
          <div>
            <p className="text-[20px] font-extrabold text-white tracking-tight leading-none">My<span style={{ color: '#528BFF' }}>Rehab</span></p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(248,250,252,0.45)' }}>{t('auth.platformSubtitle')}</p>
          </div>
        </div>

        {/* Main content */}
        <div className="relative" style={{ animation: 'heroFadeUp 0.6s ease-out 0.1s both' }}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 text-xs font-bold"
               style={{ background: 'rgba(21,94,239,0.15)', border: '1px solid rgba(21,94,239,0.3)', color: '#84ADFF' }}>
            <Sparkles size={12} /> 2025 yilning #1 reabilitatsiya platformasi
          </div>

          <h1 className="text-[38px] font-extrabold leading-tight mb-4">
            <span className="text-white">{t('auth.heroTitle')}</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg,#84ADFF 0%,#528BFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              aqlli platformasi
            </span>
          </h1>
          <p className="text-[15px] leading-relaxed mb-8 max-w-sm" style={{ color: 'rgba(248,250,252,0.55)' }}>
            {t('auth.heroSubtitle')}
          </p>

          <div className="space-y-3">
            {[
              { icon: Shield,     color: '#528BFF', text: t('auth.feature1') },
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
                <div className="text-lg font-black" style={{ color: '#528BFF' }}>{v}</div>
                <div className="text-xs" style={{ color: 'rgba(248,250,252,0.35)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs" style={{ color: 'rgba(248,250,252,0.3)' }}>© 2025 MyRehab. {t('auth.allRights')}</p>
      </div>

      {/* ── Right panel ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col" style={{ background: rp.bg, borderLeft: rp.border }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-1.5 text-sm transition-colors"
             style={{ color: rp.topLink }}
             onMouseEnter={e => (e.currentTarget.style.color = isDark ? 'rgba(248,250,252,0.8)' : '#0f172a')}
             onMouseLeave={e => (e.currentTarget.style.color = rp.topLink)}>
            <ArrowLeft size={14} />
            <span>Bosh sahifa</span>
          </a>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2">
            <img src="/logo.svg" alt="" className="w-7 h-7 shrink-0" />
            <span className="font-bold text-[15px]" style={{ color: rp.textPrimary }}>My<span style={{ color: '#84ADFF' }}>Rehab</span></span>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all"
              style={{ color: rp.langText, background: rp.toggleBg, border: `1px solid ${rp.toggleBorder}` }}
              title={isDark ? 'Yorug\' rejim' : 'Qorong\'u rejim'}
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {/* Language switcher */}
            <Menu>
              <MenuTrigger className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-sm outline-none cursor-pointer transition-all"
                           style={{ color: rp.langText, background: rp.langBg, border: `1px solid ${rp.langBorder}` }}>
                <Globe size={14} />
                <span className="uppercase font-bold" style={{ fontSize: 11 }}>{lang}</span>
                <ChevronDown size={12} />
              </MenuTrigger>
              <MenuContent>
                {LANGS.map(l => (
                  <MenuItem key={l.code} onClick={() => setLang(l.code)}>
                    <span className="w-6 text-[12px] font-bold uppercase" style={{ color: 'rgba(248,250,252,0.4)' }}>{l.code}</span>
                    <span className="flex-1">{l.label}</span>
                    {lang === l.code && <Check size={14} style={{ color: '#155EEF' }} />}
                  </MenuItem>
                ))}
              </MenuContent>
            </Menu>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-[380px]" style={{ animation: 'heroFadeUp 0.6s ease-out 0.15s both' }}>
            <div className="mb-8">
              <h2 className="text-[26px] font-extrabold mb-1.5 tracking-tight" style={{ color: rp.textPrimary }}>{t('auth.welcome')} 👋</h2>
              <p className="text-sm" style={{ color: rp.textMuted }}>{t('auth.signInToContinue')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: rp.labelColor }}>
                  {t('auth.username')}
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: rp.iconColor }} />
                  <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoFocus
                    autoComplete="username"
                    placeholder={t('auth.usernamePlaceholder')}
                    className={`${isDark ? 'autofill-dark' : ''} w-full h-11 pl-10 pr-4 rounded-xl text-sm outline-none transition-all`}
                    style={{
                      background: rp.inputBg,
                      border: `1px solid ${rp.inputBorder}`,
                      color: rp.inputText,
                      caretColor: '#155EEF',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(21,94,239,0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(21,94,239,0.12)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = rp.inputBorder; e.currentTarget.style.boxShadow = 'none' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: rp.labelColor }}>
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: rp.iconColor }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`${isDark ? 'autofill-dark' : ''} w-full h-11 pl-10 pr-11 rounded-xl text-sm outline-none transition-all`}
                    style={{
                      background: rp.inputBg,
                      border: `1px solid ${rp.inputBorder}`,
                      color: rp.inputText,
                      caretColor: '#155EEF',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(21,94,239,0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(21,94,239,0.12)' }}
                    onBlur={e => { e.currentTarget.style.borderColor = rp.inputBorder; e.currentTarget.style.boxShadow = 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: rp.iconColor }}
                    onMouseEnter={e => (e.currentTarget.style.color = rp.inputText)}
                    onMouseLeave={e => (e.currentTarget.style.color = rp.iconColor)}
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
                  background: '#155EEF',
                  boxShadow: '0 0 24px rgba(21,94,239,0.4)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 36px rgba(21,94,239,0.6)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' } }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(21,94,239,0.4)'; (e.currentTarget as HTMLButtonElement).style.transform = 'none' }}
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
                <div className="flex-1 h-px" style={{ background: rp.divider }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: rp.dividerText }}>
                  {t('auth.demoAccounts')}
                </span>
                <div className="flex-1 h-px" style={{ background: rp.divider }} />
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
                      <p className="text-sm font-bold" style={{ color: rp.textPrimary }}>{acct.label}</p>
                      <p className="text-xs font-mono" style={{ color: rp.textMuted }}>
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
