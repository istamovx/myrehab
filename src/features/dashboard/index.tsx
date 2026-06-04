import { useState } from 'react'
import { Calendar, Search, Settings2, Maximize2, Plus, Phone, Info, MoreHorizontal } from 'lucide-react'
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

// Gantt time slots 8AM - 15PM
const TIME_SLOTS = [8, 9, 10, 11, 12, 13, 14, 15]
const TOTAL_HOURS = 7 // 8 to 15

function timeToPercent(hour: number, min = 0) {
  return ((hour - 8 + min / 60) / TOTAL_HOURS) * 100
}

function durationPercent(startH: number, startM: number, endH: number, endM: number) {
  return ((endH - startH + (endM - startM) / 60) / TOTAL_HOURS) * 100
}

const blockColors = {
  surgery: 'bg-navy text-white',
  'ward-round': 'bg-[#BED2E9] text-navy',
  'consent-talk': 'bg-light-blue/70 text-navy',
  break: 'bg-gray-100 text-gray-500 border border-gray-200',
}

const blockIcons = {
  surgery: '✕',
  'ward-round': '◎',
  'consent-talk': '◎',
  break: '☕',
}

function AlertIcon({ type }: { type: 'high' | 'medium' | 'low' }) {
  if (type === 'high') {
    return (
      <div className="size-8 rounded-full bg-danger-bg flex items-center justify-center shrink-0">
        <span className="text-danger text-sm font-bold">!</span>
      </div>
    )
  }
  if (type === 'medium') {
    return (
      <div className="size-8 rounded-full bg-warning-bg flex items-center justify-center shrink-0">
        <span className="text-warning text-sm font-bold">!</span>
      </div>
    )
  }
  return (
    <div className="size-8 rounded-full bg-info-bg flex items-center justify-center shrink-0">
      <span className="text-info text-sm font-bold">i</span>
    </div>
  )
}

