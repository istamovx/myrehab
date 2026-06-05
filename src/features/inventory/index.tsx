import { useState, useMemo } from 'react'
import { Search, Plus, Edit, Trash2, Package, AlertTriangle, DollarSign, MinusCircle, CheckCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Dialog } from '@/components/ui/dialog'
import { PageHeader } from '@/components/layout/page-header'
import { SUPABASE_ENABLED } from '@/lib/supabase'
import {
  getInventory,
  createItem,
  updateItem,
  deleteItem,
  logUsage,
} from '@/services/inventory.service'
import type { InventoryItem } from '@/types/database.types'
import { cn } from '@/lib/utils'

const MOCK_ITEMS: InventoryItem[] = [
  {
    id: '1', organization_id: 'demo', name: 'Ibuprofen 400mg', category: 'medication',
    unit: 'dona', quantity: 45, min_quantity: 50, unit_price: 2800,
    supplier: 'Pharmstandard', expiry_date: '2026-08-01', barcode: '4607027360019',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2', organization_id: 'demo', name: 'Diclofenac 75mg/3ml', category: 'medication',
    unit: 'ampula', quantity: 120, min_quantity: 30, unit_price: 4500,
    supplier: 'Novartis UZ', expiry_date: '2025-12-15', barcode: '4607124060012',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3', organization_id: 'demo', name: 'Nimesulid 100mg', category: 'medication',
    unit: 'tablet', quantity: 200, min_quantity: 60, unit_price: 1200,
    supplier: 'Hemofarm', expiry_date: '2026-03-20', barcode: '8606007006054',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '4', organization_id: 'demo', name: 'Tibbiy qo\'lqop L', category: 'consumable',
    unit: 'juft', quantity: 8, min_quantity: 20, unit_price: 950,
    supplier: 'MedLine UZ', expiry_date: null, barcode: null,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '5', organization_id: 'demo', name: 'Paxta (100g)', category: 'consumable',
    unit: 'paket', quantity: 35, min_quantity: 15, unit_price: 3200,
    supplier: 'UzMedSnab', expiry_date: '2027-01-01', barcode: null,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '6', organization_id: 'demo', name: 'Steril doka (10x10)', category: 'consumable',
    unit: 'dona', quantity: 4, min_quantity: 10, unit_price: 600,
    supplier: 'MedLine UZ', expiry_date: '2026-06-01', barcode: null,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '7', organization_id: 'demo', name: 'Tonometr (Omron M2)', category: 'equipment',
    unit: 'dona', quantity: 3, min_quantity: 2, unit_price: 480000,
    supplier: 'Omron Healthcare', expiry_date: null, barcode: '4015672388894',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '8', organization_id: 'demo', name: 'Pulsoksimetr', category: 'equipment',
    unit: 'dona', quantity: 5, min_quantity: 2, unit_price: 220000,
    supplier: 'ChoiceMMed', expiry_date: null, barcode: null,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
  },
]

type Category = 'all' | 'medication' | 'consumable' | 'equipment'

const CATEGORY_LABELS: Record<string, string> = {
  medication: 'Dori',
  consumable: 'Sarf material',
  equipment: 'Jihozlar',
}

const CATEGORY_BADGE: Record<string, string> = {
  medication: 'bg-blue-50 text-blue-700',
  consumable: 'bg-green-50 text-green-700',
  equipment: 'bg-orange-50 text-orange-700',
}

const EMPTY_FORM = {
  name: '', category: 'medication' as InventoryItem['category'],
  unit: '', quantity: 0, min_quantity: 0, unit_price: 0,
  supplier: '', expiry_date: '', barcode: '',
}

const EMPTY_USAGE = { quantity: 1, reason: '', patient: '' }

function SummaryCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] [box-shadow:var(--shadow-xs)] p-5 flex items-center gap-4">
      <div className="size-10 rounded-lg bg-[var(--bg-brand-primary)] flex items-center justify-center shrink-0 text-[var(--fg-brand-primary)]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide font-semibold text-[var(--text-quaternary)] mb-0.5">{label}</p>
        <p className="text-[22px] font-bold text-[var(--text-primary)] leading-tight">{value}</p>
        {sub && <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(MOCK_ITEMS)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category>('all')
  const [addOpen, setAddOpen] = useState(false)
  const [editItem, setEditItem] = useState<InventoryItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<InventoryItem | null>(null)
  const [usageTarget, setUsageTarget] = useState<InventoryItem | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [usageForm, setUsageForm] = useState(EMPTY_USAGE)
  const [saving, setSaving] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)
  const [usageSuccess, setUsageSuccess] = useState(false)

  const ORG_ID = 'demo'

  async function loadItems() {
    if (SUPABASE_ENABLED) {
      const data = await getInventory(ORG_ID)
      setItems(data)
    }
  }

  const filtered = useMemo(() => {
    return items.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.supplier ?? '').toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'all' || item.category === category
      return matchSearch && matchCat
    })
  }, [items, search, category])

  const totalValue = useMemo(() =>
    items.reduce((sum, i) => sum + i.quantity * (i.unit_price ?? 0), 0), [items])

  const lowStockCount = useMemo(() =>
    items.filter(i => i.quantity <= i.min_quantity).length, [items])

  function openAdd() {
    setForm(EMPTY_FORM)
    setEditItem(null)
    setAddSuccess(false)
    setAddOpen(true)
  }

  function openEdit(item: InventoryItem) {
    setForm({
      name: item.name,
      category: item.category,
      unit: item.unit,
      quantity: item.quantity,
      min_quantity: item.min_quantity,
      unit_price: item.unit_price ?? 0,
      supplier: item.supplier ?? '',
      expiry_date: item.expiry_date ?? '',
      barcode: item.barcode ?? '',
    })
    setEditItem(item)
    setAddSuccess(false)
    setAddOpen(true)
  }

  async function handleSave() {
    if (!form.name || !form.unit) return
    setSaving(true)
    try {
      if (SUPABASE_ENABLED) {
        if (editItem) {
          await updateItem(editItem.id, { ...form, unit_price: form.unit_price || null, supplier: form.supplier || null, expiry_date: form.expiry_date || null, barcode: form.barcode || null })
        } else {
          await createItem({ ...form, organization_id: ORG_ID, unit_price: form.unit_price || null, supplier: form.supplier || null, expiry_date: form.expiry_date || null, barcode: form.barcode || null })
        }
        await loadItems()
      } else {
        if (editItem) {
          setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, ...form, unit_price: form.unit_price || null, supplier: form.supplier || null, expiry_date: form.expiry_date || null, barcode: form.barcode || null } : i))
        } else {
          const newItem: InventoryItem = {
            id: String(Date.now()),
            organization_id: ORG_ID,
            ...form,
            unit_price: form.unit_price || null,
            supplier: form.supplier || null,
            expiry_date: form.expiry_date || null,
            barcode: form.barcode || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          setItems(prev => [newItem, ...prev])
        }
      }
      setAddSuccess(true)
      setTimeout(() => {
        setAddSuccess(false)
        setAddOpen(false)
      }, 1400)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    if (SUPABASE_ENABLED) {
      await deleteItem(deleteTarget.id)
      await loadItems()
    } else {
      setItems(prev => prev.filter(i => i.id !== deleteTarget.id))
    }
    setDeleteTarget(null)
  }

  async function handleUsage() {
    if (!usageTarget || usageForm.quantity <= 0) return
    setSaving(true)
    try {
      if (SUPABASE_ENABLED) {
        await logUsage({
          inventory_item_id: usageTarget.id,
          organization_id: ORG_ID,
          quantity: usageForm.quantity,
          reason: usageForm.reason || null,
          patient_id: null,
          used_by: null,
        })
        await loadItems()
      } else {
        setItems(prev => prev.map(i =>
          i.id === usageTarget.id
            ? { ...i, quantity: Math.max(0, i.quantity - usageForm.quantity) }
            : i,
        ))
      }
      setUsageSuccess(true)
      setTimeout(() => {
        setUsageSuccess(false)
        setUsageTarget(null)
        setUsageForm(EMPTY_USAGE)
      }, 1400)
    } finally {
      setSaving(false)
    }
  }

  function f(key: string, value: string | number) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const TABS: { value: Category; label: string }[] = [
    { value: 'all', label: 'Barchasi' },
    { value: 'medication', label: 'Dori' },
    { value: 'consumable', label: 'Sarf material' },
    { value: 'equipment', label: 'Jihozlar' },
  ]

  const CATEGORY_OPTIONS = [
    { value: 'medication', label: 'Dori' },
    { value: 'consumable', label: 'Sarf material' },
    { value: 'equipment', label: 'Jihozlar' },
  ]

  return (
    <div>
      <PageHeader
        title="Omborxona"
        subtitle={`${items.length} ta mahsulot`}
        crumbs={[{ label: 'Omborxona' }]}
        actions={
          <Button size="sm" onClick={openAdd}>
            <Plus size={15} />
            Yangi mahsulot
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard
          icon={<Package size={18} />}
          label="Jami mahsulotlar"
          value={String(items.length)}
          sub={`${filtered.length} ta ko'rsatilmoqda`}
        />
        <SummaryCard
          icon={<AlertTriangle size={18} />}
          label="Kam qolgan"
          value={String(lowStockCount)}
          sub="Minimal miqdordan kam"
        />
        <SummaryCard
          icon={<DollarSign size={18} />}
          label="Umumiy qiymat"
          value={`${totalValue.toLocaleString('uz-UZ')} so'm`}
          sub="Joriy zaxira qiymati"
        />
      </div>

      <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] [box-shadow:var(--shadow-xs)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border-secondary)] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-[var(--bg-secondary)] rounded-lg p-0.5">
            {TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setCategory(tab.value)}
                className={cn(
                  'px-3 h-7 rounded-md text-[13px] font-medium transition-all cursor-pointer',
                  category === tab.value
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
              placeholder="Nomi yoki yetkazuvchi..."
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
                {['Nomi', 'Kategoriya', 'Miqdor', 'Birlik', 'Min qty', 'Narx', 'Yetkazuvchi', 'Yaroqlilik', ''].map((h, i) => (
                  <th
                    key={i}
                    className={cn(
                      'px-4 py-3 text-left text-[11px] uppercase tracking-wide text-[var(--text-quaternary)] font-semibold whitespace-nowrap',
                      i === 0 && 'pl-5',
                      i === 8 && 'pr-5',
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const isLow = item.quantity <= item.min_quantity
                return (
                  <tr
                    key={item.id}
                    className={cn(
                      'border-b border-[var(--border-secondary)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors group',
                      isLow && 'bg-red-50/30',
                    )}
                  >
                    <td className="pl-5 pr-4 py-3.5">
                      <span className="text-[14px] font-semibold text-[var(--text-primary)]">{item.name}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-[12px] font-medium', CATEGORY_BADGE[item.category])}>
                        {CATEGORY_LABELS[item.category]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn('text-[14px] font-bold', isLow ? 'text-red-600' : 'text-[var(--text-primary)]')}>
                        {item.quantity}
                        {isLow && <AlertTriangle size={12} className="inline ml-1 text-red-500" />}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-[var(--text-tertiary)]">{item.unit}</td>
                    <td className="px-4 py-3.5 text-[13px] text-[var(--text-tertiary)]">{item.min_quantity}</td>
                    <td className="px-4 py-3.5 text-[13px] text-[var(--text-secondary)]">
                      {item.unit_price != null ? `${item.unit_price.toLocaleString('uz-UZ')} so'm` : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-[var(--text-tertiary)] max-w-[120px] truncate">
                      {item.supplier ?? '—'}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-[var(--text-tertiary)]">
                      {item.expiry_date ?? '—'}
                    </td>
                    <td className="pr-5 pl-4 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setUsageTarget(item); setUsageForm(EMPTY_USAGE); setUsageSuccess(false) }}
                          className="h-7 px-2 rounded-md hover:bg-red-50 flex items-center gap-1 text-[12px] font-medium text-[var(--fg-quaternary)] hover:text-red-600 transition-colors cursor-pointer"
                          title="Sarflash"
                        >
                          <MinusCircle size={13} />
                          Sarflash
                        </button>
                        <button
                          onClick={() => openEdit(item)}
                          className="size-7 rounded-md hover:bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--fg-quaternary)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="size-7 rounded-md hover:bg-red-50 flex items-center justify-center text-[var(--fg-quaternary)] hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-[var(--fg-quaternary)] text-sm">
                    Mahsulot topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-[var(--border-secondary)] bg-[var(--bg-secondary)]">
            <p className="text-[13px] text-[var(--text-tertiary)]">
              {filtered.length} ta / {items.length} ta mahsulot
            </p>
          </div>
        )}
      </div>

      <Dialog
        open={addOpen}
        onOpenChange={open => { if (!open) { setAddOpen(false); setEditItem(null); setAddSuccess(false) } }}
        title={editItem ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}
        description="Mahsulot ma'lumotlarini to'ldiring"
        className="max-w-xl"
      >
        {addSuccess ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="size-14 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle size={26} className="text-green-600" />
            </div>
            <p className="text-[16px] font-semibold text-[var(--text-primary)]">
              {editItem ? 'Mahsulot yangilandi!' : 'Mahsulot qo\'shildi!'}
            </p>
            <p className="text-[13px] text-[var(--text-tertiary)]">{form.name}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Nomi *</label>
                <Input value={form.name} onChange={e => f('name', e.target.value)} placeholder="Ibuprofen 400mg" />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Kategoriya</label>
                <Select
                  value={form.category}
                  onValueChange={v => f('category', v)}
                  options={CATEGORY_OPTIONS}
                  triggerClassName="w-full"
                />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Birlik *</label>
                <Input value={form.unit} onChange={e => f('unit', e.target.value)} placeholder="dona, paket, kg..." />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Miqdor</label>
                <Input type="number" value={form.quantity} onChange={e => f('quantity', Number(e.target.value))} min={0} />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Minimal miqdor</label>
                <Input type="number" value={form.min_quantity} onChange={e => f('min_quantity', Number(e.target.value))} min={0} />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Narx (so'm)</label>
                <Input type="number" value={form.unit_price} onChange={e => f('unit_price', Number(e.target.value))} min={0} />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Yetkazuvchi</label>
                <Input value={form.supplier} onChange={e => f('supplier', e.target.value)} placeholder="Pharmstandard" />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Yaroqlilik muddati</label>
                <Input type="date" value={form.expiry_date} onChange={e => f('expiry_date', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Shtrix-kod</label>
                <Input value={form.barcode} onChange={e => f('barcode', e.target.value)} placeholder="4607027360019" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setAddOpen(false)}>Bekor qilish</Button>
              <Button
                className="flex-1"
                onClick={handleSave}
                loading={saving}
                disabled={!form.name || !form.unit}
              >
                {editItem ? 'Saqlash' : 'Qo\'shish'}
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      <Dialog
        open={!!usageTarget}
        onOpenChange={open => { if (!open) { setUsageTarget(null); setUsageSuccess(false) } }}
        title="Mahsulot sarflash"
        description={usageTarget ? `"${usageTarget.name}" dan sarflash` : undefined}
      >
        {usageSuccess ? (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className="size-14 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle size={26} className="text-green-600" />
            </div>
            <p className="text-[16px] font-semibold text-[var(--text-primary)]">Sarflash qayd etildi!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {usageTarget && (
              <div className="bg-[var(--bg-secondary)] rounded-lg p-3 flex items-center justify-between">
                <span className="text-[13px] font-medium text-[var(--text-secondary)]">Mavjud miqdor</span>
                <span className="text-[15px] font-bold text-[var(--text-primary)]">{usageTarget.quantity} {usageTarget.unit}</span>
              </div>
            )}
            <div>
              <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Sarflangan miqdor *</label>
              <Input
                type="number"
                value={usageForm.quantity}
                onChange={e => setUsageForm(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                min={1}
                max={usageTarget?.quantity}
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Sabab</label>
              <Input
                value={usageForm.reason}
                onChange={e => setUsageForm(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Protsedura, bemor uchun..."
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">Bemor (ixtiyoriy)</label>
              <Input
                value={usageForm.patient}
                onChange={e => setUsageForm(prev => ({ ...prev, patient: e.target.value }))}
                placeholder="Bemor ismi"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <Button variant="secondary" className="flex-1" onClick={() => setUsageTarget(null)}>Bekor qilish</Button>
              <Button
                className="flex-1"
                onClick={handleUsage}
                loading={saving}
                disabled={usageForm.quantity <= 0}
              >
                Sarflash
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={open => { if (!open) setDeleteTarget(null) }}
        title="Mahsulotni o'chirish"
        description="Bu amalni qaytarib bo'lmaydi."
      >
        <div className="space-y-4">
          <div className="bg-red-50 rounded-lg p-3">
            <p className="text-[14px] font-semibold text-red-700">{deleteTarget?.name}</p>
            <p className="text-[13px] text-red-500 mt-0.5">{deleteTarget?.quantity} {deleteTarget?.unit} mavjud</p>
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
