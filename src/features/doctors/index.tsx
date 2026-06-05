import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Search, Phone, UserCheck, Users, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Avatar } from '@/components/ui/avatar'
import { Dialog } from '@/components/ui/dialog'
import { PageHeader } from '@/components/layout/page-header'
import { CLINIC_DOCTORS, SPECIALIZATIONS } from '@/data/clinic-mock-data'
import { cn } from '@/lib/utils'

const STATUS_STYLE: Record<string, string> = {
  confirmed: 'text-[var(--text-success-primary)] bg-[var(--bg-success-primary)]',
  pending:   'text-[var(--text-warning-primary)] bg-[var(--bg-warning-primary)]',
  rejected:  'text-[var(--fg-error-primary)] bg-[var(--bg-error-primary)]',
}

export function DoctorsPage() {
  const { t } = useTranslation()
  const [filter, setFilter]     = useState('all')
  const [search, setSearch]     = useState('')
  const [addOpen, setAddOpen]   = useState(false)
  const [inviteSent, setInviteSent] = useState(false)
  const [form, setForm]         = useState({ name: '', phone: '+998', specialization: '' })

  const confirmed = CLINIC_DOCTORS.filter(d => d.status === 'confirmed')
  const stats = {
    total:      CLINIC_DOCTORS.length,
    confirmed:  confirmed.length,
    pending:    CLINIC_DOCTORS.filter(d => d.status === 'pending').length,
    avgPatients: confirmed.length
      ? Math.round(confirmed.reduce((s, d) => s + d.patientCount, 0) / confirmed.length)
      : 0,
  }

  const filtered = CLINIC_DOCTORS.filter(d => {
    if (filter !== 'all' && d.status !== filter) return false
    const q = search.toLowerCase()
    return !q || d.name.toLowerCase().includes(q) || d.phone.includes(q)
  })

  function handleInvite() {
    setInviteSent(true)
    setTimeout(() => {
      setAddOpen(false)
      setInviteSent(false)
      setForm({ name: '', phone: '+998', specialization: '' })
    }, 1800)
  }

  const filterOptions = [
    { value: 'all',       label: t('doctors.allDoctors') },
    { value: 'confirmed', label: t('doctors.confirmed') },
    { value: 'pending',   label: t('doctors.pending') },
  ]

  const specOptions = SPECIALIZATIONS.map(s => ({ value: s, label: s }))

  const statCards = [
    { label: t('doctors.totalDoctors'), value: stats.total,      icon: Users,      color: 'text-[var(--fg-brand-primary)]',    bg: 'bg-[var(--bg-brand-primary)]' },
    { label: t('doctors.confirmed'),    value: stats.confirmed,  icon: UserCheck,  color: 'text-[var(--fg-success-primary)]', bg: 'bg-[var(--bg-success-primary)]' },
    { label: t('doctors.pending'),      value: stats.pending,    icon: Clock,      color: 'text-[var(--fg-warning-primary)]', bg: 'bg-[var(--bg-warning-primary)]' },
    { label: t('doctors.avgPatients'),  value: stats.avgPatients,icon: Users,      color: 'text-[var(--text-tertiary)]',      bg: 'bg-[var(--bg-secondary)]' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('doctors.title')}
        subtitle={t('doctors.subtitle', { count: CLINIC_DOCTORS.length })}
        crumbs={[{ label: t('nav.doctors') }]}
        actions={
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus size={15} />
            {t('doctors.addDoctor')}
          </Button>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn('size-9 rounded-lg flex items-center justify-center shrink-0', s.bg)}>
                <s.icon size={18} className={s.color} />
              </div>
              <span className="text-[13px] text-[var(--text-tertiary)] font-medium leading-snug">{s.label}</span>
            </div>
            <p className="text-[30px] font-bold text-[var(--text-primary)] leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)] overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border-secondary)] flex-wrap gap-y-2">
          <Input
            uiSize="sm"
            leftIcon={<Search />}
            placeholder={t('doctors.searchPlaceholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-[260px]"
          />
          <Select
            value={filter}
            onValueChange={setFilter}
            options={filterOptions}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-[var(--bg-secondary-subtle)]">
                {[
                  t('doctors.fullName'),
                  t('doctors.phone'),
                  t('doctors.specialization'),
                  t('common.status'),
                  t('doctors.patientsCount'),
                  t('doctors.joinedAt'),
                ].map(h => (
                  <th key={h} className="text-left text-[12px] font-semibold uppercase tracking-wider text-[var(--text-quaternary)] px-5 py-3.5 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-secondary)]">
              {filtered.map(doc => (
                <tr key={doc.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={doc.name} size="sm" />
                      <span className="text-[14px] font-semibold text-[var(--text-primary)]">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-[var(--text-tertiary)]">
                      <Phone size={13} className="shrink-0" />
                      {doc.phone}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[var(--text-secondary)]">{doc.specialization}</td>
                  <td className="px-5 py-4">
                    <span className={cn('text-[12px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap', STATUS_STYLE[doc.status])}>
                      {t(`doctors.${doc.status}` as any)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[var(--text-secondary)]">
                    {doc.status === 'confirmed' ? doc.patientCount : '—'}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[var(--text-tertiary)]">{doc.joinedAt}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-[14px] text-[var(--text-quaternary)]">
                    {t('doctors.noResults')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[var(--border-secondary)] bg-[var(--bg-secondary-subtle)]">
          <p className="text-[13px] text-[var(--text-quaternary)]">
            {filtered.length} / {CLINIC_DOCTORS.length}
          </p>
        </div>
      </div>

      {/* Add Doctor Dialog */}
      <Dialog
        open={addOpen}
        onOpenChange={open => { setAddOpen(open); if (!open) { setInviteSent(false); setForm({ name: '', phone: '+998', specialization: '' }) } }}
        title={t('doctors.addDoctor')}
        description={t('doctors.smsExpires')}
      >
        {inviteSent ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="size-14 rounded-full bg-[var(--bg-success-primary)] flex items-center justify-center">
              <UserCheck size={26} className="text-[var(--fg-success-primary)]" />
            </div>
            <p className="text-[16px] font-semibold text-[var(--text-primary)]">{t('doctors.inviteSent')}</p>
            <p className="text-[13px] text-[var(--text-tertiary)]">{form.phone}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">
                {t('doctors.fullName')}
              </label>
              <Input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Dr. Jasur Karimov"
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">
                {t('doctors.phone')}
              </label>
              <Input
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="+998 90 123-45-67"
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">
                {t('doctors.specialization')}
              </label>
              <Select
                value={form.specialization}
                onValueChange={v => setForm(f => ({ ...f, specialization: v }))}
                options={specOptions}
                placeholder={t('common.select')}
                triggerClassName="w-full"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setAddOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button
                className="flex-1"
                onClick={handleInvite}
                disabled={!form.name || form.phone.length < 10 || !form.specialization}
              >
                {t('doctors.invite')}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}
