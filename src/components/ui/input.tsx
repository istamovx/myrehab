import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-gray-400 pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full h-10 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400',
              'outline-none transition-shadow transition-colors',
              'hover:border-gray-400',
              'focus:border-brand-600 focus:shadow-[0_0_0_4px_rgba(21,94,239,0.12)]',
              'disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400',
              leftIcon ? 'pl-9' : 'pl-3.5',
              rightIcon ? 'pr-9' : 'pr-3.5',
              error && 'border-error-600 focus:border-error-600 focus:shadow-[0_0_0_4px_rgba(217,45,32,0.12)]',
              className,
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-gray-400 flex items-center">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-error-600">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }
