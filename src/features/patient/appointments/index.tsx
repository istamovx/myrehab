import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarPlus, CheckCircle2, Clock, MapPin, Monitor, X, XCircle } from 'lucide-react'
import { APPOINTMENTS, type Appointment } from '@/data/patient-mock-data'

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
  const date = new Date(apt.scheduled_at)

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
        {date.toLocaleDateString()} · {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

  const now = new Date()
  const upcoming = APPOINTMENTS.filter(a => new Date(a.scheduled_at) >= now && a.status === 'scheduled')
  const past     = APPOINTMENTS.filter(a => new Date(a.scheduled_at) < now || a.status !== 'scheduled')

  const list = tab === 'upcoming' ? upcoming : past

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('patient.patientAppointments')}</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">{upcoming.length} upcoming</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-3 py-2 bg-[var(--fg-brand-primary)] text-white rounded-lg text-sm font-semibold hover:opacity-90"
        >
          <CalendarPlus size={15} />
          {t('patient.bookAppointment')}
        </button>
      </div>

      {booked && (
        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm font-medium">
          ✓ Appointment booked!
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--bg-tertiary)] p-1 rounded-xl w-fit">
        {(['upcoming', 'past'] as const).map(key => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={[
              'px-4 py-1.5 rounded-lg text-sm font-semibold transition-all',
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
            {tab === 'upcoming' ? t('patient.noAppointments') : 'No past appointments'}
          </p>
        )}
      </div>

      {/* Book modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-[var(--bg-primary)] rounded-2xl shadow-xl w-full max-w-sm p-6 z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)]">{t('patient.bookAppointment')}</h3>
              <button onClick={() => setShowModal(false)} className="text-[var(--text-tertiary)]"><X size={18} /></button>
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">{t('patient.selectType')}</label>
              <select className="mt-1 w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg text-sm text-[var(--text-primary)] outline-none focus:border-[var(--fg-brand-primary)]">
                <option value="in_person">{t('patient.inPerson')}</option>
                <option value="teleconsult">{t('patient.teleconsult')}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">{t('patient.selectDate')}</label>
              <input type="date" min={new Date().toISOString().slice(0, 10)}
                className="mt-1 w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg text-sm text-[var(--text-primary)] outline-none focus:border-[var(--fg-brand-primary)]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">{t('patient.selectTime')}</label>
              <input type="time"
                className="mt-1 w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg text-sm text-[var(--text-primary)] outline-none focus:border-[var(--fg-brand-primary)]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)]">{t('patient.note')}</label>
              <textarea rows={2}
                className="mt-1 w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg text-sm text-[var(--text-primary)] outline-none focus:border-[var(--fg-brand-primary)] resize-none"
              />
            </div>
            <button
              onClick={() => { setShowModal(false); setBooked(true); setTimeout(() => setBooked(false), 3000) }}
              className="w-full py-2.5 bg-[var(--fg-brand-primary)] text-white rounded-lg text-sm font-semibold hover:opacity-90"
            >
              {t('patient.bookAppointment')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
