import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, Settings2, Maximize2, Plus, Phone, MoreHorizontal, AlertTriangle, Info, TrendingUp, Users, Activity, Stethoscope, UserX, Clock, FileText } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ReferenceLine,
} from 'recharts'
import { PillSelect } from '@/components/ui/select'
import { PageHeader } from '@/components/layout/page-header'
import { Avatar } from '@/components/ui/avatar'
import { DOCTORS, DASHBOARD_ALERTS, type Doctor, type ScheduleBlock } from '@/data/mock-data'
import { CLINIC_STATS } from '@/data/clinic-mock-data'
import { cn, formatUzDate } from '@/lib/utils'
import { SUPABASE_ENABLED } from '@/lib/supabase'
import { getOrganizationStats } from '@/services/analytics.service'
import { useAuthStore } from '@/store/auth'

const SESSION_DATA = [
  { kun: 'Du', soni: 8 },
  { kun: 'Se', soni: 11 },
  { kun: 'Ch', soni: 7 },
  { kun: 'Pa', soni: 14 },
  { kun: 'Ju', soni: 12 },
  { kun: 'Sh', soni: 5 },
  { kun: 'Ya', soni: 3 },
]

const ATRISK_DATA = [
  { hafta: '1-h', soni: 5 },
  { hafta: '2-h', soni: 7 },
  { hafta: '3-h', soni: 6 },
  { hafta: '4-h', soni: 9 },
  { hafta: '5-h', soni: 8 },
  { hafta: '6-h', soni: 11 },
  { hafta: '7-h', soni: 8 },
]

const TIME_SLOTS = [8, 9, 10, 11, 12, 13, 14, 15]
const TOTAL_HOURS = 7

function timeToPercent(hour: number, min = 0) {
  return ((hour - 8 + min / 60) / TOTAL_HOURS) * 100
}

function durationPercent(startH: number, startM: number, endH: number, endM: number) {
  return ((endH - startH + (endM - startM) / 60) / TOTAL_HOURS) * 100
}

// Live clock — re-renders on an interval so the schedule reflects "now".
function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

const minutesOf = (h: number, m: number) => h * 60 + m

// The schedule block a doctor is currently in (or null = free now).
function activeBlock(doc: Doctor, now: Date): ScheduleBlock | null {
  const cur = minutesOf(now.getHours(), now.getMinutes())
  return doc.schedule?.find(b => cur >= minutesOf(b.startHour, b.startMin) && cur < minutesOf(b.endHour, b.endMin)) ?? null
}

const blockColors = {
  surgery:       'bg-[var(--text-primary)] text-[var(--bg-primary)]',
  'ward-round':  'bg-[var(--bg-brand-primary)] text-[var(--text-brand-secondary)]',
  'consent-talk':'bg-[var(--bg-brand-primary)] text-[var(--text-brand-secondary)]',
  break:         'bg-[var(--bg-tertiary)] text-[var(--text-quaternary)]',
}

const blockIcons: Record<string, string> = {
  surgery:       '✕',
  'ward-round':  '◎',
  'consent-talk':'◎',
  break:         '☕',
}

function AlertIcon({ type }: { type: 'high' | 'medium' | 'low' }) {
  if (type === 'high')
    return (
      <div className="size-8 rounded-full bg-[var(--bg-error-primary)] flex items-center justify-center shrink-0">
        <AlertTriangle size={14} className="text-[var(--fg-error-primary)]" />
      </div>
    )
  if (type === 'medium')
    return (
      <div className="size-8 rounded-full bg-[var(--bg-warning-primary)] flex items-center justify-center shrink-0">
        <AlertTriangle size={14} className="text-[var(--fg-warning-primary)]" />
      </div>
    )
  return (
    <div className="size-8 rounded-full bg-[var(--bg-brand-primary)] flex items-center justify-center shrink-0">
      <Info size={14} className="text-[var(--text-brand-primary)]" />
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)]', className)}>
      {children}
    </div>
  )
}

