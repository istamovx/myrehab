import { useState } from 'react'
import { Trophy, Flame, Star, Zap } from 'lucide-react'

const TOTAL_XP = 2340
const LEVEL_XP = 1000
const CURRENT_LEVEL_XP = 780
const LEVEL = 'Kumush'
const NEXT_LEVEL = 'Oltin'

const EARNED_BADGES = [
  { id: '1', title: 'Birinchi mashq bajarildi',       xp: 50,  date: '1-aprel',  earned: true  },
  { id: '2', title: '7 kunlik seriya',                 xp: 200, date: '7-aprel',  earned: true  },
  { id: '3', title: "7 kun dorilarni o'z vaqtida",     xp: 150, date: '8-aprel',  earned: true  },
  { id: '4', title: "Og'riq 3 ballga kamaydi",         xp: 100, date: '5-aprel',  earned: true  },
  { id: '5', title: '1-hafta tugallandi',              xp: 100, date: '7-aprel',  earned: true  },
  { id: '6', title: 'Birinchi video konsultatsiya',    xp: 75,  date: '3-aprel',  earned: true  },
  { id: '7', title: 'Barcha vitalllarni kiritdi',      xp: 50,  date: '4-aprel',  earned: true  },
]

const UPCOMING_BADGES = [
  { id: '8',  title: '14 kunlik seriya',     xp: 300, daysLeft: 2 },
  { id: '9',  title: '50% reja bajarildi',   xp: 250, daysLeft: 3 },
  { id: '10', title: '30 kunlik seriya',     xp: 500, daysLeft: 16 },
  { id: '11', title: 'Barcha fazalarni tugatlash', xp: 1000, daysLeft: 28 },
]

const STREAK = 12
const STREAK_BEST = 14

export function PatientAchievementsPage() {
  const [claimed, setClaimed] = useState(false)

  const xpPct = Math.round((CURRENT_LEVEL_XP / LEVEL_XP) * 100)

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Yutuqlar</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Mashqlarni bajarib XP yig'ing</p>
      </div>

      {/* Level card */}
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl shrink-0">
            🏅
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-white/90" />
              <span className="font-bold text-lg">{LEVEL}</span>
            </div>
            <p className="text-sm opacity-90">{TOTAL_XP.toLocaleString()} XP jami</p>
            <p className="text-xs opacity-75 mt-0.5">{CURRENT_LEVEL_XP} / {LEVEL_XP} XP → {NEXT_LEVEL}</p>
          </div>
        </div>
        <div className="h-3 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${xpPct}%` }}
          />
        </div>
        <p className="text-xs opacity-75 mt-1.5 text-right">{LEVEL_XP - CURRENT_LEVEL_XP} XP {NEXT_LEVEL}ga</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Jami XP',      value: TOTAL_XP.toLocaleString(), icon: Star,    color: 'text-amber-500'  },
          { label: 'Kunlik seriya', value: `${STREAK} kun`,            icon: Flame,   color: 'text-orange-500' },
          { label: 'Yutuqlar',     value: `${EARNED_BADGES.length}`,  icon: Trophy,  color: 'text-green-600'  },
          { label: 'Rekord seriya',value: `${STREAK_BEST} kun`,       icon: Zap,     color: 'text-purple-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <stat.icon size={14} className={stat.color} />
              <span className="text-xs text-[var(--text-tertiary)] font-medium">{stat.label}</span>
            </div>
            <p className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Claim reward */}
      {!claimed ? (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold">Mukofot tayyor!</p>
              <p className="text-sm opacity-80 mt-0.5">Oylik yutuqlarni naqd qilish</p>
            </div>
            <button
              onClick={() => setClaimed(true)}
              className="bg-white text-purple-600 font-bold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Olish
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-xl p-4">
          <p className="text-green-700 dark:text-green-400 font-semibold text-sm">
            ✓ Mukofot muvaffaqiyatli qabul qilindi!
          </p>
        </div>
      )}

      {/* Earned badges */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Qo'lga kiritilgan yutuqlar</h2>
        <div className="space-y-2">
          {EARNED_BADGES.map(badge => (
            <div
              key={badge.id}
              className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-base">
                  🏅
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{badge.title}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">+{badge.xp} XP · {badge.date}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded-full">
                Olindi
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming badges */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Keyingi maqsadlar</h2>
        <div className="space-y-2">
          {UPCOMING_BADGES.map(badge => (
            <div
              key={badge.id}
              className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-base opacity-50">
                  🏅
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{badge.title}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">+{badge.xp} XP</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[var(--fg-brand-primary)] bg-[var(--bg-brand-primary)] border border-[var(--border-brand)] px-2 py-1 rounded-full">
                {badge.daysLeft} kun qoldi
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
