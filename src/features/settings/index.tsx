import { useState } from 'react'
import {
  User, Building2, Bell, Lock, CheckCircle2, LogOut, Monitor,
  Search, ShieldCheck, Clock,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'

// ── Types ────────────────────────────────────────────────────────────────────

type Tab = 'profile' | 'clinics' | 'notifications' | 'security'

// ── Mock data ─────────────────────────────────────────────────────────────────

const DOCTOR = {
  name:           'Muhrim Devonov',
  specialization: 'Orthopedics',
  phone:          '998900010101',
  clinic:         'MyRehab Medical',
  initials:       'MD',
}

const MY_REQUESTS = [
  { id: 1, clinic: 'Darmon Med', initials: 'DM', sentAt: '23.05.2026', status: 'pending' },
]

const SESSIONS = [
  { id: 1,  device: 'Chrome · Windows', method: 'Parol', ip: '172.18.0.6', last: 'hozir',         current: true  },
  { id: 2,  device: 'Chrome · Android', method: 'Parol', ip: '172.18.0.6', last: '11 soat oldin', current: false },
  { id: 3,  device: 'Browser · Desktop',method: 'Parol', ip: '172.18.0.6', last: '19 soat oldin', current: false },
  { id: 4,  device: 'Browser · Desktop',method: 'Parol', ip: '172.18.0.6', last: '19 soat oldin', current: false },
  { id: 5,  device: 'Chrome · Windows', method: 'Parol', ip: '172.18.0.6', last: '18 soat oldin', current: false },
  { id: 6,  device: 'Chrome · Linux',   method: 'Parol', ip: '172.18.0.6', last: '20 soat oldin', current: false },
  { id: 7,  device: 'Chrome · Windows', method: 'Parol', ip: '172.18.0.6', last: '1 kun oldin',   current: false },
  { id: 8,  device: 'Chrome · Linux',   method: 'Parol', ip: '172.18.0.6', last: '1 kun oldin',   current: false },
  { id: 9,  device: 'Chrome · Linux',   method: 'Parol', ip: '172.18.0.6', last: '2 kun oldin',   current: false },
  { id: 10, device: 'Chrome · Windows', method: 'Parol', ip: '172.18.0.6', last: '3 kun oldin',   current: false },
  { id: 11, device: 'Chrome · Linux',   method: 'Parol', ip: '172.18.0.6', last: '3 kun oldin',   current: false },
  { id: 12, device: 'Chrome · Linux',   method: 'Parol', ip: '172.18.0.6', last: '3 kun oldin',   current: false },
  { id: 13, device: 'Chrome · Linux',   method: 'Parol', ip: '172.18.0.6', last: '10 kun oldin',  current: false },
  { id: 14, device: 'Chrome · Linux',   method: 'Parol', ip: '172.18.0.6', last: '12 kun oldin',  current: false },
  { id: 15, device: 'Chrome · Linux',   method: 'Parol', ip: '172.18.0.6', last: '13 kun oldin',  current: false },
  { id: 16, device: 'Chrome · Linux',   method: 'Parol', ip: '172.18.0.6', last: '15 kun oldin',  current: false },
]

// ── Toggle switch ─────────────────────────────────────────────────────────────

function ToggleSwitch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={[
        'relative w-10 h-6 rounded-full transition-colors shrink-0',
        on ? 'bg-teal-500' : 'bg-[var(--bg-tertiary)]',
      ].join(' ')}
    >
      <span className={[
        'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
        on ? 'translate-x-4' : 'translate-x-0.5',
      ].join(' ')} />
    </button>
  )
}

// ── Tab: Profile ─────────────────────────────────────────────────────────────

