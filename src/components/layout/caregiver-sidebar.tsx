import { Link, useRouterState, useNavigate } from '@tanstack/react-router'
import { Dumbbell, X, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

interface NavItem {
  to:    string
  icon:  React.ElementType
  label: string
}

function CaregiverNavItem({ to, icon: Icon, label }: NavItem) {
  const { pathname } = useRouterState({ select: s => s.location })
  const active = pathname === to || pathname.startsWith(to + '/')

  return (
    <Link
      to={to}
      className={[
        'flex items-center gap-[11px] px-[10px] py-[9px] rounded-[10px]',
        'text-[13.5px] font-semibold transition-colors',
        active
          ? 'bg-[var(--fg-brand-primary)] text-white'
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]',
      ].join(' ')}
    >
      <Icon size={16} className="shrink-0" />
      <span className="truncate flex-1">{label}</span>
    </Link>
  )
}

interface Props {
  mobileOpen: boolean
  onClose:    () => void
}

export function CaregiverSidebar({ mobileOpen, onClose }: Props) {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)

  function handleLogout() {
    logout()
    navigate({ to: '/login' })
  }

  const navItems: NavItem[] = [
    { to: '/caregiver/exercises', icon: Dumbbell, label: 'Mashqlar yordam' },
  ]

  const sidebar = (
    <aside className="flex flex-col h-full w-[260px] bg-[var(--bg-primary)] border-r border-[var(--border-secondary)]">
      <div className="flex items-center justify-between h-16 px-5 border-b border-[var(--border-secondary)] shrink-0">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="" className="w-8 h-8 shrink-0" />
          <span className="text-[13.5px] font-semibold text-[var(--text-primary)]">MyRehab</span>
        </div>
        <button onClick={onClose} className="lg:hidden p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
          <X size={18} />
        </button>
      </div>

      <div className="mx-3 mt-3 mb-1 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-secondary)]">
        <p className="text-[12px] font-semibold text-[var(--text-primary)] truncate">{user?.name ?? 'Yordamchi'}</p>
        <p className="text-[11px] text-[var(--text-tertiary)] truncate mt-0.5">Parvarish yordamchisi</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {navItems.map(item => (
          <CaregiverNavItem key={item.to} {...item} />
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mx-3 mb-3 flex items-center gap-2.5 px-[10px] py-[9px] rounded-[10px] text-[13.5px] font-semibold text-[var(--text-secondary)] hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-colors"
      >
        <LogOut size={16} className="shrink-0" />
        <span>Chiqish</span>
      </button>
    </aside>
  )

  return (
    <>
      <div className="hidden lg:flex fixed inset-y-0 left-0 z-30">{sidebar}</div>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40" onClick={onClose} />
          <div className="relative z-50">{sidebar}</div>
        </div>
      )}
    </>
  )
}
