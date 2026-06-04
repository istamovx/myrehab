import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import type { PatientStatus } from '@/data/mock-data'

type BadgeVariant = 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-600',
  primary: 'bg-primary-light text-primary',
  success: 'bg-success-bg text-success',
  danger: 'bg-danger-bg text-danger',
  warning: 'bg-warning-bg text-warning',
  info: 'bg-info-bg text-info',
  neutral: 'bg-gray-100 text-gray-500',
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap',
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
  Ready: 'success',
  'At-Risk': 'danger',
  'In Progress': 'primary',
  'Awaiting clearance': 'warning',
  Done: 'success',
}

const statusDot: Record<PatientStatus, string> = {
  Ready: 'bg-success',
  'At-Risk': 'bg-danger',
  'In Progress': 'bg-primary',
  'Awaiting clearance': 'bg-warning',
  Done: 'bg-success',
}

export function StatusBadge({ status }: { status: PatientStatus }) {
  return (
    <Badge variant={statusVariant[status]}>
      <span className={cn('size-1.5 rounded-full', statusDot[status])} />
      {status}
    </Badge>
  )
}

export function TagBadge({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg">
      {tag}
    </span>
  )
}
