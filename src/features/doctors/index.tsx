import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Plus, Search, Phone, UserCheck, Users, Clock,
  Star, Instagram, Send, ChevronDown, ChevronUp, BadgeCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Avatar } from '@/components/ui/avatar'
import { Dialog } from '@/components/ui/dialog'
import { PageHeader } from '@/components/layout/page-header'
import { CLINIC_DOCTORS, SPECIALIZATIONS, type ClinicDoctor } from '@/data/clinic-mock-data'
import { cn } from '@/lib/utils'

const STATUS_STYLE: Record<string, string> = {
  confirmed: 'text-[var(--text-success-primary)] bg-[var(--bg-success-primary)]',
  pending:   'text-[var(--text-warning-primary)] bg-[var(--bg-warning-primary)]',
  rejected:  'text-[var(--fg-error-primary)] bg-[var(--bg-error-primary)]',
}
const STATUS_LABEL: Record<string, string> = {
  confirmed: 'Tasdiqlangan',
  pending:   'Kutilmoqda',
  rejected:  'Rad etilgan',
}

function StarRating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={12}
          className={i <= Math.round(value) ? 'text-amber-400 fill-amber-400' : 'text-[var(--border-secondary)] fill-[var(--border-secondary)]'}
        />
      ))}
    </span>
  )
}

