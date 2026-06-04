import { useState } from 'react'
import { RefreshCw, Calendar } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ReferenceLine,
} from 'recharts'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { INSIGHTS_BAR_DATA, PROMS_DATA, DELAY_DATA, COMPLICATIONS_HEATMAP } from '@/data/mock-data'

const VIEW_OPTIONS = [
  { value: 'trends', label: 'Trends' },
  { value: 'overview', label: 'Overview' },
  { value: 'compare', label: 'Compare' },
]

const PERIOD_OPTIONS = [
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '6m', label: 'Last 6 months' },
  { value: '1y', label: 'Last year' },
]

const PROCEDURE_OPTIONS = [
  { value: 'all', label: 'All procedures' },
  { value: 'knee', label: 'Knees' },
  { value: 'hip', label: 'Hip' },
  { value: 'shoulder', label: 'Shoulder' },
  { value: 'spine', label: 'Spine' },
]

const TEAM_OPTIONS = [
  { value: 'all', label: 'All teams' },
  { value: 'team-a', label: 'Team A' },
  { value: 'team-b', label: 'Team B' },
  { value: 'team-c', label: 'Team C' },
]

const PATIENT_OPTIONS = [
  { value: 'all', label: 'All patients' },
  { value: 'high-risk', label: 'High risk' },
  { value: 'at-risk', label: 'At-risk' },
  { value: 'ready', label: 'Ready' },
]

const DEPT_OPTIONS = [
  { value: 'ortho', label: 'Orthopedics & Trauma Surgery' },
  { value: 'neuro', label: 'Neurology' },
  { value: 'sports', label: 'Sports Medicine' },
]

// Month group labels for bar chart

function ChartCard({ title, children, controls }: {
  title: string
  children: React.ReactNode
  controls?: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-gray-300 text-xs">⠿</span>
          <h3 className="text-sm font-bold text-navy">{title}</h3>
        </div>
        {controls}
      </div>
      {children}
    </div>
  )
}

function PeriodToggle({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
      {['3 days', '3 month', '1 year'].map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all',
            value === v
              ? 'bg-navy text-white shadow-sm'
              : 'text-gray-500 hover:text-navy',
          )}
        >
          {v}
        </button>
      ))}
    </div>
  )
}

// Heatmap cell
function HeatCell({ value }: { value: number }) {
  const opacity = value === 0 ? 0.08 : value / 100
  return (
    <div
      className="rounded-lg h-12 transition-all"
      style={{
        backgroundColor: `rgba(70, 132, 254, ${opacity})`,
        minWidth: 60,
      }}
    />
  )
}

