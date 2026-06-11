import { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { NurseSidebar } from './nurse-sidebar'
import { ThemeCustomizer } from '@/components/theme-customizer'

export function NurseLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <NurseSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="lg:ml-[260px] flex flex-col min-h-screen">
        <div className="lg:hidden flex items-center h-16 px-4 bg-[var(--bg-primary)] border-b border-[var(--border-secondary)]">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
          >
            <Menu size={20} />
          </button>
        </div>

        <main className="flex-1">
          <div className="p-4 sm:p-6 w-full">
            <Outlet />
          </div>
        </main>
      </div>

      <ThemeCustomizer showLayout={false} />
    </div>
  )
}
