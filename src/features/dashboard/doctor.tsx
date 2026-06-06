import {
  Users, CalendarDays, MessageSquare, TrendingUp,
  AlertTriangle, Clock, CheckCircle2, ChevronRight,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Area, AreaChart, ReferenceLine,
} from 'recharts'
import { Avatar } from '@/components/ui/avatar'
import { PageHeader } from '@/components/layout/page-header'
import { PATIENTS } from '@/data/mock-data'
import { useConnectStore } from '@/store/connect'
import { useAuthStore } from '@/store/auth'
import { cn, formatUzDate } from '@/lib/utils'

// --- Static chart data for this doctor ----------------------------------------

const WEEKLY_APPTS = [
  { kun: 'Du', bajarildi: 6, rejalashtirildi: 7 },
  { kun: 'Se', bajarildi: 8, rejalashtirildi: 8 },
  { kun: 'Ch', bajarildi: 5, rejalashtirildi: 6 },
  { kun: 'Pa', bajarildi: 9, rejalashtirildi: 9 },
  { kun: 'Ju', bajarildi: 7, rejalashtirildi: 8 },
  { kun: 'Sh', bajarildi: 3, rejalashtirildi: 4 },
  { kun: 'Ya', bajarildi: 0, rejalashtirildi: 2 },
]

const ADHERENCE_TREND = [
  { hafta: '1-h', foiz: 64 },
  { hafta: '2-h', foiz: 70 },
  { hafta: '3-h', foiz: 68 },
  { hafta: '4-h', foiz: 75 },
  { hafta: '5-h', foiz: 78 },
  { hafta: '6-h', foiz: 82 },
  { hafta: '7-h', foiz: 79 },
  { hafta: '8-h', foiz: 85 },
]

const TODAY_APPTS = [
  { id: 't1', time: '09:00', name: 'Dilnoza Karimova',  type: 'Dastlabki baholash', done: true  },
  { id: 't2', time: '10:30', name: 'Jasur Rahimov',     type: 'Mashq sessiyasi',    done: true  },
  { id: 't3', time: '12:00', name: 'Malika Yusupova',   type: 'Nazorat tekshiruv',  done: false },
  { id: 't4', time: '14:00', name: 'Sardor Nazarov',    type: 'Reabilitatsiya',     done: false },
  { id: 't5', time: '15:30', name: 'Mohira Tosheva',    type: 'Mashq sessiyasi',    done: false },
]

const STATUS_COLORS: Record<string, string> = {
  Ready:               'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'In Progress':       'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'At-Risk':           'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'Awaiting clearance':'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Done:                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

const STATUS_UZ: Record<string, string> = {
  Ready: 'Tayyor', 'In Progress': 'Jarayonda', 'At-Risk': 'Xavfli', 'Awaiting clearance': 'Kutilmoqda', Done: 'Tugallangan',
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)]', className)}>
      {children}
    </div>
  )
}

