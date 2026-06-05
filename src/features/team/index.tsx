import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Plus, Phone, Mail, MoreHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Dialog } from '@/components/ui/dialog'
import { PageHeader } from '@/components/layout/page-header'
import { DOCTORS } from '@/data/mock-data'
import { cn } from '@/lib/utils'

export function TeamPage() {
  const { t } = useTranslation()
  const [activeSpec, setActiveSpec] = useState('all')
  const [addOpen, setAddOpen] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)
  const [form, setForm] = useState({ name: '', role: '', phone: '', specialization: '' })

  function handleAdd() {
    if (!form.name || !form.role) return
    setAddSuccess(true)
    setTimeout(() => { setAddSuccess(false); setAddOpen(false); setForm({ name: '', role: '', phone: '', specialization: '' }) }, 1500)
  }

  const SPECIALIZATIONS = [
    { key: 'all',            label: t('team.allSpecializations') },
    { key: 'Orthopedic',     label: t('team.orthopedic') },
    { key: 'Physical Therapy', label: t('team.physicalTherapy') },
    { key: 'Radiology',      label: t('team.radiology') },
    { key: 'Neurology',      label: t('team.neurology') },
  ]

  return (
    <div>
      <PageHeader
        title={t('team.title')}
        subtitle={t('team.subtitle', { count: DOCTORS.length })}
        crumbs={[{ label: t('nav.team') }]}
        actions={
          <>
            <div className="w-44 sm:w-56">
              <Input placeholder={t('team.searchPlaceholder')} leftIcon={<Search />} uiSize="sm" />
            </div>
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus size={15} />
              {t('team.addMember')}
            </Button>
          </>
        }
      />

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 flex-wrap mb-5">
        {SPECIALIZATIONS.map(s => (
          <button
            key={s.key}
            onClick={() => setActiveSpec(s.key)}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer',
              activeSpec === s.key
                ? 'bg-[var(--fg-brand-primary)] text-white shadow-xs'
                : 'bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] shadow-xs',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DOCTORS.map(doc => (
          <div
            key={doc.id}
            className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)] p-5 hover:shadow-sm transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <Avatar name={doc.name} size="lg" className="rounded-xl" />
              <button className="opacity-0 group-hover:opacity-100 transition-opacity size-8 rounded-lg hover:bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--fg-quaternary)] hover:text-[var(--text-tertiary)] cursor-pointer">
                <MoreHorizontal size={15} />
              </button>
            </div>

            <h3 className="text-sm font-semibold text-[var(--text-primary)]">{doc.name}</h3>
            <p className="text-xs text-[var(--text-quaternary)] mt-0.5">{doc.role}</p>

            {doc.availableFrom && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-[var(--text-success-primary)] font-medium">
                <span className="size-1.5 rounded-full bg-[var(--fg-success-primary)]" />
                {t('team.available', { from: doc.availableFrom, to: doc.availableTo })}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-[var(--border-secondary)] flex items-center gap-2">
              <button className="flex-1 h-9 rounded-lg bg-[var(--fg-brand-primary)] text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[var(--text-brand-secondary)] transition-colors cursor-pointer shadow-xs">
                <Phone size={13} />
                {t('team.call')}
              </button>
              <button className="size-9 rounded-lg border border-[var(--border-primary)] flex items-center justify-center text-[var(--text-quaternary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer shadow-xs">
                <Mail size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Member Dialog */}
      <Dialog
        open={addOpen}
        onOpenChange={open => { setAddOpen(open); if (!open) { setAddSuccess(false); setForm({ name: '', role: '', phone: '', specialization: '' }) } }}
        title={t('team.addMember')}
        description="Yangi jamoa a'zosini qo'shing"
        side="right"
      >
        {addSuccess ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="size-14 rounded-full bg-[var(--bg-success-primary)] flex items-center justify-center">
              <Plus size={26} className="text-[var(--fg-success-primary)]" />
            </div>
            <p className="text-[16px] font-semibold text-[var(--text-primary)]">A'zo qo'shildi!</p>
            <p className="text-[13px] text-[var(--text-tertiary)]">{form.name}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[
              { label: t('common.name') + ' *', key: 'name', placeholder: 'Dr. Aziz Rahimov' },
              { label: 'Lavozim *', key: 'role', placeholder: 'Orthopedic Surgeon' },
              { label: 'Mutaxassislik', key: 'specialization', placeholder: 'Ortopediya' },
              { label: 'Telefon', key: 'phone', placeholder: '+998 90 123 45 67' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">{f.label}</label>
                <Input value={(form as Record<string, string>)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder} />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setAddOpen(false)}>{t('common.cancel')}</Button>
              <Button className="flex-1" onClick={handleAdd} disabled={!form.name || !form.role}>{t('common.add')}</Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}
