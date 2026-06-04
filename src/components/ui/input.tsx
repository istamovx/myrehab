import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  error?: string
  uiSize?: 'sm' | 'md'
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, error, uiSize = 'md', ...props }, ref) => {
    const height = uiSize === 'sm' ? 'h-9' : 'h-11'
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-[var(--fg-quaternary)] pointer-events-none flex items-center [&>svg]:w-4 [&>svg]:h-4">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-lg',
              'text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)]',
              'outline-none transition-colors',
              'hover:border-[var(--border-primary)]',
              'focus:border-[var(--fg-brand-primary)] focus:[box-shadow:0_0_0_3px_rgba(41,112,255,0.15)]',
              'disabled:bg-[var(--bg-secondary)] disabled:cursor-not-allowed disabled:text-[var(--text-quaternary)]',
              height,
              leftIcon ? 'pl-9' : 'pl-3',
              rightIcon ? 'pr-9' : 'pr-3',
              error && 'border-[var(--border-error)] focus:border-[var(--fg-error-primary)] focus:[box-shadow:0_0_0_3px_rgba(217,45,32,0.15)]',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-[var(--fg-quaternary)] flex items-center [&>svg]:w-4 [&>svg]:h-4">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-[12px] text-[var(--fg-error-primary)]">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }
