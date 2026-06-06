import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ASSIGNED_DOCTOR, type Message, type MessageAttachment } from '@/data/patient-mock-data'
import { useConnectStore } from '@/store/connect'
import { RichChatInput } from '@/components/chat/rich-input'
import { MessageBubble } from '@/components/chat/message-bubble'
import { formatUzDate } from '@/lib/utils'

function groupByDate(messages: Message[]) {
  const groups: { label: string; messages: Message[] }[] = []
  let lastDate = ''
  for (const m of messages) {
    const date = m.created_at.slice(0, 10)
    if (date !== lastDate) {
      groups.push({ label: formatUzDate(m.created_at), messages: [] })
      lastDate = date
    }
    groups[groups.length - 1].messages.push(m)
  }
  return groups
}

export function PatientMessagesPage() {
  const { t } = useTranslation()
  const messages = useConnectStore(s => s.messages)
  const sendMessage = useConnectStore(s => s.sendMessage)
  const deleteMessage = useConnectStore(s => s.deleteMessage)
  const editMessage = useConnectStore(s => s.editMessage)
  const markThreadRead = useConnectStore(s => s.markThreadRead)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { markThreadRead('patient') }, [markThreadRead, messages.length])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  function handleSend(text: string, attachment?: MessageAttachment) {
    sendMessage('patient', text, attachment)
  }

  const groups = groupByDate(messages)

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-[var(--bg-primary)] rounded-t-xl border border-b-0 border-[var(--border-secondary)] px-4 py-3 flex items-center gap-3">
        <div className="size-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[13px] font-bold shrink-0">
          {ASSIGNED_DOCTOR.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[var(--text-primary)] truncate">{ASSIGNED_DOCTOR.name}</p>
          <p className="text-xs text-[var(--text-tertiary)] truncate">{ASSIGNED_DOCTOR.specialization}</p>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto bg-[var(--bg-secondary)] border-x border-[var(--border-secondary)] px-4 py-3 space-y-4">
        {groups.map(group => (
          <div key={group.label}>
            <div className="text-center mb-3">
              <span className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-3 py-1 rounded-full">
                {group.label}
              </span>
            </div>
            <div className="space-y-2">
              {group.messages.map(m => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  isSelf={m.sender_role === 'patient'}
                  avatar={
                    <div className="size-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {ASSIGNED_DOCTOR.name.charAt(0)}
                    </div>
                  }
                  onDelete={deleteMessage}
                  onEdit={editMessage}
                />
              ))}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Rich input */}
      <RichChatInput onSend={handleSend} placeholder={t('patient.typeMessage')} />
    </div>
  )
}
