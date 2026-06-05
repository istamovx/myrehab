import { useState, useMemo } from 'react'
import { Search, Plus, Eye, CheckCircle, Trash2, FlaskConical, Clock, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { PageHeader } from '@/components/layout/page-header'
import { SUPABASE_ENABLED } from '@/lib/supabase'
import {
  getLabResults,
  createLabResult,
  updateLabResult,
  completeLabResult,
} from '@/services/lab-results.service'
import type { LabResult, Json } from '@/types/database.types'
import { cn } from '@/lib/utils'

type Status = 'all' | 'pending' | 'in_progress' | 'completed'

interface ResultRow {
  parameter: string
  value: string
  unit: string
  reference_range: string
  is_abnormal: boolean
}

const MOCK_RESULTS: LabResult[] = [
  {
    id: '1', patient_id: 'p1', ordered_by: 'd1', organization_id: 'demo',
    test_name: 'KLA - Klinik qon tahlili', test_code: 'CBC',
    status: 'completed', ordered_at: '2026-05-28T08:00:00Z', completed_at: '2026-05-28T11:30:00Z',
    notes: 'Oddiy tekshiruv',
    results: [
      { parameter: 'Gemoglobin', value: '118', unit: 'g/L', reference_range: '120–160', is_abnormal: true },
      { parameter: 'Eritrotsitlar', value: '4.2', unit: '×10¹²/L', reference_range: '3.8–5.2', is_abnormal: false },
      { parameter: 'Leykotsitlar', value: '7.4', unit: '×10⁹/L', reference_range: '4.0–10.0', is_abnormal: false },
      { parameter: 'Trombotsitlar', value: '210', unit: '×10⁹/L', reference_range: '150–400', is_abnormal: false },
    ] as Json,
  },
  {
    id: '2', patient_id: 'p2', ordered_by: 'd1', organization_id: 'demo',
    test_name: 'Биохимия крови', test_code: 'BMP',
    status: 'in_progress', ordered_at: '2026-06-01T09:00:00Z', completed_at: null,
    notes: null,
    results: null,
  },
  {
    id: '3', patient_id: 'p1', ordered_by: 'd2', organization_id: 'demo',
    test_name: 'Mochevina', test_code: 'UREA',
    status: 'pending', ordered_at: '2026-06-03T10:15:00Z', completed_at: null,
    notes: 'Buyrak funktsiyasi nazorati',
    results: null,
  },
  {
    id: '4', patient_id: 'p3', ordered_by: 'd1', organization_id: 'demo',
    test_name: 'C-reaktiv oqsil (CRP)', test_code: 'CRP',
    status: 'completed', ordered_at: '2026-05-30T14:00:00Z', completed_at: '2026-05-31T09:00:00Z',
    notes: null,
    results: [
      { parameter: 'CRP', value: '18.4', unit: 'mg/L', reference_range: '< 5.0', is_abnormal: true },
    ] as Json,
  },
  {
    id: '5', patient_id: 'p2', ordered_by: 'd2', organization_id: 'demo',
    test_name: 'ОАМ - Umumiy siydik tahlili', test_code: 'UA',
    status: 'pending', ordered_at: '2026-06-04T08:30:00Z', completed_at: null,
    notes: null,
    results: null,
  },
]

const MOCK_PATIENTS = [
  { id: 'p1', name: 'Jasur Mirzayev' },
  { id: 'p2', name: 'Malika Yusupova' },
  { id: 'p3', name: 'Bobur Toshmatov' },
]

const STATUS_LABEL: Record<string, string> = {
  pending: 'Kutilmoqda',
  in_progress: 'Jarayonda',
  completed: 'Tayyor',
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-[var(--bg-secondary)] text-[var(--text-tertiary)]',
  in_progress: 'bg-amber-50 text-amber-700',
  completed: 'bg-green-50 text-green-700',
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending: <Clock size={11} />,
  in_progress: <Loader2 size={11} className="animate-spin" />,
  completed: <CheckCircle size={11} />,
}

const EMPTY_FORM = {
  test_name: '', test_code: '', patient_id: '', ordered_at: '', notes: '',
}

const EMPTY_ROW: ResultRow = { parameter: '', value: '', unit: '', reference_range: '', is_abnormal: false }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function getPatientName(patientId: string) {
  return MOCK_PATIENTS.find(p => p.id === patientId)?.name ?? patientId
}

export function LabResultsPage() {
  const [items, setItems] = useState<LabResult[]>(MOCK_RESULTS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<Status>('all')
  const [addOpen, setAddOpen] = useState(false)
  const [viewItem, setViewItem] = useState<LabResult | null>(null)
  const [enterItem, setEnterItem] = useState<LabResult | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LabResult | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [resultRows, setResultRows] = useState<ResultRow[]>([{ ...EMPTY_ROW }])
  const [saving, setSaving] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)
  const [enterSuccess, setEnterSuccess] = useState(false)

  const ORG_ID = 'demo'

  async function loadItems() {
    if (SUPABASE_ENABLED) {
      const data = await getLabResults(ORG_ID)
      setItems(data)
    }
  }

  const filtered = useMemo(() => {
    return items.filter(item => {
      const matchSearch = item.test_name.toLowerCase().includes(search.toLowerCase()) ||
        (item.test_code ?? '').toLowerCase().includes(search.toLowerCase()) ||
        getPatientName(item.patient_id).toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || item.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [items, search, statusFilter])

  async function handleAdd() {
    if (!form.test_name || !form.patient_id) return
    setSaving(true)
    try {
      const payload = {
        test_name: form.test_name,
        test_code: form.test_code || null,
        patient_id: form.patient_id,
        organization_id: ORG_ID,
        ordered_at: form.ordered_at || new Date().toISOString(),
        notes: form.notes || null,
        status: 'pending' as const,
        results: null,
        ordered_by: null,
        completed_at: null,
      }
      if (SUPABASE_ENABLED) {
        await createLabResult(payload)
        await loadItems()
      } else {
        setItems(prev => [{ id: String(Date.now()), ...payload }, ...prev])
      }
      setAddSuccess(true)
      setTimeout(() => {
        setAddSuccess(false)
        setAddOpen(false)
        setForm(EMPTY_FORM)
      }, 1400)
    } finally {
      setSaving(false)
    }
  }

  async function handleEnterResults() {
    if (!enterItem) return
    const validRows = resultRows.filter(r => r.parameter && r.value)
    if (validRows.length === 0) return
    setSaving(true)
    try {
      if (SUPABASE_ENABLED) {
        await completeLabResult(enterItem.id, validRows as unknown as Json)
        await loadItems()
      } else {
        setItems(prev => prev.map(i =>
          i.id === enterItem.id
            ? { ...i, status: 'completed' as const, results: validRows as unknown as Json, completed_at: new Date().toISOString() }
            : i,
        ))
      }
      setEnterSuccess(true)
      setTimeout(() => {
        setEnterSuccess(false)
        setEnterItem(null)
        setResultRows([{ ...EMPTY_ROW }])
      }, 1400)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    if (SUPABASE_ENABLED) {
      await updateLabResult(deleteTarget.id, { status: 'completed' })
      await loadItems()
    } else {
      setItems(prev => prev.filter(i => i.id !== deleteTarget.id))
    }
    setDeleteTarget(null)
  }

  function addRow() {
    setResultRows(prev => [...prev, { ...EMPTY_ROW }])
  }

  function updateRow(index: number, key: keyof ResultRow, value: string | boolean) {
    setResultRows(prev => prev.map((r, i) => i === index ? { ...r, [key]: value } : r))
  }

  function removeRow(index: number) {
    setResultRows(prev => prev.filter((_, i) => i !== index))
  }

  const TABS: { value: Status; label: string }[] = [
    { value: 'all', label: 'Barchasi' },
    { value: 'pending', label: 'Kutilmoqda' },
    { value: 'in_progress', label: 'Jarayonda' },
    { value: 'completed', label: 'Tayyor' },
  ]

  const PATIENT_OPTIONS = MOCK_PATIENTS.map(p => ({ value: p.id, label: p.name }))

  return (
    <div>
      <PageHeader
        title="Laboratoriya natijalari"
        subtitle={`${items.length} ta tahlil`}
        crumbs={[{ label: 'Laboratoriya' }]}
        actions={
          <Button size="sm" onClick={() => { setForm(EMPTY_FORM); setAddSuccess(false); setAddOpen(true) }}>
            <Plus size={15} />
            Yangi tahlil
          </Button>
        }
      />

      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] [box-shadow:var(--shadow-xs)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border-secondary)] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-[var(--bg-secondary)] rounded-lg p-0.5">
            {TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={cn(
                  'px-3 h-7 rounded-md text-[13px] font-medium transition-all cursor-pointer',
                  statusFilter === tab.value
                    ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] [box-shadow:var(--shadow-xs)]'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="w-56">
            <Input
              placeholder="Test nomi yoki bemor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftIcon={<Search />}
              uiSize="sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-secondary)] bg-[var(--bg-secondary)]">
                {['Test nomi', 'Bemor', 'Shifokor', 'Holat', 'Buyurtma sanasi', 'Bajarilgan', ''].map((h, i) => (
                  <th
                    key={i}
                    className={cn(
                      'px-4 py-3 text-left text-[11px] uppercase tracking-wide text-[var(--text-quaternary)] font-semibold whitespace-nowrap',
                      i === 0 && 'pl-5',
                      i === 6 && 'pr-5',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr
                  key={item.id}
                  className="border-b border-[var(--border-secondary)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors group"
                >
                  <td className="pl-5 pr-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-lg bg-[var(--bg-brand-primary)] flex items-center justify-center shrink-0">
                        <FlaskConical size={13} className="text-[var(--fg-brand-primary)]" />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-[var(--text-primary)]">{item.test_name}</p>
                        {item.test_code && (
                          <p className="text-[11px] text-[var(--text-quaternary)] font-mono">{item.test_code}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[14px] text-[var(--text-secondary)]">
                    {getPatientName(item.patient_id)}
                  </td>
                  <td className="px-4 py-3.5 text-[14px] text-[var(--text-tertiary)]">
                    {item.ordered_by ?? '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold',
                      STATUS_BADGE[item.status],
                    )}>
                      {STATUS_ICON[item.status]}
                      {STATUS_LABEL[item.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-[var(--text-tertiary)]">
                    {formatDate(item.ordered_at)}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-[var(--text-tertiary)]">
                    {item.completed_at ? formatDate(item.completed_at) : '—'}
                  </td>
                  <td className="pr-5 pl-4 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.status === 'completed' && (
                        <button
                          onClick={() => setViewItem(item)}
                          className="size-7 rounded-md hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--fg-quaternary)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
                          title="Ko'rish"
                        >
                          <Eye size={13} />
                        </button>
                      )}
                      {(item.status === 'pending' || item.status === 'in_progress') && (
                        <button
                          onClick={() => { setEnterItem(item); setResultRows([{ ...EMPTY_ROW }]); setEnterSuccess(false) }}
                          className="h-7 px-2 rounded-md hover:bg-green-50 flex items-center gap-1 text-[12px] font-medium text-[var(--fg-quaternary)] hover:text-green-700 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <CheckCircle size={12} />
                          Natija kiritish
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="size-7 rounded-md hover:bg-red-50 flex items-center justify-center text-[var(--fg-quaternary)] hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-[var(--fg-quaternary)] text-sm">
                    Natija topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-[var(--border-secondary)] bg-[var(--bg-secondary)]">
            <p className="text-[13px] text-[var(--text-tertiary)]">
              {filtered.length} ta / {items.length} ta tahlil
            </p>
          </div>
        )}
      </div>

      <Dialog
        open={addOpen}
        onOpenChange={open => { if (!open) { setAddOpen(false); setAddSuccess(false) } }}
        title="Yangi tahlil buyurtmasi"
        description="Laboratoriya tahlili ma'lumotlarini kiriting"
        side="right"
      >
        {addSuccess ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="size-14 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle size={26} className="text-green-600" />
            </div>
            <p className="text-[16px] font-semibold text-[var(--text-primary)]">Tahlil qo'shildi!</p>
            <p className="text-[13px] text-[var(--text-tertiary)]">{form.test_name}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Test nomi *</label>
              <Input
                value={form.test_name}
                onChange={e => setForm(prev => ({ ...prev, test_name: e.target.value }))}
                placeholder="KLA - Klinik qon tahlili"
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Test kodi</label>
              <Input
                value={form.test_code}
                onChange={e => setForm(prev => ({ ...prev, test_code: e.target.value }))}
                placeholder="CBC, BMP, UA..."
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Bemor *</label>
              <select
                value={form.patient_id}
                onChange={e => setForm(prev => ({ ...prev, patient_id: e.target.value }))}
                className="w-full h-11 bg-[var(--bg-primary)] border border-[var(--border-secondary)] rounded-lg px-3 text-[14px] text-[var(--text-primary)] outline-none hover:border-[var(--border-primary)] focus:border-[var(--fg-brand-primary)] transition-colors cursor-pointer"
              >
                <option value="">Bemorni tanlang...</option>
                {PATIENT_OPTIONS.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Buyurtma sanasi</label>
              <Input
                type="datetime-local"
                value={form.ordered_at}
                onChange={e => setForm(prev => ({ ...prev, ordered_at: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Izoh</label>
              <Input
                value={form.notes}
                onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Qo'shimcha ma'lumot..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setAddOpen(false)}>Bekor qilish</Button>
              <Button
                className="flex-1"
                onClick={handleAdd}
                loading={saving}
                disabled={!form.test_name || !form.patient_id}
              >
                Qo'shish
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      <Dialog
        open={!!enterItem}
        onOpenChange={open => { if (!open) { setEnterItem(null); setEnterSuccess(false) } }}
        title="Natijani kiritish"
        description={enterItem ? `"${enterItem.test_name}" natijalari` : undefined}
        className="max-w-2xl"
      >
        {enterSuccess ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="size-14 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle size={26} className="text-green-600" />
            </div>
            <p className="text-[16px] font-semibold text-[var(--text-primary)]">Natijalar saqlandi!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[var(--border-secondary)]">
                    {["Ko'rsatkich", 'Qiymat', 'Birlik', 'Norma', 'Norma emas', ''].map((h, i) => (
                      <th key={i} className="pb-2 text-left text-[11px] uppercase tracking-wide text-[var(--text-quaternary)] font-semibold pr-2">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-secondary)]">
                  {resultRows.map((row, i) => (
                    <tr key={i}>
                      <td className="py-2 pr-2">
                        <Input
                          value={row.parameter}
                          onChange={e => updateRow(i, 'parameter', e.target.value)}
                          placeholder="Gemoglobin"
                          uiSize="sm"
                        />
                      </td>
                      <td className="py-2 pr-2 w-24">
                        <Input
                          value={row.value}
                          onChange={e => updateRow(i, 'value', e.target.value)}
                          placeholder="120"
                          uiSize="sm"
                        />
                      </td>
                      <td className="py-2 pr-2 w-24">
                        <Input
                          value={row.unit}
                          onChange={e => updateRow(i, 'unit', e.target.value)}
                          placeholder="g/L"
                          uiSize="sm"
                        />
                      </td>
                      <td className="py-2 pr-2 w-28">
                        <Input
                          value={row.reference_range}
                          onChange={e => updateRow(i, 'reference_range', e.target.value)}
                          placeholder="120–160"
                          uiSize="sm"
                        />
                      </td>
                      <td className="py-2 pr-2 text-center">
                        <input
                          type="checkbox"
                          checked={row.is_abnormal}
                          onChange={e => updateRow(i, 'is_abnormal', e.target.checked)}
                          className="size-4 cursor-pointer accent-[#155EEF]"
                        />
                      </td>
                      <td className="py-2">
                        {resultRows.length > 1 && (
                          <button
                            onClick={() => removeRow(i)}
                            className="size-7 rounded-md hover:bg-red-50 flex items-center justify-center text-[var(--fg-quaternary)] hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={addRow}
              className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--fg-brand-primary)] hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Plus size={14} />
              Qator qo'shish
            </button>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setEnterItem(null)}>Bekor qilish</Button>
              <Button
                className="flex-1"
                onClick={handleEnterResults}
                loading={saving}
                disabled={resultRows.every(r => !r.parameter || !r.value)}
              >
                <CheckCircle size={14} />
                Tayyor
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      <Dialog
        open={!!viewItem}
        onOpenChange={open => { if (!open) setViewItem(null) }}
        title={viewItem?.test_name ?? 'Natijalar'}
        description={viewItem ? `Bemor: ${getPatientName(viewItem.patient_id)} · ${viewItem.completed_at ? formatDate(viewItem.completed_at) : ''}` : undefined}
        className="max-w-xl"
      >
        {viewItem && (
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-[var(--border-secondary)]">
                    {["Ko'rsatkich", 'Qiymat', 'Birlik', 'Norma'].map((h, i) => (
                      <th key={i} className="pb-2.5 text-left text-[11px] uppercase tracking-wide text-[var(--text-quaternary)] font-semibold pr-4">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-secondary)]">
                  {(Array.isArray(viewItem.results) ? viewItem.results : []).map((row: any, i: number) => (
                    <tr key={i}>
                      <td className="py-2.5 pr-4 font-medium text-[var(--text-secondary)]">{row.parameter}</td>
                      <td className={cn('py-2.5 pr-4 font-bold', row.is_abnormal ? 'text-red-600' : 'text-[var(--text-primary)]')}>
                        {row.value}
                        {row.is_abnormal && <span className="ml-1.5 text-[11px] font-semibold text-red-500">!</span>}
                      </td>
                      <td className="py-2.5 pr-4 text-[var(--text-tertiary)]">{row.unit}</td>
                      <td className="py-2.5 text-[var(--text-tertiary)]">{row.reference_range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {viewItem.notes && (
              <div className="bg-[var(--bg-secondary)] rounded-lg p-3">
                <p className="text-[12px] font-semibold text-[var(--text-tertiary)] mb-1">Izoh</p>
                <p className="text-[13px] text-[var(--text-secondary)]">{viewItem.notes}</p>
              </div>
            )}
            <div className="pt-1">
              <Button variant="secondary" className="w-full" onClick={() => setViewItem(null)}>Yopish</Button>
            </div>
          </div>
        )}
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={open => { if (!open) setDeleteTarget(null) }}
        title="Tahlilni o'chirish"
        description="Bu amalni qaytarib bo'lmaydi."
      >
        <div className="space-y-4">
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-[14px] font-semibold text-red-700">{deleteTarget?.test_name}</p>
            <p className="text-[13px] text-red-500 mt-0.5">
              {deleteTarget ? getPatientName(deleteTarget.patient_id) : ''} · {deleteTarget?.status ? STATUS_LABEL[deleteTarget.status] : ''}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setDeleteTarget(null)}>Bekor qilish</Button>
            <Button variant="danger" className="flex-1" onClick={handleDelete}>O'chirish</Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
