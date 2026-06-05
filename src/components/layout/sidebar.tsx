import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, Users, BarChart2, Calendar, FileText, UsersRound,
  Search, X, ChevronDown, HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function NavItem({ to, icon: Icon, label, badge, onClose }: {
  to: string
  icon: React.ElementType
  label: string
  badge?: number
  onClose?: () => void
}) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className={cn(
        'flex items-center gap-[11px] px-[10px] py-[9px] rounded-[10px] text-[13.5px] font-semibold',
        'text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer',
      )}
      activeProps={{
        className: 'bg-[var(--bg-brand-primary)] text-[var(--text-brand-secondary)] hover:bg-[var(--bg-brand-primary)] hover:text-[var(--text-brand-secondary)]',
      }}
    >
      {({ isActive }) => (
        <>
          <Icon size={17} className="shrink-0" />
          <span className="flex-1 truncate">{label}</span>
          {badge != null && badge > 0 && (
            <span className={cn(
              'text-[11px] font-bold min-w-[19px] h-[19px] px-[5px] rounded-[6px] flex items-center justify-center',
              isActive
                ? 'bg-[var(--fg-brand-primary)] text-white'
                : 'bg-[var(--bg-secondary)] text-[var(--text-quaternary)]',
            )}>
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  )
}

function NavGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-[var(--text-quaternary)] px-[10px] pt-[14px] pb-[6px]">
        {label}
      </p>
      <div className="space-y-[1px]">{children}</div>
    </div>
  )
}

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const { t } = useTranslation()

  return (
    <aside className="w-[260px] h-full bg-[var(--bg-primary)] border-r border-[var(--border-secondary)] flex flex-col select-none">
      {/* Logo */}
      <div className="flex items-center justify-between px-[14px] pt-[18px] pb-[4px] shrink-0">
        <div className="flex items-center gap-[9px]">
          <div className="size-[26px] rounded-lg bg-gradient-to-br from-[#6d6bf0] to-[#4b48d6] flex items-center justify-center shrink-0">
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
              <path d="M8 3h4v4h4v4h-4v4H8v-4H4V7h4V3z" fill="white" />
            </svg>
          </div>
          <span className="font-extrabold text-[16.5px] tracking-[-0.3px] text-[var(--text-primary)]">MyRehab</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden size-8 rounded-lg flex items-center justify-center text-[var(--fg-quaternary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors"
          >
            <X size={17} />
          </button>
        )}
      </div>

      {/* Sidebar search */}
      <div className="mx-[14px] mt-[16px] mb-[6px] h-[38px] bg-[var(--bg-secondary)] rounded-[10px] flex items-center gap-2 px-[11px] text-[var(--text-tertiary)]">
        <Search size={15} className="shrink-0" />
        <input
          placeholder={t('common.search')}
          className="flex-1 bg-transparent border-none outline-none text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] min-w-0"
        />
        <span className="text-[11px] font-semibold text-[var(--text-quaternary)] whitespace-nowrap">⌘ K</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-[14px] py-1">
        <NavGroup label={t('nav.general')}>
          <NavItem to="/dashboard"    icon={LayoutDashboard} label={t('nav.dashboard')}    onClose={onClose} />
          <NavItem to="/patients"     icon={Users}           label={t('nav.patients')}     onClose={onClose} />
          <NavItem to="/insights"     icon={BarChart2}       label={t('nav.insights')}     onClose={onClose} />
          <NavItem to="/appointments" icon={Calendar}        label={t('nav.appointments')} badge={3} onClose={onClose} />
        </NavGroup>

        <NavGroup label={t('nav.management')}>
          <NavItem to="/docs" icon={FileText}   label={t('nav.documents')} onClose={onClose} />
          <NavItem to="/team" icon={UsersRound} label={t('nav.team')}      onClose={onClose} />
        </NavGroup>
      </nav>

      {/* Footer */}
      <div className="px-[14px] pb-[18px] pt-[16px] border-t border-[var(--border-secondary)] space-y-[10px]">
        {/* Clinic card */}
        <div className="bg-[var(--bg-secondary)] rounded-[13px] p-[11px] flex items-center gap-[10px] cursor-pointer hover:bg-[var(--bg-tertiary)] transition-colors">
          <div className="size-[33px] rounded-[9px] shrink-0 bg-gradient-to-br from-[#34d8c8] to-[#19b6a6] flex items-center justify-center text-white">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-[var(--text-quaternary)] font-semibold">{t('nav.clinic')}</p>
            <p className="text-[13.5px] font-bold text-[var(--text-primary)] truncate">{t('nav.clinicName')}</p>
          </div>
          <ChevronDown size={15} className="text-[var(--text-quaternary)] shrink-0" />
        </div>

        {/* Support button */}
        <button className="w-full border border-[var(--border-secondary)] bg-[var(--bg-primary)] rounded-[11px] p-[11px] text-[13px] font-bold text-[var(--text-secondary)] cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors flex items-center justify-center gap-[7px]">
          <HelpCircle size={15} />
          {t('nav.support')}
        </button>

        {/* Copyright */}
        <p className="text-center text-[10.5px] text-[var(--text-quaternary)] font-medium">© 2025 MyRehab</p>
      </div>
    </aside>
  )
}
