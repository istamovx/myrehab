import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  X, ClipboardList, Users, FilePlus, Activity, MessageSquare, Bell,
  Video, UsersRound, Dumbbell, Newspaper, TrendingUp, History, Settings,
  ChevronLeft, ChevronRight, Package, FlaskConical,
} from 'lucide-react'
import { cn } from '@/lib/utils'

function NavItem({ to, icon: Icon, label, badge, onClose, collapsed }: {
  to: string
  icon: React.ElementType
  label: string
  badge?: number
  onClose?: () => void
  collapsed?: boolean
}) {
  return (
    <Link
      to={to}
      onClick={onClose}
      title={collapsed ? label : undefined}
      className={cn(
        'flex items-center rounded-[10px] text-[13.5px] font-semibold transition-colors cursor-pointer',
        'text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]',
        collapsed ? 'justify-center h-9 w-9 mx-auto relative' : 'gap-[11px] px-[10px] py-[9px]',
      )}
      activeProps={{
        className: 'bg-[var(--bg-brand-primary)] text-[var(--text-brand-secondary)] hover:bg-[var(--bg-brand-primary)] hover:text-[var(--text-brand-secondary)]',
      }}
    >
      {({ isActive }) => (
        <>
          <Icon size={17} className="shrink-0" />
          {!collapsed && (
            <>
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
          {collapsed && badge != null && badge > 0 && (
            <span className="absolute top-0 right-0 size-2 rounded-full bg-[var(--fg-brand-primary)]" />
          )}
        </>
      )}
    </Link>
  )
}

function NavGroup({ label, children, collapsed }: { label: string; children: React.ReactNode; collapsed?: boolean }) {
  if (collapsed) {
    return (
      <div className="py-1.5">
        <div className="h-px bg-[var(--border-secondary)] mx-2 mb-1.5" />
        <div className="space-y-[3px] flex flex-col items-center">{children}</div>
      </div>
    )
  }
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
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ onClose, collapsed = false, onToggle }: SidebarProps) {
  const { t } = useTranslation()

  return (
    <aside
      className={cn(
        'h-full bg-[var(--bg-primary)] border-r border-[var(--border-secondary)] flex flex-col select-none transition-all duration-200',
        collapsed ? 'w-16' : 'w-[260px]',
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-3 border-b border-[var(--border-secondary)] shrink-0">
        {collapsed ? (
          <div className="flex flex-col items-center w-full gap-1">
            <img src="/logo.svg" alt="" className="size-7" />
            {onToggle && (
              <button
                onClick={onToggle}
                className="size-6 rounded flex items-center justify-center text-[var(--fg-quaternary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors"
              >
                <ChevronRight size={13} />
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-[9px]">
              <img src="/logo.svg" alt="" className="size-7 shrink-0" />
              <div>
                <span className="font-extrabold text-[15px] tracking-[-0.3px] text-[var(--text-primary)] block leading-none">MyRehab</span>
                <span className="text-[10px] text-[var(--text-quaternary)] font-medium">{t('nav.clinicalPlatform')}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {onClose && (
                <button
                  onClick={onClose}
                  className="lg:hidden size-8 rounded-lg flex items-center justify-center text-[var(--fg-quaternary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors"
                >
                  <X size={17} />
                </button>
              )}
              {onToggle && (
                <button
                  onClick={onToggle}
                  className="hidden lg:flex size-8 rounded-lg items-center justify-center text-[var(--fg-quaternary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors"
                >
                  <ChevronLeft size={17} />
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn('flex-1 overflow-y-auto py-2', collapsed ? 'px-1.5' : 'px-[14px]')}>
        <NavGroup label="ASOSIY" collapsed={collapsed}>
          <NavItem to="/dashboard"           icon={ClipboardList} label="Ish ro'yxati"     badge={0} onClose={onClose} collapsed={collapsed} />
          <NavItem to="/patients"            icon={Users}         label="Bemorlar"          badge={3} onClose={onClose} collapsed={collapsed} />
          <NavItem to="/docs"                icon={FilePlus}      label="Reja yaratish"     onClose={onClose} collapsed={collapsed} />
          <NavItem to="/insights"            icon={Activity}      label="Monitoring"        onClose={onClose} collapsed={collapsed} />
          <NavItem to="/appointments"        icon={MessageSquare} label="Xabarlar"          onClose={onClose} collapsed={collapsed} />
          <NavItem to="/membership-requests" icon={Bell}          label="Bildirishnomalar"  badge={6} onClose={onClose} collapsed={collapsed} />
        </NavGroup>

        <NavGroup label="KUNDALIK ISH" collapsed={collapsed}>
          <NavItem to="/appointments" icon={Video}         label="Telekonsultatsiya" onClose={onClose} collapsed={collapsed} />
          <NavItem to="/team"         icon={UsersRound}    label="MDT jamoasi"       onClose={onClose} collapsed={collapsed} />
          <NavItem to="/doctors"      icon={Dumbbell}      label="Mashqlar"          onClose={onClose} collapsed={collapsed} />
          <NavItem to="/docs"         icon={Newspaper}     label="Protokollar"       onClose={onClose} collapsed={collapsed} />
          <NavItem to="/inventory"    icon={Package}       label="Omborxona"         onClose={onClose} collapsed={collapsed} />
          <NavItem to="/lab-results"  icon={FlaskConical}  label="Laboratoriya"      onClose={onClose} collapsed={collapsed} />
        </NavGroup>

        <NavGroup label="TAHLIL" collapsed={collapsed}>
          <NavItem to="/insights"   icon={TrendingUp} label="Tahlil va hisobot" onClose={onClose} collapsed={collapsed} />
          <NavItem to="/dashboard"  icon={History}    label="Faoliyat tarixi"   onClose={onClose} collapsed={collapsed} />
        </NavGroup>

        <NavGroup label="SOZLAMALAR" collapsed={collapsed}>
          <NavItem to="/settings" icon={Settings} label="Sozlamalar" onClose={onClose} collapsed={collapsed} />
        </NavGroup>
      </nav>
    </aside>
  )
}
