import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { User, Building2, Lock, Monitor, Smartphone, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/layout/page-header'
import { cn } from '@/lib/utils'

const ACTIVE_SESSIONS = [
  { id: 's1', device: 'Chrome / Windows 11', location: 'Toshkent, UZ', lastActive: '5 daqiqa oldin', current: true,  Icon: Monitor },
  { id: 's2', device: 'Safari / iPhone 15',  location: 'Toshkent, UZ', lastActive: '2 soat oldin',  current: false, Icon: Smartphone },
  { id: 's3', device: 'Chrome / macOS',       location: 'Andijon, UZ',  lastActive: '1 kun oldin',   current: false, Icon: Monitor },
]

export function SettingsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'account' | 'clinic' | 'security'>('account')
  const [sessions, setSessions]   = useState(ACTIVE_SESSIONS)

  const [accountForm, setAccountForm] = useState({
    name:  'Alisher Nazarov',
    phone: '+998901234567',
    role:  'Klinika Administratori',
  })

  const [clinicForm, setClinicForm] = useState({
    name:        'Toshkent Klinikasi',
    phone:       '+998712345678',
    city:        'Toshkent',
    email:       'info@toshkentklinika.uz',
    website:     'toshkentklinika.uz',
    foundedYear: '2018',
    address:     "Mirzo Ulug'bek tumani, Buyuk Ipak Yo'li ko'chasi, 45",
  })

  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' })

  const tabs = [
    { id: 'account'  as const, label: t('settings.account'),    Icon: User },
    { id: 'clinic'   as const, label: t('settings.clinicInfo'), Icon: Building2 },
    { id: 'security' as const, label: t('settings.security'),   Icon: Lock },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('settings.title')}
        crumbs={[{ label: t('nav.settings') }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        {/* Tab list */}
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)] p-2 h-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-semibold transition-colors text-left cursor-pointer',
                activeTab === tab.id
                  ? 'bg-[var(--bg-brand-primary)] text-[var(--text-brand-secondary)]'
                  : 'text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]',
              )}
            >
              <tab.Icon size={17} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-secondary)] shadow-[var(--shadow-xs)] p-6 min-h-[400px]">

          {/* Account */}
          {activeTab === 'account' && (
            <div className="space-y-5">
              <h2 className="text-[18px] font-bold text-[var(--text-primary)]">{t('settings.account')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">{t('doctors.fullName')}</label>
                  <Input value={accountForm.name}  onChange={e => setAccountForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">{t('doctors.phone')}</label>
                  <Input value={accountForm.phone} onChange={e => setAccountForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">{t('common.status')}</label>
                  <Input value={accountForm.role} disabled />
                </div>
              </div>
              <div className="flex justify-end pt-2 border-t border-[var(--border-secondary)]">
                <Button size="sm">{t('settings.saveChanges')}</Button>
              </div>
            </div>
          )}

          {/* Clinic Info */}
          {activeTab === 'clinic' && (
            <div className="space-y-5">
              <h2 className="text-[18px] font-bold text-[var(--text-primary)]">{t('settings.clinicInfo')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">{t('settings.clinicName')}</label>
                  <Input value={clinicForm.name} onChange={e => setClinicForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">{t('doctors.phone')}</label>
                  <Input value={clinicForm.phone} onChange={e => setClinicForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">{t('settings.city')}</label>
                  <Input value={clinicForm.city} onChange={e => setClinicForm(f => ({ ...f, city: e.target.value }))} />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">{t('common.email')}</label>
                  <Input value={clinicForm.email} onChange={e => setClinicForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">{t('settings.website')}</label>
                  <Input value={clinicForm.website} onChange={e => setClinicForm(f => ({ ...f, website: e.target.value }))} />
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">{t('settings.foundedYear')}</label>
                  <Input value={clinicForm.foundedYear} onChange={e => setClinicForm(f => ({ ...f, foundedYear: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">{t('settings.address')}</label>
                  <Input value={clinicForm.address} onChange={e => setClinicForm(f => ({ ...f, address: e.target.value }))} />
                </div>
              </div>
              <div className="flex justify-end pt-2 border-t border-[var(--border-secondary)]">
                <Button size="sm">{t('settings.saveChanges')}</Button>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Change password */}
              <div>
                <h2 className="text-[18px] font-bold text-[var(--text-primary)] mb-4">{t('settings.changePassword')}</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">{t('settings.currentPassword')}</label>
                    <Input type="password" value={passForm.current} onChange={e => setPassForm(f => ({ ...f, current: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">{t('settings.newPassword')}</label>
                    <Input type="password" value={passForm.newPass} onChange={e => setPassForm(f => ({ ...f, newPass: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-[13px] font-semibold text-[var(--text-secondary)] block mb-1.5">{t('settings.confirmPassword')}</label>
                    <Input type="password" value={passForm.confirm} onChange={e => setPassForm(f => ({ ...f, confirm: e.target.value }))} />
                  </div>
                  <Button size="sm">{t('settings.changePassword')}</Button>
                </div>
              </div>

              {/* Active sessions */}
              <div className="border-t border-[var(--border-secondary)] pt-6">
                <h3 className="text-[16px] font-bold text-[var(--text-primary)] mb-4">{t('settings.activeSessions')}</h3>
                <div className="space-y-3">
                  {sessions.map(session => (
                    <div key={session.id} className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border-secondary)] bg-[var(--bg-secondary)]">
                      <div className="size-10 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-secondary)] flex items-center justify-center text-[var(--text-tertiary)] shrink-0">
                        <session.Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[14px] font-semibold text-[var(--text-primary)]">{session.device}</p>
                          {session.current && (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--bg-success-primary)] text-[var(--text-success-primary)]">
                              {t('settings.current')}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">
                          {session.location} · {session.lastActive}
                        </p>
                      </div>
                      {!session.current && (
                        <Button size="sm" variant="secondary" onClick={() => setSessions(s => s.filter(x => x.id !== session.id))}>
                          <LogOut size={14} />
                          {t('settings.logoutSession')}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
