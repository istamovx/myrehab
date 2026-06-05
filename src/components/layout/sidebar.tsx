import { Link } from '@tanstack/react-router'
import {
  X, LayoutDashboard, Users, CalendarDays, TrendingUp,
  UsersRound, FileText, Bell, Package, FlaskConical,
  Settings, ChevronLeft, ChevronRight, Stethoscope, Video, Dumbbell,
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
  return (
    <aside
      className={cn(
        'h-full bg-[var(--bg-primary)] border-r border-[var(--border-secondary)] flex flex-col select-none transition-all duration-200',
        collapsed ? 'w-16' : 'w-[260px]',
      )}
    >
      {/* Mobile close button (top-right, mobile only) */}
      {onClose && (
        <div className="lg:hidden flex justify-end p-2 shrink-0">
          <button
            onClick={onClose}
            className="size-8 rounded-lg flex items-center justify-center text-[var(--fg-quaternary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className={cn('flex-1 overflow-y-auto py-2', collapsed ? 'px-1.5' : 'px-[14px]')}>
        <NavGroup label="ASOSIY" collapsed={collapsed}>
          <NavItem to="/dashboard"        icon={LayoutDashboard} label="Bosh sahifa"      onClose={onClose} collapsed={collapsed} />
          <NavItem to="/patients"         icon={Users}           label="Bemorlar"         badge={3} onClose={onClose} collapsed={collapsed} />
          <NavItem to="/appointments"     icon={CalendarDays}    label="Uchrashuvlar"     onClose={onClose} collapsed={collapsed} />
          <NavItem to="/teleconsultation" icon={Video}           label="Telekonsultatsiya" onClose={onClose} collapsed={collapsed} />
          <NavItem to="/insights"         icon={TrendingUp}      label="Tahlillar"        onClose={onClose} collapsed={collapsed} />
        </NavGroup>

        <NavGroup label="KLINIKA" collapsed={collapsed}>
          <NavItem to="/doctors"             icon={Stethoscope} label="Shifokorlar"          onClose={onClose} collapsed={collapsed} />
          <NavItem to="/team"                icon={UsersRound}  label="MDT jamoasi"          onClose={onClose} collapsed={collapsed} />
          <NavItem to="/exercises"           icon={Dumbbell}    label="Mashqlar"             onClose={onClose} collapsed={collapsed} />
          <NavItem to="/docs"                icon={FileText}    label="Hujjatlar"            onClose={onClose} collapsed={collapsed} />
          <NavItem to="/membership-requests" icon={Bell}        label="Hamkorlik so'rovlari" badge={3} onClose={onClose} collapsed={collapsed} />
        </NavGroup>

        <NavGroup label="TIBBIY" collapsed={collapsed}>
          <NavItem to="/inventory"   icon={Package}      label="Omborxona"   onClose={onClose} collapsed={collapsed} />
          <NavItem to="/lab-results" icon={FlaskConical} label="Laboratoriya" onClose={onClose} collapsed={collapsed} />
        </NavGroup>

        <NavGroup label="SOZLAMALAR" collapsed={collapsed}>
          <NavItem to="/settings" icon={Settings} label="Sozlamalar" onClose={onClose} collapsed={collapsed} />
        </NavGroup>
      </nav>

      {/* Footer — logo + collapse toggle */}
      <div className={cn(
        'border-t border-[var(--border-secondary)] shrink-0',
        collapsed ? 'p-2 flex flex-col items-center gap-2' : 'px-[14px] py-3 flex items-center justify-between',
      )}>
        <div className="flex items-center gap-[9px]">
          <img src="/logo.svg" alt="" className="size-7 shrink-0" />
          {!collapsed && (
            <span className="font-extrabold text-[16px] tracking-[-0.3px] text-[var(--text-primary)] leading-none">MyRehab</span>
          )}
        </div>
        {onToggle && (
          <button
            onClick={onToggle}
            title={collapsed ? 'Kengaytirish' : 'Yig\'ish'}
            className="hidden lg:flex size-8 rounded-lg items-center justify-center text-[var(--fg-quaternary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors"
          >
            {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>
        )}
      </div>
    </aside>
  )
}