export function DoctorDashboardPage() {
  const user = useAuthStore(s => s.user)
  const messages = useConnectStore(s => s.messages)
  const symptoms = useConnectStore(s => s.symptoms)

  const unreadMsgs = messages.filter(m => m.sender_role === 'patient' && !m.is_read).length
  const today = formatUzDate(new Date().toISOString())

  // Doctor's patients: first 8 from the list
  const myPatients = PATIENTS.slice(0, 8)
  const doneToday = TODAY_APPTS.filter(a => a.done).length

  const STATS = [
    { label: "Mening bemorlarim", value: myPatients.length, Icon: Users,          color: 'text-[var(--fg-brand-primary)]',   bg: 'bg-[var(--bg-brand-primary)]',   trend: '+2 bu hafta' },
    { label: 'Bugungi uchrashuvlar', value: TODAY_APPTS.length, Icon: CalendarDays, color: 'text-[var(--fg-success-primary)]', bg: 'bg-[var(--bg-success-primary)]', trend: `${doneToday} bajarildi` },
    { label: "Yangi xabarlar",     value: unreadMsgs,    Icon: MessageSquare,    color: 'text-[var(--fg-warning-primary)]', bg: 'bg-[var(--bg-warning-primary)]', trend: 'O\'qilmagan' },
    { label: "O'rtacha rioya",     value: '85%',         Icon: TrendingUp,       color: 'text-[var(--fg-success-primary)]', bg: 'bg-[var(--bg-success-primary)]', trend: '+6% o\'tgan hafta' },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Salom, ${user?.name?.split(' ').slice(0, 2).join(' ')} 👋`}
        subtitle={`Bugun: ${today} · ${TODAY_APPTS.length - doneToday} ta uchrashuv kutmoqda`}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)] p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={cn('size-9 rounded-lg flex items-center justify-center', s.bg)}>
                <s.Icon size={17} className={s.color} />
              </div>
              <span className="text-[11px] font-semibold text-[var(--text-quaternary)] truncate ml-2">{s.trend}</span>
            </div>
            <p className="text-[28px] font-bold text-[var(--text-primary)] leading-none mb-1">{s.value}</p>
            <p className="text-[13px] text-[var(--text-tertiary)]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts + Today's schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly appointments bar chart */}
        <Card className="p-5 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[13px] font-medium text-[var(--text-tertiary)]">Haftalik uchrashuvlar</p>
              <p className="text-[24px] font-bold text-[var(--text-primary)] leading-tight">
                {WEEKLY_APPTS.reduce((s, d) => s + d.bajarildi, 0)}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--bg-success-primary)] text-[var(--fg-success-primary)] text-[11px] font-semibold">
              <TrendingUp size={10} />
              92%
            </span>
          </div>
          <div className="flex-1 min-h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_APPTS} margin={{ top: 0, right: 0, left: -28, bottom: 0 }} barSize={12} barGap={2}>
                <CartesianGrid vertical={false} stroke="var(--border-secondary)" />
                <XAxis dataKey="kun" tick={{ fontSize: 11, fill: 'var(--fg-quaternary)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--fg-quaternary)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'var(--bg-secondary)', radius: 4 }}
                  contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-secondary)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v, name) => [v, name === 'bajarildi' ? 'Bajarildi' : 'Rejalashtirildi']}
                />
                <Bar dataKey="rejalashtirildi" fill="var(--border-secondary)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="bajarildi"       fill="var(--fg-brand-primary)"  radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--border-secondary)] text-[12px] text-[var(--text-quaternary)]">
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[var(--fg-brand-primary)]" /> Bajarildi</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-[var(--border-secondary)]" /> Rejalashtirildi</span>
          </div>
        </Card>

        {/* Adherence trend area chart */}
        <Card className="p-5 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[13px] font-medium text-[var(--text-tertiary)]">Rioya ko'rsatkichi</p>
              <p className="text-[24px] font-bold text-[var(--text-primary)] leading-tight">85%</p>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--bg-success-primary)] text-[var(--fg-success-primary)] text-[11px] font-semibold">
              +6%
            </span>
          </div>
          <div className="flex-1 min-h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADHERENCE_TREND} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="adh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--fg-brand-primary)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--fg-brand-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border-secondary)" />
                <XAxis dataKey="hafta" tick={{ fontSize: 11, fill: 'var(--fg-quaternary)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: 'var(--fg-quaternary)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-secondary)', borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => [`${v}%`, 'Rioya']}
                />
                <ReferenceLine y={75} stroke="var(--fg-warning-primary)" strokeDasharray="4 3" strokeWidth={1.5} label={{ value: 'Maqsad', fontSize: 10, fill: 'var(--fg-warning-primary)', position: 'right' }} />
                <Area type="monotone" dataKey="foiz" stroke="var(--fg-brand-primary)" strokeWidth={2} fill="url(#adh)" dot={{ r: 3, fill: 'var(--fg-brand-primary)' }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[12px] text-[var(--text-quaternary)] mt-3 pt-3 border-t border-[var(--border-secondary)]">
            So'nggi 8 hafta · Maqsad: 75% ·&nbsp;
            <span className="text-[var(--fg-success-primary)] font-medium">Maqsadda</span>
          </p>
        </Card>

        {/* Today's appointments */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-secondary)]">
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">Bugungi uchrashuvlar</h3>
            <span className="text-[11px] font-semibold text-[var(--text-quaternary)]">{doneToday}/{TODAY_APPTS.length}</span>
          </div>
          <div className="flex-1 divide-y divide-[var(--border-secondary)] overflow-y-auto">
            {TODAY_APPTS.map(a => (
              <div key={a.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-secondary)] transition-colors">
                <div className="text-center shrink-0 w-10">
                  <p className="text-[11px] font-bold text-[var(--text-primary)] tabular-nums">{a.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--text-primary)] truncate">{a.name}</p>
                  <p className="text-[11px] text-[var(--text-tertiary)] truncate">{a.type}</p>
                </div>
                {a.done
                  ? <CheckCircle2 size={16} className="text-[var(--fg-success-primary)] shrink-0" />
                  : <Clock size={14} className="text-[var(--text-quaternary)] shrink-0" />
                }
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* My patients + Recent symptoms */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Patients list */}
        <Card className="xl:col-span-2 flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-secondary)]">
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">Mening bemorlarim</h3>
            <button className="flex items-center gap-1 text-[12px] font-semibold text-[var(--fg-brand-primary)] hover:underline cursor-pointer">
              Barchasi <ChevronRight size={13} />
            </button>
          </div>
          <div className="divide-y divide-[var(--border-secondary)]">
            {myPatients.slice(0, 6).map(p => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[var(--bg-secondary)] transition-colors">
                <Avatar name={p.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--text-primary)] truncate">{p.name}</p>
                  <p className="text-[11px] text-[var(--text-tertiary)] truncate">{p.procedure}</p>
                </div>
                <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0', STATUS_COLORS[p.status] ?? 'bg-[var(--bg-secondary)] text-[var(--text-quaternary)]')}>
                  {STATUS_UZ[p.status] ?? p.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent symptoms from connected patient */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-secondary)]">
            <h3 className="text-[14px] font-semibold text-[var(--text-primary)]">
              <span className="flex items-center gap-1.5"><AlertTriangle size={14} className="text-[var(--fg-warning-primary)]" />So'nggi shikoyatlar</span>
            </h3>
            {symptoms.length > 0 && <span className="text-[11px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">{symptoms.length}</span>}
          </div>
          {symptoms.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-[13px] text-[var(--text-tertiary)] p-6 text-center">
              Bemordan shikoyat yo'q
            </div>
          ) : (
            <div className="flex-1 divide-y divide-[var(--border-secondary)] overflow-y-auto">
              {symptoms.slice(0, 6).map(s => (
                <div key={s.id} className="px-5 py-3 hover:bg-[var(--bg-secondary)] transition-colors">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn(
                      'text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0',
                      s.severity === 'severe'   ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      s.severity === 'moderate' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                    )}>
                      {s.severity === 'severe' ? "Og'ir" : s.severity === 'moderate' ? "O'rta" : 'Yengil'}
                    </span>
                    <span className="text-[13px] font-medium text-[var(--text-primary)]">{s.type}</span>
                    <span className="text-[11px] text-[var(--text-quaternary)] ml-auto">{s.intensity}/10</span>
                  </div>
                  {s.note && <p className="text-[11px] text-[var(--text-tertiary)] truncate">{s.note}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