function ProfileTab() {
  const [name, setName] = useState(DOCTOR.name)
  const [saved, setSaved] = useState(false)
  const dirty = name !== DOCTOR.name

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] p-6 space-y-6">
      <h2 className="text-base font-bold text-[var(--text-primary)]">Shifokor profili</h2>

      {/* Avatar + verified */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
          {DOCTOR.initials}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-base font-bold text-[var(--text-primary)]">Dr. {name}</p>
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
              Tasdiqlangan
            </span>
          </div>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">{DOCTOR.specialization} · {DOCTOR.clinic}</p>
        </div>
      </div>

      {saved && (
        <p className="text-green-600 text-sm font-medium">✓ O'zgarishlar saqlandi!</p>
      )}

      {/* Form fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-[var(--text-secondary)]">To'liq ism</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="mt-1.5 w-full px-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-teal-500 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[var(--text-secondary)]">Mutaxassislik</label>
          <input
            value={DOCTOR.specialization}
            disabled
            className="mt-1.5 w-full px-3 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm text-[var(--text-tertiary)] cursor-not-allowed"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-[var(--text-secondary)]">Telefon</label>
          <div className="relative mt-1.5">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-quaternary)] text-xs">📞</span>
            <input
              value={DOCTOR.phone}
              disabled
              className="w-full pl-7 pr-3 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm text-[var(--text-tertiary)] cursor-not-allowed"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-[var(--text-secondary)]">Klinika</label>
          <input
            value={DOCTOR.clinic}
            disabled
            className="mt-1.5 w-full px-3 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] rounded-xl text-sm text-[var(--text-tertiary)] cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!dirty}
          className={[
            'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
            dirty
              ? 'bg-teal-500 text-white hover:bg-teal-600'
              : 'bg-[var(--bg-tertiary)] text-[var(--text-quaternary)] cursor-not-allowed',
          ].join(' ')}
        >
          Saqlash
        </button>
      </div>
    </div>
  )
}

// ── Tab: Clinics ──────────────────────────────────────────────────────────────

function ClinicsTab() {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-4">
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] p-5">
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">Klinika takliflari</h3>
        <p className="text-sm text-[var(--text-tertiary)]">Faol takliflar yo'q.</p>
      </div>

      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] p-5">
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">Mening so'rovlarim</h3>
        <div className="space-y-2">
          {MY_REQUESTS.map(r => (
            <div key={r.id} className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {r.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{r.clinic}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">Yuborilgan {r.sentAt}</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                Kutilmoqda
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Mavjud klinikalar</h3>
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-quaternary)]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Klinika, shahar qidiring"
              className="pl-7 pr-3 py-1.5 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg text-xs text-[var(--text-primary)] outline-none focus:border-teal-500 w-48"
            />
          </div>
        </div>
        <p className="text-sm text-[var(--text-tertiary)]">Hozircha klinikalar mavjud emas.</p>
      </div>
    </div>
  )
}

// ── Tab: Notifications ────────────────────────────────────────────────────────

function NotifRow({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border-secondary)] last:border-0">
      <span className="text-sm text-[var(--text-primary)]">{label}</span>
      <ToggleSwitch on={on} onChange={onChange} />
    </div>
  )
}

function NotificationsTab() {
  const [workAlerts,    setWorkAlerts]    = useState(true)
  const [planReminders, setPlanReminders] = useState(true)
  const [docReminders,  setDocReminders]  = useState(true)
  const [evidenceNews,  setEvidenceNews]  = useState(true)
  const [medNews,       setMedNews]       = useState(true)
  const [clinicalCases, setClinicalCases] = useState(true)

  return (
    <div className="space-y-4">
      {/* Critical — always on */}
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Kritik bemor xavfsizligi</p>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Vital ko'rsatkichlar · Shoshilinch · Og'ir salbiy holatlar</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-full shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            Doim yoqilgan
          </span>
        </div>
      </div>

      {/* Work alerts */}
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] p-5">
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Kundalik ish ogohlantirishlari</h3>
        <NotifRow label="Ish ogohlantirishlarini olish" on={workAlerts} onChange={setWorkAlerts} />
      </div>

      {/* Digest items */}
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] p-5">
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Kundalik dayjest tarkibi</h3>
        <NotifRow label="Reja muddati eslatmalari"  on={planReminders}  onChange={setPlanReminders}  />
        <NotifRow label="Hujjat eslatmalari"        on={docReminders}   onChange={setDocReminders}   />
        <NotifRow label="Dalil asosida yangiliklar" on={evidenceNews}   onChange={setEvidenceNews}   />
        <NotifRow label="Tibbiyot yangiliklari"     on={medNews}        onChange={setMedNews}        />
        <NotifRow label="Klinik holatlar"           on={clinicalCases}  onChange={setClinicalCases}  />
      </div>
    </div>
  )
}

// ── Tab: Security ─────────────────────────────────────────────────────────────

