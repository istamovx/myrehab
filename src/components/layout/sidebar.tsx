import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, Users, BarChart2, Calendar, FileText, UsersRound,
  HelpCircle, Settings, LogOut, X,
} from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { useLangStore } from '@/store/lang'
import { cn } from '@/lib/utils'

const LANG_OPTIONS = [
  { code: 'uz', label: "O'z" },
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'РУ' },
] as const

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
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium',
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

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const { t } = useTranslation()
  const { lang, setLang } = useLangStore()

  return (
    <aside className="w-[280px] h-full bg-white border-r border-gray-200 flex flex-col select-none">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-[68px] border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-brand-600 flex items-center justify-center shrink-0 shadow-sm">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M8 3h4v4h4v4h-4v4H8v-4H4V7h4V3z" fill="white" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-base text-gray-900 leading-tight">MyRehab</p>
            <p className="text-xs text-gray-400 leading-tight">{t('nav.clinicalPlatform')}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden size-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Main navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          <NavItem to="/dashboard"    icon={LayoutDashboard} label={t('nav.dashboard')}    onClose={onClose} />
          <NavItem to="/patients"     icon={Users}           label={t('nav.patients')}     onClose={onClose} />
          <NavItem to="/insights"     icon={BarChart2}       label={t('nav.insights')}     onClose={onClose} />
          <NavItem to="/appointments" icon={Calendar}        label={t('nav.appointments')} onClose={onClose} />
        </div>

        <div className="mt-6 mb-2 px-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            {t('nav.management')}
          </p>
        </div>

        <div className="space-y-0.5">
          <NavItem to="/docs" icon={FileText}   label={t('nav.documents')} onClose={onClose} />
          <NavItem to="/team" icon={UsersRound} label={t('nav.team')}      onClose={onClose} />
        </div>
      </nav>

      {/* Language switcher */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
          {LANG_OPTIONS.map(opt => (
            <button
              key={opt.code}
              onClick={() => setLang(opt.code)}
              className={cn(
                'flex-1 h-8 rounded-md text-sm font-semibold transition-all cursor-pointer',
                lang === opt.code
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-700',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-3 pb-2 space-y-0.5 border-t border-gray-100 pt-3">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer">
          <HelpCircle size={18} className="shrink-0 text-gray-400" />
          {t('nav.support')}
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer">
          <Settings size={18} className="shrink-0 text-gray-400" />
          {t('nav.settings')}
        </button>
      </div>

      {/* User profile */}
      <div className="px-3 pb-4 pt-2 border-t border-gray-100">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
          <Avatar name="Dr. Robert Fox" size="sm" />
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold text-gray-700 truncate">Dr. Robert Fox</p>
            <p className="text-xs text-gray-400 truncate">Rehab Specialist</p>
          </div>
          <LogOut size={14} className="text-gray-400 group-hover:text-gray-600 shrink-0 transition-colors" />
        </button>
      </div>
    </aside>
  )
}
