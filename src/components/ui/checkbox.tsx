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
        'size-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer outline-none shrink-0',
        'border-gray-300 bg-white',
        'data-[checked]:bg-primary data-[checked]:border-primary',
        'focus-visible:ring-2 focus-visible:ring-primary/30',
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
      <div className={cn('size-7 rounded-full bg-primary flex items-center justify-center shrink-0', className)}>
        <Check size={14} strokeWidth={3} className="text-white" />
      </div>
    )
  }
  if (inProgress) {
    return (
      <div className={cn('size-7 rounded-full border-[3px] border-primary flex items-center justify-center shrink-0', className)}>
        <div className="size-2.5 rounded-full bg-primary" />
      </div>
    )
  }
  return (
    <div className={cn('size-7 rounded-full border-2 border-gray-200 shrink-0', className)} />
  )
}
