import { useState } from 'react'
import { Search, Dumbbell, Clock, Activity, ChevronRight, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import { Markdown } from '@/components/ui/markdown'
import { EXERCISE_PROTOCOLS, type ExerciseProtocol } from '@/data/exercise-protocols'
import { cn } from '@/lib/utils'

const LEVEL_STYLE: Record<ExerciseProtocol['level'], string> = {
  "Boshlang'ich": 'bg-[var(--bg-success-primary)] text-[var(--text-success-primary)]',
  "O'rta":        'bg-[var(--bg-warning-primary)] text-[var(--text-warning-primary)]',
  'Yuqori':       'bg-[var(--bg-error-primary)] text-[var(--text-error-primary)]',
}

export function ExercisesPage() {
  const [selectedId, setSelectedId] = useState(EXERCISE_PROTOCOLS[0].id)
  const [search, setSearch] = useState('')

  const filtered = EXERCISE_PROTOCOLS.filter(p => {
    const q = search.toLowerCase()
    return !q || p.title.toLowerCase().includes(q) || p.bodyPart.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  })

  const selected = EXERCISE_PROTOCOLS.find(p => p.id === selectedId) ?? EXERCISE_PROTOCOLS[0]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mashqlar protokollari"
        subtitle="Reabilitatsiya mashqlari va davolash protokollari kutubxonasi"
        crumbs={[{ label: 'Mashqlar' }]}
        actions={
          <Button size="sm">
            <Plus size={15} />
            Yangi protokol
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Protocol list */}
        <div className="lg:col-span-1 space-y-3">
          <Input
            uiSize="sm"
            leftIcon={<Search />}
            placeholder="Protokol qidirish..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="space-y-2">
            {filtered.map(p => {
              const active = p.id === selectedId
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={cn(
                    'w-full text-left rounded-xl border p-3.5 transition-all cursor-pointer group',
                    active
                      ? 'border-[var(--border-brand)] bg-[var(--bg-brand-primary)] ring-1 ring-[var(--blue-200)]'
                      : 'border-[var(--border-secondary)] bg-[var(--bg-primary)] hover:border-[var(--border-primary)]',
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'size-9 rounded-lg flex items-center justify-center shrink-0',
                      active ? 'bg-[var(--fg-brand-primary)]' : 'bg-[var(--bg-tertiary)]',
                    )}>
                      <Dumbbell size={17} className={active ? 'text-white' : 'text-[var(--fg-quaternary)]'} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn('text-[14px] font-semibold leading-tight', active ? 'text-[var(--text-brand-secondary)]' : 'text-[var(--text-primary)]')}>
                        {p.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[11px] text-[var(--text-tertiary)] bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded">{p.bodyPart}</span>
                        <span className={cn('text-[11px] font-medium px-1.5 py-0.5 rounded', LEVEL_STYLE[p.level])}>{p.level}</span>
                      </div>
                    </div>
                    <ChevronRight size={15} className={cn('shrink-0 mt-1 transition-transform', active ? 'text-[var(--fg-brand-primary)]' : 'text-[var(--fg-quaternary)] group-hover:translate-x-0.5')} />
                  </div>
                </button>
              )
            })}
            {filtered.length === 0 && (
              <p className="text-center py-10 text-[var(--text-quaternary)] text-sm">Protokol topilmadi</p>
            )}
          </div>
        </div>

        {/* Markdown document */}
        <div className="lg:col-span-2">
          <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)] overflow-hidden">
            {/* Doc header */}
            <div className="px-6 py-4 border-b border-[var(--border-secondary)] bg-[var(--bg-secondary-subtle)]">
              <div className="flex items-center gap-2 flex-wrap text-[12px] text-[var(--text-tertiary)] mb-1">
                <span className="font-semibold text-[var(--text-brand-primary)]">{selected.category}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Activity size={12} />{selected.bodyPart}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock size={12} />{selected.duration}</span>
                <span>·</span>
                <span className={cn('font-medium px-1.5 py-0.5 rounded', LEVEL_STYLE[selected.level])}>{selected.level}</span>
              </div>
              <p className="text-[12px] text-[var(--text-quaternary)]">Oxirgi yangilanish: {selected.updatedAt}</p>
            </div>

            {/* Rendered markdown */}
            <div className="px-6 py-5">
              <Markdown content={selected.markdown} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
