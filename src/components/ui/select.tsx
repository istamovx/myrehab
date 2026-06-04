import { Select as BaseSelect } from '@base-ui/react/select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value?: string
  onValueChange?: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  triggerClassName?: string
  disabled?: boolean
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = 'Select…',
  className,
  triggerClassName,
  disabled,
}: SelectProps) {
  return (
    <BaseSelect.Root value={value} onValueChange={v => onValueChange?.(v as string)} disabled={disabled}>
      <BaseSelect.Trigger
        className={cn(
          'inline-flex items-center gap-2 px-3.5 h-9 bg-white border border-gray-200 rounded-xl text-sm font-medium text-navy cursor-pointer select-none',
          'hover:border-gray-300 transition-colors outline-none',
          'focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          triggerClassName,
        )}
      >
        <BaseSelect.Value placeholder={placeholder} />
        <BaseSelect.Icon className="text-gray-400 ml-1">
          <ChevronDown size={14} />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>

      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={6} className="z-50">
          <BaseSelect.Popup
            className={cn(
              'bg-white rounded-2xl border border-gray-100 shadow-[var(--shadow-dropdown)] py-1.5 min-w-[180px] overflow-hidden',
              className,
            )}
          >
            <BaseSelect.ScrollUpArrow className="flex items-center justify-center h-6 cursor-default text-gray-400">
              <ChevronUp size={14} />
            </BaseSelect.ScrollUpArrow>

            {options.map((opt) => (
              <BaseSelect.Item
                key={opt.value}
                value={opt.value}
                className="px-3 py-2.5 text-sm cursor-pointer flex items-center justify-between gap-3 text-navy hover:bg-gray-50 data-[highlighted]:bg-gray-50 data-[selected]:text-primary transition-colors mx-1 rounded-xl"
              >
                <BaseSelect.ItemText>{opt.label}</BaseSelect.ItemText>
                <BaseSelect.ItemIndicator className="text-primary">
                  <Check size={13} strokeWidth={2.5} />
                </BaseSelect.ItemIndicator>
              </BaseSelect.Item>
            ))}

            <BaseSelect.ScrollDownArrow className="flex items-center justify-center h-6 cursor-default text-gray-400">
              <ChevronDown size={14} />
            </BaseSelect.ScrollDownArrow>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  )
}

// Compact pill-style select (like department filter)
interface PillSelectProps {
  value: string
  onValueChange: (v: string) => void
  options: SelectOption[]
  className?: string
}

export function PillSelect({ value, onValueChange, options, className }: PillSelectProps) {
  const selected = options.find(o => o.value === value)
  return (
    <BaseSelect.Root value={value} onValueChange={v => onValueChange(v as string)}>
      <BaseSelect.Trigger
        className={cn(
          'inline-flex items-center gap-2 px-4 h-9 bg-white border border-gray-200 rounded-full text-sm font-semibold text-navy cursor-pointer select-none',
          'hover:border-gray-300 transition-colors outline-none shadow-sm',
          className,
        )}
      >
        <span>{selected?.label ?? options[0]?.label}</span>
        <BaseSelect.Icon className="text-gray-400">
          <ChevronDown size={14} />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>

      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={6} className="z-50">
          <BaseSelect.Popup className="bg-white rounded-2xl border border-gray-100 shadow-[var(--shadow-dropdown)] py-1.5 min-w-[200px]">
            {options.map((opt) => (
              <BaseSelect.Item
                key={opt.value}
                value={opt.value}
                className="px-3 py-2.5 text-sm cursor-pointer flex items-center justify-between gap-3 text-navy hover:bg-gray-50 data-[highlighted]:bg-gray-50 data-[selected]:text-primary transition-colors mx-1 rounded-xl"
              >
                <BaseSelect.ItemText>{opt.label}</BaseSelect.ItemText>
                <BaseSelect.ItemIndicator className="text-primary">
                  <Check size={13} strokeWidth={2.5} />
                </BaseSelect.ItemIndicator>
              </BaseSelect.Item>
            ))}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  )
}

// Generic icon-label select
interface IconSelectProps {
  value: string
  onValueChange: (v: string) => void
  options: SelectOption[]
  children: ReactNode
}

export function IconSelect({ value, onValueChange, options, children }: IconSelectProps) {
  return (
    <BaseSelect.Root value={value} onValueChange={v => onValueChange(v as string)}>
      <BaseSelect.Trigger className="inline-flex items-center gap-1.5 px-3 h-9 bg-white border border-gray-200 rounded-xl text-sm font-medium text-navy cursor-pointer hover:border-gray-300 transition-colors outline-none">
        {children}
        <BaseSelect.Icon className="text-gray-400">
          <ChevronDown size={14} />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>

      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={6} className="z-50">
          <BaseSelect.Popup className="bg-white rounded-2xl border border-gray-100 shadow-[var(--shadow-dropdown)] py-1.5 min-w-[180px]">
            {options.map((opt) => (
              <BaseSelect.Item
                key={opt.value}
                value={opt.value}
                className="px-3 py-2.5 text-sm cursor-pointer flex items-center justify-between gap-3 text-navy hover:bg-gray-50 data-[highlighted]:bg-gray-50 data-[selected]:text-primary transition-colors mx-1 rounded-xl"
              >
                <BaseSelect.ItemText>{opt.label}</BaseSelect.ItemText>
                <BaseSelect.ItemIndicator className="text-primary">
                  <Check size={13} strokeWidth={2.5} />
                </BaseSelect.ItemIndicator>
              </BaseSelect.Item>
            ))}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  )
}
