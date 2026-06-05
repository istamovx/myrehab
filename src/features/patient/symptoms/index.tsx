import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, Plus } from 'lucide-react'
import { SYMPTOM_LOGS, type SymptomLog } from '@/data/patient-mock-data'
import { useConnectStore } from '@/store/connect'
import { Dialog } from '@/components/ui/dialog'
import { Input, Textarea, FieldLabel } from '@/components/ui/input'
import { Range } from '@/components/ui/range'
import { Button } from '@/components/ui/button'
import { formatUzDateTime } from '@/lib/utils'

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
  const reportSymptom = useConnectStore(s => s.reportSymptom)

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
    // Notify the assigned doctor of the complaint (cross-role).
    reportSymptom({
      type: form.type,
      severity: form.severity as SymptomLog['severity'],
      intensity: form.intensity,
      location: form.location,
      note: form.note,
    })
    setShowModal(false)
    setForm({ type: 'pain', severity: 'mild', intensity: 3, location: '', note: '' })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('patient.symptoms')}</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">{logs.length} ta yozuv</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={15} />
          {t('patient.logSymptom')}
        </Button>
      </div>

      {saved && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm font-medium">
          ✓ Belgi saqlandi
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
              {formatUzDateTime(log.recorded_at)}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal} title={t('patient.logSymptom')} className="max-w-md">
        <div className="space-y-4">
          {/* Type */}
          <div>
            <FieldLabel>{t('patient.symptomType')}</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {SYMPTOM_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setForm(f => ({ ...f, type }))}
                  className={['px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer', form.type === type ? 'bg-[var(--fg-brand-primary)] text-white border-[var(--fg-brand-primary)]' : 'border-[var(--border-secondary)] text-[var(--text-secondary)] hover:border-[var(--border-primary)]'].join(' ')}
                >
                  {t(`patient.${type}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div>
            <FieldLabel>{t('patient.severity')}</FieldLabel>
            <div className="flex gap-2">
              {SEVERITIES.map(sev => (
                <button
                  key={sev}
                  onClick={() => setForm(f => ({ ...f, severity: sev }))}
                  className={['flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer', form.severity === sev ? 'bg-[var(--fg-brand-primary)] text-white border-[var(--fg-brand-primary)]' : 'border-[var(--border-secondary)] text-[var(--text-secondary)] hover:border-[var(--border-primary)]'].join(' ')}
                >
                  {t(`patient.${sev}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Intensity */}
          <div>
            <FieldLabel>{t('patient.intensity')} ({form.intensity}/10)</FieldLabel>
            <Range value={form.intensity} onChange={v => setForm(f => ({ ...f, intensity: v }))} min={1} max={10} />
          </div>

          {/* Location */}
          <div>
            <FieldLabel>{t('patient.location')}</FieldLabel>
            <Input
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              placeholder="masalan, Chap tizza"
            />
          </div>

          {/* Note */}
          <div>
            <FieldLabel>{t('patient.note')}</FieldLabel>
            <Textarea
              value={form.note}
              onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              rows={2}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">{t('common.save')}</Button>
        </div>
      </Dialog>
    </div>
  )
}
