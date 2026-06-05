import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval,
  format, isSameMonth, isSameDay, isToday, addMonths, subMonths,
} from 'date-fns'
import { cn } from '@/lib/utils'

interface CalendarProps {
  value?: Date
  onChange?: (date: Date) => void
  /** Controlled visible month (optional). */
  month?: Date
  onMonthChange?: (date: Date) => void
  /** Dates that get a small dot indicator. */
  markedDates?: Date[]
  className?: string
}

const WEEKDAYS = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']

export function Calendar({ value, onChange, month: monthProp, onMonthChange, markedDates = [], className }: CalendarProps) {
  const [internalMonth, setInternalMonth] = useState(value ?? new Date())
  const month = monthProp ?? internalMonth
  const setMonth = (d: Date) => { onMonthChange ? onMonthChange(d) : setInternalMonth(d) }

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
  })

  return (
    <div className={cn('w-[280px] select-none', className)}>
      {/* Month header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setMonth(subMonths(month, 1))}
          className="size-8 rounded-lg hover:bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-quaternary)] cursor-pointer transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-[14px] font-semibold text-[var(--text-primary)] capitalize">
          {format(month, 'LLLL yyyy')}
        </span>
        <button
          type="button"
          onClick={() => setMonth(addMonths(month, 1))}
          className="size-8 rounded-lg hover:bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-quaternary)] cursor-pointer transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

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
              {format(day, 'd')}
              {marked && !selected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-[var(--fg-brand-primary)]" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
