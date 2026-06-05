import { useState } from 'react'
import { Popover } from '@base-ui/react/popover'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format, parse, isValid } from 'date-fns'
import { cn } from '@/lib/utils'
import { Calendar } from './calendar'

interface DatePickerProps {
  /** ISO date string ("yyyy-MM-dd") or empty. */
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

function toDate(value?: string): Date | undefined {
  if (!value) return undefined
  const d = parse(value, 'yyyy-MM-dd', new Date())
  return isValid(d) ? d : undefined
}

export function DatePicker({ value, onChange, placeholder = 'Sanani tanlang', className, disabled }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const selected = toDate(value)

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        disabled={disabled}
        className={cn(
          'inline-flex items-center gap-2 w-full px-3 h-11 bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-lg text-[16px] text-left cursor-pointer outline-none transition-colors',
          'hover:border-[var(--border-primary)] focus-visible:border-[var(--fg-brand-primary)] focus-visible:[box-shadow:0_0_0_3px_rgba(41,112,255,0.15)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className,
        )}
      >
        <CalendarIcon size={16} className="text-[var(--fg-quaternary)] shrink-0" />
        <span className={cn('flex-1 truncate', selected ? 'text-[var(--text-primary)]' : 'text-[var(--text-placeholder)]')}>
          {selected ? format(selected, 'dd.MM.yyyy') : placeholder}
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={6} className="z-50">
          <Popover.Popup className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] [box-shadow:var(--shadow-dropdown)] p-3 outline-none origin-[var(--transform-origin)] transition-[transform,opacity] data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95">
            <Calendar
              value={selected}
              onChange={d => { onChange?.(format(d, 'yyyy-MM-dd')); setOpen(false) }}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
