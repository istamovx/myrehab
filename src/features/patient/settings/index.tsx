import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Monitor, LogOut, Lock, User, Send, Check, Copy, Unlink, Bell } from 'lucide-react'
import { PATIENT_PROFILE } from '@/data/patient-mock-data'
import { useAuthStore } from '@/store/auth'

type Tab = 'profile' | 'security'

const TELEGRAM_BOT = 'MyRehabUzBot'

const SESSIONS = [
  { id: 1, device: 'Chrome · Windows', ip: '172.18.0.6', last: 'Hozir',         current: true  },
  { id: 2, device: 'Chrome · Android', ip: '172.18.0.6', last: '3 soat oldin',  current: false },
  { id: 3, device: 'Safari · iPhone',  ip: '172.18.0.5', last: '1 kun oldin',   current: false },
]

// ── Telegram linking card ─────────────────────────────────────────────────────

function genCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

function TelegramCard() {
  const [linked, setLinked] = useState(false)
  const [code] = useState(genCode)
  const [copied, setCopied] = useState(false)
  const deepLink = `https://t.me/${TELEGRAM_BOT}?start=${code}`

  async function copyCode() {
    await navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="size-11 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shrink-0">
          <Send size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[15px] font-bold text-[var(--text-primary)]">Telegram bot</p>
            {linked ? (
              <span className="flex items-center gap-1 text-[12px] font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                <span className="size-1.5 rounded-full bg-green-500" />
                Ulangan
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[12px] font-semibold text-[var(--text-tertiary)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded-full">
                <span className="size-1.5 rounded-full bg-[var(--fg-quaternary)]" />
                Ulanmagan
              </span>
            )}
          </div>
          <p className="text-[13px] text-[var(--text-tertiary)] mt-0.5">
            Qabul eslatmalari, dori vaqti va shifokor xabarlarini Telegram orqali oling
          </p>
        </div>
      </div>

      {linked ? (
        <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-xl">
          <div className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
            <Bell size={14} className="text-sky-500" />
            Bildirishnomalar yoqilgan · @{PATIENT_PROFILE.name.split(' ')[0].toLowerCase()}
          </div>
          <button
            onClick={() => setLinked(false)}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-red-600 hover:underline"
          >
            <Unlink size={13} />
            Uzish
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Linking code */}
          <div>
            <label className="text-[12px] font-semibold text-[var(--text-secondary)]">Ulash kodi</label>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 flex items-center justify-between bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg px-3 h-10">
                <span className="text-[16px] font-mono font-bold tracking-[0.2em] text-[var(--text-primary)]">{code}</span>
                <button onClick={copyCode} className="text-[var(--fg-quaternary)] hover:text-[var(--text-primary)] cursor-pointer">
                  {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
                </button>
              </div>
            </div>
          </div>

          {/* Steps */}
          <ol className="text-[12px] text-[var(--text-tertiary)] space-y-1 list-decimal list-inside">
            <li>Quyidagi tugma orqali botni oching</li>
            <li>Botda <span className="font-mono font-semibold">/start</span> bosing</li>
            <li>Ulanish avtomatik tasdiqlanadi</li>
          </ol>

          <div className="flex gap-2">
            <a
              href={deepLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-[14px] font-semibold transition-colors"
            >
              <Send size={15} />
              Telegram orqali ulash
            </a>
            {/* Demo: simulate successful linking */}
            <button
              onClick={() => setLinked(true)}
              className="px-4 py-2.5 rounded-xl border border-[var(--border-secondary)] text-[14px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              Tekshirish
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function PatientSettingsPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>('profile')
  const [name, setName] = useState(PATIENT_PROFILE.name)
  const [saved, setSaved] = useState(false)
  const [sessions, setSessions] = useState(SESSIONS)

  const changePassword = useAuthStore(s => s.changePassword)
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pwMsg, setPwMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  function handleChangePassword() {
    const res = changePassword(current, next, confirm)
    if (res.ok) {
      setPwMsg({ type: 'ok', text: t('settings.passwordChanged') })
      setCurrent(''); setNext(''); setConfirm('')
    } else {
      const text =
        res.error === 'wrong_password' ? t('settings.wrongCurrentPassword')
          : res.error === 'too_short' ? t('settings.passwordTooShort')
          : res.error === 'mismatch' ? t('settings.passwordMismatch')
          : t('settings.passwordError')
      setPwMsg({ type: 'error', text })
    }
    setTimeout(() => setPwMsg(null), 3000)
  }

  const TABS = [
    { key: 'profile' as Tab,  icon: User, label: t('patient.patientSettings') },
    { key: 'security' as Tab, icon: Lock, label: t('settings.security') },
  ]

  function saveProfile() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('patient.patientSettings')}</h1>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-[var(--bg-tertiary)] p-1 rounded-xl w-fit">
        {TABS.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={[
              'flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all',
              tab === key
                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]',
            ].join(' ')}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === 'profile' && (
        <div className="space-y-4">
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-6 space-y-4">
            <h2 className="text-base font-bold text-[var(--text-primary)]">Profil ma'lumotlari</h2>
            {saved && (
              <p className="text-green-600 text-sm font-medium">✓ Saqlandi!</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "To'liq ism",    value: name, onChange: (v: string) => setName(v), disabled: false },
                { label: 'Telefon',       value: PATIENT_PROFILE.phone,     onChange: () => {}, disabled: true },
                { label: 'Tashxis',       value: PATIENT_PROFILE.diagnosis, onChange: () => {}, disabled: true },
                { label: "Tug'ilgan sana", value: PATIENT_PROFILE.dob,      onChange: () => {}, disabled: true },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-medium text-[var(--text-secondary)]">{f.label}</label>
                  <input
                    value={f.value}
                    onChange={e => f.onChange(e.target.value)}
                    disabled={f.disabled}
                    className={[
                      'mt-1 w-full px-3 py-2 border rounded-lg text-sm text-[var(--text-primary)] outline-none',
                      f.disabled
                        ? 'bg-[var(--bg-tertiary)] border-[var(--border-secondary)] text-[var(--text-tertiary)] cursor-not-allowed'
                        : 'bg-[var(--bg-secondary)] border-[var(--border-secondary)] focus:border-[var(--fg-brand-primary)]',
                    ].join(' ')}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={saveProfile}
                className="px-4 py-2 bg-[var(--fg-brand-primary)] text-white rounded-lg text-sm font-semibold hover:opacity-90"
              >
                {t('settings.saveChanges')}
              </button>
            </div>
          </div>

          {/* Telegram linking */}
          <TelegramCard />
        </div>
      )}

      {/* Security tab */}
      {tab === 'security' && (
        <div className="space-y-4">
          {/* Change password */}
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-6 space-y-4">
            <h2 className="text-base font-bold text-[var(--text-primary)]">{t('settings.changePassword')}</h2>
            {pwMsg && (
              <p className={['text-sm font-medium', pwMsg.type === 'ok' ? 'text-green-600' : 'text-red-500'].join(' ')}>
                {pwMsg.text}
              </p>
            )}
            {[
              { label: t('settings.currentPassword'), value: current, set: setCurrent },
              { label: t('settings.newPassword'),     value: next,    set: setNext },
              { label: t('settings.confirmPassword'), value: confirm, set: setConfirm },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs font-medium text-[var(--text-secondary)]">{f.label}</label>
                <input
                  type="password"
                  value={f.value}
                  onChange={e => f.set(e.target.value)}
                  className="mt-1 w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg text-sm text-[var(--text-primary)] outline-none focus:border-[var(--fg-brand-primary)]"
                />
              </div>
            ))}
            <button
              onClick={handleChangePassword}
              disabled={!current || !next || !confirm}
              className="px-4 py-2 bg-[var(--fg-brand-primary)] text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-40"
            >
              {t('settings.changePassword')}
            </button>
          </div>

          {/* Active sessions */}
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-6">
            <h2 className="text-base font-bold text-[var(--text-primary)] mb-1">{t('settings.activeSessions')}</h2>
            <p className="text-xs text-[var(--text-tertiary)] mb-4">Hozir tizimga kirgan qurilmalar</p>
            <div className="space-y-3">
              {sessions.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)]">
                  <div className="flex items-center gap-3">
                    <Monitor size={16} className="text-[var(--text-tertiary)] shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{s.device}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{s.ip} · {s.last}</p>
                    </div>
                  </div>
                  {s.current
                    ? <span className="text-xs font-semibold text-[var(--fg-brand-primary)] bg-blue-50 dark:bg-blue-950/20 px-2 py-1 rounded-full">{t('settings.current')}</span>
                    : <button
                        onClick={() => setSessions(prev => prev.filter(x => x.id !== s.id))}
                        className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
                      >
                        <LogOut size={12} />
                        {t('settings.logoutSession')}
                      </button>
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
