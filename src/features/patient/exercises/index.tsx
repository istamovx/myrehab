import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Circle } from 'lucide-react'
import { EXERCISE_LIBRARY, TODAY_EXERCISES, type Exercise } from '@/data/patient-mock-data'

type Category = Exercise['category'] | 'all'

const CATEGORIES: { key: Category; labelKey: string }[] = [
  { key: 'all',         labelKey: 'patient.allCategories' },
  { key: 'strength',    labelKey: 'patient.strength'      },
  { key: 'mobility',    labelKey: 'patient.mobility'      },
  { key: 'balance',     labelKey: 'patient.balance'       },
  { key: 'circulation', labelKey: 'patient.circulation'   },
  { key: 'other',       labelKey: 'patient.other'         },
]

const CATEGORY_COLORS: Record<string, string> = {
  strength:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  mobility:    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  balance:     'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  circulation: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  other:       'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

export function PatientExercisesPage() {
  const { t } = useTranslation()
  const [category, setCategory] = useState<Category>('all')
  const [done, setDone] = useState<Set<string>>(
    new Set(TODAY_EXERCISES.filter(e => e.completedToday).map(e => e.exercise_id))
  )

  const filtered = category === 'all'
    ? EXERCISE_LIBRARY
    : EXERCISE_LIBRARY.filter(e => e.category === category)

  function toggle(id: string) {
    setDone(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('patient.exercises')}</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">{EXERCISE_LIBRARY.length} exercises</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(({ key, labelKey }) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={[
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
              category === key
                ? 'bg-[var(--fg-brand-primary)] text-white'
                : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-secondary)] hover:border-[var(--fg-brand-primary)]',
            ].join(' ')}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>

      {/* Exercise cards */}
      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.map(ex => (
          <div
            key={ex.id}
            className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[var(--text-primary)] text-sm">{ex.title}</h3>
                <span className={['text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block', CATEGORY_COLORS[ex.category]].join(' ')}>
                  {t(`patient.${ex.category}`)}
                </span>
              </div>
              <button
                onClick={() => toggle(ex.id)}
                className="shrink-0 mt-0.5"
              >
                {done.has(ex.id)
                  ? <CheckCircle2 size={22} className="text-green-500" />
                  : <Circle size={22} className="text-[var(--text-quaternary)]" />
                }
              </button>
            </div>
            {ex.description && (
              <p className="text-xs text-[var(--text-tertiary)] mb-3 line-clamp-2">{ex.description}</p>
            )}
            <div className="flex gap-4 text-xs text-[var(--text-secondary)]">
              <span className="font-medium">{t('patient.setsReps', { sets: ex.default_sets, reps: ex.default_reps })}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[var(--text-tertiary)] py-12">{t('patient.noExercises')}</p>
      )}
    </div>
  )
}
