import { FileText, Download } from 'lucide-react'
import type { MessageAttachment } from '@/data/patient-mock-data'
import { AudioPlayer } from './audio-player'

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1048576).toFixed(1)} MB`
}

export function AttachmentView({ att, isSelf }: { att: MessageAttachment; isSelf: boolean }) {
  if (!att.url) {
    // Attachment lost on reload (blob URL stripped)
    const label = att.kind === 'audio' ? '🎤 Ovozli xabar' : att.kind === 'video' ? '🎬 Video xabar' : att.kind === 'image' ? '📷 Rasm' : `📎 ${att.name}`
    return <p className={['text-xs mt-1 opacity-60 italic', isSelf ? 'text-blue-100' : 'text-[var(--text-quaternary)]'].join(' ')}>{label}</p>
  }

  if (att.kind === 'image') {
    return (
      <img
        src={att.url}
        alt={att.name}
        className="max-w-full rounded-xl mt-1.5 max-h-60 object-cover block cursor-zoom-in"
        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
      />
    )
  }

  if (att.kind === 'audio') {
    return <AudioPlayer src={att.url} duration={att.duration} isSelf={isSelf} />
  }

  if (att.kind === 'video') {
    return (
      <video
        controls
        src={att.url}
        className="max-w-full rounded-xl mt-1.5 max-h-48 block"
      />
    )
  }

  // file
  return (
    <a
      href={att.url}
      download={att.name}
      className={[
        'flex items-center gap-2.5 mt-1.5 p-2.5 rounded-xl border transition-colors',
        isSelf
          ? 'border-white/20 bg-white/10 hover:bg-white/20'
          : 'border-[var(--border-secondary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]',
      ].join(' ')}
    >
      <FileText size={18} className={isSelf ? 'text-blue-200 shrink-0' : 'text-[var(--fg-brand-primary)] shrink-0'} />
      <div className="min-w-0 flex-1">
        <p className={['text-xs font-semibold truncate', isSelf ? 'text-white' : 'text-[var(--text-primary)]'].join(' ')}>{att.name}</p>
        <p className={['text-[11px]', isSelf ? 'text-blue-200' : 'text-[var(--text-quaternary)]'].join(' ')}>{fmtBytes(att.size)}</p>
      </div>
      <Download size={14} className={isSelf ? 'text-blue-200 shrink-0' : 'text-[var(--text-tertiary)] shrink-0'} />
    </a>
  )
}