export function DashboardPage() {
  const [department, setDepartment] = useState('orthopedics')
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-navy">Department dashboard:</h1>
          <PillSelect
            value={department}
            onValueChange={setDepartment}
            options={DEPARTMENTS}
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 h-9 px-3.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-navy hover:border-gray-300 transition-colors cursor-pointer">
            <Calendar size={15} className="text-gray-400" />
            Apr 03, 2025
          </button>
          <Input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search size={15} />}
            className="w-48"
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sessions card */}
        <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)]">
          <h3 className="text-base font-semibold text-navy mb-5">
            Rehab sessions scheduled on the day
          </h3>

          <div className="flex items-center gap-6">
            <div className="relative">
              <DonutChart percentage={70} color="#4684FE" size={148} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-navy">12</span>
                <span className="text-xs text-gray-400">Total sessions</span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-success-bg text-success rounded-lg text-sm font-semibold">
                <span>+2</span>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm">
                  <span className="size-2.5 rounded-full bg-primary shrink-0" />
                  <span className="text-gray-600">8 Finished sessions</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="size-2.5 rounded-full bg-gray-200 shrink-0" />
                  <span className="text-gray-600">4 Upcoming sessions</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            <span className="font-semibold text-navy">70%</span> sessions on schedule
          </p>
        </div>

        {/* At-risk card */}
        <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)]">
          <h3 className="text-base font-semibold text-navy mb-5">
            At-Risk patients on the day
          </h3>

          <div className="flex items-center gap-6">
            <div className="relative">
              <DonutChart percentage={60} color="#4684FE" size={148} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-navy">8</span>
                <span className="text-xs text-gray-400">Total At-risk</span>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-danger-bg text-danger rounded-lg text-sm font-semibold">
                <span>-3</span>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm">
                  <span className="size-2.5 rounded-full bg-primary shrink-0" />
                  <span className="text-gray-600">5 Finished At-risk</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="size-2.5 rounded-full bg-gray-200 shrink-0" />
                  <span className="text-gray-600">3 Upcoming At-risk</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            <span className="font-semibold text-navy">60%</span> at-risk cases reviewed
          </p>
        </div>

        {/* Alerts panel */}
        <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-navy">Important alerts</h3>
            <div className="flex items-center gap-2">
              <button className="size-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer transition-colors">
                <Settings2 size={15} />
              </button>
              <button className="size-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer transition-colors">
                <Info size={15} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {DASHBOARD_ALERTS.map(alert => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <AlertIcon type={alert.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy">{alert.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Gantt chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <h3 className="text-base font-semibold text-navy">Team Gantt</h3>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-navy" />
                  Surgery
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-light-blue" />
                  Session
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-[#BED2E9]/70" />
                  Consent
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-gray-100 border border-gray-200" />
                  Break
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="size-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer transition-colors">
                <Settings2 size={15} />
              </button>
              <button className="size-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer transition-colors">
                <Maximize2 size={15} />
              </button>
            </div>
          </div>

          {/* Gantt grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[580px]">
              {/* Header */}
              <div className="flex mb-2">
                <div className="w-40 shrink-0 pr-3">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span>Doctors</span>
                    <button className="size-5 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                      <Plus size={11} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 relative h-5">
                  {TIME_SLOTS.map((h) => (
                    <span
                      key={h}
                      className="absolute text-xs text-gray-400 -translate-x-1/2"
                      style={{ left: `${((h - 8) / TOTAL_HOURS) * 100}%` }}
                    >
                      {h < 12 ? `${h}:00 AM` : h === 12 ? '12:00 PM' : `${h - 12}:00 PM`}
                    </span>
                  ))}
                </div>
              </div>

              {/* Current time indicator */}
              <div className="space-y-1.5">
                {DOCTORS.map(doc => (
                  <div key={doc.id} className="flex items-center">
                    <div className="w-40 shrink-0 pr-3 flex items-center gap-2">
                      <Avatar name={doc.name} size="xs" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-navy truncate">{doc.name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{doc.role}</p>
                      </div>
                    </div>
                    <div className="flex-1 h-10 bg-bg-page rounded-lg relative overflow-hidden">
                      {/* Time grid lines */}
                      {TIME_SLOTS.slice(1).map(h => (
                        <div
                          key={h}
                          className="absolute top-0 bottom-0 w-px bg-gray-100"
                          style={{ left: `${((h - 8) / TOTAL_HOURS) * 100}%` }}
                        />
                      ))}
                      {/* Current time indicator (10:00 AM) */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-primary/60 z-10"
                        style={{ left: `${timeToPercent(10)}%` }}
                      />
                      {/* Schedule blocks */}
                      {doc.schedule?.map((block, i) => (
                        <div
                          key={i}
                          className={cn(
                            'absolute top-1 bottom-1 rounded-md flex items-center px-2 text-[11px] font-medium overflow-hidden',
                            blockColors[block.type],
                          )}
                          style={{
                            left: `${timeToPercent(block.startHour, block.startMin)}%`,
                            width: `${durationPercent(block.startHour, block.startMin, block.endHour, block.endMin)}%`,
                          }}
                        >
                          <span className="mr-1 opacity-70">{blockIcons[block.type]}</span>
                          <span className="truncate">{block.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Team availability */}
        <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-navy">Team availability</h3>
            <button className="size-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer transition-colors">
              <Settings2 size={15} />
            </button>
          </div>

          <div className="space-y-3">
            {DOCTORS.map(doc => (
              <div key={doc.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <Avatar name={doc.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy truncate">{doc.name}</p>
                  <p className="text-xs text-gray-400">{doc.role}</p>
                  {doc.availableFrom && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <span className="size-1.5 rounded-full bg-success" />
                      {doc.availableFrom} – {doc.availableTo}
                    </p>
                  )}
                </div>
                <button className="size-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary-hover transition-colors cursor-pointer shrink-0">
                  <Phone size={14} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
