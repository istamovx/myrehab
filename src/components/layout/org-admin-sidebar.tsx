import { Link } from '@tanstack/react-router'
import {
  X, LayoutDashboard, TrendingUp, Stethoscope, UsersRound,
  FileText, Bell, Package, FlaskConical, Settings,
  ChevronLeft, ChevronRight,
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

export function OrgAdminSidebar({ onClose, collapsed = false, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'h-full bg-[var(--bg-primary)] border-r border-[var(--border-secondary)] flex flex-col select-none transition-all duration-200',
        collapsed ? 'w-16' : 'w-[260px]',
      )}
    >
      {/* Header — logo */}
      <div className={cn(
        'h-16 border-b border-[var(--border-secondary)] shrink-0 flex items-center',
        collapsed ? 'justify-center px-2' : 'px-[18px] justify-between',
      )}>
        <div className="flex items-center gap-[9px]">
          <img src="/logo.svg" alt="" className="size-7 shrink-0" />
          {!collapsed && (
            <span className="font-extrabold text-[16px] tracking-[-0.3px] text-[var(--text-primary)] leading-none">MyRehab</span>
          )}
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

      {/* Navigation */}
      <nav className={cn('flex-1 overflow-y-auto py-2', collapsed ? 'px-1.5' : 'px-[14px]')}>
        <NavGroup label="ASOSIY" collapsed={collapsed}>
          <NavItem to="/org-admin/dashboard" icon={LayoutDashboard} label="Bosh sahifa" onClose={onClose} collapsed={collapsed} />
          <NavItem to="/org-admin/insights"  icon={TrendingUp}      label="Tahlillar"   onClose={onClose} collapsed={collapsed} />
        </NavGroup>

        <NavGroup label="KLINIKA" collapsed={collapsed}>
          <NavItem to="/org-admin/doctors"             icon={Stethoscope} label="Shifokorlar"          onClose={onClose} collapsed={collapsed} />
          <NavItem to="/org-admin/team"                icon={UsersRound}  label="MDT jamoasi"          onClose={onClose} collapsed={collapsed} />
          <NavItem to="/org-admin/docs"                icon={FileText}    label="Hujjatlar"            onClose={onClose} collapsed={collapsed} />
          <NavItem to="/org-admin/membership-requests" icon={Bell}        label="Hamkorlik so'rovlari" badge={3} onClose={onClose} collapsed={collapsed} />
        </NavGroup>

        <NavGroup label="TIBBIY" collapsed={collapsed}>
          <NavItem to="/org-admin/inventory"   icon={Package}      label="Omborxona"    onClose={onClose} collapsed={collapsed} />
          <NavItem to="/org-admin/lab-results" icon={FlaskConical} label="Laboratoriya" onClose={onClose} collapsed={collapsed} />
        </NavGroup>

        <NavGroup label="SOZLAMALAR" collapsed={collapsed}>
          <NavItem to="/org-admin/settings" icon={Settings} label="Sozlamalar" onClose={onClose} collapsed={collapsed} />
        </NavGroup>
      </nav>

      {/* Footer — collapse toggle */}
      {onToggle && (
        <div className={cn(
          'border-t border-[var(--border-secondary)] shrink-0',
          collapsed ? 'p-2 flex justify-center' : 'px-[14px] py-3',
        )}>
          <button
            onClick={onToggle}
            title={collapsed ? 'Kengaytirish' : 'Yig\'ish'}
            className={cn(
              'hidden lg:flex items-center rounded-[10px] text-[13.5px] font-semibold text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors',
              collapsed ? 'size-9 justify-center' : 'w-full gap-[11px] px-[10px] py-[9px]',
            )}
          >
            {collapsed ? <ChevronRight size={17} className="shrink-0" /> : <ChevronLeft size={17} className="shrink-0" />}
            {!collapsed && <span>Yig'ish</span>}
          </button>
        </div>
      )}
    </aside>
  )
}
