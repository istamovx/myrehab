import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import type { PatientStatus } from '@/data/mock-data'

type BadgeVariant = 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default:  'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-secondary)]',
  primary:  'bg-[var(--bg-brand-primary)] text-[var(--text-brand-secondary)] border border-[var(--blue-200)]',
  success:  'bg-[var(--bg-success-primary)] text-[var(--text-success-primary)] border border-transparent',
  danger:   'bg-[var(--bg-error-primary)] text-[var(--text-error-primary)] border border-transparent',
  warning:  'bg-[var(--bg-warning-primary)] text-[var(--text-warning-primary)] border border-transparent',
  info:     'bg-[var(--bg-brand-primary)] text-[var(--text-brand-secondary)] border border-[var(--blue-200)]',
  neutral:  'bg-[var(--bg-secondary)] text-[var(--text-tertiary)] border border-[var(--border-secondary)]',
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[12px] font-medium rounded-full whitespace-nowrap',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

const statusVariant: Record<PatientStatus, BadgeVariant> = {
  Ready:               'success',
  'At-Risk':           'danger',
  'In Progress':       'primary',
  'Awaiting clearance':'warning',
  Done:                'success',
}

const statusDot: Record<PatientStatus, string> = {
  Ready:               'bg-[var(--fg-success-primary)]',
  'At-Risk':           'bg-[var(--fg-error-primary)]',
  'In Progress':       'bg-[var(--fg-brand-primary)]',
  'Awaiting clearance':'bg-[var(--fg-warning-primary)]',
  Done:                'bg-[var(--fg-success-primary)]',
}

export function StatusBadge({ status }: { status: PatientStatus }) {
  return (
    <Badge variant={statusVariant[status]}>
      <span className={cn('size-1.5 rounded-full shrink-0', statusDot[status])} />
      {status}
    </Badge>
  )
}

export function TagBadge({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 text-[12px] font-medium bg-[var(--bg-secondary)] text-[var(--text-tertiary)] border border-[var(--border-secondary)] rounded-full">
      {tag}
    </span>
  )
}
