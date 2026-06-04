import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from '@tanstack/react-router'
import {
  ChevronLeft, Phone, Calendar, MoreHorizontal,
  Edit, Plus, Search, Settings2, Eye, Download,
  ChevronRight, ChevronDown, FileText, FileType,
  AlertTriangle, Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { CircleCheck } from '@/components/ui/checkbox'
import { PATIENTS } from '@/data/mock-data'
import { formatDate, cn } from '@/lib/utils'

function AlertIcon({ type }: { type: 'high' | 'medium' | 'low' }) {
  if (type === 'high') return (
    <div className="size-8 rounded-full bg-[var(--bg-error-primary)] flex items-center justify-center shrink-0">
      <AlertTriangle size={13} className="text-[var(--fg-error-primary)]" />
    </div>
  )
  if (type === 'medium') return (
    <div className="size-8 rounded-full bg-[var(--bg-warning-primary)] flex items-center justify-center shrink-0">
      <AlertTriangle size={13} className="text-[var(--fg-warning-primary)]" />
    </div>
  )
  return (
    <div className="size-8 rounded-full bg-[var(--bg-brand-primary)] flex items-center justify-center shrink-0">
      <Info size={13} className="text-[var(--text-brand-primary)]" />
    </div>
  )
}

function FileIcon({ type }: { type: 'pdf' | 'txt' | 'img' }) {
  if (type === 'pdf') return (
    <div className="size-7 rounded-lg bg-[var(--bg-error-primary)] flex items-center justify-center shrink-0">
      <FileType size={13} className="text-[var(--fg-error-primary)]" />
    </div>
  )
  return (
    <div className="size-7 rounded-lg bg-[var(--bg-brand-primary)] flex items-center justify-center shrink-0">
      <FileText size={13} className="text-[var(--text-brand-primary)]" />
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)]', className)}>
      {children}
    </div>
  )
}

function CardHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-secondary)]">
      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
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
      <Icon size={13} />
    </button>
  )
}

