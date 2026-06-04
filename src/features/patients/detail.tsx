import { useState } from 'react'
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
    <div className="size-8 rounded-full bg-error-50 flex items-center justify-center shrink-0">
      <AlertTriangle size={13} className="text-error-600" />
    </div>
  )
  if (type === 'medium') return (
    <div className="size-8 rounded-full bg-warning-50 flex items-center justify-center shrink-0">
      <AlertTriangle size={13} className="text-warning-600" />
    </div>
  )
  return (
    <div className="size-8 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
      <Info size={13} className="text-brand-600" />
    </div>
  )
}

function FileIcon({ type }: { type: 'pdf' | 'txt' | 'img' }) {
  if (type === 'pdf') return (
    <div className="size-7 rounded-lg bg-error-50 flex items-center justify-center shrink-0">
      <FileType size={13} className="text-error-600" />
    </div>
  )
  return (
    <div className="size-7 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
      <FileText size={13} className="text-brand-600" />
    </div>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 shadow-[var(--shadow-xs)]', className)}>
      {children}
    </div>
  )
}

function CardHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {children && <div className="flex items-center gap-1">{children}</div>}
    </div>
  )
}

function IconBtn({ icon: Icon, onClick }: { icon: React.ElementType; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="size-7 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
    >
      <Icon size={13} />
    </button>
  )
}

