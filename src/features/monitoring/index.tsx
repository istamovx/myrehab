import { useState } from 'react'
import { AlertTriangle, TrendingDown, MessageSquare, RotateCcw, ChevronRight, Unlock } from 'lucide-react'

const ALERTS = [
  {
    id: '1', patient: 'Dilnoza T.', issue: 'Dori-mashq o\'zaro ta\'siri', detail: 'Reja tasdiqlash bloklangan',
    severity: 'critical' as const, action: 'Bemorni ochish',
  },
  {
    id: '2', patient: 'Nilufar K.', issue: 'Rioya pasayishi', detail: '92% → 78% 7 kunda',
    severity: 'moderate' as const, action: 'Kartani ko\'rish',
  },
  {
    id: '3', patient: 'Sardor R.', issue: 'Simptom xabari', detail: 'Harakatda nafas qisishi',
    severity: 'moderate' as const, action: 'Triaj',
  },
  {
    id: '4', patient: 'Anvar A.', issue: 'Reja muddati tugaydi', detail: 'Bugun yarim kechaga qadar ko\'rib chiqish kerak',
    severity: 'routine' as const, action: 'Ko\'rib chiqish',
  },
]

const MISSED_SESSIONS = [
  {
    id: '1', patient: 'Toshev Bobur (P-1067)', context: 'Yurak reabilitatsiyasi · 3 sessiya o\'tkazib yuborildi',
    days: 3, severity: 'critical' as const, note: 'Hamshira qo\'ng\'iroq qildi: javob yo\'q. Sizga topshirildi',
  },
  {
    id: '2', patient: 'Rahimov Sardor (P-1033)', context: 'Post-PTCA · 2 sessiya o\'tkazib yuborildi',
    days: 2, severity: 'moderate' as const, note: 'Hamshira tashrifi ertaga rejalashtirilgan',
  },
]

const AUTO_BLOCKED = [
  {
    id: '1', patient: 'Karimov Alisher (P-1018)', reason: "AD 192/115 bugun o'lchandi",
    detail: "Barcha mashqlar avtomatik bloklangan. Sizning ruxsatingiz kutilmoqda",
    type: 'BP',
  },
]

const RENEWALS = [
  { patient: 'Azimova Nigora',  phase: '2-faza (40/42 kun)', endsOn: '10-aprel', action: 'Yangilash yoki chiqarish' },
  { patient: 'Rahimov Sardor',  phase: '1-faza (14/14 kun)', endsOn: '11-aprel', action: '2-fazaga o\'tish' },
]

const SEVERITY_BADGE: Record<'critical' | 'moderate' | 'routine', string> = {
  critical: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
  moderate: 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400',
  routine:  'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
}

const SEVERITY_LABEL: Record<'critical' | 'moderate' | 'routine', string> = {
  critical: 'Kritik',
  moderate: "O'rtacha",
  routine:  'Oddiy',
}

export function MonitoringPage() {
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set())

  function unlock(id: string) {
    setUnlockedIds(prev => new Set([...prev, id]))
  }

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Monitoring</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Ogohlantirishlar, rioya va muolaja jarayoni</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-[var(--fg-brand-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          Murojaat yuborish
        </button>
      </div>

      {/* Alert stream */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border-secondary)] flex items-center gap-2">
          <AlertTriangle size={16} className="text-orange-500" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Ogohlantirishlar oqimi</h2>
          <span className="ml-auto text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">{ALERTS.length}</span>
        </div>
        <div className="divide-y divide-[var(--border-secondary)]">
          {ALERTS.map(alert => (
            <div key={alert.id} className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--bg-secondary)] transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{alert.patient}</span>
                  <span className="text-sm text-[var(--text-secondary)]">—</span>
                  <span className="text-sm text-[var(--text-secondary)]">{alert.issue}</span>
                </div>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{alert.detail}</p>
              </div>
              <span className={['text-xs font-semibold px-2 py-1 rounded-full shrink-0', SEVERITY_BADGE[alert.severity]].join(' ')}>
                {SEVERITY_LABEL[alert.severity]}
              </span>
              <button className="flex items-center gap-1 text-xs font-semibold text-[var(--fg-brand-primary)] hover:opacity-80 transition-opacity shrink-0">
                {alert.action} <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Missed sessions + Auto-blocked */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border-secondary)] flex items-center gap-2">
            <RotateCcw size={16} className="text-red-500" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">O'tkazib yuborilgan sessiyalar</h2>
          </div>
          <div className="divide-y divide-[var(--border-secondary)]">
            {MISSED_SESSIONS.map(item => (
              <div key={item.id} className={[
                'p-4',
                item.severity === 'critical' ? 'bg-red-50 dark:bg-red-950/10' : 'bg-orange-50 dark:bg-orange-950/10',
              ].join(' ')}>
                <div className="flex items-start gap-3">
                  <div className={[
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
                    item.severity === 'critical' ? 'bg-red-100 text-red-600 dark:bg-red-900/40' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/40',
                  ].join(' ')}>
                    {item.days}k
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{item.patient}</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{item.context}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">{item.note}</p>
                  </div>
                  <button className="text-xs font-semibold text-[var(--fg-brand-primary)] border border-[var(--border-brand)] px-2.5 py-1 rounded-lg hover:bg-[var(--bg-brand-primary)] transition-colors shrink-0">
                    Qo'ng'iroq
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border-secondary)] flex items-center gap-2">
            <TrendingDown size={16} className="text-red-500" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Avtomatik bloklangan bemorlar</h2>
          </div>
          <div className="divide-y divide-[var(--border-secondary)]">
            {AUTO_BLOCKED.map(item => (
              <div key={item.id} className="p-4 bg-red-50 dark:bg-red-950/10">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center text-xs font-bold shrink-0">
                    {item.type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{item.patient}</p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{item.reason}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">{item.detail}</p>
                  </div>
                  {unlockedIds.has(item.id) ? (
                    <span className="text-xs font-semibold text-green-600">Blok olib tashlandi</span>
                  ) : (
                    <button
                      onClick={() => unlock(item.id)}
                      className="flex items-center gap-1 text-xs font-semibold bg-[var(--fg-brand-primary)] text-white px-2.5 py-1 rounded-lg hover:opacity-90 transition-opacity shrink-0"
                    >
                      <Unlock size={12} /> Blokni ochish
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plan renewals */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border-secondary)] flex items-center gap-2">
          <MessageSquare size={16} className="text-blue-500" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Bu hafta yangilanishi kerak bo'lgan rejalar</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                {['Bemor', 'Joriy faza', 'Tugash sanasi', 'Amal', ''].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-[var(--text-tertiary)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-secondary)]">
              {RENEWALS.map((row, i) => (
                <tr key={i} className="hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="px-4 py-2.5 text-xs font-semibold text-[var(--text-primary)]">{row.patient}</td>
                  <td className="px-4 py-2.5 text-xs text-[var(--text-secondary)]">{row.phase}</td>
                  <td className="px-4 py-2.5 text-xs text-orange-500 font-medium">{row.endsOn}</td>
                  <td className="px-4 py-2.5 text-xs text-[var(--text-secondary)]">{row.action}</td>
                  <td className="px-4 py-2.5">
                    <button className="text-xs font-semibold text-[var(--fg-brand-primary)] hover:opacity-80 transition-opacity">
                      Reja yaratish
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
