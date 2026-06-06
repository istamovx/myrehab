import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CheckCircle2, Circle, Clock, Lock, PlayCircle,
  TrendingDown, TrendingUp,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts'
import {
  EXERCISE_LIBRARY, TODAY_EXERCISES, TREATMENT_PLAN, PATIENT_PROFILE,
  WEEKLY_ADHERENCE, PAIN_HISTORY, TODAY_SUMMARY,
  type Exercise, type PlanPhase,
} from '@/data/patient-mock-data'
import { cn } from '@/lib/utils'

// ─── Exercises ────────────────────────────────────────────────────────────────

type Category = Exercise['category'] | 'all'

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'all',         label: 'Barchasi'    },
  { key: 'strength',    label: 'Kuch'        },
  { key: 'mobility',    label: 'Harakatchanlik' },
  { key: 'balance',     label: 'Muvozanat'   },
  { key: 'circulation', label: 'Qon aylanish' },
  { key: 'other',       label: 'Boshqa'      },
]

const CATEGORY_COLORS: Record<string, string> = {
  strength:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  mobility:    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  balance:     'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  circulation: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  other:       'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
}

function ExercisesSection() {
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
    <div className="space-y-4">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
              category === key
                ? 'bg-[var(--fg-brand-primary)] text-white'
                : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-secondary)] hover:border-[var(--fg-brand-primary)]',
            )}
          >
            {label}
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
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block', CATEGORY_COLORS[ex.category])}>
                  {t(`patient.${ex.category}`)}
                </span>
              </div>
              <button onClick={() => toggle(ex.id)} className="shrink-0 mt-0.5">
                {done.has(ex.id)
                  ? <CheckCircle2 size={22} className="text-green-500" />
                  : <Circle size={22} className="text-[var(--text-quaternary)]" />
                }
              </button>
            </div>
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

// ─── Plan ─────────────────────────────────────────────────────────────────────

const PHASE_ICON = {
  completed: <CheckCircle2 size={20} className="text-green-500" />,
  current:   <PlayCircle size={20} className="text-[var(--fg-brand-primary)]" />,
  locked:    <Lock size={20} className="text-[var(--text-quaternary)]" />,
}
const PHASE_BORDER = {
  completed: 'border-green-200 dark:border-green-900',
  current:   'border-[var(--fg-brand-primary)]',
  locked:    'border-[var(--border-secondary)]',
}

function PhaseCard({ phase }: { phase: PlanPhase }) {
  const { t } = useTranslation()
  return (
    <div className={cn('bg-[var(--bg-primary)] rounded-xl border-2 p-5', PHASE_BORDER[phase.status])}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {PHASE_ICON[phase.status]}
          <div>
            <p className="text-xs font-semibold text-[var(--text-tertiary)]">{t(`patient.${phase.status}`)}</p>
            <h3 className="font-semibold text-[var(--text-primary)] text-sm">{phase.name}</h3>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
          <Clock size={12} />
          <span>{t('patient.durationWeeks', { n: phase.duration_weeks })}</span>
        </div>
      </div>
      {phase.status !== 'locked' && phase.progress_pct !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-[var(--text-tertiary)] mb-1">
            <span>{t('patient.phaseProgress', { pct: phase.progress_pct })}</span>
          </div>
          <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', phase.status === 'completed' ? 'bg-green-500' : 'bg-[var(--fg-brand-primary)]')}
              style={{ width: `${phase.progress_pct}%` }}
            />
          </div>
        </div>
      )}
      {phase.status === 'locked' && (
        <p className="text-xs text-[var(--text-quaternary)] mt-2">{t('patient.locked')}</p>
      )}
    </div>
  )
}

