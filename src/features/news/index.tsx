import { useState } from 'react'
import { BookOpen, Brain, Calendar } from 'lucide-react'

type NewsTab = 'journals' | 'board' | 'cases' | 'cme'

const JOURNAL_ARTICLES = [
  {
    tag: 'YANGI', tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
    title: 'AHA/ASA Insult reabilitatsiyasi yangilangan ko\'rsatmalari 2026',
    meta: 'Stroke, Aprel 2026',
    desc: "Erta mobilizatsiya vaqti va intensivligi bo'yicha yangi tavsiyalar.",
  },
  {
    tag: 'RCT', tagColor: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400',
    title: "Saraton bilan bog'liq charchash uchun mashq vs oddiy parvarish: 47 RCT sharhi",
    meta: 'Cochrane, Mart 2026',
    desc: "O'rtacha aerobik mashq CRF ni 0.6 SD ga kamaytiradi.",
  },
  {
    tag: "OGOHLANTIRISH", tagColor: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400',
    title: "Dori xavfsizligi: Metformin + yodlangan kontrast — yangilangan FDA protokoli",
    meta: 'FDA, Mart 2026',
    desc: "Kontrastdan 48 soat oldin va keyin vaqtincha to'xtatish zarur.",
  },
  {
    tag: 'META', tagColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400',
    title: "Teletibbiyot bilan yurak reabilitatsiyasi: 23% yuqori tugatish darajasi",
    meta: 'JAMA Cardiology, Fev 2026',
    desc: "Gibrid model 12 markazda faqat shaxsiy modeldan yaxshiroq natija berdi.",
  },
  {
    tag: 'SHARH', tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
    title: "EULAR 2026: Tizza osteoartriti uchun mashq tavsiyalari yangilanishi",
    meta: 'Ann Rheum Dis, Yan 2026',
    desc: "Kam zarba beruvchi mustahkamlash afzal ko'riladi. Suv terapiyasi A darajali dalil.",
  },
]

const BOARD_STATS = [
  { label: "O'rganish seriyasi", value: '12 kun' },
  { label: 'Javob berilgan savollar', value: '248' },
  { label: 'Aniqlik', value: '76%' },
  { label: "Eng zaif mavzu", value: 'Orqa miya' },
]

const REPEAT_ITEMS = [
  { q: "FIM baholash: o'z-o'zini parvarish qilish", due: 'Bugun kerak' },
  { q: "Orqa miya jarohati ASIA tasnifi", due: 'Bugun kerak' },
  { q: "Yurak reabilitatsiyasi ziddiyatlilari", due: 'Ertaga' },
]

const CASES = [
  {
    title: '55 yoshli erkak, total tizza protezidan keyin (10-kun)',
    body: "Etarli og'riqni boshqarish bilan progressiv tizza qattiqligi. ROM: 0-75° (maqsad: 0-120°). Infeksiya belgilari yo'q. Rentgen: implant yaxshi joylashgan. Tiz bukilishidan qo'rqib xabar beradi.",
  },
]

const CME_EVENTS = [
  { name: 'ASNR 2026', dates: '17–22 may', location: 'Austin, TX', credits: '32 kredit' },
  { name: 'ISPRM Jahon Kongressi 2026', dates: '8–12 iyun', location: 'Lissabon, Portugalia', credits: '40 kredit' },
  { name: 'AOCR 2027 (O\'zbekiston)', dates: 'Mart 2027', location: 'Toshkent, O\'zbekiston', credits: 'TBA' },
]

const WEBINARS = [
  { title: "Reabilitatsiyada AI: Dalildan amaliyotga", date: '15-aprel, 18:00 UTC', info: "Bepul" },
  { title: 'Saraton charchashini boshqarish — ESMO vebinari', date: '22-aprel, 14:00 UTC', info: '2 CME kredit' },
  { title: "Yurak reabilitatsiyasi yangilanishi: ESC ko'rsatmalari sharhi", date: '29-aprel, 16:00 UTC', info: '1.5 CME kredit' },
]

const TABS: { key: NewsTab; label: string; icon: React.ElementType }[] = [
  { key: 'journals', label: 'Jurnal lenti',   icon: BookOpen },
  { key: 'board',    label: 'Board tayyorliq', icon: Brain    },
  { key: 'cases',    label: 'Klinik holatlar', icon: BookOpen },
  { key: 'cme',      label: 'CME / Tadbirlar', icon: Calendar },
]

