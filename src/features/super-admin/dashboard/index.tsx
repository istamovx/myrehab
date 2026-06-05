import { Building2, Users, TrendingUp, CreditCard, ArrowUpRight, Clock, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'
import { PLATFORM_STATS, MONTHLY_REVENUE, ORGANIZATIONS, PAYMENTS, PLAN_DISTRIBUTION } from '@/data/super-admin-mock-data'
import { cn } from '@/lib/utils'

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M so'm`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K so'm`
  return `${n.toLocaleString()} so'm`
}

const STATUS_STYLE: Record<string, string> = {
  active:    'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  pending:   'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
  suspended: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
}
const STATUS_LABEL: Record<string, string> = {
  active: 'Faol', pending: 'Kutilmoqda', suspended: 'To\'xtatilgan',
}

const PAY_STYLE: Record<string, string> = {
  paid:    'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
  overdue: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
  failed:  'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}
const PAY_LABEL: Record<string, string> = {
  paid: 'To\'langan', pending: 'Kutilmoqda', overdue: 'Muddati o\'tgan', failed: 'Xato',
}

export function SuperAdminDashboardPage() {
  const stats = [
    { label: 'Jami tashkilotlar', value: PLATFORM_STATS.total_orgs, sub: `${PLATFORM_STATS.active_orgs} faol`, icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
    { label: 'Jami foydalanuvchilar', value: PLATFORM_STATS.total_users.toLocaleString(), sub: `${PLATFORM_STATS.total_doctors} shifokor`, icon: Users, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950/20' },
    { label: 'Oylik daromad (MRR)', value: fmt(PLATFORM_STATS.mrr), sub: `+${PLATFORM_STATS.growth_rate}% o'sish`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/20' },
    { label: 'Yillik daromad (ARR)', value: fmt(PLATFORM_STATS.arr), sub: `${PLATFORM_STATS.churn_rate}% churn`, icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20' },
  ]

  const recentOrgs = [...ORGANIZATIONS]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  const recentPayments = PAYMENTS.slice(0, 6)

  const pendingOrgs = ORGANIZATIONS.filter(o => o.status === 'pending')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Platform Dashboard</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">MyRehab SaaS platformasini boshqarish</p>
      </div>

      {/* Pending alert */}
      {pendingOrgs.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-semibold text-amber-800 dark:text-amber-300">
              {pendingOrgs.length} ta tashkilot tasdig'ingizni kutmoqda
            </p>
            <p className="text-[12px] text-amber-600 dark:text-amber-500 mt-0.5">
              {pendingOrgs.map(o => o.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4 flex items-start gap-3">
            <div className={cn('size-10 rounded-xl flex items-center justify-center shrink-0', s.bg)}>
              <s.icon size={20} className={s.color} />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] text-[var(--text-tertiary)] font-medium">{s.label}</p>
              <p className="text-[22px] font-extrabold text-[var(--text-primary)] leading-tight truncate">{s.value}</p>
              <p className="text-[11px] text-[var(--text-quaternary)] mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[14px] font-bold text-[var(--text-primary)]">Oylik daromad</p>
              <p className="text-[12px] text-[var(--text-tertiary)]">So'nggi 6 oy</p>
            </div>
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-[12px] font-semibold">
              <ArrowUpRight size={14} />
              +{PLATFORM_STATS.growth_rate}%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_REVENUE} barSize={32}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} />
              <YAxis hide />
              <Tooltip
                formatter={(v) => [fmt(v as number), 'Daromad']}
                contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-secondary)', borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {MONTHLY_REVENUE.map((_, i) => (
                  <Cell key={i} fill={i === MONTHLY_REVENUE.length - 1 ? '#4f46e5' : '#a5b4fc'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Plan distribution */}
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-5">
          <p className="text-[14px] font-bold text-[var(--text-primary)] mb-1">Tarif rejalari</p>
          <p className="text-[12px] text-[var(--text-tertiary)] mb-4">Obunalar taqsimoti</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={PLAN_DISTRIBUTION} dataKey="value" cx="50%" cy="50%" outerRadius={60} paddingAngle={3}>
                {PLAN_DISTRIBUTION.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-primary)', border: '1px solid var(--border-secondary)', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {PLAN_DISTRIBUTION.map(p => (
              <div key={p.name} className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full shrink-0" style={{ background: p.color }} />
                  <span className="text-[var(--text-secondary)]">{p.name}</span>
                </div>
                <span className="font-semibold text-[var(--text-primary)]">{p.value} ta</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent orgs */}
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-5">
          <p className="text-[14px] font-bold text-[var(--text-primary)] mb-4">So'nggi tashkilotlar</p>
          <div className="space-y-3">
            {recentOrgs.map(org => (
              <div key={org.id} className="flex items-center gap-3">
                <div className={cn('size-8 rounded-lg bg-gradient-to-br text-white text-[11px] font-bold flex items-center justify-center shrink-0', org.logo_color)}>
                  {org.logo_initial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--text-primary)] truncate">{org.name}</p>
                  <p className="text-[11px] text-[var(--text-tertiary)]">{org.city} · {org.plan_name}</p>
                </div>
                <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', STATUS_STYLE[org.status])}>
                  {STATUS_LABEL[org.status]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent payments */}
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-5">
          <p className="text-[14px] font-bold text-[var(--text-primary)] mb-4">So'nggi to'lovlar</p>
          <div className="space-y-3">
            {recentPayments.map(p => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center shrink-0">
                  <Clock size={14} className="text-[var(--text-tertiary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--text-primary)] truncate">{p.org_name}</p>
                  <p className="text-[11px] text-[var(--text-tertiary)]">{p.period}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[13px] font-bold text-[var(--text-primary)]">{fmt(p.amount)}</p>
                  <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', PAY_STYLE[p.status])}>
                    {PAY_LABEL[p.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
