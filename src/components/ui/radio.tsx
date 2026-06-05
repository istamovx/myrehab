import { Radio as BaseRadio } from '@base-ui/react/radio'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import { cn } from '@/lib/utils'

export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

interface RadioGroupProps {
  value?: string
  onValueChange?: (value: string) => void
  options: RadioOption[]
  name?: string
  className?: string
  disabled?: boolean
}

export function RadioGroup({ value, onValueChange, options, name, className, disabled }: RadioGroupProps) {
  return (
    <BaseRadioGroup
      value={value}
      onValueChange={v => onValueChange?.(v as string)}
      name={name}
      disabled={disabled}
      className={cn('flex flex-col gap-2.5', className)}
    >
      {options.map(opt => (
        <label
          key={opt.value}
          className={cn(
            'flex items-start gap-3 cursor-pointer',
            opt.disabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          <BaseRadio.Root
            value={opt.value}
            disabled={opt.disabled}
            className={cn(
              'size-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors outline-none',
              'border-[var(--border-primary)] bg-[var(--bg-primary)]',
              'data-[checked]:border-[var(--fg-brand-primary)]',
              'focus-visible:[box-shadow:var(--focus-ring)]',
            )}
          >
            <BaseRadio.Indicator className="size-2.5 rounded-full bg-[var(--fg-brand-primary)] transition-transform data-[unchecked]:scale-0" />
          </BaseRadio.Root>
          <div className="min-w-0">
            <span className="text-[16px] font-medium text-[var(--text-secondary)] block leading-tight">{opt.label}</span>
            {opt.description && (
              <span className="text-[14px] text-[var(--text-quaternary)] block mt-0.5">{opt.description}</span>
            )}
          </div>
        </label>
      ))}
    </BaseRadioGroup>
  )
}
