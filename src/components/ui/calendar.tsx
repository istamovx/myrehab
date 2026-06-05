import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval,
  isSameMonth, isSameDay, isToday, addMonths, subMonths,
} from 'date-fns'
import { cn } from '@/lib/utils'

interface CalendarProps {
  value?: Date
  onChange?: (date: Date) => void
  month?: Date
  onMonthChange?: (date: Date) => void
  markedDates?: Date[]
  className?: string
}

const WEEKDAYS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']
const UZ_MONTHS = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr']

const YEAR_START = 1940
const YEAR_END = new Date().getFullYear() + 10

export function Calendar({ value, onChange, month: monthProp, onMonthChange, markedDates = [], className }: CalendarProps) {
  const [internalMonth, setInternalMonth] = useState(value ?? new Date())
  const [view, setView] = useState<'days' | 'years'>('days')
  const month = monthProp ?? internalMonth

  function setMonth(d: Date) {
    onMonthChange ? onMonthChange(d) : setInternalMonth(d)
  }

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  })

  const yearsList = Array.from({ length: YEAR_END - YEAR_START + 1 }, (_, i) => YEAR_START + i)
  const currentYear = month.getFullYear()

  return (
    <div className={cn('w-[280px] select-none', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setMonth(subMonths(month, 1))}
          disabled={view === 'years'}
          className="size-8 rounded-lg hover:bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-quaternary)] cursor-pointer transition-colors disabled:opacity-30"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          type="button"
          onClick={() => setView(v => v === 'years' ? 'days' : 'years')}
          className="flex items-center gap-1 text-[14px] font-semibold text-[var(--text-primary)] hover:text-[var(--text-brand-primary)] cursor-pointer transition-colors rounded-lg px-2 py-1 hover:bg-[var(--bg-tertiary)]"
        >
          {UZ_MONTHS[month.getMonth()]} {currentYear}
          <ChevronDown size={13} className={cn('text-[var(--fg-quaternary)] transition-transform', view === 'years' && 'rotate-180')} />
        </button>

        <button
          type="button"
          onClick={() => setMonth(addMonths(month, 1))}
          disabled={view === 'years'}
          className="size-8 rounded-lg hover:bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-quaternary)] cursor-pointer transition-colors disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {view === 'years' ? (
        /* Year grid */
        <div className="h-[220px] overflow-y-auto pr-1">
          <div className="grid grid-cols-4 gap-1">
            {yearsList.map(y => (
              <button
                key={y}
                type="button"
                onClick={() => {
                  setMonth(new Date(y, month.getMonth(), 1))
                  setView('days')
                }}
                className={cn(
                  'h-9 rounded-lg text-[13px] font-medium transition-colors cursor-pointer',
                  y === currentYear
                    ? 'bg-[var(--fg-brand-primary)] text-white'
                    : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]',
                )}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map(d => (
              <div key={d} className="text-center text-[12px] font-medium text-[var(--fg-quaternary)] py-1">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {days.map(day => {
              const selected = value && isSameDay(day, value)
              const outside = !isSameMonth(day, month)
              const marked = markedDates.some(d => isSameDay(d, day))
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => onChange?.(day)}
                  className={cn(
                    'h-9 w-9 mx-auto rounded-lg text-[14px] font-medium transition-all cursor-pointer flex items-center justify-center relative',
                    selected && 'bg-[var(--fg-brand-primary)] text-white',
                    !selected && isToday(day) && 'bg-[var(--bg-brand-primary)] text-[var(--text-brand-secondary)] font-semibold',
                    !selected && !isToday(day) && outside && 'text-[var(--fg-quaternary)] hover:bg-[var(--bg-tertiary)]',
                    !selected && !isToday(day) && !outside && 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]',
                  )}
                >
                  {day.getDate()}
                  {marked && !selected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-[var(--fg-brand-primary)]" />
                  )}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
