import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'

export interface Crumb {
  label: string
  to?: string
  params?: Record<string, string>
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  crumbs?: Crumb[]
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, crumbs = [], actions }: PageHeaderProps) {
  const { t } = useTranslation()
  const trail: Crumb[] = [{ label: t('breadcrumb.home'), to: '/dashboard' }, ...crumbs]

  return (
    <div className="mb-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[13px] mb-2 flex-wrap">
        {trail.map((c, i) => {
          const last = i === trail.length - 1
          return (
            <span key={i} className="flex items-center gap-1.5">
              {c.to && !last ? (
                <Link
                  to={c.to}
                  params={c.params as never}
                  className="text-[var(--text-quaternary)] hover:text-[var(--text-secondary)] font-medium transition-colors"
                >
                  {c.label}
                </Link>
              ) : (
                <span className={last ? 'text-[var(--text-secondary)] font-semibold' : 'text-[var(--text-quaternary)] font-medium'}>
                  {c.label}
                </span>
              )}
              {!last && <ChevronRight size={14} className="text-[var(--fg-quaternary)]" />}
            </span>
          )
        })}
      </nav>

      {/* Title row + actions */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-[24px] font-bold text-[var(--text-primary)] leading-tight tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[14px] text-[var(--text-tertiary)] mt-1">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 flex-wrap shrink-0">{actions}</div>
        )}
      </div>
    </div>
  )
}
