import { useTranslation } from 'react-i18next'
import { AlertTriangle, Droplets, Flame, Pill, Wheat, Zap } from 'lucide-react'
import { NUTRITION_PLAN, MEDICATIONS } from '@/data/patient-mock-data'

interface NormCardProps { icon: React.ElementType; label: string; value: string | number; unit: string; color: string }
function NormCard({ icon: Icon, label, value, unit, color }: NormCardProps) {
  return (
    <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
      <div className={['flex items-center gap-2 mb-2', color].join(' ')}>
        <Icon size={15} />
        <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
      </div>
      <p className="text-xl font-bold text-[var(--text-primary)]">
        {value} <span className="text-xs font-normal text-[var(--text-tertiary)]">{unit}</span>
      </p>
    </div>
  )
}

export function PatientNutritionPage() {
  const { t } = useTranslation()
  const n = NUTRITION_PLAN

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('patient.nutrition')}</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Shaxsiy kunlik yo'riqnoma</p>
      </div>

      {/* Daily norms */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">{t('patient.dailyNorms')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <NormCard icon={Flame}    label={t('patient.calories')} value={n.daily_calories}    unit="kcal"  color="text-orange-500" />
          <NormCard icon={Zap}      label={t('patient.protein')}  value={n.daily_protein_g}   unit="g"     color="text-blue-500"   />
          <NormCard icon={Wheat}    label={t('patient.calcium')}  value={n.daily_calcium_mg}  unit="mg"    color="text-yellow-500" />
          <NormCard icon={Pill}     label={t('patient.vitaminD')} value={n.daily_vitamin_d_mcg} unit="mcg" color="text-purple-500" />
          <NormCard icon={Droplets} label={t('patient.water')}    value={n.daily_water_l}     unit="L"     color="text-cyan-500"   />
        </div>
      </div>

      {/* Recommended foods */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">{t('patient.recommended')}</h2>
        <div className="space-y-3">
          {n.recommended_foods.map(group => (
            <div key={group.category}>
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1">{group.category}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map(item => (
                  <span key={item} className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Restricted */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">{t('patient.restricted')}</h2>
        <div className="flex flex-wrap gap-1.5">
          {n.restricted_foods.map(f => (
            <span key={f} className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-medium">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Supplements */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">{t('patient.supplements')}</h2>
        <div className="space-y-2">
          {n.supplements.map(s => (
            <div key={s.name} className="flex items-center justify-between py-2 border-b border-[var(--border-secondary)] last:border-0">
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{s.name}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{s.dose}</p>
              </div>
              <span className="text-xs text-[var(--text-secondary)] font-medium">{s.timing}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Drug-food warnings */}
      {n.drug_food_warnings.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">{t('patient.drugFoodWarning')}</h2>
          <div className="space-y-2">
            {n.drug_food_warnings.map(w => (
              <div key={w.drug} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3">
                <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                    {w.drug}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">{w.warning}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active medications note */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-2">{t('patientDetail.medications')}</h2>
        <div className="space-y-1">
          {MEDICATIONS.filter(m => m.is_active).map(m => (
            <div key={m.id} className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-primary)] font-medium">{m.name}</span>
              <span className="text-[var(--text-tertiary)]">{m.dose} · {m.schedule_times.join(', ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
