import { Link, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  Search, X, LogOut,
  ClipboardList, Users, FilePlus, Activity, MessageSquare, Bell,
  Video, UsersRound, Dumbbell, Newspaper,
  TrendingUp, History, Settings,
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

interface SidebarProps { onClose?: () => void }

export function Sidebar({ onClose }: SidebarProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
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
          <div className="size-[26px] rounded-lg bg-gradient-to-br from-[#6d6bf0] to-[#4b48d6] flex items-center justify-center shrink-0">
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
              <path d="M8 3h4v4h4v4h-4v4H8v-4H4V7h4V3z" fill="white" />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-[15px] tracking-[-0.3px] text-[var(--text-primary)] block leading-none">MyRehab</span>
            <span className="text-[10px] text-[var(--text-quaternary)] font-medium">{t('nav.clinicalPlatform')}</span>
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

      {/* Search */}
      <div className="mx-[14px] mt-[14px] mb-[6px] h-[38px] bg-[var(--bg-secondary)] rounded-[10px] flex items-center gap-2 px-[11px] text-[var(--text-tertiary)]">
        <Search size={15} className="shrink-0" />
        <input
          placeholder={t('common.search')}
          className="flex-1 bg-transparent border-none outline-none text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] min-w-0"
        />
        <span className="text-[11px] font-semibold text-[var(--text-quaternary)] whitespace-nowrap">⌘ K</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-[14px] py-1">
        <NavGroup label="ASOSIY">
          <NavItem to="/dashboard"    icon={ClipboardList}  label="Ish ro'yxati"     onClose={onClose} />
          <NavItem to="/patients"     icon={Users}          label="Bemorlar"          badge={3} onClose={onClose} />
          <NavItem to="/docs"         icon={FilePlus}       label="Reja yaratish"     onClose={onClose} />
          <NavItem to="/insights"     icon={Activity}       label="Monitoring"        onClose={onClose} />
          <NavItem to="/appointments" icon={MessageSquare}  label="Xabarlar"          onClose={onClose} />
          <NavItem to="/membership-requests" icon={Bell}   label="Bildirishnomalar"  badge={6} onClose={onClose} />
        </NavGroup>

        <NavGroup label="KUNDALIK ISH">
          <NavItem to="/appointments" icon={Video}          label="Telekonsultatsiya" onClose={onClose} />
          <NavItem to="/team"         icon={UsersRound}     label="MDT jamoasi"       onClose={onClose} />
          <NavItem to="/docs"         icon={Dumbbell}       label="Mashqlar kutubxonasi" onClose={onClose} />
          <NavItem to="/insights"     icon={Newspaper}      label="Yangiliklar"       onClose={onClose} />
        </NavGroup>

        <NavGroup label="HISOBOTLAR">
          <NavItem to="/insights"     icon={TrendingUp}     label="Daromad ko'rinishi" onClose={onClose} />
          <NavItem to="/dashboard"    icon={History}        label="Faollik tarixi"    onClose={onClose} />
        </NavGroup>

        <NavGroup label="SOZLAMALAR">
          <NavItem to="/settings"     icon={Settings}       label="Sozlamalar"        onClose={onClose} />
        </NavGroup>
      </nav>

      {/* Footer — doctor card */}
      <div className="px-[14px] pb-[14px] pt-[12px] border-t border-[var(--border-secondary)]">
        <div className="flex items-center gap-[10px]">
          <div className="size-[36px] rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-[13px] font-bold shrink-0">
            MD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-[var(--text-primary)] truncate">{user?.name ?? 'Muhrim Devonov'}</p>
            <p className="text-[11px] text-[var(--text-tertiary)]">{t('roles.doctor')}</p>
          </div>
          <button
            onClick={handleLogout}
            className="size-8 rounded-lg flex items-center justify-center text-[var(--text-quaternary)] hover:bg-[var(--bg-secondary)] hover:text-red-500 transition-colors cursor-pointer shrink-0"
            title={t('header.logout')}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
