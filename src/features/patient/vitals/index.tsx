import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, X, Heart, Thermometer, Activity, Weight, Droplets } from 'lucide-react'
import { VITAL_HISTORY, LATEST_VITAL, VITAL_NORMS } from '@/data/patient-mock-data'

function statusOf(value: number, min: number, max: number): 'normal' | 'high' | 'low' {
  if (value > max) return 'high'
  if (value < min) return 'low'
  return 'normal'
}

const STATUS_COLOR = {
  normal: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  high:   'text-red-600 bg-red-50 dark:bg-red-900/20',
  low:    'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
}

interface VitalCardProps { label: string; value: string; unit: string; status: 'normal'|'high'|'low'; icon: React.ElementType }
function VitalCard({ label, value, unit, status, icon: Icon }: VitalCardProps) {
  const { t } = useTranslation()
  return (
    <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          <Icon size={15} />
          <span className="text-xs font-medium">{label}</span>
        </div>
        <span className={['text-xs font-semibold px-2 py-0.5 rounded-full', STATUS_COLOR[status]].join(' ')}>
          {t(`patient.${status}`)}
        </span>
      </div>
      <p className="text-2xl font-bold text-[var(--text-primary)]">
        {value} <span className="text-sm font-normal text-[var(--text-tertiary)]">{unit}</span>
      </p>
    </div>
  )
}

export function PatientVitalsPage() {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)

  const v = LATEST_VITAL

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('patient.vitals')}</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">
            Latest: {new Date(v.recorded_at).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-3 py-2 bg-[var(--fg-brand-primary)] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={15} />
          {t('patient.newReading')}
        </button>
      </div>

      {/* Vital cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <VitalCard
          label={t('patient.bloodPressure')}
          value={`${v.systolic}/${v.diastolic}`}
          unit={t('patient.bpm')}
          status={statusOf(v.systolic, VITAL_NORMS.systolic.min, VITAL_NORMS.systolic.max)}
          icon={Activity}
        />
        <VitalCard
          label={t('patient.heartRate')}
          value={String(v.heart_rate)}
          unit="bpm"
          status={statusOf(v.heart_rate, VITAL_NORMS.heartRate.min, VITAL_NORMS.heartRate.max)}
          icon={Heart}
        />
        <VitalCard
          label={t('patient.temperature')}
          value={v.temperature.toFixed(1)}
          unit={t('patient.celsius') || '°C'}
          status={statusOf(v.temperature, VITAL_NORMS.temperature.min, VITAL_NORMS.temperature.max)}
          icon={Thermometer}
        />
        <VitalCard
          label={t('patient.spo2')}
          value={String(v.spo2)}
          unit="%"
          status={statusOf(v.spo2, VITAL_NORMS.spo2.min, VITAL_NORMS.spo2.max)}
          icon={Droplets}
        />
        <VitalCard
          label={t('patient.weight')}
          value={v.weight.toFixed(1)}
          unit="kg"
          status={statusOf(v.weight, VITAL_NORMS.weight.min, VITAL_NORMS.weight.max)}
          icon={Weight}
        />
      </div>

      {/* History table */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border-secondary)]">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">{t('patient.vitalHistory')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[var(--text-tertiary)] border-b border-[var(--border-secondary)]">
                <th className="text-left px-4 py-2 font-semibold">{t('common.date')}</th>
                <th className="text-left px-4 py-2 font-semibold">BP</th>
                <th className="text-left px-4 py-2 font-semibold">HR</th>
                <th className="text-left px-4 py-2 font-semibold">Temp</th>
                <th className="text-left px-4 py-2 font-semibold">SpO₂</th>
                <th className="text-left px-4 py-2 font-semibold">Wt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-secondary)]">
              {VITAL_HISTORY.slice().reverse().slice(0, 7).map(r => (
                <tr key={r.id} className="text-[var(--text-primary)]">
                  <td className="px-4 py-2 text-xs text-[var(--text-tertiary)]">
                    {new Date(r.recorded_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-xs">{r.systolic}/{r.diastolic}</td>
                  <td className="px-4 py-2 text-xs">{r.heart_rate}</td>
                  <td className="px-4 py-2 text-xs">{r.temperature.toFixed(1)}</td>
                  <td className="px-4 py-2 text-xs">{r.spo2}%</td>
                  <td className="px-4 py-2 text-xs">{r.weight} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add reading modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-[var(--bg-primary)] rounded-2xl shadow-xl w-full max-w-sm p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[var(--text-primary)]">{t('patient.newReading')}</h3>
              <button onClick={() => setShowModal(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: t('patient.systolic'), placeholder: '120' },
                { label: t('patient.diastolic'), placeholder: '80' },
                { label: t('patient.heartRate'), placeholder: '72' },
                { label: t('patient.temperature'), placeholder: '36.6' },
                { label: t('patient.spo2'), placeholder: '98' },
                { label: t('patient.weight'), placeholder: '77.5' },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-medium text-[var(--text-secondary)]">{f.label}</label>
                  <input
                    type="number"
                    placeholder={f.placeholder}
                    className="mt-1 w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg text-sm text-[var(--text-primary)] outline-none focus:border-[var(--fg-brand-primary)]"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full py-2.5 bg-[var(--fg-brand-primary)] text-white rounded-lg text-sm font-semibold hover:opacity-90"
            >
              {t('common.save')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
