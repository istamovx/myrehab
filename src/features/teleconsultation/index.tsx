import { useState } from 'react'
import {
  Plus, Video, Clock, Bell, Copy, Check, ExternalLink, RefreshCw,
  CalendarClock, X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Select } from '@/components/ui/select'
import { Dialog } from '@/components/ui/dialog'
import { DatePicker } from '@/components/ui/date-picker'
import { TimePicker } from '@/components/ui/time-picker'
import { Toggle } from '@/components/ui/toggle'
import { PageHeader } from '@/components/layout/page-header'
import { VideoRoom } from './video-room'
import { PATIENTS } from '@/data/mock-data'
import { generateMeetLink, meetCode } from '@/lib/meet'
import { ensureNotificationPermission, scheduleReminders, offsetsLabel } from '@/lib/reminders'
import { cn, formatUzDateTime } from '@/lib/utils'

interface Teleconsult {
  id: string
  patientId: string
  patientName: string
  scheduledAt: string   // ISO
  durationMin: number
  meetUrl: string
  reminderOffsets: number[]
}

function plusHours(h: number, min = 0): string {
  const d = new Date()
  d.setHours(d.getHours() + h, min, 0, 0)
  return d.toISOString()
}

const INITIAL: Teleconsult[] = [
  { id: 't1', patientId: '1001', patientName: 'Dilnoza Karimova', scheduledAt: plusHours(2),  durationMin: 30, meetUrl: generateMeetLink(), reminderOffsets: [60, 10] },
  { id: 't2', patientId: '1003', patientName: 'Gulnora Saidova',  scheduledAt: plusHours(5),  durationMin: 45, meetUrl: generateMeetLink(), reminderOffsets: [60, 10] },
  { id: 't3', patientId: '1006', patientName: 'Otabek Yusupov',   scheduledAt: plusHours(26), durationMin: 30, meetUrl: generateMeetLink(), reminderOffsets: [60] },
]

function untilLabel(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now()
  if (diff < 0) return 'O\'tib ketgan'
  const mins = Math.round(diff / 60000)
  if (mins < 60) return `${mins} daqiqadan so'ng`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} soatdan so'ng`
  return `${Math.round(hours / 24)} kundan so'ng`
}

const EMPTY_FORM = {
  patientId: '',
  date: new Date().toISOString().slice(0, 10),
  time: '',
  duration: '30',
  remind1h: true,
  remind10m: true,
}

