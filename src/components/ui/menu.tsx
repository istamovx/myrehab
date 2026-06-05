import { Menu as BaseMenu } from '@base-ui/react/menu'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export const Menu = BaseMenu.Root
export const MenuTrigger = BaseMenu.Trigger

interface MenuContentProps {
  children: ReactNode
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  className?: string
}

export function MenuContent({ children, align = 'end', sideOffset = 8, className }: MenuContentProps) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner sideOffset={sideOffset} align={align} className="z-50">
        <BaseMenu.Popup
          className={cn(
            'min-w-[220px] rounded-xl border border-[var(--border-secondary)] bg-[var(--bg-primary)] p-1.5',
            '[box-shadow:var(--shadow-dropdown)] outline-none origin-[var(--transform-origin)]',
            className,
          )}
        >
          {children}
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  )
}

interface MenuItemProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  danger?: boolean
}

export function MenuItem({ children, onClick, className, danger }: MenuItemProps) {
  return (
    <BaseMenu.Item
      onClick={onClick}
      className={cn(
        'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[14px] font-medium cursor-pointer outline-none transition-colors',
        'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] data-[highlighted]:bg-[var(--bg-secondary)]',
        danger && 'text-[var(--fg-error-primary)] hover:bg-[var(--bg-error-primary)] data-[highlighted]:bg-[var(--bg-error-primary)]',
        className,
      )}
    >
      {children}
    </BaseMenu.Item>
  )
}

export function MenuSeparator() {
  return <BaseMenu.Separator className="my-1 h-px bg-[var(--border-secondary)]" />
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-2.5 pt-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-quaternary)]">
      {children}
    </div>
  )
}
