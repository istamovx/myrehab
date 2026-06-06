import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarPlus, CheckCircle2, Clock, MapPin, Monitor, XCircle, Video, CalendarDays } from 'lucide-react'
import { APPOINTMENTS, type Appointment } from '@/data/patient-mock-data'
import { Dialog } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn, formatUzDateTime } from '@/lib/utils'

const STATUS_STYLE: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  missed:    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

const STATUS_ICON: Record<string, React.ElementType> = {
  scheduled: Clock,
  completed: CheckCircle2,
  cancelled: XCircle,
  missed:    XCircle,
}

function AppointmentCard({ apt }: { apt: Appointment }) {
  const { t } = useTranslation()
  const Icon = STATUS_ICON[apt.status]

  return (
    <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {apt.type === 'in_person'
            ? <MapPin size={15} className="text-[var(--fg-brand-primary)] shrink-0" />
            : <Monitor size={15} className="text-teal-500 shrink-0" />
          }
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {apt.type === 'in_person' ? t('patient.inPerson') : t('patient.teleconsult')}
          </span>
        </div>
        <span className={['text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1', STATUS_STYLE[apt.status]].join(' ')}>
          <Icon size={11} />
          {t(`patient.${apt.status}`)}
        </span>
      </div>
      <p className="text-sm font-medium text-[var(--text-secondary)]">
        {formatUzDateTime(apt.scheduled_at)}
      </p>
      {apt.notes && <p className="text-xs text-[var(--text-tertiary)] mt-2 leading-relaxed">{apt.notes}</p>}
    </div>
  )
}

const TIME_SLOTS = ['09:00', '10:00', '10:30', '11:00', '12:00', '14:00', '15:00', '15:30', '16:00', '17:00']

function BookingForm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const { t } = useTranslation()
  const [type, setType]     = useState<'in_person' | 'teleconsult'>('in_person')
  const [date, setDate]     = useState('')
  const [time, setTime]     = useState('')
  const [note, setNote]     = useState('')

  const minDate = new Date().toISOString().slice(0, 10)
  const canBook = date && time

  return (
    <div className="space-y-5">
      {/* Type selector — card buttons */}
      <div>
        <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-2">{t('patient.selectType')}</p>
        <div className="grid grid-cols-2 gap-3">
          {([
            { value: 'in_person',   label: t('patient.inPerson'),   Icon: MapPin,  color: 'text-[var(--fg-brand-primary)]', bg: 'bg-[var(--bg-brand-primary)]' },
            { value: 'teleconsult', label: t('patient.teleconsult'), Icon: Video,   color: 'text-teal-600',                  bg: 'bg-teal-50 dark:bg-teal-900/20' },
          ] as const).map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value)}
              className={cn(
                'flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all text-center cursor-pointer',
                type === opt.value
                  ? 'border-[var(--fg-brand-primary)] bg-[var(--bg-brand-primary)]'
                  : 'border-[var(--border-secondary)] bg-[var(--bg-primary)] hover:border-[var(--fg-brand-primary)]/40',
              )}
            >
              <div className={cn('size-9 rounded-xl flex items-center justify-center', opt.bg)}>
                <opt.Icon size={18} className={opt.color} />
              </div>
              <span className="text-[13px] font-semibold text-[var(--text-primary)] leading-tight">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Date picker */}
      <div>
        <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-2">{t('patient.selectDate')}</p>
        <div className="relative">
          <CalendarDays size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--fg-quaternary)] pointer-events-none" />
          <input
            type="date"
            min={minDate}
            value={date}
            onChange={e => { setDate(e.target.value); setTime('') }}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-secondary)] text-[13.5px] text-[var(--text-primary)] outline-none focus:border-[var(--fg-brand-primary)] focus:[box-shadow:var(--focus-ring)] transition-colors cursor-pointer"
          />
        </div>
      </div>

      {/* Time slots grid */}
      {date && (
        <div>
          <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-2">{t('patient.selectTime')}</p>
          <div className="grid grid-cols-5 gap-2">
            {TIME_SLOTS.map(slot => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={cn(
                  'py-2 rounded-lg text-[13px] font-semibold transition-all cursor-pointer',
                  time === slot
                    ? 'bg-[var(--fg-brand-primary)] text-white shadow-sm'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-secondary)] hover:border-[var(--fg-brand-primary)] hover:text-[var(--text-primary)]',
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Note */}
      <div>
        <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide mb-2">{t('patient.note')}</p>
        <Textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={2}
          placeholder="Qo'shimcha ma'lumot yoki savollaringiz..."
          className="resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-11 rounded-xl border border-[var(--border-secondary)] text-[13.5px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
        >
          Bekor qilish
        </button>
        <Button
          onClick={onConfirm}
          disabled={!canBook}
          className="flex-1 h-11"
        >
          <CalendarPlus size={15} />
          Band qilish
        </Button>
      </div>
    </div>
  )
}

export function PatientAppointmentsPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const [showModal, setShowModal] = useState(false)
  const [booked, setBooked] = useState(false)

  const now = new Date()
  const upcoming = APPOINTMENTS.filter(a => new Date(a.scheduled_at) >= now && a.status === 'scheduled')
  const past     = APPOINTMENTS.filter(a => new Date(a.scheduled_at) < now || a.status !== 'scheduled')

  const list = tab === 'upcoming' ? upcoming : past

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('patient.patientAppointments')}</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">{upcoming.length} ta rejalashtirilgan</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <CalendarPlus size={15} />
          {t('patient.bookAppointment')}
        </Button>
      </div>

      {booked && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm font-medium">
          ✓ Uchrashuv band qilindi!
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--bg-tertiary)] p-1 rounded-xl w-fit">
        {(['upcoming', 'past'] as const).map(key => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={[
              'px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer',
              tab === key
                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]',
            ].join(' ')}
          >
            {t(`patient.${key}`)}
            {key === 'upcoming' && upcoming.length > 0 && (
              <span className="ml-1.5 bg-[var(--fg-brand-primary)] text-white text-xs px-1.5 py-0.5 rounded-full">
                {upcoming.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map(apt => <AppointmentCard key={apt.id} apt={apt} />)}
        {list.length === 0 && (
          <p className="text-center text-[var(--text-tertiary)] py-12">
            {tab === 'upcoming' ? t('patient.noAppointments') : "O'tgan uchrashuvlar yo'q"}
          </p>
        )}
      </div>

      {/* Book modal */}
      <Dialog open={showModal} onOpenChange={setShowModal} title={t('patient.bookAppointment')} className="max-w-md">
        <BookingForm
          onConfirm={() => { setShowModal(false); setBooked(true); setTimeout(() => setBooked(false), 3000) }}
          onCancel={() => setShowModal(false)}
        />
      </Dialog>
    </div>
  )
}
