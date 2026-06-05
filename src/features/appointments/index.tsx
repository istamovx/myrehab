import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Select } from '@/components/ui/select'
import { PageHeader } from '@/components/layout/page-header'
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
  const [addOpen, setAddOpen] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)
  const [aptForm, setAptForm] = useState({ patientId: '', type: 'physiotherapy', time: '', duration: '60', room: '' })

  function handleAddApt() {
    if (!aptForm.patientId || !aptForm.time) return
    setAddSuccess(true)
    setTimeout(() => { setAddSuccess(false); setAddOpen(false); setAptForm({ patientId: '', type: 'physiotherapy', time: '', duration: '60', room: '' }) }, 1500)
  }

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
      <PageHeader
        title={t('appointments.title')}
        subtitle={t('appointments.subtitle', { count: APPOINTMENTS.length })}
        crumbs={[{ label: t('nav.appointments') }]}
        actions={
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus size={15} />
            {t('appointments.newAppointment')}
          </Button>
        }
      />

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

      {/* New Appointment Modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40" onClick={() => setAddOpen(false)} />
          <div className="relative bg-[var(--bg-primary)] rounded-2xl shadow-xl w-full max-w-sm p-6 z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-[var(--text-primary)]">{t('appointments.newAppointment')}</h3>
              </div>
              <button onClick={() => setAddOpen(false)} className="text-[var(--text-tertiary)]"><X size={18} /></button>
            </div>

            {addSuccess ? (
              <div className="text-center py-6">
                <p className="text-green-600 text-[16px] font-semibold">✓ Uchrashuv qo'shildi!</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-[12px] font-semibold text-[var(--text-secondary)]">Bemor *</label>
                  <Select
                    value={aptForm.patientId}
                    onValueChange={v => setAptForm(f => ({ ...f, patientId: v }))}
                    options={PATIENTS.map(p => ({ value: p.id, label: p.name }))}
                    placeholder="Bemorni tanlang"
                    triggerClassName="w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-[var(--text-secondary)]">Tur</label>
                  <Select
                    value={aptForm.type}
                    onValueChange={v => setAptForm(f => ({ ...f, type: v }))}
                    options={[
                      { value: 'physiotherapy', label: t('appointments.physiotherapy') },
                      { value: 'consultation',  label: t('appointments.consultation') },
                      { value: 'followUp',      label: t('appointments.followUp') },
                      { value: 'assessment',    label: t('appointments.assessment') },
                    ]}
                    triggerClassName="w-full mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[12px] font-semibold text-[var(--text-secondary)]">Vaqt *</label>
                    <input type="time" value={aptForm.time} onChange={e => setAptForm(f => ({ ...f, time: e.target.value }))}
                      className="mt-1 w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg text-sm text-[var(--text-primary)] outline-none focus:border-[var(--fg-brand-primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-[var(--text-secondary)]">Davomiyligi (min)</label>
                    <input type="number" value={aptForm.duration} onChange={e => setAptForm(f => ({ ...f, duration: e.target.value }))} min={15} step={15}
                      className="mt-1 w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg text-sm text-[var(--text-primary)] outline-none focus:border-[var(--fg-brand-primary)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-[var(--text-secondary)]">Xona</label>
                  <input type="text" value={aptForm.room} onChange={e => setAptForm(f => ({ ...f, room: e.target.value }))} placeholder="Room 201"
                    className="mt-1 w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg text-sm text-[var(--text-primary)] outline-none focus:border-[var(--fg-brand-primary)]"
                  />
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={() => setAddOpen(false)} className="flex-1 py-2.5 rounded-lg border border-[var(--border-secondary)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
                    {t('common.cancel')}
                  </button>
                  <button onClick={handleAddApt} disabled={!aptForm.patientId || !aptForm.time}
                    className="flex-1 py-2.5 rounded-lg bg-[var(--fg-brand-primary)] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-40"
                  >
                    {t('common.add')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
