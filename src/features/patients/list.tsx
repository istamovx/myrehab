import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, ArrowUpDown, LayoutGrid, List, Download, Plus, Edit, Trash2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { StatusBadge, TagBadge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog } from '@/components/ui/dialog'
import { PageHeader } from '@/components/layout/page-header'
import { PATIENTS, type Patient, type PatientStatus } from '@/data/mock-data'
import { formatDate, cn } from '@/lib/utils'

function PatientCard({ patient, selected, onSelect }: {
  patient: typeof PATIENTS[number]
  selected: boolean
  onSelect: (id: string) => void
}) {
  const { t } = useTranslation()
  return (
    <div
      className={cn(
        'bg-[var(--bg-primary)] rounded-xl border shadow-[var(--shadow-xs)] transition-all hover:shadow-sm group',
        selected ? 'border-[var(--border-brand)] ring-1 ring-[var(--blue-200)]' : 'border-[var(--border-secondary)]',
      )}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <Checkbox checked={selected} onCheckedChange={() => onSelect(patient.id)} />
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link to="/patients/$patientId" params={{ patientId: patient.id }}>
              <button className="size-7 rounded-md hover:bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--fg-quaternary)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer">
                <Edit size={13} />
              </button>
            </Link>
            <button className="size-7 rounded-md hover:bg-[var(--bg-error-primary)] flex items-center justify-center text-[var(--fg-quaternary)] hover:text-[var(--fg-error-primary)] transition-colors cursor-pointer">
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        <Link to="/patients/$patientId" params={{ patientId: patient.id }}>
          <div className="flex items-center gap-3 mb-4 cursor-pointer group/link">
            <Avatar name={patient.name} size="md" />
            <div>
              <p className="text-[11px] font-medium text-[var(--text-brand-primary)] uppercase tracking-wide">{t('patients.id')}: {patient.id}</p>
              <p className="text-sm font-semibold text-[var(--text-primary)] group-hover/link:text-[var(--text-brand-secondary)] transition-colors">{patient.name}</p>
            </div>
          </div>
        </Link>

        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <span className="text-[var(--fg-quaternary)] w-20 shrink-0 text-xs">{t('patients.procedure')}</span>
            <span className="font-medium text-[var(--text-secondary)] text-xs leading-snug">{patient.procedure}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--fg-quaternary)] w-20 shrink-0 text-xs">{t('common.status')}</span>
            <StatusBadge status={patient.status} />
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[var(--fg-quaternary)] w-20 shrink-0 text-xs">{t('common.date')}</span>
            <span className="font-medium text-[var(--text-secondary)] text-xs">{formatDate(patient.procedureDate)}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[var(--fg-quaternary)] w-20 shrink-0 text-xs">{t('patients.physician')}</span>
            <span className="font-medium text-[var(--text-secondary)] text-xs truncate">{patient.attendingPhysician}</span>
          </div>
        </div>
      </div>

      {patient.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 px-5 pb-4">
          {patient.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
        </div>
      )}
    </div>
  )
}

function PatientRow({ patient, selected, onSelect }: {
  patient: typeof PATIENTS[number]
  selected: boolean
  onSelect: (id: string) => void
}) {
  const { t } = useTranslation()
  return (
    <tr className="border-b border-[var(--border-secondary)] last:border-0 hover:bg-[var(--bg-secondary-subtle)] transition-colors group">
      <td className="pl-5 py-4">
        <Checkbox checked={selected} onCheckedChange={() => onSelect(patient.id)} />
      </td>
      <td className="px-5 py-4">
        <Link to="/patients/$patientId" params={{ patientId: patient.id }}>
          <div className="flex items-center gap-3 cursor-pointer">
            <Avatar name={patient.name} size="sm" />
            <div>
              <p className="text-[11px] text-[var(--text-brand-primary)] font-semibold uppercase tracking-wide">{t('patients.id')}: {patient.id}</p>
              <p className="text-[14px] font-semibold text-[var(--text-primary)]">{patient.name}</p>
            </div>
          </div>
        </Link>
      </td>
      <td className="px-5 py-4 text-[14px] text-[var(--text-tertiary)] max-w-[180px] truncate">{patient.procedure}</td>
      <td className="px-5 py-4"><StatusBadge status={patient.status} /></td>
      <td className="px-5 py-4 text-[14px] text-[var(--text-tertiary)]">{formatDate(patient.procedureDate)}</td>
      <td className="px-5 py-4 text-[14px] text-[var(--text-tertiary)]">{patient.attendingPhysician}</td>
      <td className="px-5 py-4">
        <div className="flex flex-wrap gap-1">
          {patient.tags.slice(0, 2).map(tag => <TagBadge key={tag} tag={tag} />)}
        </div>
      </td>
      <td className="pr-5 py-4">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link to="/patients/$patientId" params={{ patientId: patient.id }}>
            <button className="size-7 rounded-md hover:bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--fg-quaternary)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer">
              <Edit size={13} />
            </button>
          </Link>
          <button className="size-7 rounded-md hover:bg-[var(--bg-error-primary)] flex items-center justify-center text-[var(--fg-quaternary)] hover:text-[var(--fg-error-primary)] transition-colors cursor-pointer">
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  )
}

