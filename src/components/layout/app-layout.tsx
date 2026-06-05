import { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './sidebar'
import { TopBar } from './top-bar'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [collapsed,  setCollapsed]    = useState(false)

  return (
    <div className="flex min-h-screen bg-[var(--bg-page)]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — fixed on lg+, drawer on mobile */}
      <div
        className={cn(
          'fixed top-0 left-0 bottom-0 z-40 transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <Sidebar
          onClose={() => setMobileOpen(false)}
          collapsed={collapsed}
          onToggle={() => setCollapsed(v => !v)}
        />
      </div>

      {/* Main area */}
      <div
        className={cn(
          'flex-1 min-h-screen flex flex-col min-w-0 transition-all duration-200',
          collapsed ? 'lg:ml-16' : 'lg:ml-[260px]',
        )}
      >
        <TopBar onMobileMenu={() => setMobileOpen(true)} />

        <main className="flex-1">
          <div className="p-4 sm:p-6 w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
