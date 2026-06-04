import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, Users, BarChart2, Calendar, FileText, UsersRound,
  HelpCircle, Settings, LogOut, X, Sun, Moon,
} from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { useLangStore } from '@/store/lang'
import { useThemeStore } from '@/store/theme'
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
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium',
        'text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors',
      )}
      activeProps={{
        className: 'bg-[var(--bg-brand-primary)] text-[var(--text-brand-secondary)] hover:bg-[var(--bg-brand-primary)] hover:text-[var(--text-brand-secondary)]',
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
  const { theme, toggle } = useThemeStore()

  return (
    <aside className="w-[280px] h-full bg-[var(--bg-primary)] border-r border-[var(--border-secondary)] flex flex-col select-none">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-[68px] border-b border-[var(--border-secondary)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-gradient-to-br from-[#2970FF] to-[#155EEF] flex items-center justify-center shrink-0 [box-shadow:0_2px_6px_-2px_rgba(21,94,239,0.5)]">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M8 3h4v4h4v4h-4v4H8v-4H4V7h4V3z" fill="white" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[16px] text-[var(--text-primary)] leading-tight">MyRehab</p>
            <p className="text-[12px] text-[var(--text-quaternary)] leading-tight">{t('nav.clinicalPlatform')}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden size-8 rounded-lg flex items-center justify-center text-[var(--fg-quaternary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors"
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
          <p className="text-[12px] font-semibold text-[var(--text-quaternary)] uppercase tracking-wider">
            {t('nav.management')}
          </p>
        </div>

        <div className="space-y-0.5">
          <NavItem to="/docs" icon={FileText}   label={t('nav.documents')} onClose={onClose} />
          <NavItem to="/team" icon={UsersRound} label={t('nav.team')}      onClose={onClose} />
        </div>
      </nav>

      {/* Language + theme */}
      <div className="px-4 pb-3 space-y-2">
        <div className="flex items-center gap-1 p-1 bg-[var(--bg-secondary)] rounded-lg">
          {LANG_OPTIONS.map(opt => (
            <button
              key={opt.code}
              onClick={() => setLang(opt.code)}
              className={cn(
                'flex-1 h-8 rounded-md text-[13px] font-semibold transition-all cursor-pointer',
                lang === opt.code
                  ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] [box-shadow:var(--shadow-xs)]'
                  : 'text-[var(--text-quaternary)] hover:text-[var(--text-secondary)]',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          onClick={toggle}
          className="w-full flex items-center justify-center gap-2 h-9 rounded-lg border border-[var(--border-secondary)] text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          {theme === 'dark' ? 'Yorug‘ rejim' : 'Tungi rejim'}
        </button>
      </div>

      {/* Bottom actions */}
      <div className="px-3 pb-2 space-y-0.5 border-t border-[var(--border-secondary)] pt-3">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">
          <HelpCircle size={18} className="shrink-0 text-[var(--fg-quaternary)]" />
          {t('nav.support')}
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">
          <Settings size={18} className="shrink-0 text-[var(--fg-quaternary)]" />
          {t('nav.settings')}
        </button>
      </div>

      {/* User profile */}
      <div className="px-3 pb-4 pt-2 border-t border-[var(--border-secondary)]">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer group">
          <Avatar name="Dr. Robert Fox" size="sm" />
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[14px] font-semibold text-[var(--text-secondary)] truncate">Dr. Robert Fox</p>
            <p className="text-[12px] text-[var(--text-quaternary)] truncate">Rehab Specialist</p>
          </div>
          <LogOut size={14} className="text-[var(--fg-quaternary)] group-hover:text-[var(--text-secondary)] shrink-0 transition-colors" />
        </button>
      </div>
    </aside>
  )
}
