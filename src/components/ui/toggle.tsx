import { Switch as BaseSwitch } from '@base-ui/react/switch'
import { cn } from '@/lib/utils'

interface ToggleProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  id?: string
  size?: 'sm' | 'md'
  className?: string
}

const SIZES = {
  sm: { track: 'w-9 h-5', thumb: 'size-4', on: 'data-[checked]:translate-x-4' },
  md: { track: 'w-11 h-6', thumb: 'size-5', on: 'data-[checked]:translate-x-5' },
}

export function Toggle({ checked, onCheckedChange, disabled, id, size = 'md', className }: ToggleProps) {
  const s = SIZES[size]
  return (
    <BaseSwitch.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        'relative inline-flex items-center rounded-full p-0.5 transition-colors cursor-pointer outline-none shrink-0',
        'bg-[var(--bg-tertiary)] data-[checked]:bg-[var(--fg-brand-primary)]',
        'focus-visible:[box-shadow:var(--focus-ring)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        s.track,
        className,
      )}
    >
      <BaseSwitch.Thumb
        className={cn(
          'rounded-full bg-white [box-shadow:var(--shadow-sm)] transition-transform duration-200',
          s.thumb,
          s.on,
        )}
      />
    </BaseSwitch.Root>
  )
}

// Toggle with label + optional description (settings rows)
interface ToggleFieldProps extends ToggleProps {
  label: string
  description?: string
}

export function ToggleField({ label, description, className, ...toggle }: ToggleFieldProps) {
  return (
    <label className={cn('flex items-center justify-between gap-4 cursor-pointer', className)}>
      <div className="min-w-0">
        <span className="text-[16px] font-medium text-[var(--text-secondary)] block">{label}</span>
        {description && <span className="text-[14px] text-[var(--text-quaternary)] block mt-0.5">{description}</span>}
      </div>
      <Toggle {...toggle} />
    </label>
  )
}
