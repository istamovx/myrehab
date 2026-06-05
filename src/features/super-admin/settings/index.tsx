import { useState } from 'react'
import { Shield, Bell, Globe, Lock } from 'lucide-react'

type Tab = 'general' | 'security' | 'notifications'

export function SuperAdminSettingsPage() {
  const [tab, setTab] = useState<Tab>('general')
  const [saved, setSaved] = useState(false)

  const TABS = [
    { key: 'general' as Tab, icon: Globe, label: 'Umumiy' },
    { key: 'notifications' as Tab, icon: Bell, label: 'Bildirishnomalar' },
    { key: 'security' as Tab, icon: Lock, label: 'Xavfsizlik' },
  ]

  function save() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
          <Shield size={20} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Platform sozlamalari</h1>
          <p className="text-sm text-[var(--text-tertiary)]">Super admin panel konfiguratsiyasi</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--bg-tertiary)] p-1 rounded-xl w-fit">
        {TABS.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={[
              'flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all',
              tab === key
                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]',
            ].join(' ')}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {saved && (
        <p className="text-green-600 text-sm font-semibold">✓ Sozlamalar saqlandi!</p>
      )}

      {tab === 'general' && (
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-6 space-y-4">
          <h2 className="text-base font-bold text-[var(--text-primary)]">Platform ma'lumotlari</h2>
          {[
            { label: 'Platform nomi', value: 'MyRehab' },
            { label: 'Versiya', value: '1.0.0' },
            { label: 'Support email', value: 'support@myrehab.uz' },
            { label: 'Support telefon', value: '+998 71 123 45 67' },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs font-medium text-[var(--text-secondary)]">{f.label}</label>
              <input
                defaultValue={f.value}
                className="mt-1 w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500"
              />
            </div>
          ))}
          <div className="flex justify-end">
            <button onClick={save} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:opacity-90">
              O'zgarishlarni saqlash
            </button>
          </div>
        </div>
      )}

      {tab === 'notifications' && (
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-6 space-y-4">
          <h2 className="text-base font-bold text-[var(--text-primary)]">Bildirishnomalar</h2>
          {[
            { label: 'Yangi tashkilot ro\'yxatdan o\'tganda', defaultChecked: true },
            { label: 'To\'lov muddati o\'tganda', defaultChecked: true },
            { label: 'To\'lov amalga oshirilganda', defaultChecked: false },
            { label: 'Tashkilot to\'xtatilganda', defaultChecked: true },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-primary)]">{item.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                <div className="w-10 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <button onClick={save} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:opacity-90">
              Saqlash
            </button>
          </div>
        </div>
      )}

      {tab === 'security' && (
        <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-6 space-y-4">
          <h2 className="text-base font-bold text-[var(--text-primary)]">Parolni o'zgartirish</h2>
          {['Joriy parol', 'Yangi parol', 'Parolni tasdiqlang'].map(label => (
            <div key={label}>
              <label className="text-xs font-medium text-[var(--text-secondary)]">{label}</label>
              <input
                type="password"
                className="mt-1 w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-secondary)] rounded-lg text-sm text-[var(--text-primary)] outline-none focus:border-indigo-500"
              />
            </div>
          ))}
          <button onClick={save} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:opacity-90">
            Parolni o'zgartirish
          </button>
        </div>
      )}
    </div>
  )
}