function DoctorCard({ doc }: { doc: ClinicDoctor }) {
  const [reviewsOpen, setReviewsOpen] = useState(false)
  const discount = doc.consultationPriceOld && doc.consultationPrice
    ? Math.round((1 - doc.consultationPrice / doc.consultationPriceOld) * 100)
    : 0

  return (
    <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)] overflow-hidden">
      {/* Top section */}
      <div className="p-5">
        <div className="flex gap-4">
          {/* Avatar + experience badge */}
          <div className="relative shrink-0">
            <Avatar name={doc.name} size="xl" className="rounded-2xl size-20 text-[22px]" />
            {doc.experienceYears ? (
              <div className="absolute -bottom-1 -right-1 bg-[var(--fg-brand-primary)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg whitespace-nowrap">
                {doc.experienceYears} yil
              </div>
            ) : null}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <h3 className="text-[16px] font-bold text-[var(--text-primary)] leading-tight">{doc.name}</h3>
                {doc.category && (
                  <p className="text-[12px] text-[var(--text-quaternary)] mt-0.5">{doc.category}</p>
                )}
              </div>
              <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap', STATUS_STYLE[doc.status])}>
                {STATUS_LABEL[doc.status]}
              </span>
            </div>

            {/* Specializations */}
            <div className="flex flex-wrap gap-1 mb-2">
              {(doc.specializations ?? [doc.specialization]).map(s => (
                <span key={s} className="text-[12px] font-medium text-[var(--text-brand-primary)] bg-[var(--bg-brand-primary)] px-2 py-0.5 rounded-md">
                  {s}
                </span>
              ))}
            </div>

            {/* Rating */}
            {doc.rating && doc.rating > 0 ? (
              <div className="flex items-center gap-1.5">
                <StarRating value={doc.rating} />
                <span className="text-[13px] font-semibold text-[var(--text-primary)]">{doc.rating.toFixed(1)}</span>
                {doc.reviewCount ? (
                  <span className="text-[12px] text-[var(--text-quaternary)]">· {doc.reviewCount} ta sharh</span>
                ) : null}
              </div>
            ) : (
              <span className="text-[12px] text-[var(--text-quaternary)]">Hali sharhlar yo'q</span>
            )}
          </div>
        </div>

        {/* Phone */}
        <a href={`tel:${doc.phone}`} className="flex items-center gap-1.5 text-[13px] text-[var(--text-brand-primary)] font-semibold mt-3 hover:underline">
          <Phone size={13} />
          {doc.phone}
        </a>

        {/* Bio */}
        {doc.bio && (
          <p className="text-[13px] text-[var(--text-tertiary)] mt-3 leading-relaxed line-clamp-3">
            {doc.bio}
          </p>
        )}

        {/* Social links */}
        {(doc.instagram || doc.telegram) && (
          <div className="flex items-center gap-2 mt-4">
            {doc.instagram && (
              <a
                href={`https://instagram.com/${doc.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-secondary)] text-[12px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <Instagram size={13} />
                Instagram
              </a>
            )}
            {doc.telegram && (
              <a
                href={`https://t.me/${doc.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-secondary)] text-[12px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <Send size={13} />
                Telegram
              </a>
            )}
            <a
              href={`tel:${doc.phone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--fg-brand-primary)] text-white text-[12px] font-medium hover:opacity-90 transition-opacity"
            >
              <Phone size={13} />
              Qo'ng'iroq
            </a>
          </div>
        )}
      </div>

      {/* Price + patients */}
      <div className="border-t border-[var(--border-secondary)] px-5 py-3 flex items-center justify-between bg-[var(--bg-secondary-subtle)]">
        <div>
          {doc.consultationPrice ? (
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-[var(--text-primary)]">
                {doc.consultationPrice.toLocaleString()} so'm
              </span>
              {doc.consultationPriceOld && (
                <>
                  <span className="text-[12px] text-[var(--text-quaternary)] line-through">
                    {doc.consultationPriceOld.toLocaleString()} so'm
                  </span>
                  <span className="text-[11px] font-bold text-[var(--fg-success-primary)] bg-[var(--bg-success-primary)] px-1.5 py-0.5 rounded-md">
                    -{discount}%
                  </span>
                </>
              )}
            </div>
          ) : (
            <span className="text-[13px] text-[var(--text-quaternary)]">Narx belgilanmagan</span>
          )}
          <p className="text-[11px] text-[var(--text-quaternary)]">Konsultatsiya</p>
        </div>
        <div className="text-right">
          <p className="text-[18px] font-bold text-[var(--text-primary)]">
            {doc.status === 'confirmed' ? doc.patientCount : '—'}
          </p>
          <p className="text-[11px] text-[var(--text-quaternary)]">Bemorlar</p>
        </div>
      </div>

      {/* Reviews toggle */}
      {doc.reviews && doc.reviews.length > 0 && (
        <div className="border-t border-[var(--border-secondary)]">
          <button
            onClick={() => setReviewsOpen(o => !o)}
            className="w-full flex items-center justify-between px-5 py-3 text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <BadgeCheck size={14} className="text-[var(--fg-brand-primary)]" />
              Bemorlar sharhlari ({doc.reviews.length})
            </span>
            {reviewsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {reviewsOpen && (
            <div className="px-5 pb-4 space-y-3">
              {doc.reviews.map(r => (
                <div key={r.id} className="border border-[var(--border-secondary)] rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-semibold text-[var(--text-primary)]">{r.author}</span>
                    <span className="text-[11px] text-[var(--text-quaternary)]">{r.date}</span>
                  </div>
                  <StarRating value={r.rating} />
                  <p className="text-[13px] text-[var(--text-tertiary)] mt-1.5 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const EMPTY_FORM = {
  name: '', phone: '+998', specialization: '', category: '',
  experienceYears: '', bio: '', instagram: '', telegram: '',
  consultationPrice: '', consultationPriceOld: '',
}

export function DoctorsPage() {
  const { t } = useTranslation()
  const [filter, setFilter]   = useState('all')
  const [search, setSearch]   = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [inviteSent, setInviteSent] = useState(false)
  const [form, setForm]       = useState(EMPTY_FORM)

  const confirmed = CLINIC_DOCTORS.filter(d => d.status === 'confirmed')
  const stats = {
    total:       CLINIC_DOCTORS.length,
    confirmed:   confirmed.length,
    pending:     CLINIC_DOCTORS.filter(d => d.status === 'pending').length,
    avgPatients: confirmed.length
      ? Math.round(confirmed.reduce((s, d) => s + d.patientCount, 0) / confirmed.length)
      : 0,
  }

  const filtered = CLINIC_DOCTORS.filter(d => {
    if (filter !== 'all' && d.status !== filter) return false
    const q = search.toLowerCase()
    return !q || d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q) || d.phone.includes(q)
  })

  function f(key: string, value: string) { setForm(prev => ({ ...prev, [key]: value })) }

  function handleInvite() {
    if (!form.name || form.phone.length < 10) return
    setInviteSent(true)
    setTimeout(() => { setAddOpen(false); setInviteSent(false); setForm(EMPTY_FORM) }, 1800)
  }

  const filterOptions = [
    { value: 'all',       label: t('doctors.allDoctors') },
    { value: 'confirmed', label: t('doctors.confirmed') },
    { value: 'pending',   label: t('doctors.pending') },
  ]
  const specOptions   = SPECIALIZATIONS.map(s => ({ value: s, label: s }))
  const categoryOpts  = [
    { value: 'Oliy toifali shifokor',    label: 'Oliy toifali shifokor' },
    { value: 'Birinchi toifali shifokor', label: 'Birinchi toifali shifokor' },
    { value: 'Ikkinchi toifali shifokor', label: 'Ikkinchi toifali shifokor' },
    { value: 'Mutaxassis',               label: 'Mutaxassis' },
  ]

  const statCards = [
    { label: t('doctors.totalDoctors'), value: stats.total,       icon: Users,      color: 'text-[var(--fg-brand-primary)]',   bg: 'bg-[var(--bg-brand-primary)]' },
    { label: t('doctors.confirmed'),    value: stats.confirmed,   icon: UserCheck,  color: 'text-[var(--fg-success-primary)]', bg: 'bg-[var(--bg-success-primary)]' },
    { label: t('doctors.pending'),      value: stats.pending,     icon: Clock,      color: 'text-[var(--fg-warning-primary)]', bg: 'bg-[var(--bg-warning-primary)]' },
    { label: t('doctors.avgPatients'),  value: stats.avgPatients, icon: Users,      color: 'text-[var(--text-tertiary)]',      bg: 'bg-[var(--bg-secondary)]' },
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

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          uiSize="sm"
          leftIcon={<Search />}
          placeholder={t('doctors.searchPlaceholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-[260px]"
        />
        <Select value={filter} onValueChange={setFilter} options={filterOptions} />
      </div>

      {/* Doctor cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(doc => (
          <DoctorCard key={doc.id} doc={doc} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-[var(--text-quaternary)] text-sm">
            {t('doctors.noResults')}
          </div>
        )}
      </div>

      {/* Add Doctor Dialog */}
      <Dialog
        open={addOpen}
        onOpenChange={open => { setAddOpen(open); if (!open) { setInviteSent(false); setForm(EMPTY_FORM) } }}
        title={t('doctors.addDoctor')}
        description="Yangi shifokor ma'lumotlarini kiriting. SMS taklif yuboriladi."
        side="right"
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
            {/* Basic info */}
            <div>
              <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">{t('doctors.fullName')} *</label>
              <Input value={form.name} onChange={e => f('name', e.target.value)} placeholder="Dr. Jasur Karimov" />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">{t('doctors.phone')} *</label>
              <Input value={form.phone} onChange={e => f('phone', e.target.value)} placeholder="+998 90 123-45-67" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">{t('doctors.specialization')}</label>
                <Select value={form.specialization} onValueChange={v => f('specialization', v)} options={specOptions} placeholder="Tanlang" triggerClassName="w-full" />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Toifa</label>
                <Select value={form.category} onValueChange={v => f('category', v)} options={categoryOpts} placeholder="Tanlang" triggerClassName="w-full" />
              </div>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Tajriba (yil)</label>
              <Input type="number" value={form.experienceYears} onChange={e => f('experienceYears', e.target.value)} placeholder="10" min={0} />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Qisqacha bio</label>
              <textarea
                value={form.bio}
                onChange={e => f('bio', e.target.value)}
                placeholder="Shifokor haqida qisqacha ma'lumot..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg border border-[var(--border-secondary)] bg-[var(--bg-primary)] text-[14px] text-[var(--text-primary)] resize-none focus:outline-none focus:border-[var(--fg-brand-primary)] transition-colors"
              />
            </div>
            {/* Social links */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5 flex items-center gap-1"><Instagram size={13} /> Instagram</label>
                <Input value={form.instagram} onChange={e => f('instagram', e.target.value)} placeholder="username" />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5 flex items-center gap-1"><Send size={13} /> Telegram</label>
                <Input value={form.telegram} onChange={e => f('telegram', e.target.value)} placeholder="username" />
              </div>
            </div>
            {/* Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Narx (so'm)</label>
                <Input type="number" value={form.consultationPrice} onChange={e => f('consultationPrice', e.target.value)} placeholder="150000" />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Asl narx (so'm)</label>
                <Input type="number" value={form.consultationPriceOld} onChange={e => f('consultationPriceOld', e.target.value)} placeholder="200000" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setAddOpen(false)}>{t('common.cancel')}</Button>
              <Button className="flex-1" onClick={handleInvite} disabled={!form.name || form.phone.length < 10}>
                {t('doctors.invite')}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}
