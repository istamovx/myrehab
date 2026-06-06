import { useState } from 'react'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import { AttachmentView } from './attachment-view'
import { cn } from '@/lib/utils'
import type { Message } from '@/data/patient-mock-data'

interface Props {
  message: Message
  isSelf: boolean
  avatar?: React.ReactNode
  onDelete: (id: string) => void
  onEdit: (id: string, newBody: string) => void
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function MessageBubble({ message: m, isSelf, avatar, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(m.body)

  function saveEdit() {
    if (editText.trim()) {
      onEdit(m.id, editText)
    }
    setEditing(false)
  }

  function cancelEdit() {
    setEditText(m.body)
    setEditing(false)
  }

  return (
    <div className={cn('group flex items-end gap-1.5', isSelf ? 'justify-end' : 'justify-start')}>
      {/* Other party avatar */}
      {!isSelf && avatar && <div className="shrink-0 mb-0.5">{avatar}</div>}

      {/* Action buttons (left of bubble for self) */}
      {isSelf && !m.deleted && !editing && (
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mb-1">
          {m.body && (
            <button
              onClick={() => { setEditText(m.body); setEditing(true) }}
              className="size-6 rounded flex items-center justify-center text-[var(--text-quaternary)] hover:text-[var(--fg-brand-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
              title="Tahrirlash"
            >
              <Pencil size={12} />
            </button>
          )}
          <button
            onClick={() => onDelete(m.id)}
            className="size-6 rounded flex items-center justify-center text-[var(--text-quaternary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="O'chirish"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}

      {/* Bubble */}
      <div className={cn(
        'max-w-[75%] rounded-2xl px-3.5 py-2.5',
        isSelf
          ? 'bg-[var(--fg-brand-primary)] text-white rounded-br-sm'
          : 'bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-secondary)] rounded-bl-sm',
      )}>
        {m.deleted ? (
          <p className={cn('text-sm italic', isSelf ? 'text-blue-200' : 'text-[var(--text-quaternary)]')}>
            Xabar o'chirildi
          </p>
        ) : editing ? (
          <div className="space-y-2 min-w-[180px]">
            <textarea
              autoFocus
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit() } if (e.key === 'Escape') cancelEdit() }}
              rows={2}
              className="w-full bg-white/10 rounded-lg px-2 py-1.5 text-sm text-white placeholder:text-blue-200 outline-none resize-none border border-white/20 focus:border-white/40"
            />
            <div className="flex items-center gap-1.5 justify-end">
              <button onClick={cancelEdit} className="size-6 rounded flex items-center justify-center text-blue-200 hover:text-white transition-colors">
                <X size={13} />
              </button>
              <button onClick={saveEdit} className="size-6 rounded flex items-center justify-center text-blue-200 hover:text-white transition-colors">
                <Check size={13} />
              </button>
            </div>
          </div>
        ) : (
          <>
            {m.body && <p className="text-sm leading-relaxed">{m.body}</p>}
            {m.attachment && <AttachmentView att={m.attachment} isSelf={isSelf} />}
          </>
        )}

        {/* Timestamp + edited label */}
        {!editing && (
          <p className={cn('text-xs mt-1 text-right flex items-center justify-end gap-1.5', isSelf ? 'text-blue-200' : 'text-[var(--text-quaternary)]')}>
            {m.edited && !m.deleted && <span className="italic">tahrirlangan</span>}
            {formatTime(m.created_at)}
          </p>
        )}
      </div>

      {/* Self avatar placeholder (none, self messages have no avatar) */}
    </div>
  )
}
