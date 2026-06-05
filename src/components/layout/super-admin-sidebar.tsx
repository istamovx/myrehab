import { Link, useNavigate } from '@tanstack/react-router'
import {
  X, LayoutDashboard, Building2, CreditCard, Settings, LogOut,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth'
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
        className: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-700 dark:hover:text-indigo-300',
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
                ? 'bg-indigo-600 text-white'
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

interface SuperAdminSidebarProps { onClose?: () => void }

export function SuperAdminSidebar({ onClose }: SuperAdminSidebarProps) {
  const navigate = useNavigate()
  const logout = useAuthStore(s => s.logout)

  function handleLogout() {
    logout()
    navigate({ to: '/login' })
  }

  return (
    <aside className="w-[260px] h-full bg-[var(--bg-primary)] border-r border-[var(--border-secondary)] flex flex-col select-none">
      {/* Logo */}
      <div className="h-[72px] flex items-center justify-between px-[14px] border-b border-[var(--border-secondary)] shrink-0">
        <div className="flex items-center gap-[9px]">
          <img src="/logo.svg" alt="" className="size-7 shrink-0" />
          <div>
            <span className="font-extrabold text-[15px] tracking-[-0.3px] text-[var(--text-primary)] block leading-none">MyRehab</span>
            <span className="text-[10px] text-indigo-500 font-bold">Super Admin</span>
          </div>
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
      <nav className="flex-1 overflow-y-auto px-[14px] py-1">
        <NavGroup label="BOSHQARUV">
          <NavItem to="/super-admin/dashboard"      icon={LayoutDashboard} label="Dashboard"      onClose={onClose} />
          <NavItem to="/super-admin/organizations"  icon={Building2}       label="Tashkilotlar"   onClose={onClose} />
          <NavItem to="/super-admin/payments"       icon={CreditCard}      label="To'lovlar"      onClose={onClose} />
        </NavGroup>

        <NavGroup label="TIZIM">
          <NavItem to="/super-admin/settings"       icon={Settings}        label="Sozlamalar"     onClose={onClose} />
        </NavGroup>
      </nav>

      {/* Footer */}
      <div className="px-[14px] pb-[14px] pt-[12px] border-t border-[var(--border-secondary)]">
        <div className="flex items-center gap-[10px]">
          <div className="size-[36px] rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-[13px] font-bold shrink-0">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-[var(--text-primary)] truncate">Super Admin</p>
            <p className="text-[11px] text-indigo-500 font-semibold">Platform boshqaruvchi</p>
          </div>
          <button
            onClick={handleLogout}
            className="size-8 rounded-lg flex items-center justify-center text-[var(--text-quaternary)] hover:bg-[var(--bg-secondary)] hover:text-red-500 transition-colors cursor-pointer shrink-0"
            title="Chiqish"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
