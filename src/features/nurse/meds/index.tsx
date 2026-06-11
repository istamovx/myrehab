import { useState } from 'react'
import { Pill } from 'lucide-react'

const MED_SCHEDULE = [
  { patient: 'Karimov A.',   mahalla: 'Bunyodkor', drug: 'Insulin 10 BIR',      route: "Teri ostiga",  time: '09:00', status: 'done'  },
  { patient: 'Toshev B.',    mahalla: 'Tinchlik',  drug: 'Yara boylami almashtirish', route: "Tashqi", time: '10:30', status: 'due'   },
  { patient: 'Azimova N.',   mahalla: 'Navoi',     drug: 'Enoksaparin 40 mg',    route: "Teri ostiga",  time: '12:00', status: 'sched' },
  { patient: 'Rahimov S.',   mahalla: 'Tinchlik',  drug: 'Geparin 5000 BIR',     route: "Teri ostiga",  time: '14:00', status: 'sched' },
  { patient: 'Tursunova D.', mahalla: 'Bunyodkor', drug: 'Faqat dona sanayi',   route: '—',            time: '12:30', status: 'sched' },
]

const PILL_RECON = [
  { patient: 'Karimov A.',   drugs: "Metformin ✓ · Lizinopril ✓ · Aspirin ⚠ 2 ta yetishmayapti", status: 'warn'  },
  { patient: 'Toshev B.',    drugs: "Klopidogrel ✓ · Atorvastatin ✓ · Metoprolol ✓",             status: 'ok'    },
  { patient: 'Azimova N.',   drugs: "Ibuprofen ✓ · Omeprazol ✓",                                  status: 'ok'    },
  { patient: 'Tursunova D.', drugs: "Bu hafta hali tekshirilmagan",                                status: 'pending' },
]

const STATS = [
  { label: "Bugungi yuborishlar", value: '5', note: '3 bajarildi, 2 rejalashtirilgan' },
  { label: "Bu hafta dona sanayish", value: '8 / 12', note: '2 bemorda farq bor' },
  { label: "Noxush reaksiyalar (oy)", value: '0', note: 'Toza yozuv', color: 'text-green-600' },
  { label: "Saqlash muammolari", value: '1', note: "Toshev B. — insulin muzlatilmagan", color: 'text-orange-500' },
]

const STATUS_BADGE: Record<string, string> = {
  done:    'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400',
  due:     'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400',
  sched:   'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
}

const STATUS_LABEL: Record<string, string> = {
  done:  "Yuborildi",
  due:   "Muddati yetdi",
  sched: "Rejalashtirilgan",
}

export function NurseMedsPage() {
  const [reported, setReported] = useState(false)

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dori berish</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Hududdagi barcha bemorlar bo'yicha dona sanayish, in'eksiyalar va noxush reaksiyalar</p>
        </div>
        <button
          onClick={() => setReported(true)}
          className={[
            'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
            reported
              ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/20'
              : 'bg-[var(--fg-brand-primary)] text-white hover:opacity-90',
          ].join(' ')}
        >
          {reported ? '✓ Noxush reaksiya yuborildi' : 'Noxush reaksiya haqida xabar berish'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map(stat => (
          <div key={stat.label} className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
            <div className="flex items-center gap-2 mb-1">
              <Pill size={14} className="text-[var(--fg-brand-primary)]" />
            </div>
            <p className={['text-2xl font-bold', stat.color ?? 'text-[var(--text-primary)]'].join(' ')}>{stat.value}</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{stat.label}</p>
            <p className="text-xs text-[var(--text-tertiary)] opacity-75">{stat.note}</p>
          </div>
        ))}
      </div>

      {/* Schedule */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border-secondary)]">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Dori berish jadvali</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                {['Bemor', 'Mahalla', 'Dori', "Yo'li", 'Vaqt', 'Holat', ''].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-[var(--text-tertiary)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-secondary)]">
              {MED_SCHEDULE.map((row, i) => (
                <tr key={i} className="hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="px-3 py-2.5 text-xs font-semibold text-[var(--text-primary)]">{row.patient}</td>
                  <td className="px-3 py-2.5 text-xs text-[var(--text-secondary)]">{row.mahalla}</td>
                  <td className="px-3 py-2.5 text-xs text-[var(--text-secondary)]">{row.drug}</td>
                  <td className="px-3 py-2.5 text-xs text-[var(--text-secondary)]">{row.route}</td>
                  <td className="px-3 py-2.5 text-xs font-medium text-[var(--text-primary)]">{row.time}</td>
                  <td className="px-3 py-2.5">
                    <span className={['text-xs font-semibold px-2 py-0.5 rounded-full', STATUS_BADGE[row.status]].join(' ')}>
                      {STATUS_LABEL[row.status]}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <button className="text-xs font-semibold text-[var(--fg-brand-primary)] hover:opacity-80">
                      {row.status === 'done' ? "Ko'rish" : 'Boshlash'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pill reconciliation */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border-secondary)]">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Bu hafta dona sanayish</h2>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Hududdagi barcha bemorlar bo'yicha kutilgan va haqiqiy dona soni taqqoslash</p>
        </div>
        <div className="divide-y divide-[var(--border-secondary)]">
          {PILL_RECON.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--bg-secondary)] transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[var(--text-primary)]">{item.patient}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{item.drugs}</p>
              </div>
              <span className={[
                'text-xs font-semibold px-2 py-1 rounded-full shrink-0',
                item.status === 'ok'
                  ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400'
                  : item.status === 'warn'
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
              ].join(' ')}>
                {item.status === 'ok' ? 'Mos' : item.status === 'warn' ? 'Farq bor' : 'Kutilmoqda'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
