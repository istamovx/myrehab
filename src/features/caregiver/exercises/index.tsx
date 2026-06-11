import { useState } from 'react'
import { CheckCircle2, MessageSquare } from 'lucide-react'

type AssistLevel = 'Mustaqil' | 'Minimal' | "O'rtacha" | 'Maksimal' | 'Qaramli'

const EXERCISES = [
  {
    id: '1',
    name: "Yelka fleksiyasi ROM — 3 × 10",
    note: "Fleksiya paytida bemorning tirsagini ushlab turing. Kompensator qisqarishni kuzating.",
  },
  {
    id: '2',
    name: "O'tirgan tizza uzaytirish — 3 × 8",
    note: "Sonni mustahkamlang. Tos kompensatsiyasisiz to'liq uzaytirmani ta'minlang.",
  },
  {
    id: '3',
    name: "Yurish mashqi — 15 daqiqa",
    note: "Yonma-yon yuring. Gait yordam to'g'ri ishlatilishini ta'minlang. Charchashni kuzating.",
  },
]

const PATIENT_INFO = {
  name: 'Karimov Alisher',
  barthel: '75 / 100 (+10)',
  adherence: '78%',
  pain: '4 / 10',
  streak: '12 kun',
  nextConsult: "Payshanba, 15:00 — Dr. Maruf S.",
  nextNurse: "Juma, 09:00 — vital tekshirish",
}

const ASSIST_LEVELS: AssistLevel[] = ['Mustaqil', 'Minimal', "O'rtacha", 'Maksimal', 'Qaramli']

export function CaregiverExercisesPage() {
  const [levels, setLevels] = useState<Record<string, AssistLevel>>({
    '1': "O'rtacha",
    '2': 'Minimal',
    '3': 'Minimal',
  })
  const [done, setDone] = useState<Set<string>>(new Set())
  const [obs, setObs] = useState('')
  const [saved, setSaved] = useState(false)

  function setLevel(id: string, level: AssistLevel) {
    setLevels(prev => ({ ...prev, [id]: level }))
  }

  function toggleDone(id: string) {
    setDone(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function saveObs() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Yordamchi mashqlar</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Karimov Alisher — bugungi mashqlar</p>
      </div>

      {/* Exercises */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Bugungi mashqlar — yordam bilan</h2>
          <span className="text-xs text-[var(--text-tertiary)]">{done.size}/{EXERCISES.length} bajarildi</span>
        </div>
        <div className="space-y-4">
          {EXERCISES.map((ex) => (
            <div
              key={ex.id}
              className={[
                'rounded-xl border p-4 transition-colors',
                done.has(ex.id)
                  ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900'
                  : 'bg-[var(--bg-secondary)] border-[var(--border-secondary)]',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{ex.name}</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">{ex.note}</p>
                </div>
                <button
                  onClick={() => toggleDone(ex.id)}
                  className="shrink-0"
                >
                  <CheckCircle2
                    size={22}
                    className={done.has(ex.id) ? 'text-green-500' : 'text-[var(--text-quaternary)]'}
                  />
                </button>
              </div>

              <div>
                <p className="text-xs font-semibold text-[var(--text-tertiary)] mb-2">Yordam darajasi:</p>
                <div className="flex flex-wrap gap-1.5">
                  {ASSIST_LEVELS.map(level => (
                    <button
                      key={level}
                      onClick={() => setLevel(ex.id, level)}
                      className={[
                        'px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors',
                        levels[ex.id] === level
                          ? 'bg-[var(--fg-brand-primary)] text-white'
                          : 'bg-[var(--bg-primary)] border border-[var(--border-secondary)] text-[var(--text-secondary)] hover:border-[var(--fg-brand-primary)]',
                      ].join(' ')}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patient progress overview */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Bemor holati (faqat o'qish)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Barthel',   value: PATIENT_INFO.barthel },
            { label: 'Rioya',     value: PATIENT_INFO.adherence },
            { label: "Og'riq",    value: PATIENT_INFO.pain },
            { label: 'Seriya',    value: PATIENT_INFO.streak },
          ].map(item => (
            <div key={item.label} className="bg-[var(--bg-secondary)] rounded-lg p-3">
              <p className="text-xs text-[var(--text-tertiary)]">{item.label}</p>
              <p className="text-sm font-bold text-[var(--text-primary)] mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2 pt-2 border-t border-[var(--border-secondary)]">
          <div className="flex items-start gap-2">
            <span className="text-xs font-semibold text-[var(--text-tertiary)] min-w-fit">Keyingi konsultatsiya:</span>
            <span className="text-xs text-[var(--text-secondary)]">{PATIENT_INFO.nextConsult}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs font-semibold text-[var(--text-tertiary)] min-w-fit">Keyingi hamshira tashrifi:</span>
            <span className="text-xs text-[var(--text-secondary)]">{PATIENT_INFO.nextNurse}</span>
          </div>
        </div>
      </div>

      {/* Observation notes */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare size={16} className="text-[var(--fg-brand-primary)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Kuzatuv eslatmalari</h2>
          <span className="text-xs text-[var(--text-tertiary)]">Shifokor va hamshira ko'radi</span>
        </div>
        <textarea
          value={obs}
          onChange={e => setObs(e.target.value)}
          rows={4}
          placeholder="Misol: Bemor ikkinchi mashqdan keyin charchagan. Setlar orasida qo'shimcha dam olish kerak bo'ldi. Kayfiyati ijobiy edi."
          className="w-full px-3 py-2 rounded-lg border border-[var(--border-secondary)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--fg-brand-primary)] resize-none"
        />
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={saveObs}
            className="px-4 py-2 rounded-lg bg-[var(--fg-brand-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            {saved ? '✓ Saqlandi' : 'Kuzatuvni saqlash'}
          </button>
          {saved && (
            <p className="text-xs text-green-600 font-medium">Shifokorga yuborildi</p>
          )}
        </div>
      </div>
    </div>
  )
}
