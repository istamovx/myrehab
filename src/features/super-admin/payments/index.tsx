import { useState } from 'react'
import { CreditCard, CheckCircle2, Clock, AlertTriangle, XCircle, Download, Filter } from 'lucide-react'
import { PAYMENTS, PLATFORM_STATS, type PaymentStatus } from '@/data/super-admin-mock-data'
import { cn } from '@/lib/utils'

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M so'm`
  return `${(n / 1_000).toFixed(0)}K so'm`
}

const STATUS_STYLE: Record<PaymentStatus, string> = {
  paid:    'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
  overdue: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
  failed:  'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}
const STATUS_ICON: Record<PaymentStatus, React.ElementType> = {
  paid:    CheckCircle2,
  pending: Clock,
  overdue: AlertTriangle,
  failed:  XCircle,
}
const STATUS_LABEL: Record<PaymentStatus, string> = {
  paid: 'To\'langan', pending: 'Kutilmoqda', overdue: 'Muddati o\'tgan', failed: 'Xato',
}
const METHOD_LABEL: Record<string, string> = {
  bank_transfer: 'Bank o\'tkazmasi',
  card: 'Karta',
}

export function SuperAdminPaymentsPage() {
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all')
  const [periodFilter, setPeriodFilter] = useState('all')

  const periods = ['all', ...Array.from(new Set(PAYMENTS.map(p => p.period)))]

  const filtered = PAYMENTS.filter(p => {
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    const matchPeriod = periodFilter === 'all' || p.period === periodFilter
    return matchStatus && matchPeriod
  })

  const totalPaid    = filtered.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const totalPending = filtered.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0)
  const totalOverdue = filtered.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount, 0)

  const summaryCards = [
    { label: 'To\'langan', value: fmt(totalPaid),    icon: CheckCircle2,  color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/20' },
    { label: 'Kutilmoqda', value: fmt(totalPending), icon: Clock,         color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/20' },
    { label: 'Muddati o\'tgan', value: fmt(totalOverdue), icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/20' },
    { label: 'Oylik MRR', value: fmt(PLATFORM_STATS.mrr), icon: CreditCard, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">To'lovlar</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Barcha tashkilotlar bo'yicha hisob-kitob</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg text-sm font-semibold border border-[var(--border-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors">
          <Download size={15} />
          Eksport
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map(c => (
          <div key={c.label} className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4 flex items-center gap-3">
            <div className={cn('size-10 rounded-xl flex items-center justify-center shrink-0', c.bg)}>
              <c.icon size={18} className={c.color} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-[var(--text-tertiary)] font-medium truncate">{c.label}</p>
              <p className="text-[16px] font-extrabold text-[var(--text-primary)] truncate">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Period filter */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[var(--text-tertiary)] shrink-0" />
          <select
            value={periodFilter}
            onChange={e => setPeriodFilter(e.target.value)}
            className="h-9 px-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-secondary)] text-[13px] text-[var(--text-primary)] outline-none focus:border-indigo-500"
          >
            {periods.map(p => (
              <option key={p} value={p}>{p === 'all' ? 'Barcha davrlar' : p}</option>
            ))}
          </select>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-1 bg-[var(--bg-tertiary)] p-1 rounded-xl">
          {(['all', 'paid', 'pending', 'overdue', 'failed'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-1 rounded-lg text-[12px] font-semibold transition-all',
                statusFilter === s ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-tertiary)]',
              )}
            >
              {s === 'all' ? 'Barchasi' : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-secondary)] bg-[var(--bg-secondary)]">
                {['Tashkilot', 'Davr', 'Miqdor', 'Usul', 'Holat', 'Sana', 'Hisob-faktura'].map(h => (
                  <th key={h} className="text-left text-[11px] font-bold text-[var(--text-quaternary)] uppercase tracking-wide px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const Icon = STATUS_ICON[p.status]
                return (
                  <tr key={p.id} className={cn('border-b border-[var(--border-secondary)] hover:bg-[var(--bg-secondary)] transition-colors', i === filtered.length - 1 && 'border-0')}>
                    <td className="px-4 py-3">
                      <p className="text-[13px] font-semibold text-[var(--text-primary)] truncate max-w-[160px]">{p.org_name}</p>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[var(--text-secondary)] whitespace-nowrap">{p.period}</td>
                    <td className="px-4 py-3 text-[13px] font-bold text-[var(--text-primary)] whitespace-nowrap">{fmt(p.amount)}</td>
                    <td className="px-4 py-3 text-[12px] text-[var(--text-tertiary)] whitespace-nowrap">{METHOD_LABEL[p.method]}</td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full whitespace-nowrap', STATUS_STYLE[p.status])}>
                        <Icon size={11} />
                        {STATUS_LABEL[p.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[var(--text-tertiary)] whitespace-nowrap">{p.date}</td>
                    <td className="px-4 py-3 text-[12px] text-[var(--text-tertiary)] font-mono">{p.invoice_number}</td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[var(--text-tertiary)] text-[13px]">
                    To'lovlar topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[12px] text-[var(--text-quaternary)] text-center">
        {filtered.length} ta to'lov ko'rsatilmoqda (jami {PAYMENTS.length} tadan)
      </p>
    </div>
  )
}
