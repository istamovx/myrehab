import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar } from '@/components/ui/avatar'
import { Select } from '@/components/ui/select'
import { Dialog } from '@/components/ui/dialog'
import { TimePicker } from '@/components/ui/time-picker'
import { PageHeader } from '@/components/layout/page-header'
import { cn } from '@/lib/utils'
import { PATIENTS } from '@/data/mock-data'
import { SUPABASE_ENABLED } from '@/lib/supabase'
import { getAppointments, getProfilesByIds } from '@/services/appointments.service'
import { useAuthStore } from '@/store/auth'
import type { Appointment } from '@/types/database.types'

const MOCK_APPOINTMENTS = [
  { id: '1', patient_id: '1001', scheduled_at: new Date().toISOString(), duration_minutes: 60, type: 'in_person', status: 'confirmed' as const, reason: 'Fizioterapiya',  organization_id: '', doctor_id: '' },
  { id: '2', patient_id: '1002', scheduled_at: new Date().toISOString(), duration_minutes: 45, type: 'video',     status: 'confirmed' as const, reason: 'Konsultatsiya', organization_id: '', doctor_id: '' },
  { id: '3', patient_id: '1003', scheduled_at: new Date().toISOString(), duration_minutes: 30, type: 'in_person', status: 'scheduled' as const, reason: 'Kuzatuv',        organization_id: '', doctor_id: '' },
  { id: '4', patient_id: '1004', scheduled_at: new Date().toISOString(), duration_minutes: 60, type: 'in_person', status: 'confirmed' as const, reason: 'Baholash',       organization_id: '', doctor_id: '' },
  { id: '5', patient_id: '1005', scheduled_at: new Date().toISOString(), duration_minutes: 45, type: 'video',     status: 'confirmed' as const, reason: 'Fizioterapiya',  organization_id: '', doctor_id: '' },
  { id: '6', patient_id: '1006', scheduled_at: new Date().toISOString(), duration_minutes: 30, type: 'phone',     status: 'cancelled' as const, reason: "Ko'rib chiqish", organization_id: '', doctor_id: '' },
]

type AptStatus = 'confirmed' | 'scheduled' | 'cancelled'

const STATUS_STYLE: Record<string, string> = {
  confirmed: 'text-[var(--text-success-primary)] bg-[var(--bg-success-primary)]',
  scheduled: 'text-[var(--text-warning-primary)] bg-[var(--bg-warning-primary)]',
  cancelled:  'text-[var(--fg-error-primary)] bg-[var(--bg-error-primary)]',
}