export function PatientDetailPage() {
  const { t } = useTranslation()
  const params = useParams({ from: '/patients/$patientId' })
  const patient = PATIENTS.find(p => p.id === params.patientId) ?? PATIENTS[0]

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(patient.documents?.filter(g => g.expanded).map(g => g.group) ?? []),
  )
  const [expandedChecklist, setExpandedChecklist] = useState<Set<string>>(new Set())

  function toggleGroup(group: string) {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(group)) next.delete(group)
      else next.add(group)
      return next
    })
  }

  function toggleChecklist(id: string) {
    setExpandedChecklist(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb / header */}
      <div className="flex items-center gap-3">
        <Link to="/patients">
          <button className="size-9 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] flex items-center justify-center transition-colors cursor-pointer shadow-xs">
            <ChevronLeft size={16} className="text-[var(--text-quaternary)]" />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">{t('patientDetail.title')}</h1>
          <p className="text-sm text-[var(--text-quaternary)]">{t('patientDetail.subtitle', { id: patient.id, name: patient.name })}</p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="space-y-4">
          {/* Patient profile */}
          <Card>
            <div className="p-5">
              <div className="flex items-start gap-4 mb-5">
                <Avatar name={patient.name} size="xl" className="rounded-xl shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-base font-semibold text-[var(--text-primary)]">{patient.name}</p>
                    <span className="text-xs font-medium text-[var(--text-brand-primary)] bg-[var(--bg-brand-primary)] px-2 py-0.5 rounded-full">
                      {patient.id}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-2 text-xs text-[var(--text-quaternary)]">
                    <span>{patient.gender}</span>
                    <span>·</span>
                    <span>{patient.dateOfBirth}</span>
                    <span>·</span>
                    <span>{patient.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="primary" size="md" className="flex-1">
                  <Phone size={14} />
                  {t('patientDetail.call')}
                </Button>
                <Button variant="secondary" size="md" className="flex-1">
                  <Calendar size={14} />
                  {t('patientDetail.schedule')}
                </Button>
                <button className="size-10 rounded-lg border border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--text-quaternary)] cursor-pointer transition-colors shadow-xs">
                  <MoreHorizontal size={15} />
                </button>
              </div>
            </div>
          </Card>

          {/* Planned procedure */}
          <Card>
            <CardHeader title={t('patientDetail.plannedProcedure')}>
              <IconBtn icon={Edit} />
            </CardHeader>
            <div className="p-5 space-y-3">
              {[
                { label: t('patientDetail.procedure'),       value: patient.procedure + (patient.procedureCode ? ` (${patient.procedureCode})` : '') },
                { label: t('patientDetail.surgeryDate'),     value: patient.surgeryDate ? formatDate(patient.surgeryDate) : formatDate(patient.procedureDate) },
                { label: t('patientDetail.physician'),       value: patient.attendingPhysician },
                { label: t('patientDetail.physiotherapist'), value: patient.physioTherapist ?? 'Dr. Wade Warren' },
              ].map(row => (
                <div key={row.label} className="flex items-start gap-3 text-sm">
                  <span className="text-[var(--fg-quaternary)] w-28 shrink-0 text-xs">{row.label}</span>
                  <span className="font-medium text-[var(--text-secondary)] text-xs leading-snug">{row.value}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 text-sm">
                <span className="text-[var(--fg-quaternary)] w-28 shrink-0 text-xs">{t('common.status')}</span>
                <StatusBadge status={patient.status} />
              </div>
            </div>
          </Card>

          {/* Alerts */}
          {patient.alerts && patient.alerts.length > 0 && (
            <Card>
              <CardHeader title={t('patientDetail.importantAlerts')}>
                <IconBtn icon={Plus} />
                <IconBtn icon={Settings2} />
              </CardHeader>
              <div className="divide-y divide-[var(--border-secondary)]">
                {patient.alerts.map(alert => (
                  <div key={alert.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-[var(--bg-secondary)] transition-colors group">
                    <AlertIcon type={alert.type} />
                    <p className="text-sm text-[var(--text-secondary)] flex-1 leading-relaxed">{alert.message}</p>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[var(--fg-quaternary)] hover:text-[var(--text-tertiary)] mt-0.5">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Middle column */}
        <div className="space-y-4">
          <Card>
            <CardHeader title={t('patientDetail.clinicalOverview')}>
              <IconBtn icon={Edit} />
            </CardHeader>
            <div className="p-2">
              {[
                { label: t('patientDetail.language'),    value: patient.language ?? 'Native speaker' },
                { label: t('patientDetail.allergies'),   value: patient.allergies?.join(', ') ?? '—' },
                { label: t('patientDetail.preExisting'), value: patient.preExistingConditions?.join(', ') ?? '—' },
                { label: t('patientDetail.medications'), value: patient.medications?.join(', ') ?? '—' },
                { label: t('patientDetail.dnr'),         value: patient.dnr ? t('patientDetail.active') : t('patientDetail.inactive'), isDnr: patient.dnr },
                {
                  label:   t('patientDetail.asaClass'),
                  value:   patient.asaClassification ?? '—',
                  sub:     patient.asaUploadDate ? `Uploaded ${patient.asaUploadDate}` : undefined,
                  isAsa:   true,
                  asaHigh: patient.asaClassification === 'ASA III' || patient.asaClassification === 'ASA IV',
                },
                {
                  label:  t('patientDetail.icuNeed'),
                  value:  patient.icuNeed ?? '—',
                  sub:    patient.icuStatus,
                  isIcu:  true,
                },
                {
                  label: t('patientDetail.lastLabDate'),
                  value: patient.lastLabDate ?? '—',
                  sub:   patient.lastLabUpdated ? `Updated: ${patient.lastLabUpdated}` : undefined,
                },
              ].map(row => (
                <div
                  key={row.label}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <span className="text-[var(--fg-quaternary)] text-xs w-28 shrink-0 mt-0.5">{row.label}</span>
                  <div className="flex-1 flex items-center gap-2 flex-wrap">
                    {'isDnr' in row && row.isDnr ? (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-success-primary)]">
                        <span className="size-1.5 rounded-full bg-[var(--fg-success-primary)]" />
                        {row.value}
                      </span>
                    ) : 'isAsa' in row && row.isAsa ? (
                      <span className={cn(
                        'flex items-center gap-1.5 text-xs font-semibold',
                        row.asaHigh ? 'text-[var(--fg-error-primary)]' : 'text-[var(--text-success-primary)]',
                      )}>
                        <span className={cn('size-1.5 rounded-full', row.asaHigh ? 'bg-[var(--fg-error-primary)]' : 'bg-[var(--fg-success-primary)]')} />
                        {row.value}
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-[var(--text-secondary)]">{row.value}</span>
                    )}
                    {row.sub && <span className="text-xs text-[var(--fg-quaternary)]">{row.sub}</span>}
                    {'isIcu' in row && row.isIcu && row.sub && (
                      <span className="text-xs px-2 py-0.5 bg-[var(--bg-brand-primary)] text-[var(--text-brand-secondary)] rounded-full font-medium">{row.sub}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {patient.documents && (
            <Card>
              <CardHeader title={t('patientDetail.keyDocuments')}>
                <IconBtn icon={Edit} />
                <IconBtn icon={Plus} />
              </CardHeader>
              <div className="p-4 space-y-2">
                {patient.documents.map(group => (
                  <div key={group.group}>
                    <button
                      onClick={() => toggleGroup(group.group)}
                      className="flex items-center gap-2 w-full text-left py-1.5 px-2 rounded-lg hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors"
                    >
                      {expandedGroups.has(group.group)
                        ? <ChevronDown size={13} className="text-[var(--text-brand-primary)] shrink-0" />
                        : <ChevronRight size={13} className="text-[var(--fg-quaternary)] shrink-0" />}
                      <span className="text-xs font-semibold text-[var(--text-brand-secondary)]">{group.group}</span>
                    </button>

                    {expandedGroups.has(group.group) && (
                      <div className="mt-1 space-y-1 ml-1">
                        {group.files.map(file => (
                          <div
                            key={file.id}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors group/file"
                          >
                            <FileIcon type={file.type} />
                            <span className="text-xs text-[var(--text-secondary)] flex-1 truncate">{file.name}</span>
                            <div className="flex items-center gap-0.5 opacity-0 group-hover/file:opacity-100 transition-opacity">
                              <button className="size-6 rounded-md hover:bg-[var(--bg-primary)] flex items-center justify-center text-[var(--fg-quaternary)] hover:text-[var(--text-secondary)] cursor-pointer">
                                <Eye size={12} />
                              </button>
                              <button className="size-6 rounded-md hover:bg-[var(--bg-primary)] flex items-center justify-center text-[var(--fg-quaternary)] hover:text-[var(--text-secondary)] cursor-pointer">
                                <Download size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {group.files.length === 0 && (
                          <p className="text-xs text-[var(--fg-quaternary)] py-2 px-3">{t('patientDetail.noFiles')}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {patient.checklist && (
            <Card>
              <CardHeader title={t('patientDetail.checklist')}>
                <IconBtn icon={Search} />
                <IconBtn icon={Settings2} />
                <IconBtn icon={Edit} />
              </CardHeader>
              <div className="p-4 space-y-1">
                {patient.checklist.map((item, idx) => {
                  const isDone       = item.status === 'done'
                  const isInProgress = item.status === 'in-progress'
                  const isLast       = idx === patient.checklist!.length - 1

                  return (
                    <div key={item.id} className="relative">
                      {!isLast && (
                        <div className="absolute left-4 top-8 bottom-0 w-px bg-[var(--bg-tertiary)]" />
                      )}

                      <div
                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
                        onClick={() => toggleChecklist(item.id)}
                      >
                        <CircleCheck checked={isDone} inProgress={isInProgress} />

                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <span className="text-[var(--fg-quaternary)] hover:text-[var(--text-tertiary)] shrink-0">
                            {expandedChecklist.has(item.id)
                              ? <ChevronDown size={13} />
                              : <ChevronRight size={13} />}
                          </span>
                          <div className="min-w-0">
                            <span className={cn('text-xs font-semibold block truncate', isDone ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]')}>
                              {item.name}
                            </span>
                            <span className="text-[10px] text-[var(--fg-quaternary)]">
                              {t('patientDetail.tasks', { completed: item.completedTasks, total: item.totalTasks })}
                            </span>
                          </div>
                        </div>

                        <span className={cn(
                          'text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0',
                          isDone
                            ? 'text-[var(--text-success-primary)] bg-[var(--bg-success-primary)]'
                            : isInProgress
                              ? 'text-[var(--text-brand-secondary)] bg-[var(--bg-brand-primary)]'
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
      </div>
    </div>
  )
}
