import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { ChevronDown, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// ICD-10 record shape
// ---------------------------------------------------------------------------
export interface ICD10Code {
  code: string
  description: string
}

// ---------------------------------------------------------------------------
// Bundled fallback data (common rehab codes)
// ---------------------------------------------------------------------------
export const COMMON_REHAB_CODES: ICD10Code[] = [
  { code: 'M54.5',  description: "Orqa-miya og'rig'i (past bel)" },
  { code: 'M54.4',  description: 'Lumbago ishias bilan' },
  { code: 'M47.8',  description: 'Spondiloz, boshqa' },
  { code: 'M51.1',  description: 'Disk deformatsiyasi radiculopatiya bilan' },
  { code: 'G54.4',  description: 'Lumbosakral ildiz shikastlanishi' },
  { code: 'M79.3',  description: 'Periartrit (panniculitis)' },
  { code: 'M62.5',  description: 'Mushaklarning atrofiyasi va dystrofiyasi' },
  { code: 'S14.1',  description: "Bo'yin umurtqasi shikastlanishi" },
  { code: 'S24.1',  description: "Ko'krak umurtqasi shikastlanishi" },
  { code: 'S34.1',  description: 'Bel umurtqasi shikastlanishi' },
  { code: 'G35',    description: "Ko'p skleroz" },
  { code: 'G81.9',  description: 'Gemiplegiya, aniqlanmagan' },
  { code: 'G82.2',  description: 'Paraplegiya' },
  { code: 'I63.9',  description: 'Insult (infarkt), aniqlanmagan' },
  { code: 'T14.9',  description: 'Travma, aniqlanmagan' },
  { code: 'M16.1',  description: 'Unilateral birlamchi koksartroz' },
  { code: 'M17.1',  description: 'Birlamchi gonartroz, bir tomonlama' },
  { code: 'M19.9',  description: 'Artroz, aniqlanmagan' },
  { code: 'M75.1',  description: 'Rotator manjet sindromi' },
  { code: 'M65.3',  description: 'Barmoqning tetik sindrom' },
  { code: 'G57.0',  description: 'Ishias nervi shikastlanishi' },
  { code: 'G56.0',  description: 'Karpal tunnel sindromi' },
  { code: 'F32.9',  description: 'Depressiya, aniqlanmagan' },
  { code: 'F41.1',  description: 'Generalizatsiya anxiety buzilishi' },
  { code: 'Z96.6',  description: "Ortopedik bo'g'in implantlari mavjudligi" },
]

// ---------------------------------------------------------------------------
// Service shim — dynamic import so the real service is used when available
// ---------------------------------------------------------------------------
let _serviceSearch: ((q: string) => Promise<ICD10Code[]>) | null = null

async function resolveService(): Promise<(q: string) => Promise<ICD10Code[]>> {
  if (_serviceSearch) return _serviceSearch
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod = await import('@/services/icd10.service' as any)
    if (typeof mod.searchICD10 === 'function') {
      _serviceSearch = mod.searchICD10 as (q: string) => Promise<ICD10Code[]>
      return _serviceSearch
    }
  } catch {
    // service not present — fall through to local search
  }
  const local = (q: string): Promise<ICD10Code[]> => {
    const term = q.trim().toLowerCase()
    if (!term) return Promise.resolve(COMMON_REHAB_CODES.slice(0, 8))
    const results = COMMON_REHAB_CODES.filter(
      c =>
        c.code.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term),
    )
    return Promise.resolve(results)
  }
  _serviceSearch = local
  return local
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface ICD10SearchProps {
  selected: string[]
  onChange: (codes: string[]) => void
  placeholder?: string
  className?: string
}

