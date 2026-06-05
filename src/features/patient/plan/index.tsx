import { useTranslation } from 'react-i18next'
import { CheckCircle2, Clock, Lock, PlayCircle } from 'lucide-react'
import { TREATMENT_PLAN, PATIENT_PROFILE } from '@/data/patient-mock-data'
import type { PlanPhase } from '@/data/patient-mock-data'

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
    <div className={['bg-[var(--bg-primary)] rounded-xl border-2 p-5', PHASE_BORDER[phase.status]].join(' ')}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {PHASE_ICON[phase.status]}
          <div>
            <p className="text-xs font-semibold text-[var(--text-tertiary)]">
              {t('patient.currentPhase').replace('Current ', `Phase ${phase.order_index} – `)}
            </p>
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
              className={[
                'h-full rounded-full transition-all',
                phase.status === 'completed' ? 'bg-green-500' : 'bg-[var(--fg-brand-primary)]',
              ].join(' ')}
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

export function PatientPlanPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('patient.myPlan')}</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">{TREATMENT_PLAN.title}</p>
      </div>

      {/* Plan header card */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-[var(--text-tertiary)] font-medium">{t('patient.diagnosis')}</p>
            <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">{PATIENT_PROFILE.diagnosis}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-tertiary)] font-medium">{t('patient.phases')}</p>
            <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">{TREATMENT_PLAN.phases.length} phases</p>
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
          <span className="text-sm font-semibold text-[var(--text-primary)]">Overall progress</span>
          <span className="text-sm font-bold text-[var(--fg-brand-primary)]">~40%</span>
        </div>
        <div className="h-3 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[var(--fg-brand-primary)] to-purple-500 rounded-full" style={{ width: '40%' }} />
        </div>
        <div className="flex justify-between text-xs text-[var(--text-tertiary)] mt-1.5">
          <span>1 completed · 1 active · 2 locked</span>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-3">
        {TREATMENT_PLAN.phases.map(phase => (
          <PhaseCard key={phase.id} phase={phase} />
        ))}
      </div>
    </div>
  )
}
