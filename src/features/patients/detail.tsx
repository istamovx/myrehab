import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from '@tanstack/react-router'
import {
  ChevronLeft, Phone, Calendar, MessageSquare, MoreHorizontal,
  Edit, Plus, Eye, Download, ChevronRight, ChevronDown, FileText, FileType,
  AlertTriangle, Info, Activity, ClipboardCheck, CalendarClock, ShieldAlert,
  MapPin, Cake, Globe, Pill, HeartPulse, Stethoscope, BadgeAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { CircleCheck } from '@/components/ui/checkbox'
import { DonutChart } from '@/components/charts/donut-chart'
import { PageHeader } from '@/components/layout/page-header'
import { PATIENTS } from '@/data/mock-data'
import { formatDate, cn } from '@/lib/utils'

const ICU_LABEL: Record<string, string> = { Required: 'Zarur', 'Not required': 'Shart emas' }

function ageFromDob(dob: string): number {
  const d = new Date(dob)
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000)))
}

function AlertIcon({ type }: { type: 'high' | 'medium' | 'low' }) {
  if (type === 'high') return (
    <div className="size-9 rounded-xl bg-[var(--bg-error-primary)] flex items-center justify-center shrink-0">
      <AlertTriangle size={15} className="text-[var(--fg-error-primary)]" />
    </div>
  )
  if (type === 'medium') return (
    <div className="size-9 rounded-xl bg-[var(--bg-warning-primary)] flex items-center justify-center shrink-0">
      <AlertTriangle size={15} className="text-[var(--fg-warning-primary)]" />
    </div>
  )
  return (
    <div className="size-9 rounded-xl bg-[var(--bg-brand-primary)] flex items-center justify-center shrink-0">
      <Info size={15} className="text-[var(--text-brand-primary)]" />
    </div>
  )
}

function FileIcon({ type }: { type: 'pdf' | 'txt' | 'img' }) {
  if (type === 'pdf') return (
    <div className="size-8 rounded-lg bg-[var(--bg-error-primary)] flex items-center justify-center shrink-0">
      <FileType size={14} className="text-[var(--fg-error-primary)]" />
    </div>
  )
  return (
    <div className="size-8 rounded-lg bg-[var(--bg-brand-primary)] flex items-center justify-center shrink-0">
      <FileText size={14} className="text-[var(--text-brand-primary)]" />
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)]', className)}>
      {children}
    </div>
  )
}

function CardHeader({ title, icon: Icon, children }: { title: string; icon?: React.ElementType; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-secondary)]">
      <h3 className="text-[16px] font-semibold text-[var(--text-primary)] flex items-center gap-2">
        {Icon && <Icon size={16} className="text-[var(--fg-quaternary)]" />}
        {title}
      </h3>
      {children && <div className="flex items-center gap-1">{children}</div>}
    </div>
  )
}

function IconBtn({ icon: Icon, onClick }: { icon: React.ElementType; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="size-7 rounded-md hover:bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--fg-quaternary)] hover:text-[var(--text-tertiary)] cursor-pointer transition-colors"
    >
      <Icon size={14} />
    </button>
  )
}

function Chip({ children, tone = 'gray', icon: Icon }: { children: React.ReactNode; tone?: 'red' | 'amber' | 'blue' | 'gray'; icon?: React.ElementType }) {
  const tones = {
    red:   'bg-[var(--bg-error-primary)] text-[var(--text-error-primary)]',
    amber: 'bg-[var(--bg-warning-primary)] text-[var(--text-warning-primary)]',
    blue:  'bg-[var(--bg-brand-primary)] text-[var(--text-brand-secondary)]',
    gray:  'bg-[var(--bg-secondary)] text-[var(--text-tertiary)] border border-[var(--border-secondary)]',
  }
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[14px] font-medium', tones[tone])}>
      {Icon && <Icon size={13} />}
      {children}
    </span>
  )
}

// Colourful KPI tile (matches the engaging profile style)
function StatTile({ icon: Icon, label, value, sub, tint, children }: {
  icon: React.ElementType
  label: string
  value?: string | number
  sub?: string
  tint: 'blue' | 'green' | 'amber' | 'violet'
  children?: React.ReactNode
}) {
  const tints = {
    blue:   { bg: 'bg-[var(--bg-brand-primary)]',   fg: 'text-[var(--fg-brand-primary)]' },
    green:  { bg: 'bg-[var(--bg-success-primary)]',  fg: 'text-[var(--fg-success-primary)]' },
    amber:  { bg: 'bg-[var(--bg-warning-primary)]',  fg: 'text-[var(--fg-warning-primary)]' },
    violet: { bg: 'bg-[var(--bg-brand-primary)]',    fg: 'text-[var(--text-brand-primary)]' },
  }[tint]
  return (
    <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)] p-4 flex items-center gap-4">
      <div className={cn('size-12 rounded-xl flex items-center justify-center shrink-0', tints.bg)}>
        <Icon size={22} className={tints.fg} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] text-[var(--text-quaternary)] truncate">{label}</p>
        {value != null && <p className="text-[24px] font-bold text-[var(--text-primary)] leading-tight truncate">{value}</p>}
        {sub && <p className="text-[13px] text-[var(--fg-quaternary)] truncate">{sub}</p>}
        {children}
      </div>
    </div>
  )
}

