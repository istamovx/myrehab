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
  /**
   * Where the dialog appears. `center` (default) is a classic modal;
   * `right` is a full-height side sheet that slides in from the right —
   * used for "add / create" forms.
   */
  side?: 'center' | 'right'
}

export function Dialog({ open, onOpenChange, trigger, title, description, children, className, side = 'center' }: DialogProps) {
  const isRight = side === 'right'
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <BaseDialog.Trigger className="contents cursor-pointer">
          {trigger as React.ReactElement}
        </BaseDialog.Trigger>
      )}
      <BaseDialog.Portal>
        <BaseDialog.Backdrop
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0"
        />
        <BaseDialog.Popup
          className={cn(
            'fixed z-50 bg-[var(--bg-primary)] border border-[var(--border-secondary)] [box-shadow:var(--shadow-lg)]',
            'transition-all duration-300 ease-out',
            isRight
              ? 'top-0 right-0 h-full w-full max-w-md rounded-l-2xl p-6 overflow-y-auto data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full'
              : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl w-full max-w-lg p-6 data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
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
            <BaseDialog.Close className="text-[var(--fg-quaternary)] hover:text-[var(--text-secondary)] transition-colors rounded-lg p-1 hover:bg-[var(--bg-secondary)] cursor-pointer shrink-0">
              <X size={18} />
            </BaseDialog.Close>
          </div>
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}
