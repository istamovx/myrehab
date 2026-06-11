import { useState } from 'react'
import { TrendingUp, TrendingDown, Activity, Brain, Heart, ClipboardList } from 'lucide-react'

const ASSESSMENT_HISTORY = [
  { date: '7-aprel',  barthel: 75, fim: 92, vas: 4, phq9: 6,  assessor: 'Dr. Maruf S.' },
  { date: '28-mart',  barthel: 70, fim: 85, vas: 5, phq9: 8,  assessor: 'Dr. Maruf S.' },
  { date: '14-mart',  barthel: 65, fim: 78, vas: 7, phq9: 10, assessor: 'Dr. Maruf S.' },
]

const OUTCOME_CARDS = [
  {
    label: 'Barthel Indeksi',
    value: 75,
    max: 100,
    prev: 65,
    icon: Activity,
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-950/20',
    desc: 'Kundalik faoliyat mustaqilligi',
  },
  {
    label: 'FIM Balli',
    value: 92,
    max: 126,
    prev: 78,
    icon: ClipboardList,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    desc: "O'rtacha mustaqillik",
  },
  {
    label: 'VAS Og\'riq',
    value: 4,
    max: 10,
    prev: 7,
    icon: Heart,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    desc: "Engil-o'rtacha darajada",
  },
  {
    label: 'PHQ-9 Kayfiyat',
    value: 6,
    max: 27,
    prev: 10,
    icon: Brain,
    color: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    desc: 'Engil',
  },
]


export function PatientOutcomesPage() {
  const [showSelfAssess, setShowSelfAssess] = useState(false)
  const [pain, setPain] = useState(4)
  const [fatigue, setFatigue] = useState(3)
  const [selfMood, setSelfMood] = useState('O\'rtacha')
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Natijalar</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Klinik baholash ko'rsatkichlari</p>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-2 gap-3">
        {OUTCOME_CARDS.map(card => {
          const improved = card.value > card.prev ? card.label !== 'VAS Og\'riq' : card.label === 'VAS Og\'riq'
          const diff = Math.abs(card.value - card.prev)
          return (
            <div key={card.label} className={['rounded-xl p-4 border border-[var(--border-secondary)]', card.bg].join(' ')}>
              <div className="flex items-center gap-2 mb-2">
                <card.icon size={16} className={card.color} />
                <span className="text-xs font-semibold text-[var(--text-secondary)]">{card.label}</span>
              </div>
              <p className={['text-2xl font-bold', card.color].join(' ')}>
                {card.value}<span className="text-sm font-medium text-[var(--text-tertiary)]"> / {card.max}</span>
              </p>
              <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{card.desc}</p>
              <div className={['flex items-center gap-1 mt-2 text-xs font-semibold', improved ? 'text-green-600' : 'text-red-500'].join(' ')}>
                {improved ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{improved ? '+' : '-'}{diff} qabul qilinganidan beri</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Assessment history */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border-secondary)]">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Baholash tarixi</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                {['Sana', 'Barthel', 'FIM', 'VAS', 'PHQ-9', 'Shifokor'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-[var(--text-tertiary)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-secondary)]">
              {ASSESSMENT_HISTORY.map((row, i) => (
                <tr key={i} className={i === 0 ? 'bg-[var(--bg-brand-primary)]' : ''}>
                  <td className="px-3 py-2.5 text-xs font-medium text-[var(--text-primary)]">{row.date}</td>
                  <td className="px-3 py-2.5 text-xs font-bold text-green-600">{row.barthel}</td>
                  <td className="px-3 py-2.5 text-xs font-bold text-blue-600">{row.fim}</td>
                  <td className="px-3 py-2.5 text-xs font-bold text-orange-500">{row.vas}</td>
                  <td className="px-3 py-2.5 text-xs font-bold text-purple-600">{row.phq9}</td>
                  <td className="px-3 py-2.5 text-xs text-[var(--text-secondary)]">{row.assessor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Self-assessment */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">O'z-o'zini baholash</h2>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">Shifokor tashriflari orasida alomatlarni kuzating</p>
          </div>
          <span className="text-xs text-orange-500 font-semibold bg-orange-50 dark:bg-orange-950/20 px-2 py-1 rounded-full">Bugun kerak</span>
        </div>

        {!showSelfAssess && !submitted && (
          <button
            onClick={() => setShowSelfAssess(true)}
            className="w-full py-2.5 rounded-lg bg-[var(--fg-brand-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            O'z-o'zini baholashni boshlash
          </button>
        )}

        {submitted && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
            <span className="text-sm font-semibold">✓ Baholash saqlandi! Shifokor ko'radi.</span>
          </div>
        )}

        {showSelfAssess && !submitted && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide block mb-2">
                Bugungi og'riq darajasi
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range" min={0} max={10} step={1}
                  value={pain} onChange={e => setPain(+e.target.value)}
                  className="flex-1 accent-[var(--fg-brand-primary)]"
                />
                <span className="text-lg font-bold text-orange-500 w-8 text-center">{pain}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide block mb-2">
                Charchash darajasi
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range" min={0} max={10} step={1}
                  value={fatigue} onChange={e => setFatigue(+e.target.value)}
                  className="flex-1 accent-[var(--fg-brand-primary)]"
                />
                <span className="text-lg font-bold text-purple-500 w-8 text-center">{fatigue}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide block mb-2">
                Umumiy kayfiyat
              </label>
              <div className="flex gap-2">
                {["Yaxshi", "O'rtacha", "Yomon"].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSelfMood(opt)}
                    className={[
                      'flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors',
                      selfMood === opt
                        ? 'bg-[var(--fg-brand-primary)] text-white border-[var(--fg-brand-primary)]'
                        : 'border-[var(--border-secondary)] text-[var(--text-secondary)] hover:border-[var(--fg-brand-primary)]',
                    ].join(' ')}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => { setSubmitted(true); setShowSelfAssess(false) }}
                className="flex-1 py-2.5 rounded-lg bg-[var(--fg-brand-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Saqlash
              </button>
              <button
                onClick={() => setShowSelfAssess(false)}
                className="px-4 py-2.5 rounded-lg border border-[var(--border-secondary)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
