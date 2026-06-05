import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, Users, BarChart2, Calendar, FileText, UsersRound,
  HelpCircle, X, Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function NavItem({ to, icon: Icon, label, onClose }: {
  to: string
  icon: React.ElementType
  label: string
  onClose?: () => void
}) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className={cn(
        'group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium',
        'text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors',
      )}
      activeProps={{
        className: 'bg-[var(--bg-brand-primary)] text-[var(--text-brand-secondary)] hover:bg-[var(--bg-brand-primary)] hover:text-[var(--text-brand-secondary)] font-semibold',
      }}
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[var(--fg-brand-primary)] transition-opacity',
              isActive ? 'opacity-100' : 'opacity-0',
            )}
          />
          <Icon size={19} className="shrink-0" />
          {label}
        </>
      )}
    </Link>
  )
}

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const { t } = useTranslation()

  return (
    <aside className="w-[272px] h-full bg-[var(--bg-primary)] border-r border-[var(--border-secondary)] flex flex-col select-none">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-gradient-to-br from-[#2970FF] to-[#155EEF] flex items-center justify-center shrink-0 [box-shadow:0_4px_10px_-2px_rgba(41,112,255,0.5)]">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M8 3h4v4h4v4h-4v4H8v-4H4V7h4V3z" fill="white" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[17px] text-[var(--text-primary)] leading-none tracking-tight">MyRehab</p>
            <p className="text-[11px] text-[var(--text-quaternary)] leading-tight mt-1">{t('nav.clinicalPlatform')}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden size-8 rounded-lg flex items-center justify-center text-[var(--fg-quaternary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <div className="space-y-0.5">
          <NavItem to="/dashboard"    icon={LayoutDashboard} label={t('nav.dashboard')}    onClose={onClose} />
          <NavItem to="/patients"     icon={Users}           label={t('nav.patients')}     onClose={onClose} />
          <NavItem to="/insights"     icon={BarChart2}       label={t('nav.insights')}     onClose={onClose} />
          <NavItem to="/appointments" icon={Calendar}        label={t('nav.appointments')} onClose={onClose} />
        </div>

        <div className="mt-6 mb-1.5 px-3">
          <p className="text-[11px] font-semibold text-[var(--text-quaternary)] uppercase tracking-wider">
            {t('nav.management')}
          </p>
        </div>

        <div className="space-y-0.5">
          <NavItem to="/docs" icon={FileText}   label={t('nav.documents')} onClose={onClose} />
          <NavItem to="/team" icon={UsersRound} label={t('nav.team')}      onClose={onClose} />
        </div>
      </nav>

      {/* Help / upgrade card */}
      <div className="p-3">
        <div className="rounded-xl border border-[var(--border-secondary)] bg-[var(--bg-secondary-subtle)] p-3.5">
          <div className="flex items-center gap-2 mb-1">
            <div className="size-7 rounded-lg bg-[var(--bg-brand-primary)] flex items-center justify-center">
              <Sparkles size={15} className="text-[var(--fg-brand-primary)]" />
            </div>
            <p className="text-[13px] font-semibold text-[var(--text-primary)]">{t('nav.support')}</p>
          </div>
          <p className="text-[12px] text-[var(--text-tertiary)] leading-snug mb-2.5">
            {t('nav.clinicalPlatform')} · 24/7
          </p>
          <button className="w-full h-8 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-secondary)] text-[12px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5">
            <HelpCircle size={14} />
            {t('nav.support')}
          </button>
        </div>
      </div>
    </aside>
  )
}
