import * as React from 'react'
import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: ReactNode
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export function Dialog({ open, onOpenChange, trigger, title, description, children, className }: DialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <BaseDialog.Trigger className="contents cursor-pointer">
          {trigger as React.ReactElement}
        </BaseDialog.Trigger>
      )}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        />
        <BaseDialog.Popup
          className={cn(
            'fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-2xl [box-shadow:var(--shadow-lg)] w-full max-w-lg p-6',
            className,
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              {title && (
                <BaseDialog.Title className="text-[18px] font-bold text-[var(--text-primary)]">
                  {title}
                </BaseDialog.Title>
              )}
              {description && (
                <BaseDialog.Description className="text-[14px] text-[var(--text-tertiary)] mt-1">
                  {description}
                </BaseDialog.Description>
              )}
            </div>
            <BaseDialog.Close className="text-[var(--fg-quaternary)] hover:text-[var(--text-secondary)] transition-colors rounded-lg p-1 hover:bg-[var(--bg-secondary)] cursor-pointer">
              <X size={18} />
            </BaseDialog.Close>
          </div>
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}
