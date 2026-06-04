import { Select as BaseSelect } from '@base-ui/react/select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export interface SelectOption {
  value: string
  label: string
}

const POPUP =
  'bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] [box-shadow:var(--shadow-dropdown)] py-1.5 min-w-[180px] overflow-hidden z-50'

const ITEM =
  'px-3 py-2 text-[14px] cursor-pointer flex items-center justify-between gap-3 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] data-[highlighted]:bg-[var(--bg-secondary)] data-[selected]:text-[var(--text-brand-primary)] transition-colors mx-1 rounded-lg'

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
  placeholder = 'Tanlang…',
  className,
  triggerClassName,
  disabled,
}: SelectProps) {
  return (
    <BaseSelect.Root value={value} onValueChange={v => onValueChange?.(v as string)} disabled={disabled}>
      <BaseSelect.Trigger
        className={cn(
          'inline-flex items-center gap-2 px-3 h-9 bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-lg text-[13px] font-medium text-[var(--text-secondary)] cursor-pointer select-none',
          'hover:bg-[var(--bg-secondary)] transition-colors outline-none [box-shadow:var(--shadow-xs)]',
          'focus-visible:border-[var(--fg-brand-primary)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          triggerClassName,
        )}
      >
        <BaseSelect.Value placeholder={placeholder} />
        <BaseSelect.Icon className="text-[var(--fg-quaternary)] ml-1">
          <ChevronDown size={14} />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>

      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={6} className="z-50">
          <BaseSelect.Popup className={cn(POPUP, className)}>
            <BaseSelect.ScrollUpArrow className="flex items-center justify-center h-6 cursor-default text-[var(--fg-quaternary)]">
              <ChevronUp size={14} />
            </BaseSelect.ScrollUpArrow>

            {options.map((opt) => (
              <BaseSelect.Item key={opt.value} value={opt.value} className={ITEM}>
                <BaseSelect.ItemText>{opt.label}</BaseSelect.ItemText>
                <BaseSelect.ItemIndicator className="text-[var(--text-brand-primary)]">
                  <Check size={13} strokeWidth={2.5} />
                </BaseSelect.ItemIndicator>
              </BaseSelect.Item>
            ))}

            <BaseSelect.ScrollDownArrow className="flex items-center justify-center h-6 cursor-default text-[var(--fg-quaternary)]">
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
          'inline-flex items-center gap-2 px-4 h-9 bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-full text-[13px] font-semibold text-[var(--text-secondary)] cursor-pointer select-none',
          'hover:bg-[var(--bg-secondary)] transition-colors outline-none [box-shadow:var(--shadow-xs)]',
          className,
        )}
      >
        <span>{selected?.label ?? options[0]?.label}</span>
        <BaseSelect.Icon className="text-[var(--fg-quaternary)]">
          <ChevronDown size={14} />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>

      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={6} className="z-50">
          <BaseSelect.Popup className={cn(POPUP, 'min-w-[200px]')}>
            {options.map((opt) => (
              <BaseSelect.Item key={opt.value} value={opt.value} className={ITEM}>
                <BaseSelect.ItemText>{opt.label}</BaseSelect.ItemText>
                <BaseSelect.ItemIndicator className="text-[var(--text-brand-primary)]">
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
      <BaseSelect.Trigger className="inline-flex items-center gap-1.5 px-3 h-9 bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-lg text-[13px] font-medium text-[var(--text-secondary)] cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors outline-none [box-shadow:var(--shadow-xs)]">
        {children}
        <BaseSelect.Icon className="text-[var(--fg-quaternary)]">
          <ChevronDown size={14} />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>

      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={6} className="z-50">
          <BaseSelect.Popup className={POPUP}>
            {options.map((opt) => (
              <BaseSelect.Item key={opt.value} value={opt.value} className={ITEM}>
                <BaseSelect.ItemText>{opt.label}</BaseSelect.ItemText>
                <BaseSelect.ItemIndicator className="text-[var(--text-brand-primary)]">
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
