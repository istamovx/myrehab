import { useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import {
  ChevronLeft, Phone, Calendar, MoreHorizontal,
  Edit, Plus, Search, Settings2, Eye, Download,
  ChevronRight, ChevronDown, FileText, FileType,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { CircleCheck } from '@/components/ui/checkbox'
import { PATIENTS } from '@/data/mock-data'
import { formatDate, cn } from '@/lib/utils'

function AlertIcon({ type }: { type: 'high' | 'medium' | 'low' }) {
  const cfg = {
    high: { bg: 'bg-danger-bg', text: 'text-danger', icon: '!' },
    medium: { bg: 'bg-warning-bg', text: 'text-warning', icon: '!' },
    low: { bg: 'bg-info-bg', text: 'text-info', icon: 'i' },
  }[type]
  return (
    <div className={cn('size-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm', cfg.bg, cfg.text)}>
      {cfg.icon}
    </div>
  )
}

function FileIcon({ type }: { type: 'pdf' | 'txt' | 'img' }) {
  if (type === 'pdf') {
    return (
      <div className="size-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
        <FileType size={14} className="text-danger" />
      </div>
    )
  }
  return (
    <div className="size-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
      <FileText size={14} className="text-primary" />
    </div>
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
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <Link to="/patients">
          <button className="size-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors cursor-pointer">
            <ChevronLeft size={18} className="text-gray-500" />
          </button>
        </Link>
        <h1 className="text-2xl font-bold text-navy">Patient information</h1>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="space-y-5">
          {/* Patient profile card */}
          <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-4 mb-5">
              <Avatar name={patient.name} size="xl" className="rounded-xl" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-lg font-bold text-navy">{patient.name}</p>
                  <span className="text-sm text-primary font-semibold">ID: {patient.id}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 flex-wrap">
                  <span>{patient.gender}</span>
                  <span className="text-gray-200">|</span>
                  <span>{patient.dateOfBirth}</span>
                  <span className="text-gray-200">|</span>
                  <span>{patient.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="primary" size="md" className="flex-1">
                <Phone size={15} />
                Call
              </Button>
              <Button variant="secondary" size="md" className="flex-1">
                <Calendar size={15} />
                Schedule visit
              </Button>
              <button className="size-10 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer transition-colors shrink-0">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          {/* Planned procedure */}
          <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-sm font-bold text-navy mb-4">Planned procedure details</h3>
            <div className="space-y-3">
              {[
                { label: 'Planned procedure', value: patient.procedure + (patient.procedureCode ? ` (${patient.procedureCode})` : '') },
                { label: 'Surgery date', value: patient.surgeryDate ? formatDate(patient.surgeryDate) : formatDate(patient.procedureDate) },
                { label: 'Attending physician', value: patient.attendingPhysician },
                { label: 'Physiotherapist', value: patient.physioTherapist ?? 'Dr. Wade Warren' },
                {
                  label: 'Status',
                  value: null,
                  custom: <StatusBadge status={patient.status} />,
                },
              ].map(row => (
                <div key={row.label} className="flex items-start gap-2 text-sm">
                  <span className="text-gray-400 w-40 shrink-0">{row.label}:</span>
                  {row.custom ?? <span className="font-medium text-navy">{row.value}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Important alerts */}
          {patient.alerts && patient.alerts.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-navy">Important alerts</h3>
                <div className="flex items-center gap-1.5">
                  <button className="size-7 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer">
                    <Plus size={14} />
                  </button>
                  <button className="size-7 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer">
                    <Settings2 size={14} />
                  </button>
                </div>
              </div>
              <div className="space-y-2.5">
                {patient.alerts.map(alert => (
                  <div key={alert.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group">
                    <AlertIcon type={alert.type} />
                    <p className="text-sm text-navy flex-1">{alert.message}</p>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-gray-400 hover:text-gray-600">
                      <MoreHorizontal size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Middle column */}
        <div className="space-y-5">
          {/* Key clinical overview */}
          <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-navy">Key clinical overview</h3>
              <button className="size-7 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer">
                <Edit size={14} />
              </button>
            </div>
            <div className="space-y-1.5">
              {[
                { label: 'Language', value: patient.language ?? 'Native speaker' },
                { label: 'Allergies', value: patient.allergies?.join(', ') ?? '—' },
                { label: 'Pre-existing conditions', value: patient.preExistingConditions?.join(', ') ?? '—' },
                { label: 'Medications', value: patient.medications?.join(', ') ?? '—' },
                { label: 'DNR / DNI', value: patient.dnr ? 'Active' : 'Inactive', isDnr: patient.dnr },
                {
                  label: 'ASA classification',
                  value: patient.asaClassification ?? '—',
                  sub: patient.asaUploadDate ? `(Uploaded ${patient.asaUploadDate})` : undefined,
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
                  sub: patient.lastLabUpdated ? `Last updated: ${patient.lastLabUpdated}` : undefined,
                },
              ].map(row => (
                <div
                  key={row.label}
                  className="flex items-start gap-3 px-4 py-3 rounded-xl bg-gray-50/80 hover:bg-gray-100/60 transition-colors"
                >
                  <span className="text-gray-400 text-sm w-40 shrink-0">{row.label}:</span>
                  <div className="flex-1 flex items-center gap-2 flex-wrap">
                    {'isDnr' in row && row.isDnr ? (
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-success">
                        <span className="size-2 rounded-full bg-success" />
                        {row.value}
                      </span>
                    ) : 'isAsa' in row && row.isAsa ? (
                      <span className={cn(
                        'flex items-center gap-1.5 text-sm font-semibold',
                        row.asaHigh ? 'text-danger' : 'text-success',
                      )}>
                        <span className={cn('size-2 rounded-full', row.asaHigh ? 'bg-danger' : 'bg-success')} />
                        {row.value}
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-navy">{row.value}</span>
                    )}
                    {row.sub && (
                      <span className="text-xs text-gray-400">{row.sub}</span>
                    )}
                    {'isIcu' in row && row.isIcu && row.sub && (
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-lg font-medium">
                        {row.sub}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Key documents */}
          {patient.documents && (
            <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-navy">Key documents</h3>
                <div className="flex items-center gap-1.5">
                  <button className="size-7 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer">
                    <Edit size={14} />
                  </button>
                  <button className="size-7 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer">
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {patient.documents.map(group => (
                  <div key={group.group}>
                    <button
                      onClick={() => toggleGroup(group.group)}
                      className="flex items-center gap-2 w-full text-left py-1 cursor-pointer"
                    >
                      {expandedGroups.has(group.group)
                        ? <ChevronDown size={14} className="text-primary" />
                        : <ChevronRight size={14} className="text-gray-400" />}
                      <span className="text-sm font-semibold text-primary">{group.group}</span>
                    </button>

                    {expandedGroups.has(group.group) && (
                      <div className="mt-1.5 space-y-1.5 ml-1">
                        {group.files.map(file => (
                          <div
                            key={file.id}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                          >
                            <FileIcon type={file.type} />
                            <span className="text-sm text-navy flex-1 truncate">{file.name}</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="size-6 rounded-lg hover:bg-white flex items-center justify-center text-gray-400 hover:text-navy cursor-pointer">
                                <Eye size={13} />
                              </button>
                              <button className="size-6 rounded-lg hover:bg-white flex items-center justify-center text-gray-400 hover:text-navy cursor-pointer">
                                <Download size={13} />
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
            </div>
          )}

          {/* Checklist */}
          {patient.checklist && (
            <div className="bg-white rounded-2xl p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-navy">Checklist</h3>
                <div className="flex items-center gap-1.5">
                  <button className="size-7 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer">
                    <Search size={14} />
                  </button>
                  <button className="size-7 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer">
                    <Settings2 size={14} />
                  </button>
                  <button className="size-7 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 cursor-pointer">
                    <Edit size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {patient.checklist.map((item, idx) => {
                  const isDone = item.status === 'done'
                  const isInProgress = item.status === 'in-progress'
                  const isLast = idx === patient.checklist!.length - 1

                  return (
                    <div key={item.id} className="relative">
                      {/* Connector line */}
                      {!isLast && (
                        <div className="absolute left-3.5 top-8 bottom-0 w-0.5 bg-gray-100" />
                      )}

                      <div
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => toggleChecklist(item.id)}
                      >
                        <CircleCheck
                          checked={isDone}
                          inProgress={isInProgress}
                        />

                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <button className="text-gray-400 hover:text-gray-600">
                            {expandedChecklist.has(item.id)
                              ? <ChevronDown size={14} />
                              : <ChevronRight size={14} />}
                          </button>
                          <span className={cn(
                            'text-sm font-semibold',
                            isDone ? 'text-navy' : 'text-gray-600',
                          )}>
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            Tasks: {item.completedTasks} of {item.totalTasks} completed
                          </span>
                        </div>

                        <div className={cn(
                          'flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0',
                          isDone
                            ? 'text-success bg-success-bg'
                            : isInProgress
                              ? 'text-primary bg-primary-light'
                              : 'text-gray-400 bg-gray-100',
                        )}>
                          {isDone ? (
                            <>✓ Done</>
                          ) : isInProgress ? (
                            <><span className="size-1.5 rounded-full bg-primary" />In progress</>
                          ) : (
                            <>Pending</>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
