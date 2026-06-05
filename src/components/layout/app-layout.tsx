import { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './sidebar'
import { TopBar } from './top-bar'
import { ThemeCustomizer } from '@/components/theme-customizer'
import { useThemeStore } from '@/store/theme'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const layout = useThemeStore(s => s.layout)
  const setLayout = useThemeStore(s => s.setLayout)

  const hidden = layout === 'hidden'
  // In "hover" mode the sidebar sits collapsed and expands only while hovered.
  const collapsed = layout === 'mini' || (layout === 'hover' && !hovered)

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
      {!hidden && (
        <div
          onMouseEnter={() => layout === 'hover' && setHovered(true)}
          onMouseLeave={() => layout === 'hover' && setHovered(false)}
          className={cn(
            'fixed top-0 left-0 bottom-0 z-40 transition-transform duration-200',
            mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
            layout === 'hover' && 'lg:shadow-[8px_0_32px_rgba(0,0,0,0.12)]',
          )}
        >
          <Sidebar
            onClose={() => setMobileOpen(false)}
            collapsed={collapsed}
            onToggle={() => setLayout(collapsed ? 'default' : 'mini')}
          />
        </div>
      )}

      {/* Main area */}
      <div
        className={cn(
          'flex-1 min-h-screen flex flex-col min-w-0 transition-all duration-200',
          hidden ? 'lg:ml-0' : (layout === 'mini' || layout === 'hover') ? 'lg:ml-16' : 'lg:ml-[260px]',
        )}
      >
        <TopBar onMobileMenu={() => setMobileOpen(true)} />

        <main className="flex-1">
          <div className="p-4 sm:p-6 w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating theme customizer */}
      <ThemeCustomizer />
    </div>
  )
}
