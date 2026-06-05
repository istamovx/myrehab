import { useEffect, useRef, useState } from 'react'
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, ExternalLink,
  Copy, Check, Share2, MonitorUp,
} from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { meetCode } from '@/lib/meet'
import { cn } from '@/lib/utils'

interface VideoRoomProps {
  meetUrl: string
  peerName: string
  peerRole?: string
  /** Called when the user ends/leaves the room. */
  onEnd?: () => void
}

export function VideoRoom({ meetUrl, peerName, peerRole, onEnd }: VideoRoomProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [joined, setJoined] = useState(false)
  const [camOn, setCamOn] = useState(true)
  const [micOn, setMicOn] = useState(true)
  const [camError, setCamError] = useState(false)
  const [copied, setCopied] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  // Acquire the local camera/mic once the user joins.
  useEffect(() => {
    if (!joined) return
    let cancelled = false

    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
        stream.getVideoTracks().forEach(t => (t.enabled = camOn))
        stream.getAudioTracks().forEach(t => (t.enabled = micOn))
      })
      .catch(() => setCamError(true))

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joined])

  // Call timer.
  useEffect(() => {
    if (!joined) return
    const id = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(id)
  }, [joined])

  function toggleCam() {
    const next = !camOn
    setCamOn(next)
    streamRef.current?.getVideoTracks().forEach(t => (t.enabled = next))
  }

  function toggleMic() {
    const next = !micOn
    setMicOn(next)
    streamRef.current?.getAudioTracks().forEach(t => (t.enabled = next))
  }

  function handleEnd() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setJoined(false)
    setElapsed(0)
    onEnd?.()
  }

  async function copyLink() {
    await navigator.clipboard?.writeText(meetUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  async function shareLink() {
    if (navigator.share) {
      await navigator.share({ title: 'MyRehab telekonsultatsiya', text: 'Video qabulga qo\'shiling:', url: meetUrl }).catch(() => {})
    } else {
      copyLink()
    }
  }

  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const secs = String(elapsed % 60).padStart(2, '0')

  return (
    <div className="space-y-4">
      {/* Video frame */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#0b1220] border border-[var(--border-secondary)] shadow-[var(--shadow-sm)]">
        {/* Local camera preview */}
        {joined && camOn && !camError ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover -scale-x-100"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#0b1220] to-[#1a2440]">
            <Avatar name={peerName} size="xl" className="size-24 text-[32px] ring-4 ring-white/10" />
            <div className="text-center">
              <p className="text-white font-semibold text-[16px]">{peerName}</p>
              {peerRole && <p className="text-white/50 text-[13px]">{peerRole}</p>}
            </div>
            {camError && joined && (
              <p className="text-amber-300/80 text-[12px]">Kamera topilmadi yoki ruxsat berilmadi</p>
            )}
          </div>
        )}

        {/* Top bar — peer + live + timer */}
        <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur text-white text-[12px] font-medium">
              {peerName}
            </span>
          </div>
          {joined && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/90 text-white text-[12px] font-semibold">
              <span className="size-1.5 rounded-full bg-white animate-pulse" />
              JONLI · {mins}:{secs}
            </span>
          )}
        </div>

        {/* Lobby overlay (before joining) */}
        {!joined && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-[var(--bg-primary)] rounded-2xl p-6 w-[min(90%,380px)] text-center shadow-xl">
              <div className="size-14 rounded-2xl bg-[var(--bg-brand-primary)] flex items-center justify-center mx-auto mb-3">
                <Video size={26} className="text-[var(--fg-brand-primary)]" />
              </div>
              <h3 className="text-[17px] font-bold text-[var(--text-primary)]">Video qabulga qo'shilish</h3>
              <p className="text-[13px] text-[var(--text-tertiary)] mt-1 mb-4">
                {peerName} bilan onlayn konsultatsiya
              </p>
              <div className="flex items-center gap-2 bg-[var(--bg-secondary)] rounded-lg px-3 py-2 mb-4">
                <span className="text-[13px] font-mono text-[var(--text-secondary)] flex-1 truncate text-left">
                  meet.google.com/{meetCode(meetUrl)}
                </span>
                <button onClick={copyLink} className="text-[var(--fg-quaternary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer shrink-0">
                  {copied ? <Check size={15} className="text-[var(--fg-success-primary)]" /> : <Copy size={15} />}
                </button>
              </div>
              <button
                onClick={() => setJoined(true)}
                className="w-full py-2.5 rounded-lg bg-[var(--fg-brand-primary)] text-white text-[14px] font-semibold hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2"
              >
                <Video size={16} />
                Kamera bilan qo'shilish
              </button>
              <a
                href={meetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2 py-2.5 rounded-lg border border-[var(--border-secondary)] text-[var(--text-secondary)] text-[14px] font-semibold hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <ExternalLink size={16} />
                Google Meet'da ochish
              </a>
            </div>
          </div>
        )}

        {/* Control bar (while joined) */}
        {joined && (
          <div className="absolute bottom-0 inset-x-0 p-4 flex items-center justify-center gap-2 bg-gradient-to-t from-black/60 to-transparent">
            <ControlButton active={micOn} onClick={toggleMic} on={Mic} off={MicOff} label={micOn ? 'Mikrofon' : 'Yoqish'} />
            <ControlButton active={camOn} onClick={toggleCam} on={Video} off={VideoOff} label={camOn ? 'Kamera' : 'Yoqish'} />
            <button
              title="Ekranni ulashish"
              className="size-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur"
            >
              <MonitorUp size={18} />
            </button>
            <a
              href={meetUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Google Meet'da ochish"
              className="size-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur"
            >
              <ExternalLink size={18} />
            </a>
            <button
              onClick={handleEnd}
              title="Qo'ng'iroqni tugatish"
              className="h-11 px-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2 transition-colors cursor-pointer font-semibold text-[14px]"
            >
              <PhoneOff size={18} />
              Tugatish
            </button>
          </div>
        )}
      </div>

      {/* Link toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg px-3 h-10 flex-1 min-w-[200px]">
          <Video size={15} className="text-[var(--fg-brand-primary)] shrink-0" />
          <span className="text-[13px] font-mono text-[var(--text-secondary)] truncate">{meetUrl}</span>
        </div>
        <button
          onClick={copyLink}
          className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-[var(--border-secondary)] text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
        >
          {copied ? <Check size={14} className="text-[var(--fg-success-primary)]" /> : <Copy size={14} />}
          {copied ? 'Nusxalandi' : 'Nusxalash'}
        </button>
        <button
          onClick={shareLink}
          className="inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border border-[var(--border-secondary)] text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
        >
          <Share2 size={14} />
          Ulashish
        </button>
        <a
          href={meetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-[var(--fg-brand-primary)] text-white text-[13px] font-semibold hover:opacity-90 transition-opacity cursor-pointer"
        >
          <ExternalLink size={14} />
          Meet'da ochish
        </a>
      </div>
    </div>
  )
}

function ControlButton({ active, onClick, on: On, off: Off, label }: {
  active: boolean
  onClick: () => void
  on: React.ElementType
  off: React.ElementType
  label: string
}) {
  const Icon = active ? On : Off
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        'size-11 rounded-full flex items-center justify-center transition-colors cursor-pointer backdrop-blur',
        active ? 'bg-white/15 hover:bg-white/25 text-white' : 'bg-red-500 hover:bg-red-600 text-white',
      )}
    >
      <Icon size={18} />
    </button>
  )
}
