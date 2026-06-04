import { useState, type ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { Menu } from 'lucide-react'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — always visible on lg+, drawer on mobile */}
      <div
        className={[
          'fixed top-0 left-0 bottom-0 z-30 transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <Sidebar onClose={() => setMobileOpen(false)} />
      </div>

      {/* Main area */}
      <div className="flex-1 lg:ml-[280px] min-h-screen flex flex-col">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-10 flex items-center gap-3 h-14 px-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setMobileOpen(true)}
            className="size-9 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <Menu size={20} />
          </button>
          <span className="text-base font-semibold text-gray-900">MyRehab</span>
        </header>

        <main className="flex-1 bg-bg-page">
          <div className="px-4 py-4 sm:px-6 sm:py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