const STATUS_BORDER: Record<string, string> = {
  confirmed: 'border-l-[var(--fg-success-primary)]',
  scheduled: 'border-l-[var(--fg-warning-primary)]',
  cancelled:  'border-l-[var(--fg-error-primary)] opacity-60',
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

function aptTime(iso: string) {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function aptStatus(raw: string): AptStatus {
  if (raw === 'confirmed') return 'confirmed'
  if (raw === 'cancelled' || raw === 'no_show') return 'cancelled'
  return 'scheduled'
}

function aptTypeLabel(type: string) {
  const labels: Record<string, string> = {
    in_person: 'Klinikada',
    video:     "Video qo'ng'iroq",
    phone:     'Telefon',
    home_visit: 'Uyga tashrif',
  }
  return labels[type] ?? type
}

interface DisplayApt {
  id: string
  patientId: string
  patientName: string
  time: string
  duration: number
  type: string
  status: AptStatus
  reason: string
}

function toDisplayApt(apt: Appointment, nameMap: Record<string, string>): DisplayApt {
  return {
    id: apt.id,
    patientId: apt.patient_id,
    patientName: nameMap[apt.patient_id] ?? '—',
    time: aptTime(apt.scheduled_at),
    duration: apt.duration_minutes,
    type: apt.type ?? 'in_person',
    status: aptStatus(apt.status),
    reason: apt.reason ?? '',
  }
}

function toMockDisplayApt(apt: typeof MOCK_APPOINTMENTS[number]): DisplayApt {
  const mockPatient = PATIENTS.find(p => p.id === apt.patient_id)
  return {
    id: apt.id,
    patientId: apt.patient_id,
    patientName: mockPatient?.name ?? '—',
    time: aptTime(apt.scheduled_at),
    duration: apt.duration_minutes,
    type: apt.type,
    status: aptStatus(apt.status),
    reason: apt.reason,
  }
}

export function AppointmentsPage() {
  const { t } = useTranslation()
  const today = new Date()
  const orgId = useAuthStore(s => s.user?.organizationId)

  const [currentDate, setCurrentDate] = useState(today)
  const [selectedDay, setSelectedDay] = useState(today.getDate())
  const [allApts, setAllApts] = useState<DisplayApt[]>(MOCK_APPOINTMENTS.map(toMockDisplayApt))
  const [loading, setLoading] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)
  const [aptForm, setAptForm] = useState({ patientId: '', type: 'in_person', time: '', duration: '60' })

  useEffect(() => {
    if (!SUPABASE_ENABLED || !orgId) return
    setLoading(true)
    getAppointments(orgId)
      .then(async data => {
        if (data.length > 0) {
          const patientIds = [...new Set(data.map(a => a.patient_id))]
          const nm = await getProfilesByIds(patientIds)
          setAllApts(data.map(a => toDisplayApt(a, nm)))
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [orgId])

  function handleAddApt() {
    if (!aptForm.patientId || !aptForm.time) return
    setAddSuccess(true)
    setTimeout(() => { setAddSuccess(false); setAddOpen(false); setAptForm({ patientId: '', type: 'in_person', time: '', duration: '60' }) }, 1500)
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

  const [rawApts, setRawApts] = useState<Appointment[]>([])
  const [nameMap, setNameMap] = useState<Record<string, string>>({})

  function prevMonth() { setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1)) }
  function nextMonth() { setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1)) }

  const selectedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`

  const displayApts: DisplayApt[] = rawApts.length > 0
    ? rawApts
        .filter(a => {
          const d = new Date(a.scheduled_at)
          const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
          return dStr === selectedDateStr
        })
        .map(a => toDisplayApt(a, nameMap))
    : allApts

  const daysWithApts = new Set(
    rawApts.map(a => new Date(a.scheduled_at).getDate()),
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('appointments.title')}
        subtitle={t('appointments.subtitle', { count: SUPABASE_ENABLED ? rawApts.length : allApts.length })}
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
              const hasApt     = SUPABASE_ENABLED ? daysWithApts.has(day) : false

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    'h-8 w-full rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center justify-center relative',
                    isSelected && 'bg-[var(--fg-brand-primary)] text-white',
                    isToday && !isSelected && 'bg-[var(--bg-brand-primary)] text-[var(--text-brand-secondary)] font-semibold',
                    !isSelected && !isToday && 'text-[var(--text-tertiary)] hover:bg-[var(--bg-tertiary)]',
                  )}
                >
                  {day}
                  {hasApt && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-[var(--fg-brand-primary)]" />
                  )}
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
              <p className="text-xs text-[var(--text-quaternary)] mt-0.5">{t('appointments.totalCount', { count: displayApts.length })}</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-[var(--text-quaternary)] bg-[var(--bg-secondary)] border border-[var(--border-secondary)] px-3 py-1.5 rounded-lg">
              <Calendar size={12} />
              {t('common.today')}
            </span>
          </div>

          {loading ? (
            <div className="divide-y divide-[var(--border-secondary)]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-14 h-8 bg-[var(--bg-tertiary)] rounded animate-pulse" />
                  <div className="flex-1 h-8 bg-[var(--bg-tertiary)] rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-secondary)]">
              {displayApts.length === 0 ? (
                <div className="px-5 py-12 text-center text-[var(--fg-quaternary)] text-sm">
                  Bu kunda qabullar yo'q
                </div>
              ) : displayApts.map(apt => (
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

                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar name={apt.patientName} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">{apt.patientName}</p>
                      <p className="text-xs text-[var(--fg-quaternary)]">{apt.reason}</p>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 hidden sm:block">
                    <p className="text-sm font-medium text-[var(--text-secondary)]">
                      {aptTypeLabel(apt.type)}
                    </p>
                  </div>

                  <span className={cn(
                    'text-xs font-medium px-2.5 py-1 rounded-full shrink-0',
                    STATUS_STYLE[apt.status] ?? 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]',
                  )}>
                    {{ confirmed: t('appointments.confirmed'), scheduled: t('appointments.pending'), cancelled: t('appointments.cancelled') }[apt.status] ?? apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Appointment — right side sheet */}
      <Dialog
        open={addOpen}
        onOpenChange={open => { setAddOpen(open); if (!open) { setAddSuccess(false); setAptForm({ patientId: '', type: 'in_person', time: '', duration: '60' }) } }}
        title={t('appointments.newAppointment')}
        description="Yangi qabul ma'lumotlarini kiriting"
        side="right"
      >
        {addSuccess ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="size-14 rounded-full bg-[var(--bg-success-primary)] flex items-center justify-center">
              <Plus size={26} className="text-[var(--fg-success-primary)]" />
            </div>
            <p className="text-[16px] font-semibold text-[var(--text-primary)]">Qabul qo'shildi!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Bemor *</label>
              <Select
                value={aptForm.patientId}
                onValueChange={v => setAptForm(f => ({ ...f, patientId: v }))}
                options={
                  SUPABASE_ENABLED
                    ? allApts.map(a => ({ value: a.patientId, label: a.patientName }))
                    : PATIENTS.map(p => ({ value: p.id, label: p.name }))
                }
                placeholder="Bemorni tanlang"
                triggerClassName="w-full"
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Tur</label>
              <Select
                value={aptForm.type}
                onValueChange={v => setAptForm(f => ({ ...f, type: v }))}
                options={[
                  { value: 'in_person', label: 'Klinikada' },
                  { value: 'video',     label: "Video qo'ng'iroq" },
                  { value: 'phone',     label: 'Telefon' },
                ]}
                triggerClassName="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Vaqt *</label>
                <TimePicker value={aptForm.time} onChange={v => setAptForm(f => ({ ...f, time: v }))} />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Davomiyligi (min)</label>
                <Input type="number" value={aptForm.duration} onChange={e => setAptForm(f => ({ ...f, duration: e.target.value }))} min={15} step={15} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setAddOpen(false)}>{t('common.cancel')}</Button>
              <Button className="flex-1" onClick={handleAddApt} disabled={!aptForm.patientId || !aptForm.time}>
                {t('common.add')}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}
