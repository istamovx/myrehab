import { useState } from 'react'
import {
  Search, Plus, Building2, ChevronDown,
  CheckCircle, Clock, XCircle, Mail, Phone,
} from 'lucide-react'
import { ORGANIZATIONS, type Organization, type OrgStatus } from '@/data/super-admin-mock-data'
import { cn } from '@/lib/utils'

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M so'm`
  return `${(n / 1_000).toFixed(0)}K so'm`
}

const STATUS_STYLE: Record<OrgStatus, string> = {
  active:    'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  pending:   'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
  suspended: 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400',
}
const STATUS_ICON: Record<OrgStatus, React.ElementType> = {
  active:    CheckCircle,
  pending:   Clock,
  suspended: XCircle,
}
const STATUS_LABEL: Record<OrgStatus, string> = {
  active: 'Faol', pending: 'Kutilmoqda', suspended: 'To\'xtatilgan',
}

const PLAN_STYLE: Record<string, string> = {
  Enterprise:   'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300',
  Professional: 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300',
  Pro:          'bg-teal-100 text-teal-700 dark:bg-teal-950/30 dark:text-teal-300',
  Standard:     'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300',
  Starter:      'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

function OrgCard({ org }: { org: Organization }) {
  const [expanded, setExpanded] = useState(false)
  const StatusIcon = STATUS_ICON[org.status]
  const daysLeft = Math.ceil((new Date(org.contract_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] overflow-hidden">
      {/* Main row */}
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
        onClick={() => setExpanded(v => !v)}
      >
        <div className={cn('size-10 rounded-xl bg-gradient-to-br text-white text-[13px] font-bold flex items-center justify-center shrink-0', org.logo_color)}>
          {org.logo_initial}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[14px] font-bold text-[var(--text-primary)] truncate">{org.name}</p>
            <span className="text-[10px] font-semibold text-[var(--text-quaternary)] bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded">
              {org.type === 'org' ? 'Tashkilot' : 'Xususiy klinika'}
            </span>
          </div>
          <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">{org.city} · {org.contact_person}</p>
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <div className="text-center">
            <p className="text-[16px] font-bold text-[var(--text-primary)]">{org.doctors_count}</p>
            <p className="text-[10px] text-[var(--text-tertiary)]">Shifokor</p>
          </div>
          <div className="w-px h-8 bg-[var(--border-secondary)]" />
          <div className="text-center">
            <p className="text-[16px] font-bold text-[var(--text-primary)]">{org.patients_count}</p>
            <p className="text-[10px] text-[var(--text-tertiary)]">Bemor</p>
          </div>
          <div className="w-px h-8 bg-[var(--border-secondary)]" />
          <div className="text-center">
            <p className="text-[14px] font-bold text-[var(--text-primary)]">{fmt(org.monthly_fee)}</p>
            <p className="text-[10px] text-[var(--text-tertiary)]">Oylik</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={cn('hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full', PLAN_STYLE[org.plan_name])}>
            {org.plan_name}
          </span>
          <span className={cn('inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full', STATUS_STYLE[org.status])}>
            <StatusIcon size={11} />
            <span className="hidden sm:inline">{STATUS_LABEL[org.status]}</span>
          </span>
          <ChevronDown size={16} className={cn('text-[var(--fg-quaternary)] transition-transform', expanded && 'rotate-180')} />
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-[var(--border-secondary)] p-4 bg-[var(--bg-secondary)] space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <InfoItem label="Tarif" value={`${org.plan_name} (${org.plan === 'contract' ? 'Shartnoma' : 'Obuna'})`} />
            <InfoItem label="Kontrakt boshi" value={org.contract_start} />
            <InfoItem label="Kontrakt tugashi" value={org.contract_end} />
            <InfoItem label="Qolgan kunlar" value={`${daysLeft > 0 ? daysLeft : 0} kun`} color={daysLeft < 30 ? 'text-red-500' : ''} />
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a href={`mailto:${org.contact_email}`} className="flex items-center gap-1.5 text-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <Mail size={13} />
              {org.contact_email}
            </a>
            <a href={`tel:${org.contact_phone}`} className="flex items-center gap-1.5 text-[12px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <Phone size={13} />
              {org.contact_phone}
            </a>
          </div>
          {org.status === 'pending' && (
            <div className="flex gap-2 pt-1">
              <button className="px-4 py-1.5 bg-green-600 text-white text-[12px] font-semibold rounded-lg hover:opacity-90 transition-opacity">
                Tasdiqlash
              </button>
              <button className="px-4 py-1.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-[12px] font-semibold rounded-lg border border-red-200 dark:border-red-800 hover:opacity-90 transition-opacity">
                Rad etish
              </button>
            </div>
          )}
          {org.status === 'active' && (
            <div className="flex gap-2 pt-1">
              <button className="px-4 py-1.5 bg-[var(--bg-primary)] text-[var(--text-primary)] text-[12px] font-semibold rounded-lg border border-[var(--border-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
                Tahrirlash
              </button>
              <button className="px-4 py-1.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-[12px] font-semibold rounded-lg border border-red-200 dark:border-red-800 hover:opacity-90 transition-opacity">
                To'xtatish
              </button>
            </div>
          )}
          {org.status === 'suspended' && (
            <button className="px-4 py-1.5 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-[12px] font-semibold rounded-lg border border-green-200 dark:border-green-800 hover:opacity-90 transition-opacity">
              Qayta faollashtirish
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function InfoItem({ label, value, color = '' }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p className="text-[10px] text-[var(--text-quaternary)] font-medium uppercase tracking-wide">{label}</p>
      <p className={cn('text-[13px] font-semibold text-[var(--text-primary)] mt-0.5', color)}>{value}</p>
    </div>
  )
}

export function SuperAdminOrganizationsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrgStatus | 'all'>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newOrg, setNewOrg] = useState({ name: '', type: 'private_clinic', plan: 'subscription', plan_name: 'Starter', city: '', contact_person: '', contact_email: '', contact_phone: '' })
  const [saved, setSaved] = useState(false)

  const filtered = ORGANIZATIONS.filter(o => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.city.toLowerCase().includes(search.toLowerCase()) ||
      o.contact_person.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const counts = {
    all: ORGANIZATIONS.length,
    active: ORGANIZATIONS.filter(o => o.status === 'active').length,
    pending: ORGANIZATIONS.filter(o => o.status === 'pending').length,
    suspended: ORGANIZATIONS.filter(o => o.status === 'suspended').length,
  }

  function handleAddOrg() {
    setSaved(true)
    setTimeout(() => { setSaved(false); setShowAddModal(false); setNewOrg({ name: '', type: 'private_clinic', plan: 'subscription', plan_name: 'Starter', city: '', contact_person: '', contact_email: '', contact_phone: '' }) }, 1500)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Tashkilotlar</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">{ORGANIZATIONS.length} ta tashkilot ro'yxatda</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus size={16} />
          Yangi tashkilot
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-quaternary)] pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tashkilot, shahar, kontakt..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-[var(--bg-secondary)] border border-transparent text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-placeholder)] outline-none focus:border-[var(--fg-brand-primary)]"
          />
        </div>
        <div className="flex gap-1 bg-[var(--bg-tertiary)] p-1 rounded-xl">
          {(['all', 'active', 'pending', 'suspended'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-1 rounded-lg text-[12px] font-semibold transition-all',
                statusFilter === s ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-tertiary)]',
              )}
            >
              {s === 'all' ? 'Barchasi' : STATUS_LABEL[s]}
              <span className="ml-1 text-[10px] text-[var(--text-quaternary)]">({counts[s]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map(org => <OrgCard key={org.id} org={org} />)}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-[var(--text-tertiary)]">
            <Building2 size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-[14px] font-medium">Tashkilot topilmadi</p>
          </div>
        )}
      </div>

      {/* Add org modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-[var(--bg-primary)] rounded-2xl shadow-2xl w-full max-w-md z-10 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-[var(--text-primary)]">Yangi tashkilot qo'shish</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                <XCircle size={18} />
              </button>
            </div>

            {saved && <p className="text-green-600 text-sm font-semibold text-center">✓ Tashkilot qo'shildi!</p>}

            {[
              { label: 'Tashkilot nomi *', key: 'name', type: 'text' },
              { label: 'Shahar *', key: 'city', type: 'text' },
              { label: 'Mas\'ul shaxs *', key: 'contact_person', type: 'text' },
              { label: 'Email', key: 'contact_email', type: 'email' },
              { label: 'Telefon', key: 'contact_phone', type: 'tel' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-[11px] font-semibold text-[var(--text-secondary)]">{f.label}</label>
                <input
                  type={f.type}
                  value={(newOrg as Record<string, string>)[f.key]}
                  onChange={e => setNewOrg(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="mt-1 w-full h-9 px-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-secondary)] text-[13px] text-[var(--text-primary)] outline-none focus:border-indigo-500"
                />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[var(--text-secondary)]">Tur</label>
                <select
                  value={newOrg.type}
                  onChange={e => setNewOrg(prev => ({ ...prev, type: e.target.value }))}
                  className="mt-1 w-full h-9 px-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-secondary)] text-[13px] text-[var(--text-primary)] outline-none"
                >
                  <option value="org">Tashkilot</option>
                  <option value="private_clinic">Xususiy klinika</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[var(--text-secondary)]">Tarif</label>
                <select
                  value={newOrg.plan_name}
                  onChange={e => setNewOrg(prev => ({ ...prev, plan_name: e.target.value }))}
                  className="mt-1 w-full h-9 px-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-secondary)] text-[13px] text-[var(--text-primary)] outline-none"
                >
                  <option>Starter</option>
                  <option>Standard</option>
                  <option>Pro</option>
                  <option>Professional</option>
                  <option>Enterprise</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-lg border border-[var(--border-secondary)] text-[13px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleAddOrg}
                disabled={!newOrg.name || !newOrg.city || !newOrg.contact_person}
                className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                Qo'shish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
