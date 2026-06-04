import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Plus, Phone, Mail, MoreHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { DOCTORS } from '@/data/mock-data'
import { cn } from '@/lib/utils'

export function TeamPage() {
  const { t } = useTranslation()
  const [activeSpec, setActiveSpec] = useState('all')

  const SPECIALIZATIONS = [
    { key: 'all',            label: t('team.allSpecializations') },
    { key: 'Orthopedic',     label: t('team.orthopedic') },
    { key: 'Physical Therapy', label: t('team.physicalTherapy') },
    { key: 'Radiology',      label: t('team.radiology') },
    { key: 'Neurology',      label: t('team.neurology') },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">{t('team.title')}</h1>
          <p className="text-sm text-[var(--text-quaternary)] mt-0.5">{t('team.subtitle', { count: DOCTORS.length })}</p>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder={t('team.searchPlaceholder')} leftIcon={<Search size={14} />} className="w-52" />
          <Button size="md">
            <Plus size={15} />
            {t('team.addMember')}
          </Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
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
    </div>
  )
}
