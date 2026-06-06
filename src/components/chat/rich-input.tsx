import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Smile, Mic, Video, X, FileText, Square } from 'lucide-react'
import type { MessageAttachment } from '@/data/patient-mock-data'
import { cn } from '@/lib/utils'

const EMOJIS = [
  '😀','😃','😄','😁','😆','😅','😂','🤣','🙂','😉',
  '😊','😋','😎','🥳','🤩','😏','😒','😞','😔','😟',
  '🥺','😢','😭','😤','😠','😡','🤯','😱','😨','😰',
  '🤗','🤔','🤫','😶','😐','😬','🙄','😮','😲','🥱',
  '😴','🤧','😷','🤒','🤕','💪','👍','👎','👋','✅',
  '⚠️','🔔','💊','🏥','🩺','🩹','❤️','🔥','✨','🙏',
]

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1048576).toFixed(1)} MB`
}

function fmtDur(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

interface Props {
  onSend: (text: string, attachment?: MessageAttachment) => void
  placeholder?: string
}

export function RichChatInput({ onSend, placeholder = 'Xabar yozing...' }: Props) {
  const [text, setText] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [pending, setPending] = useState<MessageAttachment | null>(null)
  const [recording, setRecording] = useState<'audio' | 'video' | null>(null)
  const [recSec, setRecSec] = useState(0)

  const fileRef = useRef<HTMLInputElement>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
    streamRef.current?.getTracks().forEach(t => t.stop())
  }, [])

  function send() {
    if (!text.trim() && !pending) return
    onSend(text.trim(), pending ?? undefined)
    setText('')
    setPending(null)
    setShowEmoji(false)
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const kind: MessageAttachment['kind'] = file.type.startsWith('image/') ? 'image'
      : file.type.startsWith('video/') ? 'video'
      : file.type.startsWith('audio/') ? 'audio'
      : 'file'
    setPending({ kind, url, name: file.name, size: file.size, mimeType: file.type })
    e.target.value = ''
  }

  async function startRec(mode: 'audio' | 'video') {
    if (!navigator.mediaDevices?.getUserMedia) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        mode === 'audio' ? { audio: true } : { audio: true, video: true }
      )
      streamRef.current = stream
      chunksRef.current = []
      const mimeType = mode === 'audio' ? 'audio/webm' : 'video/webm'
      const recorder = new MediaRecorder(stream, { mimeType })
      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        const url = URL.createObjectURL(blob)
        const dur = recSecRef.current
        setPending({ kind: mode, url, name: `${mode === 'audio' ? 'ovoz' : 'video'}-xabar.webm`, size: blob.size, mimeType, duration: dur })
        stream.getTracks().forEach(t => t.stop())
        streamRef.current = null
        setRecording(null)
        if (timerRef.current) clearInterval(timerRef.current)
        setRecSec(0)
      }
      recorder.start()
      recorderRef.current = recorder
      setRecSec(0)
      setRecording(mode)
      timerRef.current = setInterval(() => setRecSec(s => s + 1), 1000)
    } catch {
      // permission denied
    }
  }

  // Ref to access latest recSec inside onstop closure
  const recSecRef = useRef(0)
  useEffect(() => { recSecRef.current = recSec }, [recSec])

  function stopRec() {
    if (timerRef.current) clearInterval(timerRef.current)
    recorderRef.current?.stop()
  }

  return (
    <div className="bg-[var(--bg-primary)] rounded-b-xl border border-t-0 border-[var(--border-secondary)]">
      {/* Emoji panel */}
      {showEmoji && (
        <div className="border-t border-[var(--border-secondary)] px-3 py-2 grid grid-cols-10 gap-0.5">
          {EMOJIS.map(e => (
            <button
              key={e}
              type="button"
              onClick={() => { setText(t => t + e); inputRef.current?.focus() }}
              className="text-lg h-8 rounded hover:bg-[var(--bg-secondary)] flex items-center justify-center cursor-pointer transition-colors"
            >
              {e}
            </button>
          ))}
        </div>
      )}

      {/* Pending attachment preview */}
      {pending && (
        <div className="border-t border-[var(--border-secondary)] px-4 py-2.5 flex items-center gap-3">
          {pending.kind === 'image' && (
            <img src={pending.url} className="h-14 w-14 object-cover rounded-lg shrink-0" alt="" />
          )}
          {pending.kind === 'audio' && (
            <audio controls src={pending.url} className="flex-1" style={{ height: 32 }} />
          )}
          {pending.kind === 'video' && (
            <video src={pending.url} className="h-14 rounded-lg shrink-0" />
          )}
          {pending.kind === 'file' && (
            <div className="flex items-center gap-2 flex-1">
              <div className="size-10 rounded-xl bg-[var(--bg-brand-primary)] flex items-center justify-center shrink-0">
                <FileText size={18} className="text-[var(--fg-brand-primary)]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{pending.name}</p>
                <p className="text-[11px] text-[var(--text-quaternary)]">{fmtBytes(pending.size)}</p>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => setPending(null)}
            className="size-6 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 flex items-center justify-center shrink-0 cursor-pointer transition-colors ml-auto"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <div className="px-3 py-2.5 flex items-center gap-1.5">
        {recording ? (
          /* Recording state */
          <>
            <span className="size-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
            <span className="text-sm font-bold text-red-500 tabular-nums w-10 shrink-0">{fmtDur(recSec)}</span>
            <span className="text-[13px] text-[var(--text-tertiary)] flex-1">
              {recording === 'audio' ? 'Ovoz yozilmoqda...' : 'Video yozilmoqda...'}
            </span>
            <button
              type="button"
              onClick={stopRec}
              className="h-9 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white flex items-center gap-1.5 text-[13px] font-semibold cursor-pointer transition-colors"
            >
              <Square size={12} fill="currentColor" />
              To'xtatish
            </button>
          </>
        ) : (
          /* Normal state */
          <>
            {/* Emoji */}
            <button
              type="button"
              onClick={() => setShowEmoji(v => !v)}
              className={cn(
                'size-8 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors shrink-0',
                showEmoji && 'bg-[var(--bg-secondary)] text-[var(--fg-brand-primary)]',
              )}
            >
              <Smile size={17} />
            </button>

            {/* File */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className={cn(
                'size-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors shrink-0',
                pending ? 'text-[var(--fg-brand-primary)] bg-[var(--bg-brand-primary)]' : 'text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)]',
              )}
            >
              <Paperclip size={17} />
            </button>
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              onChange={onFile}
              accept="image/*,audio/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
            />

            {/* Audio */}
            <button
              type="button"
              onClick={() => startRec('audio')}
              className="size-8 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors shrink-0"
            >
              <Mic size={17} />
            </button>

            {/* Video */}
            <button
              type="button"
              onClick={() => startRec('video')}
              className="size-8 rounded-lg flex items-center justify-center text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors shrink-0"
            >
              <Video size={17} />
            </button>

            <div className="w-px h-4 bg-[var(--border-secondary)] shrink-0 mx-0.5" />

            {/* Text input */}
            <input
              ref={inputRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder={placeholder}
              className="flex-1 h-9 px-3 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl text-sm text-[var(--text-primary)] outline-none transition-colors focus:bg-[var(--bg-primary)] focus:border-[var(--fg-brand-primary)] focus:[box-shadow:var(--focus-ring)] placeholder:text-[var(--text-quaternary)]"
            />

            {/* Send */}
            <button
              type="button"
              onClick={send}
              disabled={!text.trim() && !pending}
              className="size-9 shrink-0 rounded-xl bg-[var(--fg-brand-primary)] text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer"
            >
              <Send size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
