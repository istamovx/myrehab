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
import { PATIENTS } from '@/data/mock-data'
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
        'bg-white rounded-xl border shadow-[var(--shadow-xs)] transition-all hover:shadow-sm group',
        selected ? 'border-brand-300 ring-1 ring-brand-200' : 'border-gray-200',
      )}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <Checkbox checked={selected} onCheckedChange={() => onSelect(patient.id)} />
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link to="/patients/$patientId" params={{ patientId: patient.id }}>
              <button className="size-7 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
                <Edit size={13} />
              </button>
            </Link>
            <button className="size-7 rounded-md hover:bg-error-50 flex items-center justify-center text-gray-400 hover:text-error-600 transition-colors cursor-pointer">
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        <Link to="/patients/$patientId" params={{ patientId: patient.id }}>
          <div className="flex items-center gap-3 mb-4 cursor-pointer group/link">
            <Avatar name={patient.name} size="md" />
            <div>
              <p className="text-[11px] font-medium text-brand-600 uppercase tracking-wide">{t('patients.id')}: {patient.id}</p>
              <p className="text-sm font-semibold text-gray-900 group-hover/link:text-brand-700 transition-colors">{patient.name}</p>
            </div>
          </div>
        </Link>

        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <span className="text-gray-400 w-20 shrink-0 text-xs">{t('patients.procedure')}</span>
            <span className="font-medium text-gray-700 text-xs leading-snug">{patient.procedure}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400 w-20 shrink-0 text-xs">{t('common.status')}</span>
            <StatusBadge status={patient.status} />
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-400 w-20 shrink-0 text-xs">{t('common.date')}</span>
            <span className="font-medium text-gray-700 text-xs">{formatDate(patient.procedureDate)}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-400 w-20 shrink-0 text-xs">{t('patients.physician')}</span>
            <span className="font-medium text-gray-700 text-xs truncate">{patient.attendingPhysician}</span>
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
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
      <td className="pl-4 py-3">
        <Checkbox checked={selected} onCheckedChange={() => onSelect(patient.id)} />
      </td>
      <td className="px-4 py-3">
        <Link to="/patients/$patientId" params={{ patientId: patient.id }}>
          <div className="flex items-center gap-3 cursor-pointer">
            <Avatar name={patient.name} size="sm" />
            <div>
              <p className="text-[11px] text-brand-600 font-medium uppercase tracking-wide">{t('patients.id')}: {patient.id}</p>
              <p className="text-sm font-medium text-gray-900">{patient.name}</p>
            </div>
          </div>
        </Link>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 max-w-[180px] truncate">{patient.procedure}</td>
      <td className="px-4 py-3"><StatusBadge status={patient.status} /></td>
      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(patient.procedureDate)}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{patient.attendingPhysician}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {patient.tags.slice(0, 2).map(tag => <TagBadge key={tag} tag={tag} />)}
        </div>
      </td>
      <td className="pr-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link to="/patients/$patientId" params={{ patientId: patient.id }}>
            <button className="size-7 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer">
              <Edit size={13} />
            </button>
          </Link>
          <button className="size-7 rounded-md hover:bg-error-50 flex items-center justify-center text-gray-400 hover:text-error-600 transition-colors cursor-pointer">
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export function PatientsListPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [filterBy, setFilterBy] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [selected, setSelected] = useState<Set<string>>(new Set())

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

  const filtered = PATIENTS.filter(p => {
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

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(filtered.map(p => p.id)))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{t('patients.title')}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t('patients.subtitle', { count: PATIENTS.length })}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Input
            placeholder={t('patients.searchPlaceholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search size={14} />}
            className="w-52"
          />
          <Select value={filterBy} onValueChange={setFilterBy} options={FILTER_OPTIONS} placeholder={t('common.filter')} />
          <Select value={sortBy} onValueChange={setSortBy} options={SORT_OPTIONS} placeholder={t('common.sortBy')} />

          <div className="flex items-center h-9 bg-gray-100 rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'h-8 w-8 rounded-md flex items-center justify-center transition-all cursor-pointer',
                viewMode === 'list' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-400 hover:text-gray-600',
              )}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'h-8 w-8 rounded-md flex items-center justify-center transition-all cursor-pointer',
                viewMode === 'grid' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-400 hover:text-gray-600',
              )}
            >
              <LayoutGrid size={14} />
            </button>
          </div>

          <button className="inline-flex items-center gap-2 h-9 px-3.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer shadow-xs">
            <Download size={14} className="text-gray-400" />
            {t('common.export')}
          </button>

          <Button size="sm" className="h-9 px-4">
            <Plus size={14} />
            {t('patients.newPatient')}
          </Button>
        </div>
      </div>

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
            <div className="col-span-full text-center py-16 text-gray-400 text-sm">
              {t('patients.noPatients')}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-[var(--shadow-xs)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="pl-4 py-3 w-10">
                    <Checkbox
                      checked={allSelected ? true : selected.size > 0 ? 'indeterminate' : false}
                      onCheckedChange={toggleAll}
                    />
                  </th>
                  {[t('common.name'), t('patients.procedure'), t('common.status'), t('common.date'), t('patients.physician'), t('patients.tags'), ''].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-xs font-medium text-gray-500">
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
              <tbody className="divide-y divide-gray-100">
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
                    <td colSpan={8} className="text-center py-16 text-gray-400 text-sm">
                      {t('patients.noPatients')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {t('patients.showingOf', { count: filtered.length, total: PATIENTS.length })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
