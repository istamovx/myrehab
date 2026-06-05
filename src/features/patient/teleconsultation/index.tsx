import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Video, Clock, Bell, ExternalLink, Copy, Check, X } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { VideoRoom } from '@/features/teleconsultation/video-room'
import { ASSIGNED_DOCTOR } from '@/data/patient-mock-data'
import { generateMeetLink, meetCode } from '@/lib/meet'
import { offsetsLabel } from '@/lib/reminders'
import { cn, formatUzDateTime } from '@/lib/utils'

interface PatientTeleconsult {
  id: string
  doctorName: string
  doctorSpec: string
  scheduledAt: string
  durationMin: number
  meetUrl: string
  reminderOffsets: number[]
}

function plusHours(h: number): string {
  const d = new Date()
  d.setHours(d.getHours() + h, 0, 0, 0)
  return d.toISOString()
}

const SESSIONS: PatientTeleconsult[] = [
  { id: 'pt1', doctorName: ASSIGNED_DOCTOR.name, doctorSpec: ASSIGNED_DOCTOR.specialization, scheduledAt: plusHours(2),  durationMin: 30, meetUrl: generateMeetLink(), reminderOffsets: [60, 10] },
  { id: 'pt2', doctorName: ASSIGNED_DOCTOR.name, doctorSpec: ASSIGNED_DOCTOR.specialization, scheduledAt: plusHours(48), durationMin: 45, meetUrl: generateMeetLink(), reminderOffsets: [60, 10] },
]

function untilLabel(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now()
  if (diff < 0) return "O'tib ketgan"
  const mins = Math.round(diff / 60000)
  if (mins < 60) return `${mins} daqiqadan so'ng`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} soatdan so'ng`
  return `${Math.round(hours / 24)} kundan so'ng`
}

export function PatientTeleconsultationPage() {
  const { t } = useTranslation()
  const [active, setActive] = useState<PatientTeleconsult | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  async function copyLink(id: string, url: string) {
    await navigator.clipboard?.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('patient.teleconsultation', 'Onlayn konsultatsiya')}</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Shifokoringiz bilan Google Meet orqali video aloqa</p>
      </div>

      {/* Active room */}
      {active && (
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar name={active.doctorName} size="sm" />
              <div>
                <p className="text-[15px] font-semibold text-[var(--text-primary)]">{active.doctorName}</p>
                <p className="text-[12px] text-[var(--text-tertiary)]">{active.doctorSpec}</p>
              </div>
            </div>
            <button
              onClick={() => setActive(null)}
              className="size-8 rounded-lg hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--fg-quaternary)] cursor-pointer transition-colors"
            >
              <X size={17} />
            </button>
          </div>
          <VideoRoom meetUrl={active.meetUrl} peerName={active.doctorName} peerRole={active.doctorSpec} onEnd={() => setActive(null)} />
        </div>
      )}

      {/* Sessions list */}
      <div className="space-y-3">
        {SESSIONS.map(s => {
          const soon = new Date(s.scheduledAt).getTime() - Date.now() < 15 * 60000
          return (
            <div
              key={s.id}
              className={cn(
                'bg-[var(--bg-primary)] rounded-xl border p-4',
                active?.id === s.id ? 'border-[var(--border-brand)] ring-1 ring-[var(--blue-200)]' : 'border-[var(--border-secondary)]',
              )}
            >
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center shrink-0">
                  <Video size={18} className="text-teal-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[15px] font-semibold text-[var(--text-primary)] truncate">{s.doctorName}</p>
                    <span className={cn(
                      'text-[11px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0',
                      soon ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-[var(--bg-secondary)] text-[var(--text-tertiary)]',
                    )}>
                      {untilLabel(s.scheduledAt)}
                    </span>
                  </div>
                  <p className="text-[13px] text-[var(--text-tertiary)]">{s.doctorSpec}</p>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-1.5 flex items-center gap-1.5">
                    <Clock size={12} />
                    {formatUzDateTime(s.scheduledAt)} · {s.durationMin} daqiqa
                  </p>

                  {/* Meet link */}
                  <div className="flex items-center gap-2 bg-[var(--bg-secondary)] rounded-lg px-2.5 py-1.5 mt-3">
                    <Video size={13} className="text-teal-500 shrink-0" />
                    <span className="text-[12px] font-mono text-[var(--text-secondary)] flex-1 truncate">meet.google.com/{meetCode(s.meetUrl)}</span>
                    <button onClick={() => copyLink(s.id, s.meetUrl)} className="text-[var(--fg-quaternary)] hover:text-[var(--text-primary)] cursor-pointer shrink-0">
                      {copiedId === s.id ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                    </button>
                  </div>

                  {s.reminderOffsets.length > 0 && (
                    <p className="text-[12px] text-[var(--text-quaternary)] mt-2 flex items-center gap-1.5">
                      <Bell size={12} className="text-amber-500" />
                      Eslatma: {offsetsLabel(s.reminderOffsets)}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => setActive(s)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-[13px] font-semibold transition-colors cursor-pointer"
                    >
                      <Video size={14} />
                      Qo'shilish
                    </button>
                    <a href={s.meetUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center size-9 rounded-lg border border-[var(--border-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer">
                      <ExternalLink size={15} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {SESSIONS.length === 0 && (
          <p className="text-center text-[var(--text-tertiary)] py-12">Rejalashtirilgan video qabullar yo'q</p>
        )}
      </div>
    </div>
  )
}
