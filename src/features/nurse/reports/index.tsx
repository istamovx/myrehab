import { useState } from 'react'
import { FileText, Download } from 'lucide-react'

const STATS = [
  { label: "Uy tashrifi", value: '47 / 52', note: "Bu oy (Aprel)" },
  { label: "Tekshirilgan dorilar", value: '12 / 12', note: "Barcha hudud bemorlar" },
  { label: "Yuborilgan eskalatsiyalar", value: '3', note: "Barcha shifokorlar tomonidan qabul qilindi" },
  { label: "Noxush hodisalar", value: '0', note: "Toza yozuv", color: 'text-green-600' },
]

const FORMS = [
  { code: "025-у", name: "Ambulatoriya kartasi", desc: "Uy tashrifi ma'lumotlari bilan to'ldirilgan. Poliklinika arxivi uchun.", due: 'Har hafta' },
  { code: "030-у", name: "Dispanseriya jadvali", desc: "Surunkali bemorlar uchun. Barcha hududdagi barcha bemorlar qamrab olingan.", due: "Oylik" },
  { code: "112-у", name: "Patronaj jurnali", desc: "Kundalik tashrifm yozuvlari. SSVR standartiga javob beradi.", due: "Kunlik" },
  { code: "Hisobot", name: "Oylik faoliyat hisoboti", desc: "Umumlashtirilgan statistika: tashrifmlar soni, dorilar, eskalatsiyalar.", due: "Oylik" },
]

const VISIT_HISTORY = [
  { date: '9-aprel',  patient: 'Karimov Alisher',   type: "Vital + mashq", outcome: "Aspirin yetishmaydi" },
  { date: '8-aprel',  patient: 'Toshev Bobur',       type: "Dori tekshiruvi",   outcome: "Insulinni refrigeratorda saqlash" },
  { date: '7-aprel',  patient: 'Azimova Nigora',     type: "Tana joyi foto",   outcome: "Yara shifo topmoqda" },
  { date: '7-aprel',  patient: 'Rahimov Sardor',     type: "Dastlabki tashrifm", outcome: "Uy xavfsizligi tekshirildi" },
  { date: '6-aprel',  patient: 'Tursunova Dilnoza',  type: "Vital tekshirish",  outcome: "AD baland — eskalatsiya yuborildi" },
]

export function NurseReportsPage() {
  const [exported, setExported] = useState<Set<string>>(new Set())

  function handleExport(code: string) {
    setExported(prev => new Set([...prev, code]))
  }

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">SSVR hisobotlari</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Rasmiy O'zbekiston SSV hisobot shakllari — 025-у, 030-у, 112-у</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--border-secondary)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
            <Download size={15} /> Excel eksport
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--fg-brand-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
            <FileText size={15} /> SSVR eksport
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map(stat => (
          <div key={stat.label} className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
            <p className={['text-2xl font-bold', stat.color ?? 'text-[var(--text-primary)]'].join(' ')}>{stat.value}</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{stat.label}</p>
            <p className="text-xs text-[var(--text-tertiary)] opacity-75">{stat.note}</p>
          </div>
        ))}
      </div>

      {/* Official forms */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border-secondary)]">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Rasmiy SSVR shakllari</h2>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">O'zbekiston Sog'liqni Saqlash Vazirligi talablari bo'yicha</p>
        </div>
        <div className="divide-y divide-[var(--border-secondary)]">
          {FORMS.map(form => (
            <div key={form.code} className="flex items-center gap-4 px-4 py-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--fg-brand-primary)] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {form.code}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{form.name}</p>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{form.desc}</p>
                <p className="text-xs font-medium text-[var(--fg-brand-primary)] mt-0.5">{form.due}</p>
              </div>
              <button
                onClick={() => handleExport(form.code)}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0',
                  exported.has(form.code)
                    ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/20'
                    : 'border border-[var(--border-secondary)] text-[var(--text-secondary)] hover:border-[var(--fg-brand-primary)] hover:text-[var(--fg-brand-primary)]',
                ].join(' ')}
              >
                <Download size={12} />
                {exported.has(form.code) ? 'Yuklandi' : 'Yuklab olish'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Visit history */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border-secondary)]">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">So'nggi tashrifm tarixi</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                {['Sana', 'Bemor', "Tashrifm turi", 'Natija'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-[var(--text-tertiary)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-secondary)]">
              {VISIT_HISTORY.map((row, i) => (
                <tr key={i} className="hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="px-3 py-2.5 text-xs text-[var(--text-secondary)]">{row.date}</td>
                  <td className="px-3 py-2.5 text-xs font-semibold text-[var(--text-primary)]">{row.patient}</td>
                  <td className="px-3 py-2.5 text-xs text-[var(--text-secondary)]">{row.type}</td>
                  <td className="px-3 py-2.5 text-xs text-[var(--text-secondary)]">{row.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
