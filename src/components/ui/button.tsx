import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--fg-brand-primary)] text-white hover:opacity-90 active:opacity-100 [box-shadow:var(--shadow-xs)]',
  secondary:
    'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-secondary)] hover:bg-[var(--bg-secondary)] [box-shadow:var(--shadow-xs)]',
  ghost:
    'bg-transparent text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)]',
  danger:
    'bg-[var(--fg-error-primary)] text-white hover:opacity-90 [box-shadow:var(--shadow-xs)]',
  outline:
    'bg-transparent text-[var(--text-brand-primary)] border border-[var(--border-brand)] hover:bg-[var(--bg-brand-primary)]',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-[13px] rounded-lg gap-1.5',
  md: 'h-11 px-4 text-[14px] rounded-lg gap-1.5',
  lg: 'h-11 px-5 text-[15px] rounded-lg gap-2',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-150',
          'outline-none focus-visible:[box-shadow:var(--focus-ring)]',
          'disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

export { Button }
