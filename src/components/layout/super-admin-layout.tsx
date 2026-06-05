import { useState } from 'react'
import { Outlet, useNavigate } from '@tanstack/react-router'
import { Menu, Glasses, X, Search, Sun, Moon, LogOut, ChevronRight, UserCheck, Bell, ChevronDown, Settings, UserRound } from 'lucide-react'
import { SuperAdminSidebar } from './super-admin-sidebar'
import { ThemeCustomizer } from '@/components/theme-customizer'
import { useThemeStore } from '@/store/theme'
import { useAuthStore } from '@/store/auth'
import { Menu as DropMenu, MenuTrigger, MenuContent, MenuItem, MenuSeparator } from '@/components/ui/menu'
import { Avatar } from '@/components/ui/avatar'
import { ORG_USERS, ORGANIZATIONS, type OrgUser } from '@/data/super-admin-mock-data'
import { cn } from '@/lib/utils'

interface ImpersonatingUser extends OrgUser {
  org_name: string
}

export function SuperAdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [glassOpen, setGlassOpen] = useState(false)
  const [glassSearch, setGlassSearch] = useState('')
  const [impersonating, setImpersonating] = useState<ImpersonatingUser | null>(null)
  const { theme, toggle } = useThemeStore()
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)
  const displayEmail = user?.email ?? `${user?.username ?? 'superadmin'}@myrehab.uz`

  function handleLogout() {
    logout()
    navigate({ to: '/login' })
  }

  const filteredUsers = ORG_USERS.filter(u =>
    u.name.toLowerCase().includes(glassSearch.toLowerCase()) ||
    u.org_name.toLowerCase().includes(glassSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(glassSearch.toLowerCase()),
  )

  const orgList = ORGANIZATIONS.filter(o => o.status === 'active')

  function startImpersonation(user: OrgUser) {
    setImpersonating(user)
    setGlassOpen(false)
    setGlassSearch('')
  }

  function stopImpersonation() {
    setImpersonating(null)
  }

  const roleLabel = (role: string) =>
    role === 'admin' ? 'Admin' : role === 'doctor' ? 'Shifokor' : 'Bemor'

  return (
    <div className="flex min-h-screen bg-[var(--bg-page)]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed top-0 left-0 bottom-0 z-40 transition-transform duration-200',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )}>
        <SuperAdminSidebar onClose={() => setMobileOpen(false)} />
      </div>

      {/* Main area */}
      <div className="flex-1 lg:ml-[260px] min-h-screen flex flex-col min-w-0">
        {/* Impersonation banner */}
        {impersonating && (
          <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2.5">
              <UserCheck size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-[13px] font-semibold text-amber-800 dark:text-amber-300">
                Siz <span className="font-bold">{impersonating.name}</span> sifatida ko'ryapsiz
              </span>
              <span className="text-[12px] text-amber-600 dark:text-amber-500">
                · {impersonating.org_name} · {roleLabel(impersonating.role)}
              </span>
            </div>
            <button
              onClick={stopImpersonation}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 transition-colors"
            >
              <X size={14} />
              Chiqish
            </button>
          </div>
        )}

        {/* TopBar */}
        <header className="sticky top-0 z-20 h-16 flex items-center gap-2 px-4 sm:px-6 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-secondary)]">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden size-9 -ml-1 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors shrink-0"
          >
            <Menu size={20} />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-xs sm:max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-quaternary)] pointer-events-none" />
            <input
              placeholder="Tashkilot, foydalanuvchi, to'lov qidiring..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-[var(--bg-secondary)] border border-transparent text-[13.5px] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] outline-none transition-colors focus:bg-[var(--bg-primary)] focus:border-[var(--fg-brand-primary)] focus:[box-shadow:var(--focus-ring)]"
            />
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            {/* Role badge */}
            <span className="hidden sm:inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-[var(--bg-brand-primary)] text-[var(--text-brand-secondary)] border border-[var(--border-brand)] text-[11.5px] font-semibold shrink-0">
              <span className="size-1.5 rounded-full bg-[var(--fg-brand-primary)]" />
              Platforma egasi
            </span>

            {/* Glass / Impersonation button */}
            <button
              onClick={() => setGlassOpen(true)}
              title="Foydalanuvchi profilini ko'rish"
              className={cn(
                'relative size-9 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors',
                impersonating && 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400',
              )}
            >
              <Glasses size={17} />
              {impersonating && (
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-amber-500 ring-2 ring-[var(--bg-primary)]" />
              )}
            </button>

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
                <Avatar name={user?.name ?? 'Bosh Administrator'} size="sm" />
                <div className="hidden sm:block text-left leading-tight">
                  <p className="text-[12.5px] font-semibold text-[var(--text-primary)] max-w-[120px] truncate">{user?.name ?? 'Bosh Administrator'}</p>
                  <p className="text-[10.5px] text-[var(--text-quaternary)] max-w-[120px] truncate">{displayEmail}</p>
                </div>
                <ChevronDown size={13} className="text-[var(--fg-quaternary)] shrink-0 hidden sm:block" />
              </MenuTrigger>
              <MenuContent>
                <div className="flex items-center gap-3 px-2.5 py-2.5 mb-1">
                  <Avatar name={user?.name ?? 'Bosh Administrator'} size="md" />
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold text-[var(--text-primary)] truncate">{user?.name ?? 'Bosh Administrator'}</p>
                    <p className="text-[11.5px] text-[var(--text-tertiary)] truncate">{displayEmail}</p>
                  </div>
                </div>
                <MenuSeparator />
                <MenuItem><UserRound size={15} className="text-[var(--fg-quaternary)]" />Profil</MenuItem>
                <MenuItem><Settings size={15} className="text-[var(--fg-quaternary)]" />Sozlamalar</MenuItem>
                <MenuSeparator />
                <MenuItem danger onClick={handleLogout}><LogOut size={15} />Chiqish</MenuItem>
              </MenuContent>
            </DropMenu>
          </div>
        </header>

        <main className="flex-1">
          <div className="p-4 sm:p-6 w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Glass / Impersonation modal */}
      {glassOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setGlassOpen(false)} />
          <div className="relative bg-[var(--bg-primary)] rounded-2xl shadow-2xl w-full max-w-lg z-10 flex flex-col max-h-[80vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-secondary)] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-[var(--bg-brand-primary)] flex items-center justify-center">
                  <Glasses size={16} className="text-[var(--fg-brand-primary)]" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[var(--text-primary)]">Ko'rish rejimi</p>
                  <p className="text-[11px] text-[var(--text-tertiary)]">Istalgan foydalanuvchi profilida ko'ring</p>
                </div>
              </div>
              <button onClick={() => setGlassOpen(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-[var(--border-secondary)] shrink-0">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-quaternary)] pointer-events-none" />
                <input
                  value={glassSearch}
                  onChange={e => setGlassSearch(e.target.value)}
                  placeholder="Ism, tashkilot yoki rol bo'yicha qidiring..."
                  autoFocus
                  className="w-full h-9 pl-9 pr-3 rounded-lg bg-[var(--bg-secondary)] border border-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--fg-brand-primary)]"
                />
              </div>
            </div>

            {/* User list */}
            <div className="overflow-y-auto flex-1 p-2">
              {glassSearch ? (
                filteredUsers.length === 0 ? (
                  <p className="text-center text-[var(--text-tertiary)] text-[13px] py-8">Foydalanuvchi topilmadi</p>
                ) : (
                  <div className="space-y-1">
                    {filteredUsers.map(user => (
                      <UserRow key={user.id} user={user} onClick={() => startImpersonation(user)} />
                    ))}
                  </div>
                )
              ) : (
                orgList.map(org => {
                  const users = ORG_USERS.filter(u => u.org_id === org.id)
                  if (users.length === 0) return null
                  return (
                    <div key={org.id} className="mb-3">
                      <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
                        <div className={cn('size-5 rounded bg-gradient-to-br text-white text-[9px] font-bold flex items-center justify-center shrink-0', org.logo_color)}>
                          {org.logo_initial}
                        </div>
                        <span className="text-[11px] font-bold text-[var(--text-quaternary)] uppercase tracking-wide">{org.name}</span>
                        <span className="text-[10px] text-[var(--text-quaternary)] ml-auto">{users.length} ta</span>
                      </div>
                      <div className="space-y-0.5 pl-2">
                        {users.map(user => (
                          <UserRow key={user.id} user={user} onClick={() => startImpersonation(user)} />
                        ))}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating theme customizer */}
      <ThemeCustomizer showLayout={false} />
    </div>
  )
}

function UserRow({ user, onClick }: { user: OrgUser; onClick: () => void }) {
  const roleColors: Record<string, string> = {
    admin:   'bg-[var(--bg-brand-primary)] text-[var(--text-brand-primary)]',
    doctor:  'bg-teal-100 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300',
    patient: 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300',
  }
  const roleLabel: Record<string, string> = { admin: 'Admin', doctor: 'Shifokor', patient: 'Bemor' }

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors group text-left"
    >
      <div className={cn('size-8 rounded-full bg-gradient-to-br text-white text-[12px] font-bold flex items-center justify-center shrink-0', user.color)}>
        {user.initial}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[var(--text-primary)] truncate">{user.name}</p>
        <p className="text-[11px] text-[var(--text-tertiary)] truncate">{user.last_active}</p>
      </div>
      <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', roleColors[user.role])}>
        {roleLabel[user.role]}
      </span>
      <ChevronRight size={14} className="text-[var(--fg-quaternary)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      <span className="hidden group-hover:flex items-center gap-1 text-[11px] font-semibold text-[var(--text-brand-primary)] shrink-0">
        <LogOut size={11} />
        Kirish
      </span>
    </button>
  )
}