export function NewsPage() {
  const [tab, setTab] = useState<NewsTab>('journals')
  const [boardAnswer, setBoardAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Tibbiy yangiliklar va ta'lim</h1>
        <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Jurnallar, board tayyorligi, klinik holatlar va CME</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-[var(--bg-secondary)] rounded-xl p-1 flex-wrap">
        {TABS.map(t2 => (
          <button
            key={t2.key}
            onClick={() => setTab(t2.key)}
            className={[
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors',
              tab === t2.key
                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]',
            ].join(' ')}
          >
            <t2.icon size={13} />
            {t2.label}
          </button>
        ))}
      </div>

      {/* Journals */}
      {tab === 'journals' && (
        <div className="space-y-3">
          {JOURNAL_ARTICLES.map((art, i) => (
            <div key={i} className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
              <div className="flex items-start gap-3">
                <span className={['text-xs font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5', art.tagColor].join(' ')}>{art.tag}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{art.title}</h3>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{art.desc}</p>
                  <p className="text-xs font-semibold text-[var(--fg-brand-primary)] mt-1">{art.meta}</p>
                </div>
                <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--border-secondary)] text-[var(--text-secondary)] hover:border-[var(--fg-brand-primary)] hover:text-[var(--fg-brand-primary)] transition-colors shrink-0">
                  O'qish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Board prep */}
      {tab === 'board' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BOARD_STATS.map(s => (
              <div key={s.label} className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-3">
                <p className="text-xs text-[var(--text-tertiary)]">{s.label}</p>
                <p className="text-xl font-bold text-[var(--text-primary)] mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Kunlik board savoli</h2>
              <span className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-secondary)] px-2 py-1 rounded-full">Savol #249</span>
            </div>
            <p className="text-sm text-[var(--text-primary)] mb-4 leading-relaxed">
              62 yoshli ayol o'ng hemiparezi bilan ishemik insultdan 3 hafta o'tgan. U mustaqil o'tirishi mumkin, lekin ko'chirishda mo'tadil yordam kerak. Barthel indeksi 55/100. QAYSI reabilitatsiya joyi ENG mos?
            </p>
            <div className="space-y-2">
              {[
                'A. Haftalik PT tashrifi bilan uyda reabilitatsiya',
                'B. Kuniga 3 soat terapiya bilan stasionar reabilitatsiya muassasasi (IRF)',
                'C. Kuniga 1 soat terapiya bilan malakali hamshiralik muassasasi',
                'D. Haftada 3 marta ambulatoriya reabilitatsiya klinikasi',
              ].map(opt => (
                <button
                  key={opt}
                  onClick={() => setBoardAnswer(opt)}
                  className={[
                    'w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-colors',
                    boardAnswer === opt
                      ? 'border-[var(--fg-brand-primary)] bg-[var(--bg-brand-primary)] text-[var(--text-primary)] font-medium'
                      : 'border-[var(--border-secondary)] text-[var(--text-secondary)] hover:border-[var(--fg-brand-primary)]',
                  ].join(' ')}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button
                disabled={!boardAnswer}
                className="px-4 py-2 rounded-lg bg-[var(--fg-brand-primary)] text-white text-xs font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                Javob berish
              </button>
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="px-4 py-2 rounded-lg border border-[var(--border-secondary)] text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                Tushuntirish
              </button>
            </div>
            {showExplanation && (
              <div className="mt-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                  <strong>To'g'ri javob: B.</strong> Barthel 55/100 bo'lgan bemorlar uchun kuniga ≥3 soat terapiya bilan stasionar IRF tavsiya etiladi — bu darajadagi funksional cheklov uchun optimal.
                </p>
              </div>
            )}
          </div>

          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Takroriy ko'rib chiqish</h2>
            <div className="space-y-2">
              {REPEAT_ITEMS.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{item.q}</p>
                    <p className="text-xs text-orange-500 font-medium mt-0.5">{item.due}</p>
                  </div>
                  <button className="text-xs font-semibold px-3 py-1 rounded-lg border border-[var(--border-secondary)] text-[var(--text-secondary)] hover:border-[var(--fg-brand-primary)] transition-colors">
                    Ko'rish
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cases */}
      {tab === 'cases' && (
        <div className="space-y-4">
          {CASES.map((c, i) => (
            <div key={i} className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-[var(--text-primary)]">Haftaning klinik holati</h2>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/20 px-2 py-1 rounded-full">Yangi</span>
              </div>
              <div className="p-3 rounded-lg bg-[var(--bg-brand-primary)] border border-[var(--border-brand)] mb-3">
                <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">{c.title}</p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{c.body}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg bg-[var(--fg-brand-primary)] text-white text-xs font-semibold hover:opacity-90 transition-opacity">
                  Muhokama
                </button>
                <button className="px-4 py-2 rounded-lg border border-[var(--border-secondary)] text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
                  Ekspert yechimi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CME */}
      {tab === 'cme' && (
        <div className="space-y-4">
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border-secondary)] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Kelayotgan konferensiyalar</h2>
              <button className="text-xs font-semibold text-[var(--fg-brand-primary)] hover:opacity-80">Tadbir qo'shish</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[var(--bg-secondary)]">
                  <tr>
                    {['Tadbir', 'Sana', 'Joyi', 'CPD', ''].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-[var(--text-tertiary)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-secondary)]">
                  {CME_EVENTS.map((ev, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2.5 text-xs font-semibold text-[var(--text-primary)]">{ev.name}</td>
                      <td className="px-3 py-2.5 text-xs text-[var(--text-secondary)]">{ev.dates}</td>
                      <td className="px-3 py-2.5 text-xs text-[var(--text-secondary)]">{ev.location}</td>
                      <td className="px-3 py-2.5 text-xs font-medium text-[var(--text-primary)]">{ev.credits}</td>
                      <td className="px-3 py-2.5">
                        <button className="text-xs font-semibold text-[var(--fg-brand-primary)] hover:opacity-80">Ro'yxat</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Bu oy vebinarlar</h2>
              <button className="text-xs font-semibold text-[var(--fg-brand-primary)] hover:opacity-80">Qo'shish</button>
            </div>
            <div className="space-y-2">
              {WEBINARS.map((w, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{w.title}</p>
                    <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{w.date} · {w.info}</p>
                  </div>
                  <button className="text-xs font-semibold px-3 py-1 rounded-lg border border-[var(--border-secondary)] text-[var(--text-secondary)] hover:border-[var(--fg-brand-primary)] transition-colors shrink-0">
                    Qo'shilish
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
