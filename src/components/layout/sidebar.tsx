import { Link } from '@tanstack/react-router'
import {
  LayoutDashboard, Users, BarChart2, Calendar, FileText, UsersRound,
  HelpCircle, Settings, LogOut,
} from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const PRIMARY_NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/insights', icon: BarChart2, label: 'Insights' },
  { to: '/appointments', icon: Calendar, label: 'Appointments' },
]

const SECONDARY_NAV = [
  { to: '/docs', icon: FileText, label: 'Documents' },
  { to: '/team', icon: UsersRound, label: 'Team' },
]

function NavItem({ to, icon: Icon, label }: {
  to: string
  icon: React.ElementType
  label: string
}) {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium',
        'text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors',
      )}
      activeProps={{
        className: 'bg-brand-50 text-brand-700 hover:bg-brand-50 hover:text-brand-700',
      }}
    >
      <Icon size={18} className="shrink-0" />
      {label}
    </Link>
  )
}

export function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[280px] bg-white border-r border-gray-200 flex flex-col z-30 select-none">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-[68px] border-b border-gray-100 shrink-0">
        <div className="size-9 rounded-xl bg-brand-600 flex items-center justify-center shrink-0 shadow-sm">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M8 3h4v4h4v4h-4v4H8v-4H4V7h4V3z" fill="white" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="font-bold text-[15px] text-gray-900 leading-tight">MyRehab</p>
          <p className="text-[11px] text-gray-400 leading-tight">Clinical Platform</p>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          {PRIMARY_NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>

        <div className="mt-6 mb-2 px-3">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Management
          </p>
        </div>

        <div className="space-y-0.5">
          {SECONDARY_NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-2 space-y-0.5 border-t border-gray-100 pt-3">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer">
          <HelpCircle size={18} className="shrink-0 text-gray-400" />
          Support
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer">
          <Settings size={18} className="shrink-0 text-gray-400" />
          Settings
        </button>
      </div>

      {/* User profile */}
      <div className="px-3 pb-4 pt-2 border-t border-gray-100">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
          <Avatar name="Dr. Robert Fox" size="sm" />
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[13px] font-semibold text-gray-700 truncate">Dr. Robert Fox</p>
            <p className="text-[11px] text-gray-400 truncate">Rehab Specialist</p>
          </div>
          <LogOut size={14} className="text-gray-400 group-hover:text-gray-600 shrink-0 transition-colors" />
        </button>
      </div>
    </aside>
  )
}
