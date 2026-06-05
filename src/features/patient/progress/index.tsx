import { useTranslation } from 'react-i18next'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { WEEKLY_ADHERENCE, PAIN_HISTORY, TODAY_SUMMARY } from '@/data/patient-mock-data'

export function PatientProgressPage() {
  const { t } = useTranslation()

  const last7Pain = PAIN_HISTORY.slice(-7)
  const avgPain = (PAIN_HISTORY.slice(-7).reduce((s, p) => s + p.intensity, 0) / 7).toFixed(1)
  const painTrend = PAIN_HISTORY[PAIN_HISTORY.length - 1].intensity < PAIN_HISTORY[PAIN_HISTORY.length - 7].intensity

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('patient.myProgress')}</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Recovery analytics</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t('patient.recoveryScore'), value: TODAY_SUMMARY.recoveryScore, color: 'text-[var(--fg-brand-primary)]' },
          { label: t('patient.adherence'),     value: `${TODAY_SUMMARY.recoveryScore + 23}%`, color: 'text-green-500' },
          { label: t('patient.avgPain'),        value: avgPain + '/10', color: 'text-orange-500' },
          { label: t('patient.streak'),         value: `${TODAY_SUMMARY.streak} days`, color: 'text-purple-500' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
            <p className="text-xs text-[var(--text-tertiary)] font-medium mb-1">{kpi.label}</p>
            <p className={['text-2xl font-bold', kpi.color].join(' ')}>{kpi.value}</p>
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
              formatter={(v: number) => [`${v}%`, t('patient.adherenceLabel')]}
            />
            <Bar dataKey="adherence_pct" fill="#2970FF" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pain trend line chart */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">{t('patient.painTrend')}</h2>
          <div className={['flex items-center gap-1 text-xs font-semibold', painTrend ? 'text-green-600' : 'text-red-500'].join(' ')}>
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
              formatter={(v: number) => [v, t('patient.painLabel')]}
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
