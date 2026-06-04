import { useState } from 'react'
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

const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'date', label: 'Procedure date' },
  { value: 'status', label: 'Status' },
  { value: 'id', label: 'Patient ID' },
]

const FILTER_OPTIONS = [
  { value: 'all', label: 'All patients' },
  { value: 'at-risk', label: 'At-Risk' },
  { value: 'ready', label: 'Ready' },
  { value: 'in-progress', label: 'In Progress' },
]

function PatientCard({ patient, selected, onSelect }: {
  patient: typeof PATIENTS[number]
  selected: boolean
  onSelect: (id: string) => void
}) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-5 shadow-[var(--shadow-card)] border-2 transition-all hover:shadow-md group',
        selected ? 'border-primary/30' : 'border-transparent',
      )}
    >
      {/* Card header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selected}
            onCheckedChange={() => onSelect(patient.id)}
          />
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            to="/patients/$patientId"
            params={{ patientId: patient.id }}
          >
            <button className="size-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-navy transition-colors cursor-pointer">
              <Edit size={14} />
            </button>
          </Link>
          <button className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-danger transition-colors cursor-pointer">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Patient info */}
      <Link to="/patients/$patientId" params={{ patientId: patient.id }}>
        <div className="flex items-center gap-3 mb-4 cursor-pointer">
          <Avatar name={patient.name} size="md" />
          <div>
            <p className="text-xs font-semibold text-primary">ID: {patient.id}</p>
            <p className="text-base font-bold text-navy">{patient.name}</p>
          </div>
        </div>
      </Link>

      {/* Details */}
      <div className="space-y-2.5">
        <div className="flex items-start gap-2 text-sm">
          <span className="text-gray-400 w-20 shrink-0">Procedure:</span>
          <span className="font-medium text-navy">{patient.procedure}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400 w-20 shrink-0">Status:</span>
          <StatusBadge status={patient.status} />
        </div>
        <div className="flex items-start gap-2 text-sm">
          <span className="text-gray-400 w-20 shrink-0">Date:</span>
          <span className="font-medium text-navy">{formatDate(patient.procedureDate)}</span>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <span className="text-gray-400 w-20 shrink-0">Physician:</span>
          <span className="font-medium text-navy truncate">{patient.attendingPhysician}</span>
        </div>
      </div>

      {/* Tags */}
      {patient.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-gray-100">
          {patient.tags.map(tag => (
            <TagBadge key={tag} tag={tag} />
          ))}
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
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
      <td className="pl-4 py-3.5">
        <Checkbox checked={selected} onCheckedChange={() => onSelect(patient.id)} />
      </td>
      <td className="px-4 py-3.5">
        <Link to="/patients/$patientId" params={{ patientId: patient.id }}>
          <div className="flex items-center gap-3 cursor-pointer">
            <Avatar name={patient.name} size="sm" />
            <div>
              <p className="text-xs text-primary font-medium">ID: {patient.id}</p>
              <p className="text-sm font-semibold text-navy">{patient.name}</p>
            </div>
          </div>
        </Link>
      </td>
      <td className="px-4 py-3.5 text-sm text-gray-600">{patient.procedure}</td>
      <td className="px-4 py-3.5">
        <StatusBadge status={patient.status} />
      </td>
      <td className="px-4 py-3.5 text-sm text-gray-600">{formatDate(patient.procedureDate)}</td>
      <td className="px-4 py-3.5 text-sm text-gray-600">{patient.attendingPhysician}</td>
      <td className="px-4 py-3.5">
        <div className="flex flex-wrap gap-1">
          {patient.tags.slice(0, 2).map(tag => <TagBadge key={tag} tag={tag} />)}
        </div>
      </td>
      <td className="pr-4 py-3.5">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link to="/patients/$patientId" params={{ patientId: patient.id }}>
            <button className="size-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-navy transition-colors cursor-pointer">
              <Edit size={13} />
            </button>
          </Link>
          <button className="size-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-danger transition-colors cursor-pointer">
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export function PatientsListPage() {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [filterBy, setFilterBy] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = PATIENTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.includes(search) ||
      p.procedure.toLowerCase().includes(search.toLowerCase())

    const matchFilter = filterBy === 'all' ||
      (filterBy === 'at-risk' && p.status === 'At-Risk') ||
      (filterBy === 'ready' && p.status === 'Ready') ||
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
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map(p => p.id)))
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-navy">All patients view</h1>

        <div className="flex items-center gap-2 flex-wrap">
          <Input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search size={15} />}
            className="w-48"
          />

          <Select
            value={filterBy}
            onValueChange={setFilterBy}
            options={FILTER_OPTIONS}
            placeholder="Filter"
            triggerClassName="gap-2"
          />

          <Select
            value={sortBy}
            onValueChange={setSortBy}
            options={SORT_OPTIONS}
            placeholder="Sort by"
            triggerClassName="gap-2"
          />

          {/* View toggle */}
          <div className="flex items-center h-9 bg-gray-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'size-7 rounded-lg flex items-center justify-center transition-all cursor-pointer',
                viewMode === 'list' ? 'bg-white text-navy shadow-sm' : 'text-gray-400 hover:text-gray-600',
              )}
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'size-7 rounded-lg flex items-center justify-center transition-all cursor-pointer',
                viewMode === 'grid' ? 'bg-white text-navy shadow-sm' : 'text-gray-400 hover:text-gray-600',
              )}
            >
              <LayoutGrid size={15} />
            </button>
          </div>

          <button className="inline-flex items-center gap-2 h-9 px-3.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-navy hover:border-gray-300 transition-colors cursor-pointer">
            <Download size={14} className="text-gray-400" />
            Export data
          </button>

          <Button size="sm" className="h-9 px-4">
            <Plus size={15} />
            New patient
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
            <div className="col-span-full text-center py-16 text-gray-400">
              No patients found
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pl-4 py-3.5 w-10">
                  <Checkbox
                    checked={allSelected ? true : selected.size > 0 ? 'indeterminate' : false}
                    onCheckedChange={toggleAll}
                  />
                </th>
                {['Patient', 'Procedure', 'Status', 'Date', 'Physician', 'Tags', ''].map(h => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {h && (
                      <span className="flex items-center gap-1">
                        {h}
                        {h !== '' && <ArrowUpDown size={12} className="opacity-50" />}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
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
                  <td colSpan={8} className="text-center py-16 text-gray-400">
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
