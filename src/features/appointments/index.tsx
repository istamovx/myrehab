import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { PATIENTS } from '@/data/mock-data'

const APPOINTMENTS = [
  { id: 1, patientId: '1001', time: '09:00', duration: 60, type: 'physiotherapy', room: 'Room 201', status: 'confirmed' },
  { id: 2, patientId: '1002', time: '10:30', duration: 45, type: 'consultation',  room: 'Room 105', status: 'confirmed' },
  { id: 3, patientId: '1003', time: '11:30', duration: 30, type: 'followUp',      room: 'Room 301', status: 'pending' },
  { id: 4, patientId: '1004', time: '13:00', duration: 60, type: 'assessment',    room: 'Room 202', status: 'confirmed' },
  { id: 5, patientId: '1005', time: '14:30', duration: 45, type: 'physiotherapy', room: 'Room 201', status: 'confirmed' },
  { id: 6, patientId: '1006', time: '15:30', duration: 30, type: 'review',        room: 'Room 105', status: 'cancelled' },
]

const STATUS_STYLE: Record<string, string> = {
  confirmed: 'text-[var(--text-success-primary)] bg-[var(--bg-success-primary)]',
  pending:   'text-[var(--text-warning-primary)] bg-[var(--bg-warning-primary)]',
  cancelled: 'text-[var(--fg-error-primary)] bg-[var(--bg-error-primary)]',
}

const STATUS_BORDER: Record<string, string> = {
  confirmed: 'border-l-[var(--fg-success-primary)]',
  pending:   'border-l-[var(--fg-warning-primary)]',
  cancelled: 'border-l-[var(--fg-error-primary)] opacity-60',
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

export function AppointmentsPage() {
  const { t } = useTranslation()
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(today)
  const [selectedDay, setSelectedDay] = useState(today.getDate())

  const year  = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay    = getFirstDayOfMonth(year, month)

  const DAYS   = [t('days.mon'), t('days.tue'), t('days.wed'), t('days.thu'), t('days.fri'), t('days.sat'), t('days.sun')]
  const MONTHS = [
    t('months.january'), t('months.february'), t('months.march'), t('months.april'),
    t('months.may'), t('months.june'), t('months.july'), t('months.august'),
    t('months.september'), t('months.october'), t('months.november'), t('months.december'),
  ]

  function prevMonth() { setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1)) }
  function nextMonth() { setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1)) }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">{t('appointments.title')}</h1>
          <p className="text-sm text-[var(--text-quaternary)] mt-0.5">{t('appointments.subtitle', { count: APPOINTMENTS.length })}</p>
        </div>
        <Button size="md">
          <Plus size={15} />
          {t('appointments.newAppointment')}
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Calendar */}
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)] p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              {MONTHS[month]} {year}
            </h3>
            <div className="flex items-center gap-0.5">
              <button
                onClick={prevMonth}
                className="size-8 rounded-lg hover:bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-quaternary)] cursor-pointer transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={nextMonth}
                className="size-8 rounded-lg hover:bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-quaternary)] cursor-pointer transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[11px] font-medium text-[var(--fg-quaternary)] py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day        = i + 1
              const isToday    = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
              const isSelected = day === selectedDay

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    'h-8 w-full rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center justify-center',
                    isSelected && 'bg-[var(--fg-brand-primary)] text-white',
                    isToday && !isSelected && 'bg-[var(--bg-brand-primary)] text-[var(--text-brand-secondary)] font-semibold',
                    !isSelected && !isToday && 'text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)]',
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-5 pt-4 border-t border-[var(--border-secondary)] space-y-2">
            {[
              { color: 'bg-[var(--fg-success-primary)]', label: t('appointments.confirmed') },
              { color: 'bg-[var(--fg-warning-primary)]', label: t('appointments.pending') },
              { color: 'bg-[var(--fg-error-primary)]',   label: t('appointments.cancelled') },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 text-xs text-[var(--text-quaternary)]">
                <span className={cn('size-2 rounded-full', item.color)} />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Day schedule */}
        <div className="xl:col-span-2 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-secondary)]">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                {t('appointments.schedule', { month: MONTHS[month], day: selectedDay })}
              </h3>
              <p className="text-xs text-[var(--text-quaternary)] mt-0.5">{t('appointments.totalCount', { count: APPOINTMENTS.length })}</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-quaternary)] bg-[var(--bg-secondary)] border border-[var(--border-secondary)] px-3 py-1.5 rounded-lg">
              <Calendar size={12} />
              {t('common.today')}
            </span>
          </div>

          <div className="divide-y divide-[var(--border-secondary)]">
            {APPOINTMENTS.map(apt => {
              const patient = PATIENTS.find(p => p.id === apt.patientId)

              return (
                <div
                  key={apt.id}
                  className={cn(
                    'flex items-center gap-4 px-5 py-4 border-l-[3px] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer',
                    STATUS_BORDER[apt.status] ?? 'border-l-gray-200',
                  )}
                >
                  <div className="w-14 shrink-0 text-center">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{apt.time}</p>
                    <p className="text-xs text-[var(--fg-quaternary)] flex items-center justify-center gap-0.5 mt-0.5">
                      <Clock size={9} />
                      {t('appointments.minutes', { count: apt.duration })}
                    </p>
                  </div>

                  <div className="w-px h-10 bg-[var(--bg-tertiary)] shrink-0" />

                  {patient && (
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar name={patient.name} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{patient.name}</p>
                        <p className="text-xs text-[var(--fg-quaternary)]">{t('patients.id')}: {patient.id}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex-1 min-w-0 hidden sm:block">
                    <p className="text-sm font-medium text-[var(--text-secondary)]">
                      {t(`appointments.${apt.type}` as any, apt.type)}
                    </p>
                    <p className="text-xs text-[var(--fg-quaternary)] mt-0.5">{apt.room}</p>
                  </div>

                  <span className={cn(
                    'text-xs font-medium px-2.5 py-1 rounded-full shrink-0',
                    STATUS_STYLE[apt.status] ?? 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]',
                  )}>
                    {t(`appointments.${apt.status}` as any, apt.status)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
