import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import type { PatientStatus } from '@/data/mock-data'

type BadgeVariant = 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default:  'bg-gray-100 text-gray-700',
  primary:  'bg-brand-50 text-brand-700',
  success:  'bg-success-50 text-success-700',
  danger:   'bg-error-50 text-error-700',
  warning:  'bg-warning-50 text-warning-700',
  info:     'bg-brand-50 text-brand-700',
  neutral:  'bg-gray-100 text-gray-600',
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap',
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
  Ready:               'bg-success-600',
  'At-Risk':           'bg-error-600',
  'In Progress':       'bg-brand-600',
  'Awaiting clearance':'bg-warning-600',
  Done:                'bg-success-600',
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
    <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
      {tag}
    </span>
  )
}
