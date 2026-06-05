import { Palette, Sun, Moon, Check, Sparkles } from 'lucide-react'
import { useThemeStore, ACCENTS, type Accent } from '@/store/theme'
import { cn } from '@/lib/utils'

const ACCENT_ORDER: Accent[] = ['blue', 'violet', 'emerald', 'orange']

export function ThemeConstructor() {
  const theme = useThemeStore(s => s.theme)
  const accent = useThemeStore(s => s.accent)
  const setTheme = useThemeStore(s => s.setTheme)
  const setAccent = useThemeStore(s => s.setAccent)

  return (
    <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--border-secondary)] flex items-center gap-2.5">
        <div className="size-9 rounded-xl bg-[var(--bg-brand-primary)] flex items-center justify-center shrink-0">
          <Palette size={18} className="text-[var(--fg-brand-primary)]" />
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-[var(--text-primary)] leading-tight">Mavzu sozlamalari</h3>
          <p className="text-[12px] text-[var(--text-quaternary)]">Ko'rinish va rangni tanlang</p>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Appearance */}
        <div>
          <p className="text-[13px] font-semibold text-[var(--text-secondary)] mb-2.5">Ko'rinish</p>
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
                    'relative rounded-xl border-2 p-3 cursor-pointer transition-all text-left overflow-hidden',
                    active ? 'border-[var(--fg-brand-primary)]' : 'border-[var(--border-secondary)] hover:border-[var(--border-primary)]',
                  )}
                >
                  {/* Mini preview */}
                  <div className={cn('rounded-lg p-2 mb-2 flex items-center gap-1.5', key === 'dark' ? 'bg-[#0b1220]' : 'bg-[#F2F4F7]')}>
                    <span className="size-2 rounded-full bg-[var(--fg-brand-primary)]" />
                    <span className={cn('h-1.5 rounded-full flex-1', key === 'dark' ? 'bg-white/20' : 'bg-black/10')} />
                  </div>
                  <span className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--text-secondary)]">
                      <Icon size={14} />
                      {label}
                    </span>
                    {active && (
                      <span className="size-4 rounded-full bg-[var(--fg-brand-primary)] flex items-center justify-center">
                        <Check size={10} className="text-white" strokeWidth={3} />
                      </span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Accent color */}
        <div>
          <p className="text-[13px] font-semibold text-[var(--text-secondary)] mb-2.5">Asosiy rang</p>
          <div className="grid grid-cols-4 gap-2.5">
            {ACCENT_ORDER.map(key => {
              const a = ACCENTS[key]
              const active = accent === key
              return (
                <button
                  key={key}
                  onClick={() => setAccent(key)}
                  title={a.label}
                  className={cn(
                    'group relative aspect-square rounded-xl cursor-pointer transition-all flex items-center justify-center',
                    active ? 'ring-2 ring-offset-2 ring-offset-[var(--bg-primary)]' : 'hover:scale-105',
                  )}
                  style={{ backgroundColor: a.swatch, ...(active ? { ['--tw-ring-color' as string]: a.swatch } : {}) }}
                >
                  {active && <Check size={18} className="text-white" strokeWidth={3} />}
                </button>
              )
            })}
          </div>
          <div className="flex items-center justify-between mt-2.5">
            {ACCENT_ORDER.map(key => (
              <span key={key} className={cn('text-[10.5px] font-medium text-center flex-1', accent === key ? 'text-[var(--text-secondary)]' : 'text-[var(--text-quaternary)]')}>
                {ACCENTS[key].label}
              </span>
            ))}
          </div>
        </div>

        {/* Live preview */}
        <div className="rounded-xl border border-dashed border-[var(--border-primary)] p-3.5 bg-[var(--bg-secondary-subtle)]">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-quaternary)] mb-2.5 flex items-center gap-1">
            <Sparkles size={11} />
            Jonli ko'rinish
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="px-3 py-1.5 rounded-lg bg-[var(--fg-brand-primary)] text-white text-[12px] font-semibold">
              Tugma
            </button>
            <span className="px-2.5 py-1 rounded-full bg-[var(--bg-brand-primary)] text-[var(--text-brand-primary)] text-[12px] font-semibold border border-[var(--border-brand)]">
              Yorliq
            </span>
            <span className="text-[12px] font-semibold text-[var(--text-brand-primary)] underline">Havola</span>
          </div>
        </div>
      </div>
    </div>
  )
}
