import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, Plus, X } from 'lucide-react'
import { SYMPTOM_LOGS, type SymptomLog } from '@/data/patient-mock-data'

const SEVERITY_COLORS: Record<string, string> = {
  mild:     'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  moderate: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  severe:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const TYPE_EMOJI: Record<string, string> = {
  pain: '🔴', swelling: '🟠', stiffness: '🟡', fatigue: '🟢', numbness: '🔵', other: '⚪'
}

function IntensityBar({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className={[
            'h-2 w-3 rounded-sm',
            i < value
              ? value <= 3 ? 'bg-green-500' : value <= 6 ? 'bg-orange-500' : 'bg-red-500'
              : 'bg-[var(--bg-tertiary)]',
          ].join(' ')}
        />
      ))}
    </div>
  )
}

const SYMPTOM_TYPES = ['pain', 'swelling', 'stiffness', 'fatigue', 'numbness', 'other']
const SEVERITIES    = ['mild', 'moderate', 'severe']

export function PatientSymptomsPage() {
  const { t } = useTranslation()
  const [logs, setLogs] = useState<SymptomLog[]>(SYMPTOM_LOGS)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ type: 'pain', severity: 'mild', intensity: 3, location: '', note: '' })
  const [saved, setSaved] = useState(false)

  const hasEmergency = logs.some(s => s.severity === 'severe')

  function handleSubmit() {
    const newEntry: SymptomLog = {
      id: `sym-${Date.now()}`,
      type: form.type as SymptomLog['type'],
      severity: form.severity as SymptomLog['severity'],
      intensity: form.intensity,
      location: form.location,
      note: form.note,
      recorded_at: new Date().toISOString(),
    }
    setLogs(prev => [newEntry, ...prev])
    setShowModal(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('patient.symptoms')}</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">{logs.length} entries</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-3 py-2 bg-[var(--fg-brand-primary)] text-white rounded-lg text-sm font-semibold hover:opacity-90"
        >
          <Plus size={15} />
          {t('patient.logSymptom')}
        </button>
      </div>

      {saved && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm font-medium">
          ✓ Symptom saved
        </div>
      )}

      {/* Emergency banner */}
      {hasEmergency && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-400 font-medium">{t('patient.emergencyBanner')}</p>
        </div>
      )}

      {/* Symptom list */}
      <div className="space-y-2">
        {logs.map(log => (
          <div key={log.id} className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{TYPE_EMOJI[log.type]}</span>
                <div>
                  <span className="text-sm font-semibold text-[var(--text-primary)] capitalize">
                    {t(`patient.${log.type}`)}
                  </span>
                  <span className="text-xs text-[var(--text-tertiary)] ml-2">· {log.location}</span>
                </div>
              </div>
              <span className={['text-xs font-semibold px-2 py-0.5 rounded-full', SEVERITY_COLORS[log.severity]].join(' ')}>
                {t(`patient.${log.severity}`)}
              </span>
            </div>
            <IntensityBar value={log.intensity} />
            {log.note && <p className="text-xs text-[var(--text-tertiary)] mt-2">{log.note}</p>}
            <p className="text-xs text-[var(--text-quaternary)] mt-1">
              {new Date(log.recorded_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-[var(--bg-primary)] rounded-2xl shadow-xl w-full max-w-sm p-6 z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)]">{t('patient.logSymptom')}</h3>
              <button onClick={() => setShowModal(false)} className="text-[var(--text-tertiary)]"><X size={18} /></button>
            </div>

            {/* Type */}
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">{t('patient.symptomType')}</label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {SYMPTOM_TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setForm(f => ({ ...f, type }))}
                    className={['px-3 py-1 rounded-lg text-xs font-semibold border transition-colors', form.type === type ? 'bg-[var(--fg-brand-primary)] text-white border-[var(--fg-brand-primary)]' : 'border-[var(--border-secondary)] text-[var(--text-secondary)]'].join(' ')}
                  >
                    {t(`patient.${type}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">{t('patient.severity')}</label>
              <div className="flex gap-2 mt-1.5">
                {SEVERITIES.map(sev => (
                  <button
                    key={sev}
                    onClick={() => setForm(f => ({ ...f, severity: sev }))}
                    className={['flex-1 py-1 rounded-lg text-xs font-semibold border transition-colors', form.severity === sev ? 'bg-[var(--fg-brand-primary)] text-white border-[var(--fg-brand-primary)]' : 'border-[var(--border-secondary)] text-[var(--text-secondary)]'].join(' ')}
                  >
                    {t(`patient.${sev}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity */}
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">{t('patient.intensity')} ({form.intensity}/10)</label>
              <input type="range" min={1} max={10} value={form.intensity}
                onChange={e => setForm(f => ({ ...f, intensity: +e.target.value }))}
                className="w-full mt-1.5 accent-[var(--fg-brand-primary)]"
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">{t('patient.location')}</label>
              <input
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="e.g. Left knee"
                className="mt-1 w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg text-sm text-[var(--text-primary)] outline-none focus:border-[var(--fg-brand-primary)]"
              />
            </div>

            {/* Note */}
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">{t('patient.note')}</label>
              <textarea
                value={form.note}
                onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                rows={2}
                className="mt-1 w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg text-sm text-[var(--text-primary)] outline-none focus:border-[var(--fg-brand-primary)] resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-2.5 bg-[var(--fg-brand-primary)] text-white rounded-lg text-sm font-semibold hover:opacity-90"
            >
              {t('common.save')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
