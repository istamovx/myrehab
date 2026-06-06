import { useRef, useEffect, useState } from 'react'
import { Pill, AlertTriangle, Plus, Check } from 'lucide-react'
import { useConnectStore } from '@/store/connect'
import { PATIENT_PROFILE, type Message, type MessageAttachment } from '@/data/patient-mock-data'
import { Avatar } from '@/components/ui/avatar'
import { Dialog } from '@/components/ui/dialog'
import { Input, Textarea, FieldLabel } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import { RichChatInput } from '@/components/chat/rich-input'
import { AttachmentView } from '@/components/chat/attachment-view'
import { formatUzDate, formatUzDateTime } from '@/lib/utils'

const SEVERITY_COLORS: Record<string, string> = {
  mild:     'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  moderate: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  severe:   'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}
const SEVERITY_LABEL: Record<string, string> = { mild: 'Yengil', moderate: "O'rta", severe: "Og'ir" }
const TYPE_LABEL: Record<string, string> = {
  pain: "Og'riq", swelling: 'Shish', stiffness: 'Qotishlik', fatigue: 'Charchoq', numbness: 'Uvishish', other: 'Boshqa',
}

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

const EMPTY_MED = { name: '', dose: '', schedule: '', instructions: '' }

export function MessagesPage() {
  const messages = useConnectStore(s => s.messages)
  const symptoms = useConnectStore(s => s.symptoms)
  const telegramLinked = useConnectStore(s => s.telegramLinked)
  const sendMessage = useConnectStore(s => s.sendMessage)
  const markThreadRead = useConnectStore(s => s.markThreadRead)
  const assignMedication = useConnectStore(s => s.assignMedication)

  const [medOpen, setMedOpen] = useState(false)
  const [med, setMed] = useState(EMPTY_MED)
  const [medDone, setMedDone] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { markThreadRead('doctor') }, [markThreadRead, messages.length])
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  function handleSend(text: string, attachment?: MessageAttachment) {
    sendMessage('doctor', text, attachment)
  }

  function saveMed() {
    if (!med.name.trim() || !med.dose.trim()) return
    assignMedication({
      name: med.name.trim(),
      dose: med.dose.trim(),
      schedule: med.schedule.trim(),
      instructions: med.instructions.trim() || undefined,
    })
    setMedDone(true)
    setTimeout(() => { setMedDone(false); setMedOpen(false); setMed(EMPTY_MED) }, 1400)
  }

  const groups = groupByDate(messages)

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Xabarlar"
        subtitle="Bemor bilan yozishmalar va tayinlovlar"
        crumbs={[{ label: 'Xabarlar' }]}
        actions={
          <Button size="sm" onClick={() => setMedOpen(true)}>
            <Pill size={15} />
            Dori tayinlash
          </Button>
        }
      />

      {/* Recent complaints */}
      {symptoms.length > 0 && (
        <div className="mb-4 rounded-xl border border-[var(--border-secondary)] bg-[var(--bg-primary)] p-4">
          <p className="text-[13px] font-bold text-[var(--text-primary)] mb-2.5 flex items-center gap-1.5">
            <AlertTriangle size={15} className="text-[var(--fg-warning-primary)]" />
            So'nggi shikoyatlar ({symptoms.length})
          </p>
          <div className="space-y-1.5">
            {symptoms.slice(0, 5).map(s => (
              <div key={s.id} className="flex items-center gap-2 text-[13px]">
                <span className={['text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0', SEVERITY_COLORS[s.severity]].join(' ')}>
                  {SEVERITY_LABEL[s.severity]}
                </span>
                <span className="font-medium text-[var(--text-primary)]">{TYPE_LABEL[s.type] ?? s.type}</span>
                <span className="text-[var(--text-tertiary)] truncate">
                  · {s.location || 'umumiy'} · {s.intensity}/10{s.note ? ' · ' + s.note : ''}
                </span>
                <span className="text-[var(--text-quaternary)] text-[11px] ml-auto shrink-0">{formatUzDateTime(s.reported_at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat window */}
      <div className="flex flex-col h-[calc(100vh-13rem)]">
        {/* Header */}
        <div className="bg-[var(--bg-primary)] rounded-t-xl border border-b-0 border-[var(--border-secondary)] px-4 py-3 flex items-center gap-3">
          <Avatar name={PATIENT_PROFILE.name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[var(--text-primary)] truncate">{PATIENT_PROFILE.name}</p>
            <p className="text-xs text-[var(--text-tertiary)] truncate">{PATIENT_PROFILE.diagnosis}</p>
          </div>
          {telegramLinked && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 bg-sky-50 dark:bg-sky-950/30 px-2 py-1 rounded-full shrink-0">
              <Check size={11} />
              Telegram
            </span>
          )}
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
                {group.messages.map(m => {
                  const isDoctor = m.sender_role === 'doctor'
                  return (
                    <div key={m.id} className={['flex', isDoctor ? 'justify-end' : 'justify-start'].join(' ')}>
                      {!isDoctor && (
                        <div className="mr-2 mt-1 shrink-0">
                          <Avatar name={PATIENT_PROFILE.name} size="xs" />
                        </div>
                      )}
                      <div className={[
                        'max-w-[75%] rounded-2xl px-3.5 py-2.5',
                        isDoctor
                          ? 'bg-[var(--fg-brand-primary)] text-white rounded-br-sm'
                          : 'bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-secondary)] rounded-bl-sm',
                      ].join(' ')}>
                        {m.body && <p className="text-sm leading-relaxed">{m.body}</p>}
                        {m.attachment && <AttachmentView att={m.attachment} isSelf={isDoctor} />}
                        <p className={['text-xs mt-1 text-right', isDoctor ? 'text-blue-200' : 'text-[var(--text-quaternary)]'].join(' ')}>
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

        {/* Rich input */}
        <RichChatInput onSend={handleSend} placeholder="Xabar yozing..." />
      </div>

      {/* Assign medication dialog */}
      <Dialog
        open={medOpen}
        onOpenChange={open => { setMedOpen(open); if (!open) { setMed(EMPTY_MED); setMedDone(false) } }}
        title="Dori tayinlash"
        description={`${PATIENT_PROFILE.name} uchun yangi dori`}
        side="right"
      >
        {medDone ? (
          <div className="flex flex-col items-center py-10 gap-3">
            <div className="size-14 rounded-full bg-[var(--bg-success-primary)] flex items-center justify-center">
              <Pill size={26} className="text-[var(--fg-success-primary)]" />
            </div>
            <p className="text-[16px] font-semibold text-[var(--text-primary)]">Dori tayinlandi!</p>
            <p className="text-[13px] text-[var(--text-tertiary)]">{med.name} · {med.dose}</p>
            <p className="text-[12px] text-[var(--text-quaternary)]">Bemorga bildirishnoma yuborildi</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <FieldLabel>Dori nomi *</FieldLabel>
              <Input value={med.name} onChange={e => setMed(m => ({ ...m, name: e.target.value }))} placeholder="masalan, Ibuprofen" />
            </div>
            <div>
              <FieldLabel>Doza *</FieldLabel>
              <Input value={med.dose} onChange={e => setMed(m => ({ ...m, dose: e.target.value }))} placeholder="masalan, 400 mg" />
            </div>
            <div>
              <FieldLabel>Qabul vaqti</FieldLabel>
              <Input value={med.schedule} onChange={e => setMed(m => ({ ...m, schedule: e.target.value }))} placeholder="masalan, 08:00, 20:00" />
            </div>
            <div>
              <FieldLabel>Ko'rsatma</FieldLabel>
              <Textarea value={med.instructions} onChange={e => setMed(m => ({ ...m, instructions: e.target.value }))} rows={2} placeholder="masalan, Ovqatdan keyin iching" />
            </div>
            <div className="flex gap-3 pt-1">
              <Button variant="secondary" className="flex-1" onClick={() => setMedOpen(false)}>Bekor qilish</Button>
              <Button className="flex-1" onClick={saveMed} disabled={!med.name.trim() || !med.dose.trim()}>
                <Plus size={15} />
                Tayinlash
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}