export function DashboardPage() {
  const { t } = useTranslation()
  const [department, setDepartment] = useState('orthopedics')
  const orgId = useAuthStore(s => s.user?.organizationId)
  const [stats, setStats] = useState(CLINIC_STATS)

  useEffect(() => {
    if (!SUPABASE_ENABLED || !orgId) return
    getOrganizationStats(orgId)
      .then(live => {
        setStats({
          totalPatients:   live.totalPatients,
          activePlans:     live.appointmentsThisMonth,
          totalDoctors:    live.totalDoctors,
          unassigned:      Math.max(0, live.totalPatients - live.activePatients),
          pendingRequests: Math.max(0, live.appointmentsThisMonth - live.completedAppointments),
          draftPlans:      0,
        })
      })
      .catch(console.error)
  }, [orgId])

  const DEPARTMENTS = [
    { value: 'orthopedics', label: t('team.orthopedic') },
    { value: 'neurology',   label: t('team.neurology') },
    { value: 'sports',      label: 'Sport tibbiyoti' },
    { value: 'cardio',      label: 'Kardiologiya' },
  ]

  const todayLabel = formatUzDate(new Date())

  // Real-time team schedule
  const now = useNow()
  const nowDecimal = now.getHours() + now.getMinutes() / 60
  const nowInRange = nowDecimal >= 8 && nowDecimal <= 15
  const nowPercent = Math.min(100, Math.max(0, timeToPercent(now.getHours(), now.getMinutes())))
  const nowClock = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
        actions={
          <>
            <PillSelect value={department} onValueChange={setDepartment} options={DEPARTMENTS} />
            <button className="inline-flex items-center gap-2 h-9 px-3.5 bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-lg text-[16px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer [box-shadow:var(--shadow-xs)]">
              <Calendar size={14} className="text-[var(--fg-quaternary)]" />
              {todayLabel}
            </button>
          </>
        }
      />

      {/* Aggregate stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: t('dashboard.totalPatients'),   value: stats.totalPatients,   Icon: Users,       color: 'text-[var(--fg-brand-primary)]',    bg: 'bg-[var(--bg-brand-primary)]' },
          { label: t('dashboard.activePlans'),     value: stats.activePlans,     Icon: Activity,    color: 'text-[var(--fg-success-primary)]',  bg: 'bg-[var(--bg-success-primary)]' },
          { label: t('dashboard.totalDoctors'),    value: stats.totalDoctors,    Icon: Stethoscope, color: 'text-[var(--text-tertiary)]',       bg: 'bg-[var(--bg-secondary)]' },
          { label: t('dashboard.unassigned'),      value: stats.unassigned,      Icon: UserX,       color: 'text-[var(--fg-warning-primary)]',  bg: 'bg-[var(--bg-warning-primary)]' },
          { label: t('dashboard.pendingRequests'), value: stats.pendingRequests, Icon: Clock,       color: 'text-[var(--fg-brand-primary)]',    bg: 'bg-[var(--bg-brand-primary)]' },
          { label: t('dashboard.draftPlans'),      value: stats.draftPlans,      Icon: FileText,    color: 'text-[var(--text-tertiary)]',       bg: 'bg-[var(--bg-secondary)]' },
        ].map(s => (
          <div key={s.label} className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)] p-4">
            <div className={cn('size-8 rounded-lg flex items-center justify-center mb-3', s.bg)}>
              <s.Icon size={16} className={s.color} />
            </div>
            <p className="text-[24px] font-bold text-[var(--text-primary)] leading-none mb-1">{s.value}</p>
            <p className="text-[16px] text-[var(--text-tertiary)] leading-snug">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sessions — BarChart */}
        <Card className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[16px] font-medium text-[var(--text-quaternary)]">{t('dashboard.sessionsToday')}</p>
              <p className="text-[28px] font-bold text-[var(--text-primary)] leading-tight">12</p>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--bg-success-primary)] text-[var(--text-success-primary)] text-[13px] font-semibold">
              <TrendingUp size={11} />
              +2
            </span>
          </div>
          <ResponsiveContainer width="100%" height={110}>
            <BarChart data={SESSION_DATA} margin={{ top: 0, right: 0, left: -28, bottom: 0 }} barSize={18}>
              <CartesianGrid vertical={false} stroke="var(--border-secondary)" />
              <XAxis dataKey="kun" tick={{ fontSize: 11, fill: 'var(--fg-quaternary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--fg-quaternary)' }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: 'var(--bg-secondary)', radius: 4 }}
                contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-secondary)', borderRadius: 8, fontSize: 12 }}
                formatter={(v) => [`${v} seans`, '']}
              />
              <Bar dataKey="soni" fill="#2970FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-secondary)] text-[13px] text-[var(--text-quaternary)]">
            <span><span className="font-semibold text-[var(--text-secondary)]">8</span> {t('dashboard.finished', { count: 8 }).replace('8 ta ', '')}</span>
            <span><span className="font-semibold text-[var(--text-secondary)]">4</span> {t('dashboard.upcoming', { count: 4 }).replace('4 ta ', '')}</span>
            <span><span className="font-semibold text-[var(--text-secondary)]">70%</span> {t('dashboard.onSchedule')}</span>
          </div>
        </Card>

        {/* At-risk — LineChart */}
        <Card className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[16px] font-medium text-[var(--text-quaternary)]">{t('dashboard.atRiskToday')}</p>
              <p className="text-[28px] font-bold text-[var(--text-primary)] leading-tight">8</p>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--bg-error-primary)] text-[var(--text-error-primary)] text-[13px] font-semibold">
              −3 kritik
            </span>
          </div>
          <ResponsiveContainer width="100%" height={110}>
            <LineChart data={ATRISK_DATA} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border-secondary)" />
              <XAxis dataKey="hafta" tick={{ fontSize: 11, fill: 'var(--fg-quaternary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--fg-quaternary)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-secondary)', borderRadius: 8, fontSize: 12 }}
                formatter={(v) => [`${v} bemor`, '']}
              />
              <ReferenceLine y={10} stroke="#D92D20" strokeDasharray="4 3" strokeWidth={1.5} />
              <Line type="monotone" dataKey="soni" stroke="#2970FF" strokeWidth={2} dot={{ r: 3, fill: '#2970FF' }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-secondary)] text-[13px] text-[var(--text-quaternary)]">
            <span><span className="font-semibold text-[var(--text-secondary)]">5</span> {t('dashboard.reviewed', { count: 5 }).replace('5 ta ', '')}</span>
            <span><span className="font-semibold text-[var(--text-secondary)]">3</span> {t('dashboard.pending', { count: 3 }).replace('3 ta ', '')}</span>
            <span><span className="font-semibold text-[var(--text-secondary)]">60%</span> ko'rib chiqildi</span>
          </div>
        </Card>

        {/* Alerts panel */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-secondary)]">
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">{t('dashboard.alerts')}</h3>
            <button className="size-7 rounded-md hover:bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--fg-quaternary)] cursor-pointer transition-colors">
              <Settings2 size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-secondary)]">
            {DASHBOARD_ALERTS.map(alert => (
              <div key={alert.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-[var(--bg-secondary)] transition-colors group">
                <AlertIcon type={alert.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-medium text-[var(--text-primary)]">{alert.title}</p>
                  <p className="text-[16px] text-[var(--text-quaternary)] mt-0.5 line-clamp-2">{alert.message}</p>
                  <p className="text-[16px] text-[var(--fg-quaternary)] mt-1">{alert.time}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[var(--fg-quaternary)] hover:text-[var(--text-tertiary)] mt-0.5">
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
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-secondary)]">
            <div className="flex items-center gap-4 flex-wrap">
              <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">{t('dashboard.teamSchedule')}</h3>
              <div className="flex items-center gap-3 text-[16px] text-[var(--text-quaternary)] flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-sm bg-[var(--text-primary)]" />
                  {t('dashboard.surgery')}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-sm bg-[var(--bg-brand-primary)]" />
                  {t('dashboard.session')}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-sm bg-[var(--bg-brand-primary)] border border-[var(--blue-200)]" />
                  {t('dashboard.consent')}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-sm bg-[var(--bg-tertiary)] border border-[var(--border-secondary)]" />
                  {t('dashboard.break')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-success-primary)] text-[var(--text-success-primary)] text-[16px] font-semibold">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--fg-success-primary)] opacity-75 animate-ping" />
                  <span className="relative inline-flex size-2 rounded-full bg-[var(--fg-success-primary)]" />
                </span>
                {t('dashboard.liveNow', 'Jonli')} · {nowClock}
              </span>
              <button className="size-7 rounded-md hover:bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--fg-quaternary)] cursor-pointer transition-colors">
                <Settings2 size={14} />
              </button>
              <button className="size-7 rounded-md hover:bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--fg-quaternary)] cursor-pointer transition-colors">
                <Maximize2 size={14} />
              </button>
            </div>
          </div>

          <div className="p-5 overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="flex mb-3">
                <div className="w-44 shrink-0 pr-3">
                  <div className="flex items-center gap-1 text-[16px] text-[var(--fg-quaternary)]">
                    <span>{t('dashboard.doctors')}</span>
                    <button className="size-5 rounded-md bg-[var(--bg-brand-primary)] text-[var(--text-brand-primary)] flex items-center justify-center hover:bg-[var(--bg-brand-primary)] transition-colors cursor-pointer">
                      <Plus size={11} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 relative h-5">
                  {TIME_SLOTS.map((h) => (
                    <span
                      key={h}
                      className="absolute text-[16px] text-[var(--fg-quaternary)] -translate-x-1/2"
                      style={{ left: `${((h - 8) / TOTAL_HOURS) * 100}%` }}
                    >
                      {String(h).padStart(2, '0')}:00
                    </span>
                  ))}
                  {/* live "now" marker on the axis */}
                  {nowInRange && (
                    <span
                      className="absolute -top-0.5 -translate-x-1/2 px-1.5 py-0.5 rounded-md bg-[var(--fg-error-primary)] text-white text-[12px] font-semibold z-20 whitespace-nowrap"
                      style={{ left: `${nowPercent}%` }}
                    >
                      {nowClock}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {DOCTORS.map(doc => {
                  const current = activeBlock(doc, now)
                  const busy = !!current
                  return (
                  <div key={doc.id} className="flex items-center">
                    <div className="w-44 shrink-0 pr-3 flex items-center gap-2">
                      <div className="relative shrink-0">
                        <Avatar name={doc.name} size="xs" />
                        <span
                          className={cn(
                            'absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[var(--bg-primary)]',
                            busy ? 'bg-[var(--fg-warning-primary)]' : 'bg-[var(--fg-success-primary)]',
                          )}
                          title={busy ? `Band — ${current?.label}` : 'Bo\'sh'}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[16px] font-medium text-[var(--text-secondary)] truncate leading-tight">{doc.name}</p>
                        <p className="text-[16px] text-[var(--fg-quaternary)] truncate leading-tight">
                          {busy
                            ? <span className="text-[var(--fg-warning-primary)] font-medium">● {current?.label}</span>
                            : <span className="text-[var(--fg-success-primary)] font-medium">● Bo'sh</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 h-12 bg-[var(--bg-secondary)] rounded-lg relative overflow-hidden border border-[var(--border-secondary)]">
                      {TIME_SLOTS.slice(1).map(h => (
                        <div
                          key={h}
                          className="absolute top-0 bottom-0 w-px bg-[var(--bg-tertiary)]"
                          style={{ left: `${((h - 8) / TOTAL_HOURS) * 100}%` }}
                        />
                      ))}
                      {/* live "now" line — moves with the actual current time */}
                      {nowInRange && (
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-[var(--fg-error-primary)] z-20"
                          style={{ left: `${nowPercent}%` }}
                        />
                      )}
                      {doc.schedule?.map((block, i) => {
                        const isCurrent = current === block
                        return (
                        <div
                          key={i}
                          className={cn(
                            'absolute top-1 bottom-1 rounded-md flex items-center px-1.5 text-[16px] font-medium overflow-hidden transition-all',
                            blockColors[block.type as keyof typeof blockColors] ?? 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]',
                            isCurrent && 'ring-2 ring-[var(--fg-error-primary)] ring-offset-1 ring-offset-[var(--bg-secondary)]',
                          )}
                          style={{
                            left:  `${timeToPercent(block.startHour, block.startMin)}%`,
                            width: `${durationPercent(block.startHour, block.startMin, block.endHour, block.endMin)}%`,
                          }}
                        >
                          <span className="mr-1 opacity-60">{blockIcons[block.type]}</span>
                          <span className="truncate">{block.label}</span>
                        </div>
                        )
                      })}
                    </div>
                  </div>
                  )
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Right column: team availability */}
        <div className="space-y-5">
          {/* Team availability */}
          <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-secondary)]">
            <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">{t('dashboard.teamAvailable')}</h3>
            <button className="size-7 rounded-md hover:bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--fg-quaternary)] cursor-pointer transition-colors">
              <Settings2 size={14} />
            </button>
          </div>

          <div className="divide-y divide-[var(--border-secondary)]">
            {DOCTORS.map(doc => (
              <div key={doc.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--bg-secondary)] transition-colors">
                <Avatar name={doc.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-medium text-[var(--text-primary)] truncate">{doc.name}</p>
                  <p className="text-[16px] text-[var(--fg-quaternary)] truncate">{doc.role}</p>
                  {doc.availableFrom && (
                    <p className="text-[16px] text-[var(--fg-success-primary)] flex items-center gap-1 mt-0.5">
                      <span className="size-1.5 rounded-full bg-[var(--fg-success-primary)]" />
                      {t('team.available', { from: doc.availableFrom, to: doc.availableTo })}
                    </p>
                  )}
                </div>
                <button className="size-8 rounded-full bg-[var(--fg-brand-primary)] flex items-center justify-center hover:bg-[var(--text-brand-secondary)] transition-colors cursor-pointer shrink-0 shadow-xs">
                  <Phone size={13} className="text-white" />
                </button>
              </div>
            ))}
          </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
