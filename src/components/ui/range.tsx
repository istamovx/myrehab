import { cn } from '@/lib/utils'

interface RangeProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
  /** Optional color override for the filled track + thumb (defaults to brand accent). */
  color?: string
}

/**
 * Modern range slider: filled track + accent thumb, fully theme-aware.
 * Uses a CSS gradient on the track to show progress.
 */
export function Range({ value, onChange, min = 0, max = 100, step = 1, className, color = 'var(--fg-brand-primary)' }: RangeProps) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className={cn('myrehab-range w-full', className)}
      style={{
        background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, var(--bg-tertiary) ${pct}%, var(--bg-tertiary) 100%)`,
        // expose thumb color to the stylesheet
        ['--range-thumb' as string]: color,
      }}
    />
  )
}