export function PatientDetailPage() {
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
          <button className="size-9 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors cursor-pointer shadow-xs">
            <ChevronLeft size={16} className="text-gray-500" />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Patient information</h1>
          <p className="text-sm text-gray-500">ID: {patient.id} · {patient.name}</p>
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
                    <p className="text-base font-semibold text-gray-900">{patient.name}</p>
                    <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                      {patient.id}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-2 text-xs text-gray-500">
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
                  Call
                </Button>
                <Button variant="secondary" size="md" className="flex-1">
                  <Calendar size={14} />
                  Schedule
                </Button>
                <button className="size-10 rounded-lg border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-gray-500 cursor-pointer transition-colors shadow-xs">
                  <MoreHorizontal size={15} />
                </button>
              </div>
            </div>
          </Card>

          {/* Planned procedure */}
          <Card>
            <CardHeader title="Planned procedure">
              <IconBtn icon={Edit} />
            </CardHeader>
            <div className="p-5 space-y-3">
              {[
                { label: 'Procedure', value: patient.procedure + (patient.procedureCode ? ` (${patient.procedureCode})` : '') },
                { label: 'Surgery date', value: patient.surgeryDate ? formatDate(patient.surgeryDate) : formatDate(patient.procedureDate) },
                { label: 'Physician', value: patient.attendingPhysician },
                { label: 'Physiotherapist', value: patient.physioTherapist ?? 'Dr. Wade Warren' },
              ].map(row => (
                <div key={row.label} className="flex items-start gap-3 text-sm">
                  <span className="text-gray-400 w-28 shrink-0 text-xs">{row.label}</span>
                  <span className="font-medium text-gray-700 text-xs leading-snug">{row.value}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-400 w-28 shrink-0 text-xs">Status</span>
                <StatusBadge status={patient.status} />
              </div>
            </div>
          </Card>

          {/* Alerts */}
          {patient.alerts && patient.alerts.length > 0 && (
            <Card>
              <CardHeader title="Important alerts">
                <IconBtn icon={Plus} />
                <IconBtn icon={Settings2} />
              </CardHeader>
              <div className="divide-y divide-gray-50">
                {patient.alerts.map(alert => (
                  <div key={alert.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                    <AlertIcon type={alert.type} />
                    <p className="text-sm text-gray-700 flex-1 leading-relaxed">{alert.message}</p>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-gray-400 hover:text-gray-600 mt-0.5">
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
            <CardHeader title="Key clinical overview">
              <IconBtn icon={Edit} />
            </CardHeader>
            <div className="p-2">
              {[
                { label: 'Language', value: patient.language ?? 'Native speaker' },
                { label: 'Allergies', value: patient.allergies?.join(', ') ?? '—' },
                { label: 'Pre-existing', value: patient.preExistingConditions?.join(', ') ?? '—' },
                { label: 'Medications', value: patient.medications?.join(', ') ?? '—' },
                { label: 'DNR / DNI', value: patient.dnr ? 'Active' : 'Inactive', isDnr: patient.dnr },
                {
                  label: 'ASA class',
                  value: patient.asaClassification ?? '—',
                  sub: patient.asaUploadDate ? `Uploaded ${patient.asaUploadDate}` : undefined,
                  isAsa: true,
                  asaHigh: patient.asaClassification === 'ASA III' || patient.asaClassification === 'ASA IV',
                },
                {
                  label: 'ICU need',
                  value: patient.icuNeed ?? '—',
                  sub: patient.icuStatus,
                  isIcu: true,
                },
                {
                  label: 'Last lab date',
                  value: patient.lastLabDate ?? '—',
                  sub: patient.lastLabUpdated ? `Updated: ${patient.lastLabUpdated}` : undefined,
                },
              ].map(row => (
                <div
                  key={row.label}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-400 text-xs w-28 shrink-0 mt-0.5">{row.label}</span>
                  <div className="flex-1 flex items-center gap-2 flex-wrap">
                    {'isDnr' in row && row.isDnr ? (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-success-700">
                        <span className="size-1.5 rounded-full bg-success-600" />
                        {row.value}
                      </span>
                    ) : 'isAsa' in row && row.isAsa ? (
                      <span className={cn(
                        'flex items-center gap-1.5 text-xs font-semibold',
                        row.asaHigh ? 'text-error-600' : 'text-success-700',
                      )}>
                        <span className={cn('size-1.5 rounded-full', row.asaHigh ? 'bg-error-600' : 'bg-success-600')} />
                        {row.value}
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-gray-700">{row.value}</span>
                    )}
                    {row.sub && <span className="text-xs text-gray-400">{row.sub}</span>}
                    {'isIcu' in row && row.isIcu && row.sub && (
                      <span className="text-xs px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full font-medium">{row.sub}</span>
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
              <CardHeader title="Key documents">
                <IconBtn icon={Edit} />
                <IconBtn icon={Plus} />
              </CardHeader>
              <div className="p-4 space-y-2">
                {patient.documents.map(group => (
                  <div key={group.group}>
                    <button
                      onClick={() => toggleGroup(group.group)}
                      className="flex items-center gap-2 w-full text-left py-1.5 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      {expandedGroups.has(group.group)
                        ? <ChevronDown size={13} className="text-brand-500 shrink-0" />
                        : <ChevronRight size={13} className="text-gray-400 shrink-0" />}
                      <span className="text-xs font-semibold text-brand-700">{group.group}</span>
                    </button>

                    {expandedGroups.has(group.group) && (
                      <div className="mt-1 space-y-1 ml-1">
                        {group.files.map(file => (
                          <div
                            key={file.id}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group/file"
                          >
                            <FileIcon type={file.type} />
                            <span className="text-xs text-gray-700 flex-1 truncate">{file.name}</span>
                            <div className="flex items-center gap-0.5 opacity-0 group-hover/file:opacity-100 transition-opacity">
                              <button className="size-6 rounded-md hover:bg-white flex items-center justify-center text-gray-400 hover:text-gray-700 cursor-pointer">
                                <Eye size={12} />
                              </button>
                              <button className="size-6 rounded-md hover:bg-white flex items-center justify-center text-gray-400 hover:text-gray-700 cursor-pointer">
                                <Download size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {group.files.length === 0 && (
                          <p className="text-xs text-gray-400 py-2 px-3">No files</p>
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
              <CardHeader title="Checklist">
                <IconBtn icon={Search} />
                <IconBtn icon={Settings2} />
                <IconBtn icon={Edit} />
              </CardHeader>
              <div className="p-4 space-y-1">
                {patient.checklist.map((item, idx) => {
                  const isDone = item.status === 'done'
                  const isInProgress = item.status === 'in-progress'
                  const isLast = idx === patient.checklist!.length - 1

                  return (
                    <div key={item.id} className="relative">
                      {!isLast && (
                        <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-100" />
                      )}

                      <div
                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => toggleChecklist(item.id)}
                      >
                        <CircleCheck checked={isDone} inProgress={isInProgress} />

                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <span className="text-gray-400 hover:text-gray-600 shrink-0">
                            {expandedChecklist.has(item.id)
                              ? <ChevronDown size={13} />
                              : <ChevronRight size={13} />}
                          </span>
                          <div className="min-w-0">
                            <span className={cn('text-xs font-semibold block truncate', isDone ? 'text-gray-900' : 'text-gray-600')}>
                              {item.name}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {item.completedTasks}/{item.totalTasks} tasks
                            </span>
                          </div>
                        </div>

                        <span className={cn(
                          'text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0',
                          isDone
                            ? 'text-success-700 bg-success-50'
                            : isInProgress
                              ? 'text-brand-700 bg-brand-50'
                              : 'text-gray-500 bg-gray-100',
                        )}>
                          {isDone ? 'Done' : isInProgress ? 'In progress' : 'Pending'}
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
