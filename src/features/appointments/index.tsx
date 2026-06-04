import { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { PATIENTS } from '@/data/mock-data'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const APPOINTMENTS = [
  { id: 1, patientId: '1001', time: '09:00', duration: 60, type: 'Physiotherapy', room: 'Room 201', status: 'confirmed' },
  { id: 2, patientId: '1002', time: '10:30', duration: 45, type: 'Consultation', room: 'Room 105', status: 'confirmed' },
  { id: 3, patientId: '1003', time: '11:30', duration: 30, type: 'Follow-up', room: 'Room 301', status: 'pending' },
  { id: 4, patientId: '1004', time: '13:00', duration: 60, type: 'Assessment', room: 'Room 202', status: 'confirmed' },
  { id: 5, patientId: '1005', time: '14:30', duration: 45, type: 'Physiotherapy', room: 'Room 201', status: 'confirmed' },
  { id: 6, patientId: '1006', time: '15:30', duration: 30, type: 'Review', room: 'Room 105', status: 'cancelled' },
]

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-primary-light text-primary',
  pending: 'bg-warning-bg text-warning',
  cancelled: 'bg-danger-bg text-danger line-through',
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

export function AppointmentsPage() {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(today)
  const [selectedDay, setSelectedDay] = useState(today.getDate())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  function prevMonth() {
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }
  function nextMonth() {
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-navy">Appointments</h1>
        <Button size="md">
          <Plus size={16} />
          New appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Calendar */}
        <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-navy">
              {MONTHS[month]} {year}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="size-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextMonth}
                className="size-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
              const isSelected = day === selectedDay

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    'h-9 w-full rounded-xl text-sm font-medium transition-all cursor-pointer flex items-center justify-center',
                    isSelected && 'bg-primary text-white',
                    isToday && !isSelected && 'bg-primary-light text-primary font-bold',
                    !isSelected && !isToday && 'text-gray-600 hover:bg-gray-50',
                  )}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-5 pt-5 border-t border-gray-100 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="size-2 rounded-full bg-primary" />
              Confirmed
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="size-2 rounded-full bg-warning" />
              Pending
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="size-2 rounded-full bg-danger" />
              Cancelled
            </div>
          </div>
        </div>

        {/* Day schedule */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-navy">
              <span className="text-primary">{MONTHS[month]} {selectedDay}</span> — Schedule
            </h3>
            <span className="text-sm text-gray-400">{APPOINTMENTS.length} appointments</span>
          </div>

          <div className="space-y-3">
            {APPOINTMENTS.map(apt => {
              const patient = PATIENTS.find(p => p.id === apt.patientId)

              return (
                <div
                  key={apt.id}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-2xl border-l-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer',
                    apt.status === 'confirmed' && 'border-primary',
                    apt.status === 'pending' && 'border-warning',
                    apt.status === 'cancelled' && 'border-danger opacity-60',
                  )}
                >
                  {/* Time */}
                  <div className="text-center w-14 shrink-0">
                    <p className="text-sm font-bold text-navy">{apt.time}</p>
                    <p className="text-xs text-gray-400">{apt.duration}min</p>
                  </div>

                  <div className="w-px h-10 bg-gray-200" />

                  {/* Patient */}
                  {patient && (
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar name={patient.name} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-navy truncate">{patient.name}</p>
                        <p className="text-xs text-gray-400">ID: {patient.id}</p>
                      </div>
                    </div>
                  )}

                  {/* Type */}
                  <div className="flex-1 min-w-0 hidden sm:block">
                    <p className="text-sm font-medium text-navy">{apt.type}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Calendar size={11} />
                      {apt.room}
                    </p>
                  </div>

                  {/* Status */}
                  <span className={cn(
                    'text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0',
                    STATUS_COLORS[apt.status],
                  )}>
                    {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
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
