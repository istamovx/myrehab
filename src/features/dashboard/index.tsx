import { useState } from 'react'
import { Calendar, Search, Settings2, Maximize2, Plus, Phone, MoreHorizontal, AlertTriangle, Info, TrendingUp } from 'lucide-react'
import { PillSelect } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { DonutChart } from '@/components/charts/donut-chart'
import { DOCTORS, DASHBOARD_ALERTS } from '@/data/mock-data'
import { cn } from '@/lib/utils'

const DEPARTMENTS = [
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'sports', label: 'Sports Medicine' },
  { value: 'cardio', label: 'Cardiology' },
]

const TIME_SLOTS = [8, 9, 10, 11, 12, 13, 14, 15]
const TOTAL_HOURS = 7

function timeToPercent(hour: number, min = 0) {
  return ((hour - 8 + min / 60) / TOTAL_HOURS) * 100
}

function durationPercent(startH: number, startM: number, endH: number, endM: number) {
  return ((endH - startH + (endM - startM) / 60) / TOTAL_HOURS) * 100
}

const blockColors = {
  surgery:      'bg-gray-900 text-white',
  'ward-round': 'bg-brand-100 text-brand-800',
  'consent-talk':'bg-brand-50 text-brand-700',
  break:        'bg-gray-100 text-gray-500',
}

const blockIcons: Record<string, string> = {
  surgery:      '✕',
  'ward-round': '◎',
  'consent-talk':'◎',
  break:        '☕',
}

function AlertIcon({ type }: { type: 'high' | 'medium' | 'low' }) {
  if (type === 'high') {
    return (
      <div className="size-8 rounded-full bg-error-50 flex items-center justify-center shrink-0">
        <AlertTriangle size={14} className="text-error-600" />
      </div>
    )
  }
  if (type === 'medium') {
    return (
      <div className="size-8 rounded-full bg-warning-50 flex items-center justify-center shrink-0">
        <AlertTriangle size={14} className="text-warning-600" />
      </div>
    )
  }
  return (
    <div className="size-8 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
      <Info size={14} className="text-brand-600" />
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 shadow-[var(--shadow-xs)]', className)}>
      {children}
    </div>
  )
}

