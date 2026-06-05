import { useEffect, useRef, useState } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Web Speech API ambient declarations
// The TypeScript DOM lib may not include these; we declare the minimum needed.
// ---------------------------------------------------------------------------
interface SpeechRecognitionAlternative {
  readonly transcript: string
  readonly confidence: number
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean
  readonly length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionResultList {
  readonly length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string
  readonly message: string
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((ev: SpeechRecognitionEvent) => void) | null
  onerror: ((ev: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type SupportedLanguage = 'uz-UZ' | 'ru-RU' | 'en-US'

interface VoiceRecorderProps {
  onTranscript: (text: string) => void
  language?: string
  className?: string
}

const LANG_LABELS: Record<SupportedLanguage, string> = {
  'uz-UZ': 'UZ',
  'ru-RU': 'RU',
  'en-US': 'EN',
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function VoiceRecorder({
  onTranscript,
  language = 'uz-UZ',
  className,
}: VoiceRecorderProps) {
  const isSupported =
    typeof window !== 'undefined' &&
    Boolean(window.SpeechRecognition ?? window.webkitSpeechRecognition)

  const [isRecording, setIsRecording] = useState(false)
  const [interimText, setInterimText] = useState('')
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(
    (language as SupportedLanguage) ?? 'uz-UZ',
  )

  // Accumulated final transcript across recognition restart cycles
  const accumulatedRef = useRef('')
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------
  function createRecognition(lang: SupportedLanguage): SpeechRecognitionInstance {
    const Ctor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!Ctor) throw new Error('SpeechRecognition not supported')
    const rec = new Ctor()
    rec.lang = lang
    rec.continuous = true
    rec.interimResults = true
    return rec
  }

  function startRecognition(lang: SupportedLanguage) {
    const rec = createRecognition(lang)
    recognitionRef.current = rec

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          accumulatedRef.current += result[0].transcript + ' '
        } else {
          interim += result[0].transcript
        }
      }
      setInterimText(interim)
    }

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      // Ignore no-speech and aborted; log other transient errors
      if (event.error === 'no-speech') return
      if (event.error === 'aborted') return
      console.warn('SpeechRecognition error:', event.error)
    }

    rec.onend = () => {
      // Auto-restart as long as we are still in "recording" state
      if (recognitionRef.current === rec) {
        try {
          rec.start()
        } catch {
          // Already started or component unmounted — ignore
        }
      }
    }

    rec.start()
  }

  function stopRecognition() {
    if (!recognitionRef.current) return
    // Detach so the onend handler does NOT restart
    const rec = recognitionRef.current
    recognitionRef.current = null
    rec.onend = null
    rec.stop()
  }

  // ------------------------------------------------------------------
  // Toggle handler
  // ------------------------------------------------------------------
  function handleToggle() {
    if (!isSupported) return

    if (isRecording) {
      stopRecognition()
      setIsRecording(false)
      setInterimText('')
      const full = accumulatedRef.current.trim()
      accumulatedRef.current = ''
      onTranscript(full)
    } else {
      accumulatedRef.current = ''
      setInterimText('')
      startRecognition(selectedLang)
      setIsRecording(true)
    }
  }

  // ------------------------------------------------------------------
  // Language change (only while idle)
  // ------------------------------------------------------------------
  function handleLangChange(lang: SupportedLanguage) {
    if (isRecording) return
    setSelectedLang(lang)
  }

  // ------------------------------------------------------------------
  // Cleanup on unmount
  // ------------------------------------------------------------------
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
    }
  }, [])

  // ------------------------------------------------------------------
  // Trim interim text to last ~30 chars for compact display
  // ------------------------------------------------------------------
  const displayInterim =
    interimText.length > 30 ? '…' + interimText.slice(-30) : interimText

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <div className={cn('flex flex-col items-start gap-1.5', className)}>
      {/* Main row: button + language selector + optional warning */}
      <div className="flex items-center gap-2">
        {/* Record / Stop button */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={!isSupported}
          aria-label={isRecording ? "Yozishni to'xtatish" : 'Yozishni boshlash'}
          className={cn(
            'relative size-10 rounded-full flex items-center justify-center transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            !isSupported && 'opacity-40 cursor-not-allowed',
            isRecording
              ? 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500'
              : 'bg-[var(--bg-brand-primary)] text-[var(--text-brand-secondary)] hover:opacity-90 focus-visible:ring-[var(--fg-brand-primary)]',
          )}
        >
          {/* Pulsing ring while recording */}
          {isRecording && (
            <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-60" />
          )}

          {isRecording ? (
            <MicOff className="size-4 relative z-10" />
          ) : (
            <Mic className="size-4" />
          )}
        </button>

        {/* Language selector: UZ / RU / EN */}
        <div className="flex items-center gap-0.5">
          {(Object.keys(LANG_LABELS) as SupportedLanguage[]).map(lang => (
            <button
              key={lang}
              type="button"
              onClick={() => handleLangChange(lang)}
              disabled={isRecording}
              className={cn(
                'px-2 py-0.5 rounded text-xs font-medium transition-colors',
                isRecording && 'cursor-not-allowed opacity-50',
                lang === selectedLang
                  ? 'bg-[var(--fg-brand-primary)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]',
              )}
            >
              {LANG_LABELS[lang]}
            </button>
          ))}
        </div>

        {/* Not-supported warning */}
        {!isSupported && (
          <span className="text-xs text-amber-500 flex items-center gap-1">
            <MicOff className="size-3" />
            Qo&apos;llab-quvvatlanmaydi
          </span>
        )}
      </div>

      {/* Status / interim text pill — visible only while recording */}
      {isRecording && (
        <div className="flex items-center gap-1.5 max-w-xs">
          {/* Breathing dot */}
          <span className="size-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="text-xs text-[var(--text-secondary)] truncate">
            {displayInterim ? displayInterim : 'Tinglayapman…'}
          </span>
        </div>
      )}
    </div>
  )
}

export default VoiceRecorder
