import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, X, UserPlus, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { PageHeader } from '@/components/layout/page-header'
import { MEMBERSHIP_REQUESTS, type MembershipRequest } from '@/data/clinic-mock-data'
import { cn } from '@/lib/utils'

const STATUS_STYLE: Record<string, string> = {
  pending:  'text-[var(--text-warning-primary)] bg-[var(--bg-warning-primary)]',
  approved: 'text-[var(--text-success-primary)] bg-[var(--bg-success-primary)]',
  rejected: 'text-[var(--fg-error-primary)] bg-[var(--bg-error-primary)]',
  expired:  'text-[var(--text-quaternary)] bg-[var(--bg-tertiary)]',
}

export function MembershipRequestsPage() {
  const { t } = useTranslation()
  const [tab, setTab]           = useState<'incoming' | 'outgoing'>('incoming')
  const [requests, setRequests] = useState<MembershipRequest[]>(MEMBERSHIP_REQUESTS)

  const incoming         = requests.filter(r => r.direction === 'incoming')
  const outgoing         = requests.filter(r => r.direction === 'outgoing')
  const incomingPending  = incoming.filter(r => r.status === 'pending').length
  const outgoingPending  = outgoing.filter(r => r.status === 'pending').length

  function approve(id: string) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r))
  }
  function reject(id: string) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r))
  }

  const displayed = tab === 'incoming' ? incoming : outgoing

  const statCards = [
    { label: t('membership.incoming'),        value: incoming.length,       icon: UserPlus },
    { label: t('membership.incomingPending'), value: incomingPending,        icon: UserPlus },
    { label: t('membership.outgoing'),        value: outgoing.length,        icon: Send },
    { label: t('membership.outgoingPending'), value: outgoingPending,        icon: Send },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('membership.title')}
        subtitle={t('membership.subtitle')}
        crumbs={[{ label: t('nav.membership') }]}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-9 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center shrink-0">
                <s.icon size={18} className="text-[var(--text-tertiary)]" />
              </div>
              <span className="text-[13px] text-[var(--text-tertiary)] font-medium leading-snug">{s.label}</span>
            </div>
            <p className="text-[30px] font-bold text-[var(--text-primary)] leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)] overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-[var(--border-secondary)]">
          {(['incoming', 'outgoing'] as const).map(key => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                'flex items-center gap-2 px-6 py-4 text-[14px] font-semibold border-b-2 -mb-px transition-colors cursor-pointer',
                tab === key
                  ? 'border-[var(--fg-brand-primary)] text-[var(--text-brand-primary)]'
                  : 'border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]',
              )}
            >
              {t(`membership.${key}` as any)}
              {key === 'incoming' && incomingPending > 0 && (
                <span className="inline-flex items-center justify-center text-[11px] font-bold size-5 rounded-full bg-[var(--fg-brand-primary)] text-white">
                  {incomingPending}
                </span>
              )}
              {key === 'outgoing' && outgoingPending > 0 && (
                <span className="inline-flex items-center justify-center text-[11px] font-bold size-5 rounded-full bg-[var(--fg-warning-primary)] text-white">
                  {outgoingPending}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-[var(--bg-secondary-subtle)]">
                <th className="text-left text-[12px] font-semibold uppercase tracking-wider text-[var(--text-quaternary)] px-5 py-3.5">
                  {t('doctors.fullName')}
                </th>
                <th className="text-left text-[12px] font-semibold uppercase tracking-wider text-[var(--text-quaternary)] px-5 py-3.5">
                  {t('doctors.specialization')}
                </th>
                <th className="text-left text-[12px] font-semibold uppercase tracking-wider text-[var(--text-quaternary)] px-5 py-3.5">
                  {t('membership.requestedAt')}
                </th>
                {tab === 'outgoing' && (
                  <th className="text-left text-[12px] font-semibold uppercase tracking-wider text-[var(--text-quaternary)] px-5 py-3.5">
                    {t('membership.expiresAt')}
                  </th>
                )}
                <th className="text-left text-[12px] font-semibold uppercase tracking-wider text-[var(--text-quaternary)] px-5 py-3.5">
                  {t('common.status')}
                </th>
                {tab === 'incoming' && <th className="px-5 py-3.5" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-secondary)]">
              {displayed.map(req => (
                <tr key={req.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={req.doctorName} size="sm" />
                      <div>
                        <p className="text-[14px] font-semibold text-[var(--text-primary)]">{req.doctorName}</p>
                        <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">{req.doctorPhone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[var(--text-secondary)]">{req.specialization}</td>
                  <td className="px-5 py-4 text-[13px] text-[var(--text-tertiary)]">{req.requestedAt}</td>
                  {tab === 'outgoing' && (
                    <td className="px-5 py-4 text-[13px] text-[var(--text-tertiary)]">{req.expiresAt ?? '—'}</td>
                  )}
                  <td className="px-5 py-4">
                    <span className={cn('text-[12px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap', STATUS_STYLE[req.status])}>
                      {t(`membership.${req.status}` as any)}
                    </span>
                  </td>
                  {tab === 'incoming' && (
                    <td className="px-5 py-4">
                      {req.status === 'pending' && (
                        <div className="flex items-center gap-2 justify-end">
                          <Button size="sm" variant="secondary" onClick={() => reject(req.id)}>
                            <X size={14} />
                            {t('membership.reject')}
                          </Button>
                          <Button size="sm" onClick={() => approve(req.id)}>
                            <Check size={14} />
                            {t('membership.approve')}
                          </Button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {displayed.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-[14px] text-[var(--text-quaternary)]">
                    {t(tab === 'incoming' ? 'membership.noIncoming' : 'membership.noOutgoing')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