export function PatientDetailPage() {
  const { t } = useTranslation()
  const params = useParams({ from: '/_admin/patients/$patientId' })
  const patient = PATIENTS.find(p => p.id === params.patientId) ?? PATIENTS[0]

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(patient.documents?.filter(g => g.expanded).map(g => g.group) ?? []),
  )

  function toggleGroup(group: string) {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(group)) next.delete(group); else next.add(group)
      return next
    })
  }

  // Derived engagement metrics
  const totalTasks = patient.checklist?.reduce((s, c) => s + c.totalTasks, 0) ?? 0
  const doneTasks  = patient.checklist?.reduce((s, c) => s + c.completedTasks, 0) ?? 0
  const progress   = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : (patient.status === 'Done' ? 100 : patient.status === 'Ready' ? 80 : 45)
  const doneStages = patient.checklist?.filter(c => c.status === 'done').length ?? 0
  const totalStages = patient.checklist?.length ?? 0
  const age = ageFromDob(patient.dateOfBirth)
  const asaHigh = patient.asaClassification === 'ASA III' || patient.asaClassification === 'ASA IV'

  return (
    <div className="space-y-5">
      <PageHeader
        title={t('patientDetail.title')}
        subtitle={t('patientDetail.subtitle', { id: patient.id, name: patient.name })}
        crumbs={[
          { label: t('nav.patients'), to: '/patients' },
          { label: patient.name },
        ]}
        actions={
          <Link to="/patients">
            <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[var(--border-secondary)] bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] text-[14px] font-medium text-[var(--text-secondary)] transition-colors cursor-pointer [box-shadow:var(--shadow-xs)]">
              <ChevronLeft size={16} className="text-[var(--fg-quaternary)]" />
              {t('nav.patients')}
            </button>
          </Link>
        }
      />

      {/* ── Hero header ─────────────────────────────────────────────── */}
      <Card>
        <div className="px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Avatar name={patient.name} size="xl" className="rounded-2xl shrink-0 size-20 text-[26px]" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-[22px] font-bold text-[var(--text-primary)]">{patient.name}</h2>
                <span className="text-[13px] font-semibold text-[var(--text-brand-primary)] bg-[var(--bg-brand-primary)] px-2.5 py-0.5 rounded-full">#{patient.id}</span>
                <StatusBadge status={patient.status} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-[var(--text-quaternary)]">
                <span className="inline-flex items-center gap-1.5"><Cake size={14} />{age} yosh · {patient.gender === 'Male' ? 'Erkak' : 'Ayol'}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin size={14} />{patient.location}</span>
                <span className="inline-flex items-center gap-1.5"><Stethoscope size={14} />{patient.attendingPhysician}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="primary" size="md"><Phone size={15} />{t('patientDetail.call')}</Button>
              <Button variant="secondary" size="md"><Calendar size={15} />{t('patientDetail.schedule')}</Button>
              <button className="size-10 rounded-lg border border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-quaternary)] cursor-pointer transition-colors [box-shadow:var(--shadow-xs)]">
                <MessageSquare size={16} />
              </button>
              <button className="size-10 rounded-lg border border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-quaternary)] cursor-pointer transition-colors [box-shadow:var(--shadow-xs)]">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* ── KPI tiles ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)] p-4 flex items-center gap-4">
          <div className="relative shrink-0">
            <DonutChart percentage={progress} color="#2970FF" size={56} strokeWidth={7} />
            <span className="absolute inset-0 flex items-center justify-center text-[14px] font-bold text-[var(--text-primary)]">{progress}%</span>
          </div>
          <div className="min-w-0">
            <p className="text-[14px] text-[var(--text-quaternary)]">Davolanish jarayoni</p>
            <p className="text-[20px] font-bold text-[var(--text-primary)] leading-tight">{progress < 50 ? 'Boshlang\'ich' : progress < 90 ? 'Davom etmoqda' : 'Yakuniga yaqin'}</p>
          </div>
        </div>
        <StatTile icon={ClipboardCheck} tint="green" label="Bajarilgan bosqichlar" value={`${doneStages}/${totalStages || '—'}`} sub={`${doneTasks}/${totalTasks} vazifa`} />
        <StatTile icon={CalendarClock} tint="amber" label="Keyingi qabul" value={formatDate(patient.procedureDate)} sub={patient.procedure} />
        <StatTile icon={asaHigh ? ShieldAlert : HeartPulse} tint={asaHigh ? 'violet' : 'blue'} label="Xavf darajasi (ASA)" value={patient.asaClassification ?? '—'} sub={asaHigh ? 'Yuqori e\'tibor talab' : 'Barqaror'} />
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left + middle (span 2) */}
        <div className="xl:col-span-2 space-y-5">
          {/* Planned procedure */}
          <Card>
            <CardHeader title={t('patientDetail.plannedProcedure')} icon={Stethoscope}>
              <IconBtn icon={Edit} />
            </CardHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[var(--border-secondary)]">
              {[
                { label: t('patientDetail.procedure'),       value: patient.procedure + (patient.procedureCode ? ` (${patient.procedureCode})` : '') },
                { label: t('patientDetail.surgeryDate'),     value: formatDate(patient.surgeryDate ?? patient.procedureDate) },
                { label: t('patientDetail.physician'),       value: patient.attendingPhysician },
                { label: t('patientDetail.physiotherapist'), value: patient.physioTherapist ?? 'Dr. Bobur Toshmatov' },
              ].map(row => (
                <div key={row.label} className="bg-[var(--bg-primary)] px-5 py-3.5">
                  <p className="text-[14px] text-[var(--fg-quaternary)] mb-0.5">{row.label}</p>
                  <p className="text-[16px] font-medium text-[var(--text-secondary)] leading-snug">{row.value}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Clinical overview */}
          <Card>
            <CardHeader title={t('patientDetail.clinicalOverview')} icon={HeartPulse}>
              <IconBtn icon={Edit} />
            </CardHeader>
            <div className="p-5 space-y-4">
              {/* chip groups */}
              <div>
                <p className="text-[14px] text-[var(--fg-quaternary)] mb-2 flex items-center gap-1.5"><BadgeAlert size={14} />{t('patientDetail.allergies')}</p>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies && patient.allergies.length > 0
                    ? patient.allergies.map(a => <Chip key={a} tone="red" icon={AlertTriangle}>{a}</Chip>)
                    : <span className="text-[15px] text-[var(--text-tertiary)]">Yo'q</span>}
                </div>
              </div>
              <div>
                <p className="text-[14px] text-[var(--fg-quaternary)] mb-2 flex items-center gap-1.5"><Activity size={14} />{t('patientDetail.preExisting')}</p>
                <div className="flex flex-wrap gap-2">
                  {patient.preExistingConditions && patient.preExistingConditions.length > 0
                    ? patient.preExistingConditions.map(c => <Chip key={c} tone="amber">{c}</Chip>)
                    : <span className="text-[15px] text-[var(--text-tertiary)]">Yo'q</span>}
                </div>
              </div>
              <div>
                <p className="text-[14px] text-[var(--fg-quaternary)] mb-2 flex items-center gap-1.5"><Pill size={14} />{t('patientDetail.medications')}</p>
                <div className="flex flex-wrap gap-2">
                  {patient.medications && patient.medications.length > 0
                    ? patient.medications.map(m => <Chip key={m} tone="blue" icon={Pill}>{m}</Chip>)
                    : <span className="text-[15px] text-[var(--text-tertiary)]">Yo'q</span>}
                </div>
              </div>

              {/* info rows */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border-secondary)]">
                {[
                  { icon: Globe,      label: t('patientDetail.language'),    value: patient.language ?? 'Ona tili — o\'zbek' },
                  { icon: ShieldAlert, label: t('patientDetail.dnr'),         value: patient.dnr ? t('patientDetail.active') : t('patientDetail.inactive'), danger: patient.dnr },
                  { icon: HeartPulse, label: t('patientDetail.icuNeed'),     value: ICU_LABEL[patient.icuNeed ?? ''] ?? '—', sub: patient.icuStatus },
                  { icon: Activity,   label: t('patientDetail.lastLabDate'), value: patient.lastLabDate ?? '—', sub: patient.lastLabUpdated ? `Yangilangan: ${patient.lastLabUpdated}` : undefined },
                ].map(row => (
                  <div key={row.label} className="bg-[var(--bg-secondary-subtle)] rounded-xl p-3">
                    <p className="text-[13px] text-[var(--fg-quaternary)] flex items-center gap-1.5 mb-1"><row.icon size={13} />{row.label}</p>
                    <p className={cn('text-[16px] font-semibold', row.danger ? 'text-[var(--fg-error-primary)]' : 'text-[var(--text-secondary)]')}>{row.value}</p>
                    {row.sub && <p className="text-[13px] text-[var(--fg-quaternary)] mt-0.5">{row.sub}</p>}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Checklist timeline */}
          {patient.checklist && (
            <Card>
              <CardHeader title={t('patientDetail.checklist')} icon={ClipboardCheck}>
                <IconBtn icon={Plus} />
                <IconBtn icon={Edit} />
              </CardHeader>
              <div className="p-4 space-y-1">
                {patient.checklist.map((item, idx) => {
                  const isDone = item.status === 'done'
                  const isInProgress = item.status === 'in-progress'
                  const isLast = idx === patient.checklist!.length - 1
                  return (
                    <div key={item.id} className="relative">
                      {!isLast && <div className="absolute left-[19px] top-9 bottom-0 w-px bg-[var(--bg-tertiary)]" />}
                      <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors">
                        <CircleCheck checked={isDone} inProgress={isInProgress} />
                        <div className="flex-1 min-w-0">
                          <span className={cn('text-[16px] font-semibold block truncate', isDone ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]')}>{item.name}</span>
                          <span className="text-[13px] text-[var(--fg-quaternary)]">
                            {t('patientDetail.tasks', { completed: item.completedTasks, total: item.totalTasks })}
                          </span>
                        </div>
                        <span className={cn(
                          'text-[13px] font-medium px-2.5 py-0.5 rounded-full shrink-0',
                          isDone ? 'text-[var(--text-success-primary)] bg-[var(--bg-success-primary)]'
                            : isInProgress ? 'text-[var(--text-brand-secondary)] bg-[var(--bg-brand-primary)]'
                              : 'text-[var(--text-quaternary)] bg-[var(--bg-tertiary)]',
                        )}>
                          {isDone ? t('checklist.done') : isInProgress ? t('checklist.inProgress') : t('checklist.pending')}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Alerts */}
          {patient.alerts && patient.alerts.length > 0 && (
            <Card>
              <CardHeader title={t('patientDetail.importantAlerts')} icon={AlertTriangle}>
                <IconBtn icon={Plus} />
              </CardHeader>
              <div className="divide-y divide-[var(--border-secondary)]">
                {patient.alerts.map(alert => (
                  <div key={alert.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-[var(--bg-secondary)] transition-colors">
                    <AlertIcon type={alert.type} />
                    <p className="text-[15px] text-[var(--text-secondary)] flex-1 leading-relaxed">{alert.message}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Documents */}
          {patient.documents && (
            <Card>
              <CardHeader title={t('patientDetail.keyDocuments')} icon={FileText}>
                <IconBtn icon={Plus} />
              </CardHeader>
              <div className="p-4 space-y-2">
                {patient.documents.map(group => (
                  <div key={group.group}>
                    <button
                      onClick={() => toggleGroup(group.group)}
                      className="flex items-center gap-2 w-full text-left py-2 px-2 rounded-lg hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors"
                    >
                      {expandedGroups.has(group.group)
                        ? <ChevronDown size={14} className="text-[var(--text-brand-primary)] shrink-0" />
                        : <ChevronRight size={14} className="text-[var(--fg-quaternary)] shrink-0" />}
                      <span className="text-[15px] font-semibold text-[var(--text-brand-secondary)] flex-1">{group.group}</span>
                      <span className="text-[13px] text-[var(--fg-quaternary)] bg-[var(--bg-secondary)] px-2 py-0.5 rounded-full">{group.files.length}</span>
                    </button>
                    {expandedGroups.has(group.group) && (
                      <div className="mt-1 space-y-1 ml-1">
                        {group.files.map(file => (
                          <div key={file.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors group/file">
                            <FileIcon type={file.type} />
                            <span className="text-[15px] text-[var(--text-secondary)] flex-1 truncate">{file.name}</span>
                            <div className="flex items-center gap-0.5 opacity-0 group-hover/file:opacity-100 transition-opacity">
                              <button className="size-7 rounded-md hover:bg-[var(--bg-primary)] flex items-center justify-center text-[var(--fg-quaternary)] hover:text-[var(--text-secondary)] cursor-pointer"><Eye size={13} /></button>
                              <button className="size-7 rounded-md hover:bg-[var(--bg-primary)] flex items-center justify-center text-[var(--fg-quaternary)] hover:text-[var(--text-secondary)] cursor-pointer"><Download size={13} /></button>
                            </div>
                          </div>
                        ))}
                        {group.files.length === 0 && (
                          <p className="text-[14px] text-[var(--fg-quaternary)] py-2 px-3">{t('patientDetail.noFiles')}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