const EMPTY_FORM = { name: '', gender: 'Male' as const, procedure: '', status: 'In Progress' as PatientStatus, attendingPhysician: '', procedureDate: '', dateOfBirth: '', location: '' }

export function PatientsListPage() {
  const { t } = useTranslation()
  const [patients, setPatients] = useState<Patient[]>(PATIENTS)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [filterBy, setFilterBy] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [addOpen, setAddOpen] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  function handleAddPatient() {
    if (!form.name || !form.procedure || !form.attendingPhysician) return
    const newPatient: Patient = {
      id: `P-${String(patients.length + 1).padStart(3, '0')}`,
      name: form.name,
      gender: form.gender,
      dateOfBirth: form.dateOfBirth || '1990-01-01',
      location: form.location || 'Toshkent',
      procedure: form.procedure,
      status: form.status,
      procedureDate: form.procedureDate || new Date().toISOString().slice(0, 10),
      attendingPhysician: form.attendingPhysician,
      tags: [],
    }
    setPatients(prev => [newPatient, ...prev])
    setAddSuccess(true)
    setTimeout(() => {
      setAddSuccess(false)
      setAddOpen(false)
      setForm(EMPTY_FORM)
    }, 1500)
  }

  const SORT_OPTIONS = [
    { value: 'name',   label: t('patients.sortByName') },
    { value: 'date',   label: t('patients.sortByDate') },
    { value: 'status', label: t('patients.sortByStatus') },
    { value: 'id',     label: t('patients.sortById') },
  ]

  const FILTER_OPTIONS = [
    { value: 'all',         label: t('patients.allPatients') },
    { value: 'at-risk',     label: t('patients.atRisk') },
    { value: 'ready',       label: t('patients.ready') },
    { value: 'in-progress', label: t('patients.inProgress') },
  ]

  const filtered = patients.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.includes(search) ||
      p.procedure.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filterBy === 'all' ||
      (filterBy === 'at-risk'     && p.status === 'At-Risk') ||
      (filterBy === 'ready'       && p.status === 'Ready') ||
      (filterBy === 'in-progress' && p.status === 'In Progress')
    return matchSearch && matchFilter
  })

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const allSelected = filtered.length > 0 && filtered.every(p => selected.has(p.id))

  function f(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(filtered.map(p => p.id)))
  }

  return (
    <div>
      <PageHeader
        title={t('patients.title')}
        subtitle={t('patients.subtitle', { count: patients.length })}
        crumbs={[{ label: t('nav.patients') }]}
        actions={
          <>
            <div className="w-44 sm:w-56">
              <Input
                placeholder={t('patients.searchPlaceholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                leftIcon={<Search />}
                uiSize="sm"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy} options={FILTER_OPTIONS} placeholder={t('common.filter')} />
            <Select value={sortBy} onValueChange={setSortBy} options={SORT_OPTIONS} placeholder={t('common.sortBy')} />

            <div className="flex items-center h-9 bg-[var(--bg-tertiary)] rounded-lg p-0.5 gap-0.5">
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'h-8 w-8 rounded-md flex items-center justify-center transition-all cursor-pointer',
                  viewMode === 'list' ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] [box-shadow:var(--shadow-xs)]' : 'text-[var(--fg-quaternary)] hover:text-[var(--text-tertiary)]',
                )}
              >
                <List size={15} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'h-8 w-8 rounded-md flex items-center justify-center transition-all cursor-pointer',
                  viewMode === 'grid' ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] [box-shadow:var(--shadow-xs)]' : 'text-[var(--fg-quaternary)] hover:text-[var(--text-tertiary)]',
                )}
              >
                <LayoutGrid size={15} />
              </button>
            </div>

            <Button variant="secondary" size="sm">
              <Download size={15} />
              <span className="hidden sm:inline">{t('common.export')}</span>
            </Button>

            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus size={15} />
              {t('patients.newPatient')}
            </Button>
          </>
        }
      />

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(patient => (
            <PatientCard
              key={patient.id}
              patient={patient}
              selected={selected.has(patient.id)}
              onSelect={toggleSelect}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-[var(--fg-quaternary)] text-sm">
              {t('patients.noPatients')}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] [box-shadow:var(--shadow-xs)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--bg-secondary-subtle)] border-b border-[var(--border-secondary)]">
                  <th className="pl-5 py-3 w-10">
                    <Checkbox
                      checked={allSelected ? true : selected.size > 0 ? 'indeterminate' : false}
                      onCheckedChange={toggleAll}
                    />
                  </th>
                  {[t('common.name'), t('patients.procedure'), t('common.status'), t('common.date'), t('patients.physician'), t('patients.tags'), ''].map((h, i) => (
                    <th key={i} className="px-5 py-3 text-left text-[12px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)] whitespace-nowrap">
                      {h && (
                        <span className="flex items-center gap-1">
                          {h}
                          <ArrowUpDown size={11} className="opacity-40" />
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-secondary)]">
                {filtered.map(patient => (
                  <PatientRow
                    key={patient.id}
                    patient={patient}
                    selected={selected.has(patient.id)}
                    onSelect={toggleSelect}
                  />
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-[var(--fg-quaternary)] text-sm">
                      {t('patients.noPatients')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="px-5 py-3.5 border-t border-[var(--border-secondary)] flex items-center justify-between bg-[var(--bg-secondary-subtle)]">
              <p className="text-[13px] text-[var(--text-tertiary)]">
                {t('patients.showingOf', { count: filtered.length, total: patients.length })}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add Patient Dialog */}
      <Dialog
        open={addOpen}
        onOpenChange={open => { setAddOpen(open); if (!open) { setAddSuccess(false); setForm(EMPTY_FORM) } }}
        title={t('patients.newPatient')}
        description="Yangi bemor ma'lumotlarini kiriting"
      >
        {addSuccess ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="size-14 rounded-full bg-[var(--bg-success-primary)] flex items-center justify-center">
              <Plus size={26} className="text-[var(--fg-success-primary)]" />
            </div>
            <p className="text-[16px] font-semibold text-[var(--text-primary)]">Bemor qo'shildi!</p>
            <p className="text-[13px] text-[var(--text-tertiary)]">{form.name}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">{t('common.name')} *</label>
                <Input value={form.name} onChange={e => f('name', e.target.value)} placeholder="Jasur Mirzayev" />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Jinsi</label>
                <Select value={form.gender} onValueChange={v => f('gender', v)} options={[{ value: 'Male', label: 'Erkak' }, { value: 'Female', label: 'Ayol' }]} triggerClassName="w-full" />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Holat</label>
                <Select value={form.status} onValueChange={v => f('status', v)} options={[
                  { value: 'In Progress', label: t('patients.inProgress') },
                  { value: 'At-Risk', label: t('patients.atRisk') },
                  { value: 'Ready', label: t('patients.ready') },
                  { value: 'Awaiting clearance', label: t('patients.awaitingClearance') },
                ]} triggerClassName="w-full" />
              </div>
              <div className="col-span-2">
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Protsedura *</label>
                <Input value={form.procedure} onChange={e => f('procedure', e.target.value)} placeholder="ACL Reconstruction" />
              </div>
              <div className="col-span-2">
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">{t('patientDetail.physician')} *</label>
                <Input value={form.attendingPhysician} onChange={e => f('attendingPhysician', e.target.value)} placeholder="Dr. Aziz Karimov" />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Tug'ilgan sana</label>
                <Input type="date" value={form.dateOfBirth} onChange={e => f('dateOfBirth', e.target.value)} />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Protsedura sanasi</label>
                <Input type="date" value={form.procedureDate} onChange={e => f('procedureDate', e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setAddOpen(false)}>{t('common.cancel')}</Button>
              <Button
                className="flex-1"
                onClick={handleAddPatient}
                disabled={!form.name || !form.procedure || !form.attendingPhysician}
              >
                {t('common.add')}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}
