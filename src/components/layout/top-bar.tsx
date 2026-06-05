import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@tanstack/react-router'
import {
  Search, Sun, Moon, Bell, LogOut, Settings, UserRound, ChevronDown, Menu,
} from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Menu as DropMenu, MenuTrigger, MenuContent, MenuItem, MenuSeparator } from '@/components/ui/menu'
import { useThemeStore } from '@/store/theme'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'

interface TopBarProps {
  onMobileMenu?: () => void
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Platforma egasi',
  doctor:      'Shifokor',
  patient:     'Bemor',
}

export function TopBar({ onMobileMenu }: TopBarProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { theme, toggle } = useThemeStore()
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)
  const [search, setSearch] = useState('')

  const roleLabel = ROLE_LABELS[user?.role ?? 'doctor'] ?? 'Shifokor'
  const displayEmail = user?.email ?? `${user?.username ?? ''}@myrehab.uz`

  function handleLogout() {
    logout()
    navigate({ to: '/login' })
  }

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center gap-2 px-4 sm:px-6 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-secondary)]">
      {/* Mobile: hamburger */}
      {onMobileMenu && (
        <button
          onClick={onMobileMenu}
          className="lg:hidden size-9 -ml-1 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors shrink-0"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Search */}
      <div className="relative flex-1 max-w-xs sm:max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-quaternary)] pointer-events-none" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Izlash..."
          className="w-full h-9 pl-9 pr-3 rounded-lg bg-[var(--bg-secondary)] border border-transparent text-[13.5px] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] outline-none transition-colors focus:bg-[var(--bg-primary)] focus:border-[var(--fg-brand-primary)] focus:[box-shadow:var(--focus-ring)]"
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1.5 ml-auto">
        {/* Role badge */}
        <span className="hidden sm:inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-[var(--bg-brand-primary)] text-[var(--text-brand-secondary)] border border-[var(--border-brand)] text-[11.5px] font-semibold shrink-0">
          <span className="size-1.5 rounded-full bg-[var(--fg-brand-primary)]" />
          {roleLabel}
        </span>

        {/* Theme */}
        <button
          onClick={toggle}
          aria-label="Mavzu"
          className="size-9 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notifications */}
        <button
          aria-label="Bildirishnomalar"
          className="relative size-9 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors"
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 ring-2 ring-[var(--bg-primary)]" />
        </button>

        {/* Avatar + dropdown */}
        <DropMenu>
          <MenuTrigger className="inline-flex items-center gap-2 h-9 pl-1 pr-2 rounded-lg hover:bg-[var(--bg-secondary)] cursor-pointer outline-none transition-colors">
            <Avatar name={user?.name ?? ''} size="sm" />
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-[12.5px] font-semibold text-[var(--text-primary)] max-w-[120px] truncate">{user?.name ?? ''}</p>
              <p className="text-[10.5px] text-[var(--text-quaternary)] max-w-[120px] truncate">{displayEmail}</p>
            </div>
            <ChevronDown size={13} className={cn('text-[var(--fg-quaternary)] shrink-0', 'hidden sm:block')} />
          </MenuTrigger>
          <MenuContent>
            <div className="flex items-center gap-3 px-2.5 py-2.5 mb-1">
              <Avatar name={user?.name ?? ''} size="md" />
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold text-[var(--text-primary)] truncate">{user?.name ?? ''}</p>
                <p className="text-[11.5px] text-[var(--text-tertiary)] truncate">{displayEmail}</p>
              </div>
            </div>
            <MenuSeparator />
            <MenuItem><UserRound size={15} className="text-[var(--fg-quaternary)]" />{t('header.viewProfile')}</MenuItem>
            <MenuItem><Settings size={15} className="text-[var(--fg-quaternary)]" />{t('header.settings')}</MenuItem>
            <MenuSeparator />
            <MenuItem danger onClick={handleLogout}><LogOut size={15} />{t('header.logout')}</MenuItem>
          </MenuContent>
        </DropMenu>
      </div>
    </header>
  )
}
