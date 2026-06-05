import { useState } from 'react'
import { Popover } from '@base-ui/react/popover'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimePickerProps {
  /** "HH:mm" string or empty. */
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  minuteStep?: number
  className?: string
  disabled?: boolean
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))

const COL_BTN =
  'w-full px-2 py-1.5 rounded-md text-[16px] text-center cursor-pointer transition-colors text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
const COL_BTN_ACTIVE = 'bg-[var(--bg-brand-primary)] text-[var(--text-brand-primary)] font-semibold hover:bg-[var(--bg-brand-primary)]'

export function TimePicker({ value, onChange, placeholder = 'Vaqt', minuteStep = 5, className, disabled }: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => String(i * minuteStep).padStart(2, '0'))
  const [h, m] = value ? value.split(':') : ['', '']

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
        <Clock size={16} className="text-[var(--fg-quaternary)] shrink-0" />
        <span className={cn('flex-1 truncate', value ? 'text-[var(--text-primary)]' : 'text-[var(--text-placeholder)]')}>
          {value || placeholder}
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={6} className="z-50">
          <Popover.Popup className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] [box-shadow:var(--shadow-dropdown)] p-2 outline-none flex gap-1 origin-[var(--transform-origin)] transition-[transform,opacity] data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95">
          <div className="w-16 h-[200px] overflow-y-auto pr-1 space-y-0.5">
            {HOURS.map(hh => (
              <button
                key={hh}
                type="button"
                onClick={() => onChange?.(`${hh}:${m || '00'}`)}
                className={cn(COL_BTN, h === hh && COL_BTN_ACTIVE)}
              >
                {hh}
              </button>
            ))}
          </div>
          <div className="w-px bg-[var(--border-secondary)]" />
          <div className="w-16 h-[200px] overflow-y-auto pl-1 space-y-0.5">
            {minutes.map(mm => (
              <button
                key={mm}
                type="button"
                onClick={() => onChange?.(`${h || '00'}:${mm}`)}
                className={cn(COL_BTN, m === mm && COL_BTN_ACTIVE)}
              >
                {mm}
              </button>
            ))}
          </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