const CustomBarTooltip = ({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-[var(--shadow-dropdown)] px-4 py-2.5 border border-gray-100">
        <p className="text-xs font-semibold text-navy">{label} – <span className="text-primary">{payload[0].value}%</span></p>
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
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-[var(--shadow-dropdown)] px-4 py-3 border border-gray-100">
        <p className="text-xs font-semibold text-navy mb-2">{label}</p>
        {payload.map(p => (
          <div key={p.name} className="flex items-center gap-2 text-xs">
            <span className="size-2 rounded-full" style={{ background: p.color }} />
            <span className="text-gray-500">{p.name}:</span>
            <span className="font-semibold text-navy">{p.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// Create display data for bar chart (combine all weeks)
const barDisplayData = INSIGHTS_BAR_DATA.map((d) => ({
  name: `${d.month.slice(0, 3)} ${d.week}`,
  value: d.value,
  fill: '#4684FE',
}))

export function InsightsPage() {
  const [view, setView] = useState('trends')
  const [period, setPeriod] = useState('30d')
  const [procedure, setProcedure] = useState('knee')
  const [team, setTeam] = useState('team-b')
  const [patients, setPatients] = useState('all')
  const [dept, setDept] = useState('ortho')
  const [barPeriod, setBarPeriod] = useState('3 month')
  const [promsPeriod, setPromsPeriod] = useState('3 month')
  const [delayPeriod, setDelayPeriod] = useState('3 month')

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-2xl font-bold text-navy">Insights</h1>
        <Select
          value={view}
          onValueChange={setView}
          options={VIEW_OPTIONS}
          triggerClassName="font-semibold"
        />

        <div className="flex-1" />

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={period}
            onValueChange={setPeriod}
            options={PERIOD_OPTIONS}
            triggerClassName="gap-1.5"
          />
          <button className="inline-flex items-center gap-1.5 h-9 px-3.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-navy hover:border-gray-300 transition-colors cursor-pointer">
            <Calendar size={14} className="text-gray-400" />
            <span className="text-primary font-semibold">{PERIOD_OPTIONS.find(o => o.value === period)?.label}</span>
          </button>
          <Select value={procedure} onValueChange={setProcedure} options={PROCEDURE_OPTIONS} />
          <Select value={team} onValueChange={setTeam} options={TEAM_OPTIONS} />
          <Select value={patients} onValueChange={setPatients} options={PATIENT_OPTIONS} />
          <Select value={dept} onValueChange={setDept} options={DEPT_OPTIONS} triggerClassName="max-w-[220px]" />
          <Button variant="ghost" size="sm" className="gap-1.5 text-gray-500 font-medium border border-gray-200 bg-white hover:bg-gray-50">
            <RefreshCw size={13} />
            Reset
          </Button>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Complication rate over time */}
        <ChartCard
          title="Complication rate over time"
          controls={<PeriodToggle value={barPeriod} onChange={setBarPeriod} />}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barDisplayData} margin={{ top: 4, right: 0, left: -20, bottom: 4 }}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                tickFormatter={v => `${v}%`}
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#F3F4F6', radius: 6 }} />
              <Bar
                dataKey="value"
                fill="#4684FE"
                radius={[5, 5, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Month labels */}
          <div className="flex justify-around mt-1 text-xs text-gray-400">
            <span>February</span>
            <span>March</span>
            <span>April</span>
          </div>
        </ChartCard>

        {/* Complications heatmap */}
        <ChartCard
          title="Complications"
          controls={
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Less</span>
              <div className="flex gap-0.5">
                {[0.1, 0.3, 0.5, 0.7, 1].map((o) => (
                  <div key={o} className="w-5 h-4 rounded-sm" style={{ background: `rgba(70, 132, 254, ${o})` }} />
                ))}
              </div>
              <span>More</span>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <div className="min-w-[400px]">
              {/* Column headers (teams) */}
              <div className="flex gap-2 mb-2 ml-20">
                {COMPLICATIONS_HEATMAP.teams.map(t => (
                  <div key={t} className="flex-1 text-center text-xs text-gray-400 font-medium">{t}</div>
                ))}
              </div>

              {/* Rows */}
              {COMPLICATIONS_HEATMAP.bodyParts.map((part, rowIdx) => (
                <div key={part} className="flex items-center gap-2 mb-2">
                  <div className="w-16 text-xs text-gray-500 font-medium text-right pr-2 shrink-0">{part}</div>
                  {COMPLICATIONS_HEATMAP.values[rowIdx].map((val, colIdx) => (
                    <div key={colIdx} className="flex-1">
                      <HeatCell value={val} />
                    </div>
                  ))}
                </div>
              ))}

              {/* Column labels */}
              <div className="flex gap-2 mt-2 ml-20">
                {COMPLICATIONS_HEATMAP.teams.map(t => (
                  <div key={t} className="flex-1 text-center text-xs text-gray-400">{t}</div>
                ))}
              </div>
            </div>
          </div>
        </ChartCard>

        {/* PROMs trend */}
        <ChartCard
          title="PROMs trend"
          controls={<PeriodToggle value={promsPeriod} onChange={setPromsPeriod} />}
        >
          {/* Legend */}
          <div className="flex items-center gap-4 mb-4 text-xs">
            <span className="flex items-center gap-1.5 text-gray-500">
              <span className="size-2 rounded-full bg-[#1e3a5f]" />
              Satisfaction
            </span>
            <span className="flex items-center gap-1.5 text-gray-500">
              <span className="size-2 rounded-full bg-[#4684FE]" />
              Mobility
            </span>
            <span className="flex items-center gap-1.5 text-gray-500">
              <span className="size-2 rounded-full bg-[#BED2E9]" />
              Pain
            </span>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={PROMS_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                interval={2}
                tickFormatter={v => v.split(' ')[0]}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                domain={[0, 10]}
                ticks={[0, 2.5, 5, 7.5, 10]}
              />
              <Tooltip content={<CustomLineTooltip />} />
              <ReferenceLine x="Mar W2" stroke="#D1D5DB" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="satisfaction" stroke="#1e3a5f" strokeWidth={2.5} dot={false} name="Satisfaction" />
              <Line type="monotone" dataKey="mobility" stroke="#4684FE" strokeWidth={2.5} dot={false} name="Mobility" />
              <Line type="monotone" dataKey="pain" stroke="#BED2E9" strokeWidth={2.5} dot={false} name="Pain" />
            </LineChart>
          </ResponsiveContainer>

          <div className="flex justify-around mt-1 text-xs text-gray-400">
            <span>February</span>
            <span>March</span>
            <span>April</span>
          </div>
        </ChartCard>

        {/* Procedure start delay trend */}
        <ChartCard
          title="Procedure start delay trend"
          controls={<PeriodToggle value={delayPeriod} onChange={setDelayPeriod} />}
        >
          {/* Legend */}
          <div className="flex items-center gap-4 mb-4 text-xs">
            <span className="flex items-center gap-1.5 text-gray-500">
              <span className="w-4 h-0.5 bg-danger" />
              Goals
            </span>
            <span className="flex items-center gap-1.5 text-gray-500">
              <span className="size-2 rounded-full bg-[#1e3a5f]" />
              Avg. delay (min)
            </span>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={DELAY_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
              <CartesianGrid vertical={false} stroke="#F3F4F6" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                interval={2}
                tickFormatter={v => v.split(' ')[0]}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                domain={[0, 20]}
                ticks={[0, 5, 10, 15, '>15']}
              />
              <Tooltip content={<CustomLineTooltip />} />
              <ReferenceLine y={15} stroke="#EF4444" strokeDasharray="5 5" strokeWidth={1.5} />
              <ReferenceLine x="Mar W2" stroke="#D1D5DB" strokeDasharray="4 4" />
              <Line
                type="monotone"
                dataKey="delay"
                stroke="#1e3a5f"
                strokeWidth={2.5}
                dot={(props) => {
                  if (props.index === 7) {
                    return <circle key={props.index} cx={props.cx} cy={props.cy} r={5} fill="#1e3a5f" stroke="white" strokeWidth={2} />
                  }
                  return <g key={props.index} />
                }}
                name="Avg. delay (min)"
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="flex justify-around mt-1 text-xs text-gray-400">
            <span>February</span>
            <span>March</span>
            <span>April</span>
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