function PlanSection() {
  const { t } = useTranslation()
  const phases = TREATMENT_PLAN.phases
  const doneCount   = phases.filter(p => p.status === 'completed').length
  const activeCount = phases.filter(p => p.status === 'current').length
  const lockedCount = phases.filter(p => p.status === 'locked').length

  return (
    <div className="space-y-4">
      {/* Summary card */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-[var(--text-tertiary)] font-medium">{t('patient.diagnosis')}</p>
            <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">{PATIENT_PROFILE.diagnosis}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-tertiary)] font-medium">{t('patient.phases')}</p>
            <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">{t('patient.phasesCount', { n: TREATMENT_PLAN.phases.length })}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-tertiary)] font-medium">{t('patient.currentPhase')}</p>
            <p className="text-sm font-semibold text-[var(--fg-brand-primary)] mt-0.5">
              {TREATMENT_PLAN.phases.find(p => p.status === 'current')?.name ?? '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Overall progress */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-[var(--text-primary)]">Umumiy jarayon</span>
          <span className="text-sm font-bold text-[var(--fg-brand-primary)]">~40%</span>
        </div>
        <div className="h-3 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[var(--fg-brand-primary)] to-purple-500 rounded-full" style={{ width: '40%' }} />
        </div>
        <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1.5">
          <span>{t('patient.phaseStatusSummary', { done: doneCount, active: activeCount, locked: lockedCount })}</span>
        </div>
      </div>

      {/* Phase cards */}
      <div className="space-y-3">
        {TREATMENT_PLAN.phases.map(phase => (
          <PhaseCard key={phase.id} phase={phase} />
        ))}
      </div>
    </div>
  )
}

// ─── Progress ─────────────────────────────────────────────────────────────────

function ProgressSection() {
  const { t } = useTranslation()
  const last7Pain = PAIN_HISTORY.slice(-7)
  const avgPain = (PAIN_HISTORY.slice(-7).reduce((s, p) => s + p.intensity, 0) / 7).toFixed(1)
  const painTrend = PAIN_HISTORY[PAIN_HISTORY.length - 1].intensity < PAIN_HISTORY[PAIN_HISTORY.length - 7].intensity

  return (
    <div className="space-y-4">
      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t('patient.recoveryScore'), value: TODAY_SUMMARY.recoveryScore,               color: 'text-[var(--fg-brand-primary)]' },
          { label: t('patient.adherence'),     value: `${TODAY_SUMMARY.recoveryScore + 23}%`,    color: 'text-green-500'                 },
          { label: t('patient.avgPain'),        value: avgPain + '/10',                           color: 'text-orange-500'                },
          { label: t('patient.streak'),         value: `${TODAY_SUMMARY.streak} kun`,             color: 'text-purple-500'                },
        ].map(kpi => (
          <div key={kpi.label} className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
            <p className="text-xs text-[var(--text-tertiary)] font-medium mb-1">{kpi.label}</p>
            <p className={cn('text-2xl font-bold', kpi.color)}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Weekly adherence bar chart */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">{t('patient.weeklyAdherence')}</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={WEEKLY_ADHERENCE} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-secondary)', borderRadius: 8, fontSize: 12 }}
              formatter={(v) => [`${v}%`, t('patient.adherenceLabel')]}
            />
            <Bar dataKey="adherence_pct" fill="#2970FF" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pain trend line chart */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">{t('patient.painTrend')}</h2>
          <div className={cn('flex items-center gap-1 text-xs font-semibold', painTrend ? 'text-green-600' : 'text-red-500')}>
            {painTrend ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            <span>{painTrend ? t('patient.trendGood') : t('patient.trendBad')}</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={last7Pain} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
            <XAxis dataKey="date" tickFormatter={d => d.slice(5)} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-secondary)', borderRadius: 8, fontSize: 12 }}
              formatter={(v) => [v, t('patient.painLabel')]}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line
              type="monotone"
              dataKey="intensity"
              name={t('patient.painLabel')}
              stroke="#f97316"
              strokeWidth={2}
              dot={{ r: 4, fill: '#f97316' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Tab = 'progress' | 'plan' | 'exercises'

const TABS: { key: Tab; label: string }[] = [
  { key: 'progress',  label: "O'sishim"  },
  { key: 'plan',      label: 'Rejam'     },
  { key: 'exercises', label: 'Mashqlar'  },
]

export function PatientDinamikaPage() {
  const [tab, setTab] = useState<Tab>('progress')

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dinamika</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">O'sish, reja va mashqlaringiz bir joyda</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-[var(--bg-secondary)] p-1 rounded-xl border border-[var(--border-secondary)]">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'flex-1 py-2 rounded-lg text-sm font-semibold transition-all',
              tab === t.key
                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm border border-[var(--border-secondary)]'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'progress'  && <ProgressSection />}
      {tab === 'plan'      && <PlanSection />}
      {tab === 'exercises' && <ExercisesSection />}
    </div>
  )
}
