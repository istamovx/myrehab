import { Users, Home, ShieldCheck, AlertTriangle, ChevronRight } from 'lucide-react'

const STATS = [
  { label: "Biriktirilgan bemorlar", value: '12', note: 'Chilanzar tumani', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20' },
  { label: "Bugungi uy tashrifi", value: '4', note: "Masofa bo'yicha optimallashtirilgan", icon: Home, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/20' },
  { label: "Tekshirilgan dorilar", value: '8 / 12', note: '4 bemor qoldi', icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/20' },
  { label: "Ochiq eskalatsiyalar", value: '1', note: "Karimov A. — og'riq oshishi", icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/20' },
]

const SCHEDULE = [
  { time: '09:00', patient: 'Karimov Alisher', context: 'Insult reabilitatsiyasi · 18-kun', mahalla: 'Bunyodkor', type: "Vital + mashq kuzatish", priority: 'high' },
  { time: '10:30', patient: 'Toshev Bobur',    context: 'Yurak reabilitatsiyasi · 3 kun o\'tkazildi', mahalla: 'Tinchlik', type: "Dori tekshiruvi + rioya", priority: 'urgent' },
  { time: '12:00', patient: 'Tursunova Dilnoza', context: "Onkologiya reab. · BIRINCHI TASHRIFM", mahalla: 'Bunyodkor', type: "Dastlabki baholash", priority: 'new' },
  { time: '14:00', patient: 'Azimova Nigora',  context: "Bel og'rig'i reab. · tana joyi tekshiruvi", mahalla: 'Navoi', type: "Tana joyi baholash + foto", priority: 'routine' },
]

const ENROLLMENTS = [
  {
    patient: 'Tursunova Dilnoza (P-1042)',
    desc: "Dr. Maruf S. tomonidan biriktirildi (Toshkent flagman klinikasi) · Post-op onkologiya reab. · Poliklinika #42 · Birinchi tashrifm 48 soat ichida",
    isNew: true,
  },
  {
    patient: 'Rahimov Sardor (P-1033)',
    desc: "Yurak reabilitatsiyasi post-PCI · Navoi mahallasi · 2 tashrifm bajarildi · Keyingisi: 11-aprel",
    isNew: false,
  },
]

const PRIORITY_BADGE: Record<string, string> = {
  high:    'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
  urgent:  'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
  new:     'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
  routine: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
}

const PRIORITY_LABEL: Record<string, string> = {
  high:    'Yuqori',
  urgent:  'Shoshilinch',
  new:     'Yangi',
  routine: 'Oddiy',
}

export function NurseDashboardPage() {
  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Patronaj hamshira paneli</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Oilaviy poliklinika #42, Chilanzar tumani</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-[var(--border-secondary)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
            Marshrutni optimallashtirish
          </button>
          <button className="px-4 py-2 rounded-lg bg-[var(--fg-brand-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            Navbatdagi tashrif
          </button>
        </div>
      </div>

      {/* Territory banner */}
      <div className="bg-[var(--bg-brand-primary)] border border-[var(--border-brand)] rounded-xl p-4">
        <div className="flex items-start gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[var(--text-primary)]">Oilaviy poliklinika #42 — Chilanzar tumani</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Mahallalar: Bunyodkor, Tinchlik, Navoi. 12 faol reabilitatsiya bemori.
              Poliklinika shifokori: Dr. Karimova Z.T.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">Ertalabki smenasi</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400">Navbatda</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map(stat => (
          <div key={stat.label} className={['rounded-xl border border-[var(--border-secondary)] p-4', stat.bg].join(' ')}>
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={16} className={stat.color} />
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{stat.label}</p>
            <p className="text-xs text-[var(--text-tertiary)] opacity-75">{stat.note}</p>
          </div>
        ))}
      </div>

      {/* New enrollments */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border-secondary)]">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Yangi bemor biriktirishlari</h2>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Shifokor bemorni ro'yxatga olganda, tizim poliklinika hududiga qarab hamshirani avtomatik biriktiradi.</p>
        </div>
        <div className="divide-y divide-[var(--border-secondary)]">
          {ENROLLMENTS.map((item, i) => (
            <div key={i} className={['flex items-center gap-4 px-4 py-3', item.isNew ? 'bg-[var(--bg-brand-primary)]' : ''].join(' ')}>
              <div className={['w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0', item.isNew ? 'bg-[var(--fg-brand-primary)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-tertiary)]'].join(' ')}>
                {item.isNew ? 'YANGI' : 'i'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{item.patient}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{item.desc}</p>
              </div>
              {item.isNew && (
                <button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--fg-brand-primary)] text-white hover:opacity-90 transition-opacity shrink-0">
                  Qabul qilish
                </button>
              )}
              {!item.isNew && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 shrink-0">Faol</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Today's route */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border-secondary)]">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Bugungi uy tashriflari marshrutsi</h2>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Ustuvorlik, so'ng geografik yaqinlik bo'yicha tartiblangan</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                {['Vaqt', 'Bemor', 'Mahalla', "Tashrifm turi", 'Ustuvorlik', ''].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-[var(--text-tertiary)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-secondary)]">
              {SCHEDULE.map((row, i) => (
                <tr key={i} className="hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="px-3 py-2.5 text-xs font-semibold text-[var(--text-secondary)]">{row.time}</td>
                  <td className="px-3 py-2.5">
                    <p className="text-xs font-semibold text-[var(--text-primary)]">{row.patient}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{row.context}</p>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-[var(--text-secondary)]">{row.mahalla}</td>
                  <td className="px-3 py-2.5 text-xs text-[var(--text-secondary)]">{row.type}</td>
                  <td className="px-3 py-2.5">
                    <span className={['text-xs font-semibold px-2 py-0.5 rounded-full', PRIORITY_BADGE[row.priority]].join(' ')}>
                      {PRIORITY_LABEL[row.priority]}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <button className="flex items-center gap-0.5 text-xs font-semibold text-[var(--fg-brand-primary)] hover:opacity-80 transition-opacity">
                      Boshlash <ChevronRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