function SecurityTab() {
  const [sessions, setSessions] = useState(SESSIONS)
  const otherCount = sessions.filter(s => !s.current).length

  const changePassword = useAuthStore(s => s.changePassword)
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  function handleChangePassword() {
    const res = changePassword(current, next, confirm)
    if (res.ok) {
      setMsg({ type: 'ok', text: "✓ Parol muvaffaqiyatli o'zgartirildi!" })
      setCurrent(''); setNext(''); setConfirm('')
    } else {
      const text =
        res.error === 'wrong_password' ? "Joriy parol noto'g'ri"
          : res.error === 'too_short' ? "Yangi parol kamida 4 ta belgidan iborat bo'lishi kerak"
          : res.error === 'mismatch' ? 'Parollar mos kelmadi'
          : 'Xatolik yuz berdi'
      setMsg({ type: 'error', text })
    }
    setTimeout(() => setMsg(null), 3000)
  }

  const fields = [
    { label: 'Joriy parol', value: current, set: setCurrent },
    { label: 'Yangi parol', value: next, set: setNext },
    { label: 'Parolni tasdiqlang', value: confirm, set: setConfirm },
  ]

  return (
    <div className="space-y-4">
      {/* Change password */}
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] p-5 space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">Parol</h3>
        {msg && (
          <p className={['text-sm font-medium', msg.type === 'ok' ? 'text-green-600' : 'text-red-500'].join(' ')}>
            {msg.text}
          </p>
        )}
        {fields.map(f => (
          <div key={f.label}>
            <label className="text-xs font-semibold text-[var(--text-secondary)]">{f.label}</label>
            <input
              type="password"
              value={f.value}
              onChange={e => f.set(e.target.value)}
              className="mt-1.5 w-full px-3 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-teal-500"
            />
          </div>
        ))}
        <button
          onClick={handleChangePassword}
          disabled={!current || !next || !confirm}
          className="px-5 py-2.5 bg-teal-500 text-white rounded-xl text-sm font-semibold hover:bg-teal-600 transition-colors disabled:opacity-40"
        >
          Parolni o'zgartirish
        </button>
      </div>

      {/* Sessions */}
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Faol seanslar</h3>
          {otherCount > 0 && (
            <button
              onClick={() => setSessions(prev => prev.filter(s => s.current))}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Boshqa qurilmalardan chiqish ({otherCount})
            </button>
          )}
        </div>
        <p className="text-xs text-[var(--text-tertiary)] mb-4">
          Hozir kirgan qurilmalar. Notanish bo'lsa bekor qiling.
        </p>
        <div className="space-y-2">
          {sessions.map(s => (
            <div key={s.id} className="flex items-start justify-between gap-3 p-3 bg-[var(--bg-secondary)] rounded-xl">
              <div className="flex items-start gap-3">
                <Monitor size={15} className="text-[var(--text-tertiary)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{s.device}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap text-[var(--text-tertiary)]">
                    <span className="text-xs">{s.method}</span>
                    <span className="text-xs">·</span>
                    <span className="text-xs">{s.ip}</span>
                    <span className="text-xs">·</span>
                    <span className="flex items-center gap-1 text-xs">
                      <Clock size={10} />
                      {s.last}
                    </span>
                  </div>
                </div>
              </div>
              {s.current
                ? (
                  <span className="shrink-0 flex items-center gap-1 text-xs font-semibold text-teal-600 bg-teal-50 dark:bg-teal-900/20 px-2.5 py-1 rounded-full">
                    <CheckCircle2 size={11} />
                    Joriy
                  </span>
                )
                : (
                  <button
                    onClick={() => setSessions(prev => prev.filter(x => x.id !== s.id))}
                    className="shrink-0 flex items-center gap-1 text-xs font-semibold text-[var(--text-tertiary)] hover:text-red-600 transition-colors"
                  >
                    <LogOut size={12} />
                    Bekor qilish
                  </button>
                )
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main Settings page ────────────────────────────────────────────────────────

const TABS: { key: Tab; icon: React.ElementType; label: string }[] = [
  { key: 'profile',       icon: User,      label: 'Profil'          },
  { key: 'clinics',       icon: Building2, label: 'Klinikalar'      },
  { key: 'notifications', icon: Bell,      label: 'Bildirishnomalar'},
  { key: 'security',      icon: Lock,      label: 'Xavfsizlik'      },
]

export function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)]">Sozlamalar</h1>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Left tab sidebar */}
        <nav className="flex flex-row sm:flex-col gap-1 sm:w-52 shrink-0">
          {TABS.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={[
                'flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all',
                tab === key
                  ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]',
              ].join(' ')}
            >
              <Icon
                size={16}
                className={tab === key ? 'text-teal-500' : 'text-[var(--text-quaternary)]'}
              />
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {tab === 'profile'       && <ProfileTab />}
          {tab === 'clinics'       && <ClinicsTab />}
          {tab === 'notifications' && <NotificationsTab />}
          {tab === 'security'      && <SecurityTab />}
        </div>
      </div>
    </div>
  )
}