export function DashboardPage() {
  const [department, setDepartment] = useState('orthopedics')
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Department dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Monitor your team and patient activity</p>
          </div>
          <PillSelect
            value={department}
            onValueChange={setDepartment}
            options={DEPARTMENTS}
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 h-9 px-3.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer shadow-xs">
            <Calendar size={14} className="text-gray-400" />
            Apr 03, 2025
          </button>
          <Input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search size={14} />}
            className="w-48"
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sessions card */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-1">
            <p className="text-sm font-medium text-gray-500">Rehab sessions today</p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success-50 text-success-700 text-xs font-medium">
              <TrendingUp size={11} />
              +2
            </span>
          </div>

          <div className="flex items-center gap-6 mt-4">
            <div className="relative shrink-0">
              <DonutChart percentage={70} color="#155EEF" size={120} strokeWidth={14} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-gray-900">12</span>
                <span className="text-[10px] text-gray-400 -mt-0.5">sessions</span>
              </div>
            </div>

            <div className="space-y-2.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <span className="size-2 rounded-full bg-brand-600 shrink-0" />
                <span className="text-gray-500">8 Finished</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="size-2 rounded-full bg-gray-200 shrink-0" />
                <span className="text-gray-500">4 Upcoming</span>
              </div>
              <p className="text-xs text-gray-400 pt-1 border-t border-gray-100">
                <span className="font-semibold text-gray-700">70%</span> on schedule
              </p>
            </div>
          </div>
        </Card>

        {/* At-risk card */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-1">
            <p className="text-sm font-medium text-gray-500">At-risk patients today</p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-error-50 text-error-700 text-xs font-medium">
              −3 critical
            </span>
          </div>

          <div className="flex items-center gap-6 mt-4">
            <div className="relative shrink-0">
              <DonutChart percentage={60} color="#155EEF" size={120} strokeWidth={14} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-gray-900">8</span>
                <span className="text-[10px] text-gray-400 -mt-0.5">at-risk</span>
              </div>
            </div>

            <div className="space-y-2.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <span className="size-2 rounded-full bg-brand-600 shrink-0" />
                <span className="text-gray-500">5 Reviewed</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="size-2 rounded-full bg-gray-200 shrink-0" />
                <span className="text-gray-500">3 Pending</span>
              </div>
              <p className="text-xs text-gray-400 pt-1 border-t border-gray-100">
                <span className="font-semibold text-gray-700">60%</span> reviewed
              </p>
            </div>
          </div>
        </Card>

        {/* Alerts panel */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Important alerts</h3>
            <div className="flex items-center gap-1">
              <button className="size-7 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer transition-colors">
                <Settings2 size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {DASHBOARD_ALERTS.map(alert => (
              <div key={alert.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                <AlertIcon type={alert.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-gray-400 hover:text-gray-600 mt-0.5">
                  <MoreHorizontal size={15} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Team section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Gantt chart */}
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-semibold text-gray-900">Team Schedule</h3>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-sm bg-gray-900" />
                  Surgery
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-sm bg-brand-100" />
                  Session
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-sm bg-brand-50 border border-brand-100" />
                  Consent
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-sm bg-gray-100 border border-gray-200" />
                  Break
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="size-7 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer transition-colors">
                <Settings2 size={14} />
              </button>
              <button className="size-7 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer transition-colors">
                <Maximize2 size={14} />
              </button>
            </div>
          </div>

          <div className="p-5 overflow-x-auto">
            <div className="min-w-[560px]">
              <div className="flex mb-3">
                <div className="w-36 shrink-0 pr-3">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span>Doctors</span>
                    <button className="size-5 rounded-md bg-brand-50 text-brand-600 flex items-center justify-center hover:bg-brand-100 transition-colors cursor-pointer">
                      <Plus size={11} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 relative h-4">
                  {TIME_SLOTS.map((h) => (
                    <span
                      key={h}
                      className="absolute text-[10px] text-gray-400 -translate-x-1/2"
                      style={{ left: `${((h - 8) / TOTAL_HOURS) * 100}%` }}
                    >
                      {h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {DOCTORS.map(doc => (
                  <div key={doc.id} className="flex items-center">
                    <div className="w-36 shrink-0 pr-3 flex items-center gap-2">
                      <Avatar name={doc.name} size="xs" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">{doc.name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{doc.role}</p>
                      </div>
                    </div>
                    <div className="flex-1 h-9 bg-gray-50 rounded-lg relative overflow-hidden border border-gray-100">
                      {TIME_SLOTS.slice(1).map(h => (
                        <div
                          key={h}
                          className="absolute top-0 bottom-0 w-px bg-gray-200"
                          style={{ left: `${((h - 8) / TOTAL_HOURS) * 100}%` }}
                        />
                      ))}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-brand-400/60 z-10"
                        style={{ left: `${timeToPercent(10)}%` }}
                      />
                      {doc.schedule?.map((block, i) => (
                        <div
                          key={i}
                          className={cn(
                            'absolute top-1 bottom-1 rounded-md flex items-center px-1.5 text-[11px] font-medium overflow-hidden',
                            blockColors[block.type as keyof typeof blockColors] ?? 'bg-gray-100 text-gray-600',
                          )}
                          style={{
                            left: `${timeToPercent(block.startHour, block.startMin)}%`,
                            width: `${durationPercent(block.startHour, block.startMin, block.endHour, block.endMin)}%`,
                          }}
                        >
                          <span className="mr-1 opacity-60">{blockIcons[block.type]}</span>
                          <span className="truncate">{block.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Team availability */}
        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Team availability</h3>
            <button className="size-7 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-400 cursor-pointer transition-colors">
              <Settings2 size={14} />
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {DOCTORS.map(doc => (
              <div key={doc.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <Avatar name={doc.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                  <p className="text-xs text-gray-400 truncate">{doc.role}</p>
                  {doc.availableFrom && (
                    <p className="text-xs text-success-600 flex items-center gap-1 mt-0.5">
                      <span className="size-1.5 rounded-full bg-success-600" />
                      {doc.availableFrom}–{doc.availableTo}
                    </p>
                  )}
                </div>
                <button className="size-8 rounded-full bg-brand-600 flex items-center justify-center hover:bg-brand-700 transition-colors cursor-pointer shrink-0 shadow-xs">
                  <Phone size={13} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
