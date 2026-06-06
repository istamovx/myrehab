import { useState, useRef, useEffect } from 'react'
import { Play, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'

// Deterministic fake waveform seeded from URL string
function waveform(seed: string, bars = 40): number[] {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return Array.from({ length: bars }, (_, i) => {
    h = (h * 1664525 + 1013904223) >>> 0
    // Smooth with neighbour using index to make it feel organic
    const base = ((h >>> 0) % 70) + 20
    const wave = Math.sin((i / bars) * Math.PI * 3) * 15
    return Math.min(100, Math.max(15, base + wave))
  })
}

function fmt(secs: number) {
  const s = Math.floor(secs)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

interface Props {
  src: string
  duration?: number
  isSelf: boolean
}

export function AudioPlayer({ src, duration = 0, isSelf }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)   // 0–1
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(duration)

  const bars = waveform(src)
  const filledBars = Math.round(progress * bars.length)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    function onTime()  { setCurrentTime(audio!.currentTime); setProgress(audio!.currentTime / (audio!.duration || 1)) }
    function onMeta()  { setTotalDuration(audio!.duration) }
    function onEnded() { setPlaying(false); setProgress(0); setCurrentTime(0) }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else         { audio.play();  setPlaying(true)  }
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current
    if (!audio) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audio.currentTime = ratio * (audio.duration || 0)
    setProgress(ratio)
  }

  const trackColor   = isSelf ? 'bg-white/30' : 'bg-[var(--border-secondary)]'
  const filledColor  = isSelf ? 'bg-white'     : 'bg-[var(--fg-brand-primary)]'
  const btnBg        = isSelf ? 'bg-white/20 hover:bg-white/30' : 'bg-[var(--bg-brand-primary)] hover:bg-blue-100 dark:hover:bg-blue-900/30'
  const btnIcon      = isSelf ? 'text-white'   : 'text-[var(--fg-brand-primary)]'
  const timeColor    = isSelf ? 'text-blue-100' : 'text-[var(--text-quaternary)]'

  return (
    <div className="flex items-center gap-2.5 mt-1.5 min-w-[200px] max-w-[260px]">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        className={cn('size-9 rounded-full flex items-center justify-center shrink-0 transition-colors', btnBg)}
      >
        {playing
          ? <Pause  size={15} className={cn(btnIcon, 'fill-current')} />
          : <Play   size={15} className={cn(btnIcon, 'fill-current ml-0.5')} />
        }
      </button>

      {/* Waveform + time */}
      <div className="flex-1 min-w-0">
        {/* Waveform bars */}
        <div
          className="flex items-center gap-[2px] h-8 cursor-pointer"
          onClick={seek}
        >
          {bars.map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className={cn(
                'flex-1 rounded-full transition-colors',
                i < filledBars ? filledColor : trackColor,
              )}
            />
          ))}
        </div>

        {/* Duration */}
        <p className={cn('text-[11px] font-medium tabular-nums mt-0.5', timeColor)}>
          {playing || currentTime > 0 ? fmt(currentTime) : fmt(totalDuration)}
        </p>
      </div>
    </div>
  )
}
