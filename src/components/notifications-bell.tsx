import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Bell, MessageSquare, Activity, Pill, CalendarClock, Video } from 'lucide-react'
import { useConnectStore, type NotificationAudience, type NotificationType } from '@/store/connect'
import { cn } from '@/lib/utils'

const ICONS: Record<NotificationType, React.ElementType> = {
  message:     MessageSquare,
  symptom:     Activity,
  medication:  Pill,
  appointment: CalendarClock,
  teleconsult: Video,
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.round(diff / 60000)
  if (m < 1) return 'hozir'
  if (m < 60) return `${m} daq oldin`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} soat oldin`
  return `${Math.round(h / 24)} kun oldin`
}

export function NotificationsBell({ audience }: { audience: NotificationAudience }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const notifications = useConnectStore(s => s.notifications)
  const markRead = useConnectStore(s => s.markNotificationRead)
  const markAllRead = useConnectStore(s => s.markAllNotificationsRead)

  const mine = notifications.filter(n => n.audience === audience)
  const unread = mine.filter(n => !n.read).length

  function go(link?: string) {
    // TanStack's typed router needs literal paths, so branch on the known set.
    if (link === '/messages') navigate({ to: '/messages' })
    else if (link === '/patient/messages') navigate({ to: '/patient/messages' })
    else if (link === '/patient/today') navigate({ to: '/patient/today' })
    else if (link === '/patient/symptoms') navigate({ to: '/patient/symptoms' })
  }

  function openNotif(id: string, link?: string) {
    markRead(id)
    setOpen(false)
    go(link)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Bildirishnomalar"
        className="relative size-9 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] cursor-pointer transition-colors"
      >
        <Bell size={17} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[var(--bg-primary)]">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-[360px] max-w-[calc(100vw-2rem)] rounded-xl border border-[var(--border-secondary)] bg-[var(--bg-primary)] [box-shadow:var(--shadow-dropdown)] z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-secondary)]">
              <p className="text-[14px] font-bold text-[var(--text-primary)]">Bildirishnomalar</p>
              {unread > 0 && (
                <button
                  onClick={() => markAllRead(audience)}
                  className="text-[12px] font-semibold text-[var(--fg-brand-primary)] hover:underline cursor-pointer"
                >
                  Hammasini o'qildi
                </button>
              )}
            </div>

            <div className="max-h-[380px] overflow-y-auto">
              {mine.length === 0 ? (
                <div className="px-4 py-12 text-center text-[13px] text-[var(--text-tertiary)]">
                  Bildirishnomalar yo'q
                </div>
              ) : (
                mine.map(n => {
                  const Icon = ICONS[n.type]
                  return (
                    <button
                      key={n.id}
                      onClick={() => openNotif(n.id, n.link)}
                      className={cn(
                        'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--bg-secondary)] border-b border-[var(--border-secondary)] last:border-0 cursor-pointer',
                        !n.read && 'bg-[var(--bg-brand-primary)]',
                      )}
                    >
                      <div className="size-8 rounded-lg bg-[var(--bg-brand-primary)] flex items-center justify-center shrink-0 mt-0.5">
                        <Icon size={15} className="text-[var(--fg-brand-primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[var(--text-primary)]">{n.title}</p>
                        <p className="text-[12px] text-[var(--text-tertiary)] line-clamp-2">{n.body}</p>
                        <p className="text-[11px] text-[var(--text-quaternary)] mt-0.5">{timeAgo(n.created_at)}</p>
                      </div>
                      {!n.read && <span className="size-2 rounded-full bg-[var(--fg-brand-primary)] shrink-0 mt-1.5" />}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
