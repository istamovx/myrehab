import { useState } from 'react'
import { Settings2, X, Sun, Moon, Check, RotateCcw, ChevronUp } from 'lucide-react'
import { useThemeStore, ACCENTS, type Accent, type LayoutMode } from '@/store/theme'
import { cn } from '@/lib/utils'

const ACCENT_ORDER: Accent[] = ['blue', 'violet', 'emerald', 'orange']

const LAYOUTS: { key: LayoutMode; label: string }[] = [
  { key: 'default', label: 'Standart' },
  { key: 'mini',    label: 'Ixcham' },
  { key: 'hover',   label: 'Hover' },
  { key: 'hidden',  label: 'Yashirin' },
]

/** Collapsible section card mimicking the reference customizer layout. */
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-xl border border-[var(--border-secondary)] overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[var(--bg-secondary-subtle)] cursor-pointer transition-colors hover:bg-[var(--bg-secondary)]"
      >
        <span className="text-[13.5px] font-semibold text-[var(--text-secondary)]">{title}</span>
        <ChevronUp size={16} className={cn('text-[var(--fg-quaternary)] transition-transform', !open && 'rotate-180')} />
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  )
}

/** Mini browser-window mockup illustrating a sidebar layout mode. */
function LayoutMockup({ mode }: { mode: LayoutMode }) {
  return (
    <div className="rounded-md border-2 border-[var(--text-primary)] overflow-hidden bg-[var(--bg-primary)] aspect-[4/3]">
      {/* title bar */}
      <div className="h-2.5 bg-[var(--text-primary)] flex items-center gap-0.5 px-1">
        <span className="size-[3px] rounded-full bg-white/60" />
        <span className="size-[3px] rounded-full bg-white/60" />
        <span className="size-[3px] rounded-full bg-white/60" />
      </div>
      <div className="flex h-[calc(100%-0.625rem)]">
        {mode === 'default' && <div className="w-1/3 bg-[var(--text-primary)]" />}
        {mode === 'mini' && <div className="w-[15%] bg-[var(--text-primary)]" />}
        {mode === 'hover' && <div className="w-[15%] border-r-2 border-dashed border-[var(--text-primary)]" />}
        {/* hidden + content */}
        <div className="flex-1 bg-[var(--bg-secondary)]" />
      </div>
    </div>
  )
}

interface ThemeCustomizerProps {
  /** Show the sidebar-layout section (only meaningful in the main app shell). */
  showLayout?: boolean
}

export function ThemeCustomizer({ showLayout = true }: ThemeCustomizerProps) {
  const [open, setOpen] = useState(false)
  const theme = useThemeStore(s => s.theme)
  const accent = useThemeStore(s => s.accent)
  const layout = useThemeStore(s => s.layout)
  const setTheme = useThemeStore(s => s.setTheme)
  const setAccent = useThemeStore(s => s.setAccent)
  const setLayout = useThemeStore(s => s.setLayout)
  const reset = useThemeStore(s => s.reset)

  return (
    <>
      {/* Floating launcher — right edge, vertically centered */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Mavzu sozlamalari"
        title="Mavzu sozlamalari"
        className="group fixed right-4 top-1/2 -translate-y-1/2 z-40 size-12 rounded-xl bg-[var(--bg-brand-solid)] text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
      >
        <Settings2 size={22} className="transition-transform duration-500 group-hover:rotate-90" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-50 animate-[fadeIn_0.15s_ease-out]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Right drawer */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-[380px] max-w-[90vw] bg-[var(--bg-primary)] shadow-[-12px_0_40px_rgba(0,0,0,0.18)] flex flex-col transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Gradient header (adapts to active accent) */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0 text-white"
          style={{ background: 'linear-gradient(135deg, var(--fg-brand-primary), var(--text-brand-secondary))' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Settings2 size={18} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold leading-tight">Mavzu sozlamalari</h3>
              <p className="text-[12px] text-white/80">Ko'rinishni sozlang</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Yopish"
            className="size-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Color Mode */}
          <Section title="Rang rejimi">
            <div className="grid grid-cols-2 gap-2.5">
              {([
                { key: 'light', label: 'Yorug\'', icon: Sun },
                { key: 'dark',  label: 'Qorong\'i', icon: Moon },
              ] as const).map(({ key, label, icon: Icon }) => {
                const active = theme === key
                return (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={cn(
                      'relative flex items-center justify-center gap-2 h-12 rounded-xl border-2 cursor-pointer transition-all text-[13.5px] font-semibold',
                      active
                        ? 'border-[var(--fg-brand-primary)] text-[var(--text-primary)]'
                        : 'border-[var(--border-secondary)] text-[var(--text-tertiary)] hover:border-[var(--border-primary)]',
                    )}
                  >
                    <Icon size={16} />
                    {label}
                    {active && (
                      <span className="absolute top-1.5 right-1.5 size-4 rounded-full bg-[var(--fg-brand-primary)] flex items-center justify-center">
                        <Check size={10} className="text-white" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </Section>

          {/* Layout */}
          {showLayout && (
            <Section title="Tartib">
              <div className="grid grid-cols-2 gap-3">
                {LAYOUTS.map(({ key, label }) => {
                  const active = layout === key
                  return (
                    <button
                      key={key}
                      onClick={() => setLayout(key)}
                      className="group/lay text-left cursor-pointer"
                    >
                      <div className={cn(
                        'relative rounded-lg p-1.5 border-2 transition-all',
                        active ? 'border-[var(--fg-brand-primary)]' : 'border-transparent group-hover/lay:border-[var(--border-primary)]',
                      )}>
                        <LayoutMockup mode={key} />
                        {active && (
                          <span className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-[var(--fg-brand-primary)] flex items-center justify-center ring-2 ring-[var(--bg-primary)]">
                            <Check size={11} className="text-white" strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <p className={cn('text-[12px] font-medium text-center mt-1.5', active ? 'text-[var(--text-secondary)]' : 'text-[var(--text-quaternary)]')}>
                        {label}
                      </p>
                    </button>
                  )
                })}
              </div>
            </Section>
          )}

          {/* Theme Colors */}
          <Section title="Asosiy rang">
            <div className="flex items-center gap-3 flex-wrap">
              {ACCENT_ORDER.map(key => {
                const a = ACCENTS[key]
                const active = accent === key
                return (
                  <button
                    key={key}
                    onClick={() => setAccent(key)}
                    title={a.label}
                    className={cn(
                      'relative size-10 rounded-full cursor-pointer transition-all flex items-center justify-center',
                      active ? 'ring-2 ring-offset-2 ring-offset-[var(--bg-primary)]' : 'hover:scale-110',
                    )}
                    style={{ backgroundColor: a.swatch, ...(active ? { ['--tw-ring-color' as string]: a.swatch } : {}) }}
                  >
                    {active && <Check size={18} className="text-white" strokeWidth={3} />}
                  </button>
                )
              })}
            </div>
            <p className="text-[12px] text-[var(--text-tertiary)] mt-3">
              Tanlangan: <span className="font-semibold text-[var(--text-secondary)]">{ACCENTS[accent].label}</span>
            </p>
          </Section>
        </div>

        {/* Footer — reset */}
        <div className="shrink-0 border-t border-[var(--border-secondary)] p-4">
          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[13.5px] font-semibold text-[var(--text-secondary)] cursor-pointer transition-colors"
          >
            <RotateCcw size={15} />
            Tozalash
          </button>
        </div>
      </div>
    </>
  )
}