export function TeleconsultationPage() {
  const [list, setList] = useState<Teleconsult[]>(INITIAL)
  const [active, setActive] = useState<Teleconsult | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [newLink, setNewLink] = useState(generateMeetLink())
  const [copiedId, setCopiedId] = useState<string | null>(null)

  function f<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function copyLink(id: string, url: string) {
    await navigator.clipboard?.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  async function handleCreate() {
    if (!form.patientId || !form.time) return
    const patient = PATIENTS.find(p => p.id === form.patientId)
    const offsets = [form.remind1h ? 60 : null, form.remind10m ? 10 : null].filter(Boolean) as number[]
    const scheduledAt = new Date(`${form.date}T${form.time}:00`).toISOString()

    const tc: Teleconsult = {
      id: `t-${Date.now()}`,
      patientId: form.patientId,
      patientName: patient?.name ?? '—',
      scheduledAt,
      durationMin: Number(form.duration) || 30,
      meetUrl: newLink,
      reminderOffsets: offsets,
    }

    if (offsets.length) {
      await ensureNotificationPermission()
      scheduleReminders({
        appointmentId: tc.id,
        title: 'Telekonsultatsiya eslatmasi',
        body: `${tc.patientName} bilan video qabul`,
        startsAt: scheduledAt,
        offsetsMin: offsets,
        meetUrl: tc.meetUrl,
      })
    }

    setList(prev => [tc, ...prev].sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt)))
    setAddOpen(false)
    setForm(EMPTY_FORM)
    setNewLink(generateMeetLink())
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Telekonsultatsiya"
        subtitle="Google Meet orqali onlayn video qabullar"
        crumbs={[{ label: 'Telekonsultatsiya' }]}
        actions={
          <Button size="sm" onClick={() => { setNewLink(generateMeetLink()); setAddOpen(true) }}>
            <Plus size={15} />
            Yangi qabul
          </Button>
        }
      />

      {/* Active video room */}
      {active && (
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar name={active.patientName} size="sm" />
              <div>
                <p className="text-[15px] font-semibold text-[var(--text-primary)]">{active.patientName}</p>
                <p className="text-[12px] text-[var(--text-tertiary)]">{formatUzDateTime(active.scheduledAt)} · {active.durationMin} daqiqa</p>
              </div>
            </div>
            <button
              onClick={() => setActive(null)}
              className="size-8 rounded-lg hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--fg-quaternary)] cursor-pointer transition-colors"
            >
              <X size={17} />
            </button>
          </div>
          <VideoRoom meetUrl={active.meetUrl} peerName={active.patientName} peerRole="Bemor" onEnd={() => setActive(null)} />
        </div>
      )}

      {/* Upcoming list */}
      <div>
        <h3 className="text-[15px] font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
          <CalendarClock size={17} className="text-[var(--fg-quaternary)]" />
          Rejalashtirilgan qabullar ({list.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {list.map(tc => {
            const soon = new Date(tc.scheduledAt).getTime() - Date.now() < 15 * 60000
            return (
              <div
                key={tc.id}
                className={cn(
                  'bg-[var(--bg-primary)] rounded-2xl border shadow-[var(--shadow-xs)] p-5',
                  active?.id === tc.id ? 'border-[var(--border-brand)] ring-1 ring-[var(--blue-200)]' : 'border-[var(--border-secondary)]',
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar name={tc.patientName} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[15px] font-semibold text-[var(--text-primary)] truncate">{tc.patientName}</p>
                      <span className={cn(
                        'text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0',
                        soon ? 'bg-[var(--bg-success-primary)] text-[var(--text-success-primary)]' : 'bg-[var(--bg-secondary)] text-[var(--text-tertiary)]',
                      )}>
                        {untilLabel(tc.scheduledAt)}
                      </span>
                    </div>
                    <p className="text-[13px] text-[var(--text-tertiary)] mt-0.5 flex items-center gap-1.5">
                      <Clock size={12} />
                      {formatUzDateTime(tc.scheduledAt)} · {tc.durationMin} daqiqa
                    </p>

                    {/* Meet link */}
                    <div className="flex items-center gap-2 bg-[var(--bg-secondary)] rounded-lg px-2.5 py-1.5 mt-3">
                      <Video size={13} className="text-[var(--fg-brand-primary)] shrink-0" />
                      <span className="text-[12px] font-mono text-[var(--text-secondary)] flex-1 truncate">meet.google.com/{meetCode(tc.meetUrl)}</span>
                      <button onClick={() => copyLink(tc.id, tc.meetUrl)} className="text-[var(--fg-quaternary)] hover:text-[var(--text-primary)] cursor-pointer shrink-0">
                        {copiedId === tc.id ? <Check size={13} className="text-[var(--fg-success-primary)]" /> : <Copy size={13} />}
                      </button>
                    </div>

                    {/* Reminder status */}
                    {tc.reminderOffsets.length > 0 && (
                      <p className="text-[12px] text-[var(--text-quaternary)] mt-2 flex items-center gap-1.5">
                        <Bell size={12} className="text-[var(--fg-warning-primary)]" />
                        Eslatma: {offsetsLabel(tc.reminderOffsets)}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" onClick={() => setActive(tc)} className="flex-1">
                        <Video size={14} />
                        Boshlash
                      </Button>
                      <a href={tc.meetUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center size-9 rounded-lg border border-[var(--border-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer">
                        <ExternalLink size={15} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          {list.length === 0 && (
            <div className="col-span-full text-center py-16 text-[var(--fg-quaternary)] text-sm">
              Rejalashtirilgan qabullar yo'q
            </div>
          )}
        </div>
      </div>

      {/* New teleconsultation dialog */}
      <Dialog
        open={addOpen}
        onOpenChange={open => { setAddOpen(open); if (!open) { setForm(EMPTY_FORM) } }}
        title="Yangi telekonsultatsiya"
        description="Video qabulni rejalashtiring va havolani ulashing"
        side="right"
      >
        <div className="space-y-4">
          <div>
            <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Bemor *</label>
            <Select
              value={form.patientId}
              onValueChange={v => f('patientId', v)}
              options={PATIENTS.map(p => ({ value: p.id, label: p.name }))}
              placeholder="Bemorni tanlang"
              triggerClassName="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Sana *</label>
              <DatePicker value={form.date} onChange={v => f('date', v)} placeholder="kk.oo.yyyy" />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Vaqt *</label>
              <TimePicker value={form.time} onChange={v => f('time', v)} />
            </div>
          </div>

          <div>
            <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Davomiyligi (daqiqa)</label>
            <Select
              value={form.duration}
              onValueChange={v => f('duration', v)}
              options={[
                { value: '15', label: '15 daqiqa' },
                { value: '30', label: '30 daqiqa' },
                { value: '45', label: '45 daqiqa' },
                { value: '60', label: '60 daqiqa' },
              ]}
              triggerClassName="w-full"
            />
          </div>

          {/* Generated Meet link */}
          <div>
            <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Google Meet havolasi</label>
            <div className="flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg px-3 h-10">
              <Video size={15} className="text-[var(--fg-brand-primary)] shrink-0" />
              <span className="text-[13px] font-mono text-[var(--text-secondary)] flex-1 truncate">meet.google.com/{meetCode(newLink)}</span>
              <button onClick={() => setNewLink(generateMeetLink())} title="Yangi havola" className="text-[var(--fg-quaternary)] hover:text-[var(--text-primary)] cursor-pointer shrink-0">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Notification settings */}
          <div className="bg-[var(--bg-secondary-subtle)] border border-[var(--border-secondary)] rounded-xl p-3.5 space-y-3">
            <p className="text-[13px] font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
              <Bell size={14} className="text-[var(--fg-warning-primary)]" />
              Push bildirishnoma
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[var(--text-tertiary)]">1 soat oldin</span>
              <Toggle checked={form.remind1h} onCheckedChange={v => f('remind1h', v)} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[var(--text-tertiary)]">10 daqiqa oldin</span>
              <Toggle checked={form.remind10m} onCheckedChange={v => f('remind10m', v)} size="sm" />
            </div>
            <p className="text-[11px] text-[var(--text-quaternary)] leading-relaxed">
              Bemor va shifokorga belgilangan vaqtdan oldin avtomatik eslatma yuboriladi.
            </p>
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="secondary" className="flex-1" onClick={() => setAddOpen(false)}>Bekor qilish</Button>
            <Button className="flex-1" onClick={handleCreate} disabled={!form.patientId || !form.time}>
              Rejalashtirish
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
