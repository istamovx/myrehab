import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CheckCircle2, Circle, Flame, TrendingUp, Pill, Dumbbell, Smile, Meh, Frown, Zap } from 'lucide-react'
import {
  TODAY_SUMMARY, TODAY_EXERCISES, TODAY_MEDICATIONS, PATIENT_PROFILE, ASSIGNED_DOCTOR,
} from '@/data/patient-mock-data'
import { useConnectStore } from '@/store/connect'

const MOOD_OPTIONS = [
  { key: 'happy',   Icon: Smile, color: 'text-green-500'  },
  { key: 'neutral', Icon: Meh,   color: 'text-yellow-500' },
  { key: 'tired',   Icon: Zap,   color: 'text-orange-500' },
  { key: 'sad',     Icon: Frown, color: 'text-red-500'    },
]

const MED_COLOR: Record<string, string> = {
  taken:   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  skipped: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  pending: 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]',
}

export function PatientTodayPage() {
  const { t } = useTranslation()
  const [mood, setMood] = useState<string | null>(TODAY_SUMMARY.mood)
  const [moodSaved, setMoodSaved] = useState(false)
  const [exercises, setExercises] = useState(TODAY_EXERCISES)
  const assignedMeds = useConnectStore(s => s.medications)

  const doneCount = exercises.filter(e => e.completedToday).length

  function handleMood(key: string) {
    setMood(key)
    setMoodSaved(true)
    setTimeout(() => setMoodSaved(false), 2000)
  }

  function toggleExercise(idx: number) {
    setExercises(prev =>
      prev.map((e, i) => i === idx ? { ...e, completedToday: !e.completedToday } : e)
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          {t('patient.greeting')}, {PATIENT_PROFILE.name.split(' ')[0]} 👋
        </h1>
        <p className="text-[var(--text-tertiary)] text-sm mt-1">{PATIENT_PROFILE.diagnosis}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[var(--bg-primary)] rounded-xl p-4 border border-[var(--border-secondary)]">
          <div className="flex items-center gap-2 text-orange-500 mb-1">
            <Flame size={16} />
            <span className="text-xs font-medium">{t('patient.streak')}</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{TODAY_SUMMARY.streak}</p>
        </div>
        <div className="bg-[var(--bg-primary)] rounded-xl p-4 border border-[var(--border-secondary)]">
          <div className="flex items-center gap-2 text-[var(--fg-brand-primary)] mb-1">
            <TrendingUp size={16} />
            <span className="text-xs font-medium">{t('patient.recoveryScore')}</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{TODAY_SUMMARY.recoveryScore}</p>
        </div>
        <div className="bg-[var(--bg-primary)] rounded-xl p-4 border border-[var(--border-secondary)]">
          <div className="flex items-center gap-2 text-purple-500 mb-1">
            <Dumbbell size={16} />
            <span className="text-xs font-medium">{t('patient.todayExercises')}</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{doneCount}/{exercises.length}</p>
        </div>
        <div className="bg-[var(--bg-primary)] rounded-xl p-4 border border-[var(--border-secondary)]">
          <div className="flex items-center gap-2 text-teal-500 mb-1">
            <Pill size={16} />
            <span className="text-xs font-medium">{t('patient.todayMeds')}</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{TODAY_SUMMARY.medsDone}/{TODAY_SUMMARY.medsTotal}</p>
        </div>
      </div>

      {/* Doctor card */}
      <div className="bg-gradient-to-r from-[var(--fg-brand-primary)] to-purple-600 rounded-xl p-4 text-white">
        <p className="text-xs opacity-75 font-medium">{t('patient.assignedDoctor')}</p>
        <p className="font-bold mt-0.5">{ASSIGNED_DOCTOR.name}</p>
        <p className="text-sm opacity-80">{ASSIGNED_DOCTOR.specialization} · {ASSIGNED_DOCTOR.phone}</p>
      </div>

      {/* Mood */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">{t('patient.logMood')}</h2>
        {moodSaved && (
          <p className="text-xs text-green-600 mb-2 font-medium">{t('patient.taken')} ✓</p>
        )}
        <div className="flex gap-3">
          {MOOD_OPTIONS.map(({ key, Icon, color }) => (
            <button
              key={key}
              onClick={() => handleMood(key)}
              className={[
                'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all flex-1',
                mood === key
                  ? 'border-[var(--fg-brand-primary)] bg-blue-50 dark:bg-blue-950/20'
                  : 'border-transparent bg-[var(--bg-secondary)] hover:border-[var(--border-secondary)]',
              ].join(' ')}
            >
              <Icon size={24} className={color} />
              <span className="text-xs font-medium text-[var(--text-secondary)]">{t(`patient.${key}`)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Today's exercises */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">{t('patient.todayExercises')}</h2>
          <span className="text-xs text-[var(--text-tertiary)]">{doneCount}/{exercises.length}</span>
        </div>
        <div className="space-y-2">
          {exercises.map((ex, idx) => (
            <button
              key={ex.exercise_id}
              onClick={() => toggleExercise(idx)}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors text-left"
            >
              {ex.completedToday
                ? <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                : <Circle size={20} className="text-[var(--text-quaternary)] shrink-0" />
              }
              <div className="flex-1 min-w-0">
                <p className={['text-sm font-medium truncate', ex.completedToday ? 'line-through text-[var(--text-tertiary)]' : 'text-[var(--text-primary)]'].join(' ')}>
                  {ex.exercise.title}
                </p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {t('patient.setsReps', { sets: ex.sets, reps: ex.reps })}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Medications */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">{t('patient.todayMeds')}</h2>
        <div className="space-y-2">
          {/* Doctor-assigned medications (cross-role) */}
          {assignedMeds.map(m => (
            <div key={m.id} className="flex items-start justify-between p-3 rounded-lg bg-[var(--bg-brand-primary)] border border-[var(--border-brand)]">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)]">{m.name}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{m.dose}{m.schedule ? ' · ' + m.schedule : ''}</p>
                {m.instructions && <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{m.instructions}</p>}
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[var(--fg-brand-primary)] text-white shrink-0">
                Shifokor tayinladi
              </span>
            </div>
          ))}
          {TODAY_MEDICATIONS.map((m, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)]">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{m.medication_name}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{m.dose} · {m.scheduled_time}</p>
              </div>
              <span className={['text-xs font-semibold px-2 py-1 rounded-full', MED_COLOR[m.status]].join(' ')}>
                {t(`patient.${m.status}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
