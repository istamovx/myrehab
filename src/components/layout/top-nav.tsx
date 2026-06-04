import { Link } from '@tanstack/react-router'
import { Bell, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/patients', label: 'Patients' },
  { to: '/insights', label: 'Insights' },
  { to: '/appointments', label: 'Appointments' },
  { to: '/docs', label: 'Docs' },
  { to: '/team', label: 'Team' },
]

export function TopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-[var(--nav-height)] bg-white border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M8 3h4v4h4v4h-4v4H8v-4H4V7h4V3z"
                fill="white"
              />
            </svg>
          </div>
          <span className="font-bold text-[17px] text-navy tracking-tight">MyRehab</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                'text-gray-500 hover:text-navy hover:bg-gray-50',
              )}
              activeProps={{
                className: 'bg-navy text-white hover:bg-navy hover:text-white',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Notification bell */}
          <button className="relative size-10 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-colors cursor-pointer">
            <Bell size={18} className="text-gray-500" />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-danger" />
          </button>

          {/* User profile */}
          <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <Avatar name="Dr. Robert Fox" size="sm" />
            <div className="text-left hidden md:block">
              <p className="text-[13px] font-semibold text-navy leading-tight">Dr. Robert Fox</p>
              <p className="text-[11px] text-gray-400 leading-tight">Rehabilitation Specialist</p>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  )
}
