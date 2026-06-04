import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshCw, Calendar } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ReferenceLine,
} from 'recharts'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { INSIGHTS_BAR_DATA, PROMS_DATA, DELAY_DATA, COMPLICATIONS_HEATMAP } from '@/data/mock-data'

function ChartCard({ title, children, controls }: {
  title: string
  children: React.ReactNode
  controls?: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-[var(--shadow-xs)]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {controls}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function PeriodToggle({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-0.5 p-0.5 bg-gray-100 rounded-lg">
      {options.map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all',
            value === v ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-700',
          )}
        >
          {v}
        </button>
      ))}
    </div>
  )
}

function HeatCell({ value }: { value: number }) {
  const opacity = value === 0 ? 0.06 : value / 100
  return (
    <div
      className="rounded-lg h-11 transition-all"
      style={{ backgroundColor: `rgba(21, 94, 239, ${opacity})`, minWidth: 56 }}
    />
  )
}

const CustomBarTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white rounded-lg shadow-[var(--shadow-dropdown)] px-3 py-2 border border-gray-100">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{payload[0].value}%</p>
      </div>
    )
  }
  return null
}

const CustomLineTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ value: number; name: string; color: string }>
  label?: string
}) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white rounded-lg shadow-[var(--shadow-dropdown)] px-3 py-2.5 border border-gray-100">
        <p className="text-xs font-medium text-gray-500 mb-2">{label}</p>
        {payload.map(p => (
          <div key={p.name} className="flex items-center gap-2 text-xs py-0.5">
            <span className="size-2 rounded-full shrink-0" style={{ background: p.color }} />
            <span className="text-gray-500">{p.name}:</span>
            <span className="font-semibold text-gray-900">{p.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const barDisplayData = INSIGHTS_BAR_DATA.map((d) => ({
  name: `${d.month.slice(0, 3)} ${d.week}`,
  value: d.value,
}))

export function InsightsPage() {
  const { t } = useTranslation()
  const [view, setView] = useState('trends')
  const [period, setPeriod] = useState('30d')
  const [procedure, setProcedure] = useState('knee')
  const [team, setTeam] = useState('team-b')
  const [patients, setPatients] = useState('all')
  const [dept, setDept] = useState('ortho')
  const [barPeriod, setBarPeriod] = useState('')
  const [promsPeriod, setPromsPeriod] = useState('')
  const [delayPeriod, setDelayPeriod] = useState('')

  const periodOptions = [t('insights.threeDays'), t('insights.threeMonths'), t('insights.oneYear')]

  const VIEW_OPTIONS = [
    { value: 'trends',   label: t('insights.trends') },
    { value: 'overview', label: t('insights.overview') },
    { value: 'compare',  label: t('insights.compare') },
  ]
  const PERIOD_OPTIONS = [
    { value: '30d', label: t('insights.last30days') },
    { value: '90d', label: t('insights.last90days') },
    { value: '6m',  label: t('insights.last6months') },
    { value: '1y',  label: t('insights.lastYear') },
  ]
  const PROCEDURE_OPTIONS = [
    { value: 'all',      label: t('insights.allProcedures') },
    { value: 'knee',     label: t('insights.knees') },
    { value: 'hip',      label: t('insights.hip') },
    { value: 'shoulder', label: t('insights.shoulder') },
    { value: 'spine',    label: t('insights.spine') },
  ]
  const TEAM_OPTIONS = [
    { value: 'all',    label: t('insights.allTeams') },
    { value: 'team-a', label: 'Team A' },
    { value: 'team-b', label: 'Team B' },
    { value: 'team-c', label: 'Team C' },
  ]
  const PATIENT_OPTIONS = [
    { value: 'all',       label: t('insights.allPatients') },
    { value: 'high-risk', label: t('insights.highRisk') },
    { value: 'at-risk',   label: t('patients.atRisk') },
    { value: 'ready',     label: t('patients.ready') },
  ]
  const DEPT_OPTIONS = [
    { value: 'ortho',  label: t('team.orthopedic') },
    { value: 'neuro',  label: t('team.neurology') },
    { value: 'sports', label: 'Sports Medicine' },
  ]

  const activePeriod = barPeriod || periodOptions[1]
  const activePromsPeriod = promsPeriod || periodOptions[1]
  const activeDelayPeriod = delayPeriod || periodOptions[1]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{t('insights.title')}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{t('insights.subtitle')}</p>
          </div>
          <Select value={view} onValueChange={setView} options={VIEW_OPTIONS} />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select value={period} onValueChange={setPeriod} options={PERIOD_OPTIONS} />
          <button className="inline-flex items-center gap-2 h-9 px-3.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer shadow-xs">
            <Calendar size={13} className="text-gray-400" />
            <span className="text-brand-600 font-semibold">
              {PERIOD_OPTIONS.find(o => o.value === period)?.label}
            </span>
          </button>
          <Select value={procedure} onValueChange={setProcedure} options={PROCEDURE_OPTIONS} />
          <Select value={team} onValueChange={setTeam} options={TEAM_OPTIONS} />
          <Select value={patients} onValueChange={setPatients} options={PATIENT_OPTIONS} />
          <Select value={dept} onValueChange={setDept} options={DEPT_OPTIONS} triggerClassName="max-w-[210px]" />
          <Button variant="secondary" size="sm" className="gap-1.5 text-gray-600 h-9">
            <RefreshCw size={13} />
            {t('common.reset')}
          </Button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Complication rate */}
        <ChartCard
          title={t('insights.complicationRate')}
          controls={<PeriodToggle options={periodOptions} value={activePeriod} onChange={setBarPeriod} />}
        >
          <ResponsiveContainer width="100%" height={216}>
            <BarChart data={barDisplayData} margin={{ top: 4, right: 0, left: -20, bottom: 4 }}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#98A2B3' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#98A2B3' }} axisLine={false} tickLine={false} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#F9FAFB', radius: 4 }} />
              <Bar dataKey="value" fill="#155EEF" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-around mt-2 text-xs text-gray-400">
            <span>February</span>
            <span>March</span>
            <span>April</span>
          </div>
        </ChartCard>

        {/* Complications heatmap */}
        <ChartCard
          title={t('insights.complicationsByPart')}
          controls={
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{t('insights.less')}</span>
              <div className="flex gap-0.5">
                {[0.08, 0.25, 0.45, 0.65, 1].map((o) => (
                  <div key={o} className="w-5 h-3.5 rounded-sm" style={{ background: `rgba(21,94,239,${o})` }} />
                ))}
              </div>
              <span>{t('insights.more')}</span>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <div className="min-w-[380px]">
              <div className="flex gap-2 mb-2 ml-20">
                {COMPLICATIONS_HEATMAP.teams.map(tm => (
                  <div key={tm} className="flex-1 text-center text-[11px] text-gray-400 font-medium">{tm}</div>
                ))}
              </div>
              {COMPLICATIONS_HEATMAP.bodyParts.map((part, rowIdx) => (
                <div key={part} className="flex items-center gap-2 mb-1.5">
                  <div className="w-16 text-xs text-gray-500 font-medium text-right pr-2 shrink-0">{part}</div>
                  {COMPLICATIONS_HEATMAP.values[rowIdx].map((val, colIdx) => (
                    <div key={colIdx} className="flex-1">
                      <HeatCell value={val} />
                    </div>
                  ))}
                </div>
              ))}
              <div className="flex gap-2 mt-2 ml-20">
                {COMPLICATIONS_HEATMAP.teams.map(tm => (
                  <div key={tm} className="flex-1 text-center text-[11px] text-gray-400">{tm}</div>
                ))}
              </div>
            </div>
          </div>
        </ChartCard>

        {/* PROMs trend */}
        <ChartCard
          title={t('insights.promsTitle')}
          controls={<PeriodToggle options={periodOptions} value={activePromsPeriod} onChange={setPromsPeriod} />}
        >
          <div className="flex items-center gap-4 mb-4">
            {[
              { color: '#004EEB', label: t('insights.satisfaction') },
              { color: '#155EEF', label: t('insights.mobility') },
              { color: '#B2CCFF', label: t('insights.pain') },
            ].map(item => (
              <span key={item.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="size-2 rounded-full" style={{ background: item.color }} />
                {item.label}
              </span>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={216}>
            <LineChart data={PROMS_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#98A2B3' }} axisLine={false} tickLine={false} interval={2} tickFormatter={v => v.split(' ')[0]} />
              <YAxis tick={{ fontSize: 11, fill: '#98A2B3' }} axisLine={false} tickLine={false} domain={[0, 10]} ticks={[0, 2.5, 5, 7.5, 10]} />
              <Tooltip content={<CustomLineTooltip />} />
              <ReferenceLine x="Mar W2" stroke="#E4E7EC" strokeDasharray="4 3" />
              <Line type="monotone" dataKey="satisfaction" stroke="#004EEB" strokeWidth={2} dot={false} name={t('insights.satisfaction')} />
              <Line type="monotone" dataKey="mobility"     stroke="#155EEF" strokeWidth={2} dot={false} name={t('insights.mobility')} />
              <Line type="monotone" dataKey="pain"         stroke="#B2CCFF" strokeWidth={2} dot={false} name={t('insights.pain')} />
            </LineChart>
          </ResponsiveContainer>

          <div className="flex justify-around mt-2 text-xs text-gray-400">
            <span>February</span>
            <span>March</span>
            <span>April</span>
          </div>
        </ChartCard>

        {/* Delay trend */}
        <ChartCard
          title={t('insights.delayTitle')}
          controls={<PeriodToggle options={periodOptions} value={activeDelayPeriod} onChange={setDelayPeriod} />}
        >
          <div className="flex items-center gap-4 mb-4">
            {[
              { color: '#D92D20', label: t('insights.goalThreshold'), dashed: true },
              { color: '#004EEB', label: t('insights.avgDelay') },
            ].map(item => (
              <span key={item.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                {item.dashed
                  ? <span className="w-4 border-t-2 border-dashed" style={{ borderColor: item.color }} />
                  : <span className="size-2 rounded-full" style={{ background: item.color }} />}
                {item.label}
              </span>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={216}>
            <LineChart data={DELAY_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#98A2B3' }} axisLine={false} tickLine={false} interval={2} tickFormatter={v => v.split(' ')[0]} />
              <YAxis tick={{ fontSize: 11, fill: '#98A2B3' }} axisLine={false} tickLine={false} domain={[0, 20]} />
              <Tooltip content={<CustomLineTooltip />} />
              <ReferenceLine y={15} stroke="#D92D20" strokeDasharray="5 4" strokeWidth={1.5} />
              <ReferenceLine x="Mar W2" stroke="#E4E7EC" strokeDasharray="4 3" />
              <Line
                type="monotone"
                dataKey="delay"
                stroke="#004EEB"
                strokeWidth={2}
                dot={(props) => {
                  if (props.index === 7) {
                    return <circle key={props.index} cx={props.cx} cy={props.cy} r={4} fill="#004EEB" stroke="white" strokeWidth={2} />
                  }
                  return <g key={props.index} />
                }}
                name={t('insights.avgDelay')}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="flex justify-around mt-2 text-xs text-gray-400">
            <span>February</span>
            <span>March</span>
            <span>April</span>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
