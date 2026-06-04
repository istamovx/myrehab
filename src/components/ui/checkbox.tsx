import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps {
  checked?: boolean | 'indeterminate'
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  id?: string
}

export function Checkbox({ checked, onCheckedChange, disabled, className, id }: CheckboxProps) {
  return (
    <BaseCheckbox.Root
      id={id}
      checked={checked === 'indeterminate' ? false : (checked ?? false)}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        'size-5 rounded-md border flex items-center justify-center transition-all cursor-pointer outline-none shrink-0',
        'border-[var(--border-primary)] bg-[var(--bg-primary)]',
        'data-[checked]:bg-[var(--fg-brand-primary)] data-[checked]:border-[var(--fg-brand-primary)]',
        'focus-visible:[box-shadow:0_0_0_3px_rgba(41,112,255,0.20)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
    >
      <BaseCheckbox.Indicator className="text-white">
        {checked === 'indeterminate' ? <Minus size={12} strokeWidth={3} /> : <Check size={12} strokeWidth={3} />}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  )
}

// Circle checkmark for checklist
interface CircleCheckProps {
  checked?: boolean
  inProgress?: boolean
  className?: string
}

export function CircleCheck({ checked, inProgress, className }: CircleCheckProps) {
  if (checked) {
    return (
      <div className={cn('size-7 rounded-full bg-[var(--fg-brand-primary)] flex items-center justify-center shrink-0', className)}>
        <Check size={14} strokeWidth={3} className="text-white" />
      </div>
    )
  }
  if (inProgress) {
    return (
      <div className={cn('size-7 rounded-full border-[3px] border-[var(--fg-brand-primary)] flex items-center justify-center shrink-0', className)}>
        <div className="size-2.5 rounded-full bg-[var(--fg-brand-primary)]" />
      </div>
    )
  }
  return (
    <div className={cn('size-7 rounded-full border-2 border-[var(--border-secondary)] shrink-0', className)} />
  )
}
