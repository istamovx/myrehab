import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarPlus, CheckCircle2, Clock, MapPin, Monitor, XCircle } from 'lucide-react'
import { APPOINTMENTS, type Appointment } from '@/data/patient-mock-data'
import { Dialog } from '@/components/ui/dialog'
import { Input, Textarea, FieldLabel } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { formatUzDateTime } from '@/lib/utils'

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

export function PatientAppointmentsPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const [showModal, setShowModal] = useState(false)
  const [booked, setBooked] = useState(false)
  const [type, setType] = useState('in_person')

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
        <div className="space-y-4">
          <div>
            <FieldLabel>{t('patient.selectType')}</FieldLabel>
            <Select
              value={type}
              onValueChange={setType}
              triggerClassName="w-full h-11"
              options={[
                { value: 'in_person', label: t('patient.inPerson') },
                { value: 'teleconsult', label: t('patient.teleconsult') },
              ]}
            />
          </div>
          <div>
            <FieldLabel>{t('patient.selectDate')}</FieldLabel>
            <Input type="date" min={new Date().toISOString().slice(0, 10)} />
          </div>
          <div>
            <FieldLabel>{t('patient.selectTime')}</FieldLabel>
            <Input type="time" />
          </div>
          <div>
            <FieldLabel>{t('patient.note')}</FieldLabel>
            <Textarea rows={2} />
          </div>
          <Button
            onClick={() => { setShowModal(false); setBooked(true); setTimeout(() => setBooked(false), 3000) }}
            className="w-full"
          >
            {t('patient.bookAppointment')}
          </Button>
        </div>
      </Dialog>
    </div>
  )
}
