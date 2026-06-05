import { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Menu } from 'lucide-react'
import { Sidebar } from './sidebar'
import { TopBar } from './top-bar'

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

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
        className={[
          'fixed top-0 left-0 bottom-0 z-40 transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <Sidebar onClose={() => setMobileOpen(false)} />
      </div>

      {/* Main area */}
      <div className="flex-1 lg:ml-[260px] min-h-screen flex flex-col min-w-0">
        {/* Mobile menu button bar (sits above TopBar on small screens) */}
        <div className="lg:hidden flex items-center h-12 px-4 bg-[var(--bg-primary)] border-b border-[var(--border-secondary)]">
          <button
            onClick={() => setMobileOpen(true)}
            className="size-9 -ml-2 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors"
          >
            <Menu size={20} />
          </button>
          <span className="text-[15px] font-semibold text-[var(--text-primary)] ml-1">MyRehab</span>
        </div>

        <TopBar />

        <main className="flex-1">
          <div className="px-4 py-6 sm:px-6 lg:px-8 w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
