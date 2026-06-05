import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Send } from 'lucide-react'
import { ASSIGNED_DOCTOR, type Message } from '@/data/patient-mock-data'
import { useConnectStore } from '@/store/connect'
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

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function PatientMessagesPage() {
  const { t } = useTranslation()
  const messages = useConnectStore(s => s.messages)
  const sendMessage = useConnectStore(s => s.sendMessage)
  const markThreadRead = useConnectStore(s => s.markThreadRead)
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  // Opening the chat clears the patient's unread message notifications.
  useEffect(() => { markThreadRead('patient') }, [markThreadRead, messages.length])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send() {
    const text = input.trim()
    if (!text) return
    sendMessage('patient', text)
    setInput('')
  }

  const groups = groupByDate(messages)

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-[var(--bg-primary)] rounded-t-xl border border-b-0 border-[var(--border-secondary)] px-4 py-3">
        <p className="text-sm font-bold text-[var(--text-primary)]">{ASSIGNED_DOCTOR.name}</p>
        <p className="text-xs text-[var(--text-tertiary)]">{ASSIGNED_DOCTOR.specialization}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-[var(--bg-secondary)] border-x border-[var(--border-secondary)] px-4 py-3 space-y-4">
        {groups.map(group => (
          <div key={group.label}>
            <div className="text-center mb-3">
              <span className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] px-3 py-1 rounded-full">
                {group.label}
              </span>
            </div>
            <div className="space-y-2">
              {group.messages.map(m => {
                const isPatient = m.sender_role === 'patient'
                return (
                  <div key={m.id} className={['flex', isPatient ? 'justify-end' : 'justify-start'].join(' ')}>
                    {!isPatient && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mr-2 mt-1">
                        {ASSIGNED_DOCTOR.name.charAt(0)}
                      </div>
                    )}
                    <div className={[
                      'max-w-[75%] rounded-2xl px-3.5 py-2.5',
                      isPatient
                        ? 'bg-[var(--fg-brand-primary)] text-white rounded-br-sm'
                        : 'bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-secondary)] rounded-bl-sm',
                    ].join(' ')}>
                      <p className="text-sm leading-relaxed">{m.body}</p>
                      <p className={['text-xs mt-1 text-right', isPatient ? 'text-blue-200' : 'text-[var(--text-quaternary)]'].join(' ')}>
                        {formatTime(m.created_at)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="bg-[var(--bg-primary)] rounded-b-xl border border-t-0 border-[var(--border-secondary)] px-4 py-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
            placeholder={t('patient.typeMessage')}
            className="flex-1 h-11 px-3.5 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-xl text-sm text-[var(--text-primary)] outline-none transition-colors focus:bg-[var(--bg-primary)] focus:border-[var(--fg-brand-primary)] focus:[box-shadow:var(--focus-ring)] placeholder:text-[var(--text-quaternary)]"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="w-11 h-11 shrink-0 rounded-xl bg-[var(--fg-brand-primary)] text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
