import { Link, useRouterState, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  CalendarDays, CheckSquare, BarChart2, Heart,
  MessageSquare, Settings, Apple, X, LogOut, Video,
} from 'lucide-react'
import { ASSIGNED_DOCTOR, PATIENT_PROFILE } from '@/data/patient-mock-data'
import { useAuthStore } from '@/store/auth'
import { useConnectStore, selectUnreadMessages } from '@/store/connect'
import { NotificationsBell } from '@/components/notifications-bell'

interface NavItem {
  to:    string
  icon:  React.ElementType
  label: string
}

function PatientNavItem({ to, icon: Icon, label, badge }: NavItem & { badge?: number }) {
  const { pathname } = useRouterState({ select: s => s.location })
  const active = pathname === to || pathname.startsWith(to + '/')

  return (
    <Link
      to={to}
      className={[
        'flex items-center gap-[11px] px-[10px] py-[9px] rounded-[10px]',
        'text-[13.5px] font-semibold transition-colors',
        active
          ? 'bg-[var(--fg-brand-primary)] text-white'
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]',
      ].join(' ')}
    >
      <Icon size={16} className="shrink-0" />
      <span className="truncate flex-1">{label}</span>
      {badge != null && badge > 0 && (
        <span className={[
          'text-[11px] font-bold min-w-[18px] h-[18px] px-1.5 rounded-full flex items-center justify-center shrink-0',
          active ? 'bg-white text-[var(--fg-brand-primary)]' : 'bg-[var(--fg-brand-primary)] text-white',
        ].join(' ')}>
          {badge}
        </span>
      )}
    </Link>
  )
}

interface Props {
  mobileOpen: boolean
  onClose:    () => void
}

export function PatientSidebar({ mobileOpen, onClose }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)
  const unreadMessages = useConnectStore(selectUnreadMessages('patient'))

  function handleLogout() {
    logout()
    navigate({ to: '/login' })
  }

  const navItems: NavItem[] = [
    { to: '/patient/today',    icon: CheckSquare, label: t('patient.today')   },
    { to: '/patient/dinamika', icon: BarChart2,   label: 'Dinamika'           },
    { to: '/patient/vitals',       icon: Heart,  label: t('patient.vitals')    },
    { to: '/patient/nutrition',    icon: Apple,  label: t('patient.nutrition')  },
    { to: '/patient/messages',        icon: MessageSquare,label: t('patient.messages')           },
    { to: '/patient/appointments',    icon: CalendarDays,label: t('patient.patientAppointments') },
    { to: '/patient/teleconsultation',icon: Video,       label: t('patient.teleconsultation', 'Onlayn konsultatsiya') },
    { to: '/patient/settings',        icon: Settings,    label: t('patient.patientSettings')     },
  ]

  const sidebar = (
    <aside className="flex flex-col h-full w-[260px] bg-[var(--bg-primary)] border-r border-[var(--border-secondary)]">
      {/* Brand */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-[var(--border-secondary)] shrink-0">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="" className="w-8 h-8 shrink-0" />
          <span className="text-[13.5px] font-semibold text-[var(--text-primary)]">MyRehab</span>
        </div>
        <div className="flex items-center gap-0.5">
          <NotificationsBell audience="patient" side="left" />
          <button onClick={onClose} className="lg:hidden p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Patient profile card */}
      <div className="mx-3 mt-3 mb-1 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-secondary)]">
        <p className="text-[12px] font-semibold text-[var(--text-primary)] truncate">{user?.name ?? PATIENT_PROFILE.name}</p>
        <p className="text-[11px] text-[var(--text-tertiary)] truncate mt-0.5">{PATIENT_PROFILE.diagnosis}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {navItems.map(item => (
          <PatientNavItem
            key={item.to}
            {...item}
            badge={item.to === '/patient/messages' ? unreadMessages : undefined}
          />
        ))}
      </nav>

      {/* Doctor card */}
      <div className="mx-3 mb-2 p-3 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
        <p className="text-[11px] opacity-80 font-medium">{t('patient.assignedDoctor')}</p>
        <p className="text-[13px] font-semibold mt-0.5 truncate">{ASSIGNED_DOCTOR.name}</p>
        <p className="text-[11px] opacity-80 truncate">{ASSIGNED_DOCTOR.specialization}</p>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mx-3 mb-3 flex items-center gap-2.5 px-[10px] py-[9px] rounded-[10px] text-[13.5px] font-semibold text-[var(--text-secondary)] hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-colors"
      >
        <LogOut size={16} className="shrink-0" />
        <span>{t('header.logout')}</span>
      </button>
    </aside>
  )

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex fixed inset-y-0 left-0 z-30">{sidebar}</div>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40" onClick={onClose} />
          <div className="relative z-50">{sidebar}</div>
        </div>
      )}
    </>
  )
}
