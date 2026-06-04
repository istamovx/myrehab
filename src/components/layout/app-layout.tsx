import { type ReactNode } from 'react'
import { TopNav } from './top-nav'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-page">
      <TopNav />
      <main className="pt-[var(--nav-height)]">
        <div className="max-w-[1440px] mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