const MAX_SELECTED = 10

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ICD10Search({
  selected,
  onChange,
  placeholder = "ICD-10 kodi yoki tavsif bo'yicha qidirish…",
  className,
}: ICD10SearchProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ICD10Code[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isSearching, setIsSearching] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ------------------------------------------------------------------
  // Build a lookup map for descriptions so chips can show them
  // ------------------------------------------------------------------
  const descriptionMap = useRef<Map<string, string>>(new Map())

  // Populate the map from results whenever they arrive
  useEffect(() => {
    results.forEach(r => descriptionMap.current.set(r.code, r.description))
  }, [results])

  // Also seed from the bundled list on mount
  useEffect(() => {
    COMMON_REHAB_CODES.forEach(r =>
      descriptionMap.current.set(r.code, r.description),
    )
  }, [])

  // ------------------------------------------------------------------
  // Search with 300ms debounce
  // ------------------------------------------------------------------
  const doSearch = useCallback(async (q: string) => {
    setIsSearching(true)
    try {
      const fn = await resolveService()
      const data = await fn(q)
      setResults(data)
      setActiveIndex(-1)
    } catch (err) {
      console.error('ICD-10 search error', err)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!isOpen) return
    debounceRef.current = setTimeout(() => doSearch(query), 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, isOpen, doSearch])

  // ------------------------------------------------------------------
  // Input handlers
  // ------------------------------------------------------------------
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    if (!isOpen) setIsOpen(true)
  }

  function handleInputFocus() {
    setIsOpen(true)
    if (results.length === 0) doSearch(query)
  }

  // ------------------------------------------------------------------
  // Select / deselect
  // ------------------------------------------------------------------
  function toggleCode(code: string) {
    if (selected.includes(code)) {
      onChange(selected.filter(c => c !== code))
    } else {
      if (selected.length >= MAX_SELECTED) return
      onChange([...selected, code])
    }
  }

  function removeCode(code: string) {
    onChange(selected.filter(c => c !== code))
  }

  // ------------------------------------------------------------------
  // Keyboard navigation
  // ------------------------------------------------------------------
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true)
        doSearch(query)
        return
      }
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(i => Math.min(i + 1, results.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(i => Math.max(i - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && results[activeIndex]) {
          toggleCode(results[activeIndex].code)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setActiveIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return
    const item = listRef.current.children[activeIndex] as HTMLElement | undefined
    item?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  // ------------------------------------------------------------------
  // Close on outside click
  // ------------------------------------------------------------------
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  // Exclude already-selected codes from dropdown results
  const visibleResults = results.filter(r => !selected.includes(r.code))

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <div ref={containerRef} className={cn('relative flex flex-col gap-2', className)}>
      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map(code => (
            <span
              key={code}
              className="inline-flex items-center gap-1 bg-[var(--bg-brand-primary)] text-[var(--text-brand-secondary)] border border-[var(--border-brand)] rounded-full px-2.5 py-0.5 text-xs font-semibold"
            >
              <span>{code}</span>
              {descriptionMap.current.get(code) && (
                <span className="opacity-75 font-normal max-w-[160px] truncate">
                  {descriptionMap.current.get(code)}
                </span>
              )}
              <button
                type="button"
                onClick={() => removeCode(code)}
                aria-label={`${code} ni olib tashlash`}
                className="ml-0.5 rounded-full hover:opacity-70 transition-opacity"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-[var(--text-tertiary)] pointer-events-none" />
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          autoComplete="off"
          disabled={selected.length >= MAX_SELECTED}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={
            selected.length >= MAX_SELECTED
              ? 'Maksimal 10 ta kod tanlandi'
              : placeholder
          }
          className={cn(
            'w-full pl-8 pr-8 py-2 text-sm rounded-lg border',
            'bg-[var(--bg-primary)] text-[var(--text-primary)]',
            'border-[var(--border-secondary)]',
            'placeholder:text-[var(--text-tertiary)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--fg-brand-primary)] focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        />
        <ChevronDown
          className={cn(
            'absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-[var(--text-tertiary)] pointer-events-none transition-transform',
            isOpen && 'rotate-180',
          )}
        />
      </div>

      {/* Results dropdown */}
      {isOpen && (
        <div className="absolute z-50 top-full mt-1 w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-lg shadow-lg overflow-hidden">
          {isSearching ? (
            <div className="py-6 flex items-center justify-center gap-2 text-sm text-[var(--text-tertiary)]">
              <svg
                className="size-4 animate-spin text-[var(--fg-brand-primary)]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Qidirilmoqda…
            </div>
          ) : visibleResults.length === 0 ? (
            <div className="py-6 text-center text-sm text-[var(--text-tertiary)]">
              Kod topilmadi
            </div>
          ) : (
            <ul
              ref={listRef}
              role="listbox"
              aria-multiselectable="true"
              className="max-h-60 overflow-y-auto py-1"
            >
              {visibleResults.map((item, idx) => (
                <li
                  key={item.code}
                  role="option"
                  aria-selected={selected.includes(item.code)}
                  onClick={() => {
                    toggleCode(item.code)
                    setQuery('')
                    inputRef.current?.focus()
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={cn(
                    'flex items-baseline gap-2 px-3 py-2 cursor-pointer text-sm transition-colors select-none',
                    idx === activeIndex
                      ? 'bg-[var(--bg-brand-primary)] text-[var(--text-primary)]'
                      : 'hover:bg-[var(--bg-secondary)]',
                  )}
                >
                  <span className="font-semibold text-[var(--fg-brand-primary)] shrink-0 font-mono text-xs">
                    {item.code}
                  </span>
                  <span className="text-[var(--text-secondary)] leading-snug">
                    {item.description}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default ICD10Search
