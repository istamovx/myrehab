import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import {
  Search, Bell, Sun, Moon, Globe, ChevronDown, LogOut, Settings, UserRound, Check, Eye,
} from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Menu, MenuTrigger, MenuContent, MenuItem, MenuSeparator, MenuLabel } from '@/components/ui/menu'
import { useLangStore } from '@/store/lang'
import { useThemeStore } from '@/store/theme'
import { useAuthStore } from '@/store/auth'
import { DASHBOARD_ALERTS } from '@/data/mock-data'
import { cn } from '@/lib/utils'

const LANGS = [
  { code: 'uz', label: "O'zbekcha" },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
] as const

export function TopBar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang, setLang } = useLangStore()
  const { theme, toggle } = useThemeStore()
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)
  const [search, setSearch] = useState('')
  const unread = 6

  const USER = { name: user?.name ?? 'Dr. Muhrim Devonov', roleKey: 'doctor' as const }

  function handleLogout() {
    logout()
    navigate({ to: '/login' })
  }

  return (
    <header className="sticky top-0 z-20 h-[72px] flex items-center gap-3 px-4 sm:px-6 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-secondary)]">
      {/* Left: search */}
      <div className="relative flex-1 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-quaternary)] pointer-events-none" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Bemor, ICD-10, alert, reja, MDT qaydini qidiring..."
          className="w-full h-10 pl-9 pr-3 rounded-lg bg-[var(--bg-secondary)] border border-transparent text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] outline-none transition-colors focus:bg-[var(--bg-primary)] focus:border-[var(--fg-brand-primary)] focus:[box-shadow:0_0_0_3px_rgba(41,112,255,0.12)]"
        />
      </div>

      {/* Center: income badge */}
      <div className="hidden md:flex items-center gap-1.5 h-8 px-3 rounded-full bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[12px] font-semibold shrink-0">
        <Eye size={13} />
        <span>4.5M so'm</span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
        {/* Role badge */}
        <span className="hidden md:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full bg-[var(--bg-brand-primary)] text-[var(--text-brand-secondary)] border border-[var(--blue-200)] text-[12px] font-semibold">
          <span className="size-1.5 rounded-full bg-[var(--fg-brand-primary)]" />
          {t('roles.doctor')}
        </span>

        {/* Language */}
        <Menu>
          <MenuTrigger className="inline-flex items-center gap-1 h-9 px-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] cursor-pointer outline-none transition-colors">
            <Globe size={18} />
            <span className="text-[13px] font-semibold uppercase">{lang}</span>
            <ChevronDown size={13} className="text-[var(--fg-quaternary)]" />
          </MenuTrigger>
          <MenuContent>
            <MenuLabel>{t('common.all')}</MenuLabel>
            {LANGS.map(l => (
              <MenuItem key={l.code} onClick={() => setLang(l.code)}>
                <span className="w-6 text-[12px] font-bold uppercase text-[var(--text-quaternary)]">{l.code}</span>
                <span className="flex-1">{l.label}</span>
                {lang === l.code && <Check size={15} className="text-[var(--fg-brand-primary)]" />}
              </MenuItem>
            ))}
          </MenuContent>
        </Menu>

        {/* Theme */}
        <button
          onClick={toggle}
          aria-label="Theme"
          className="size-9 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <Menu>
          <MenuTrigger className="relative size-9 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] cursor-pointer outline-none transition-colors">
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[var(--fg-error-primary)] ring-2 ring-[var(--bg-primary)]" />
            )}
          </MenuTrigger>
          <MenuContent className="min-w-[320px] p-0">
            <div className="px-3.5 py-3 border-b border-[var(--border-secondary)] flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[var(--text-primary)]">{t('header.notifications')}</span>
              <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-[var(--bg-brand-primary)] text-[var(--text-brand-secondary)]">{unread}</span>
            </div>
            <div className="max-h-[320px] overflow-y-auto py-1">
              {DASHBOARD_ALERTS.map(a => (
                <div key={a.id} className="flex items-start gap-2.5 px-3.5 py-2.5 hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors">
                  <span className={cn(
                    'mt-1 size-2 rounded-full shrink-0',
                    a.type === 'high' ? 'bg-[var(--fg-error-primary)]' : a.type === 'medium' ? 'bg-[var(--fg-warning-primary)]' : 'bg-[var(--fg-brand-primary)]',
                  )} />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">{a.title}</p>
                    <p className="text-[12px] text-[var(--text-tertiary)] line-clamp-2">{a.message}</p>
                    <p className="text-[11px] text-[var(--text-quaternary)] mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </MenuContent>
        </Menu>

        {/* User menu */}
        <Menu>
          <MenuTrigger className="inline-flex items-center gap-2 h-10 pl-1.5 pr-2 rounded-lg hover:bg-[var(--bg-secondary)] cursor-pointer outline-none transition-colors">
            <Avatar name={USER.name} size="sm" />
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-[13px] font-semibold text-[var(--text-primary)] max-w-[140px] truncate">{USER.name}</p>
              <p className="text-[11px] text-[var(--text-quaternary)] max-w-[140px] truncate">{t(`roles.${USER.roleKey}`)}</p>
            </div>
            <ChevronDown size={14} className="text-[var(--fg-quaternary)] shrink-0" />
          </MenuTrigger>
          <MenuContent>
            <div className="flex items-center gap-3 px-2.5 py-2.5 mb-1">
              <Avatar name={USER.name} size="md" />
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-[var(--text-primary)] truncate">{USER.name}</p>
                <p className="text-[12px] text-[var(--text-tertiary)] truncate">{t(`roles.${USER.roleKey}`)}</p>
              </div>
            </div>
            <MenuSeparator />
            <MenuItem><UserRound size={16} className="text-[var(--fg-quaternary)]" />{t('header.viewProfile')}</MenuItem>
            <MenuItem><Settings size={16} className="text-[var(--fg-quaternary)]" />{t('header.settings')}</MenuItem>
            <MenuSeparator />
            <MenuItem danger onClick={handleLogout}><LogOut size={16} />{t('header.logout')}</MenuItem>
          </MenuContent>
        </Menu>
      </div>
    </header>
  )
}
