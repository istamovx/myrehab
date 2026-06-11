import { useState } from 'react'
import { Sparkles, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, FileText } from 'lucide-react'

const SAMPLE_PATIENTS = [
  'Tursunova Dilnoza (P-1042)',
  'Karimov Alisher (P-1018)',
  'Abdullayev Anvar (P-1055)',
  'Toshev Bobur (P-1067)',
]

const PHASES = [
  {
    label: '1-faza — Himoyalangan tiklash (1–2-haftalar)',
    goal: 'Xavfsiz erta harakatlanish. Jarrohlik joyini himoya qilish. Bazaviy tolerantlikni shakllantirish.',
    color: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900',
    exercises: [
      { name: 'Diafragmatik nafas olish', sets: '3 × 10', freq: '2× kuniga', note: "Post-jarrohlik o'pka himoyasi. 60s dam olish." },
      { name: "Yumshoq yelka mayatnik harakati", sets: '3 × 8', freq: '1× kuniga', note: "O'ng tomon faqat. Og'riq 3/10 chegarasi." },
      { name: "Qavslar va barmoq mashqlari", sets: '3 × 12', freq: '2× kuniga', note: "DVT oldini olish. Tizzalarni tekkizmasdan." },
      { name: "Tekis yuzada yurish", sets: '10 daq', freq: '1× kuniga', note: "Dam olish bilan. Glukoza tekshiruvi (QShK)." },
    ],
  },
  {
    label: '2-faza — Faol mustahkamlash (3–6-haftalar)',
    goal: "Yelka funksiyasini tiklash. Chidamlilikni oshirish. Progressiv yuklanish.",
    color: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900',
    exercises: [
      { name: "Yelka fleksiyasi ROM", sets: '3 × 10', freq: '3×/hafta', note: "Progressiv. O'ng tomon. Limfedema belgilarini kuzating." },
      { name: "O'tirgan tizza ekstensiyasi", sets: '3 × 8', freq: '3×/hafta', note: "Minimal qarshilik. OA-mos: to'liq uzaytirmasdan." },
      { name: "Elastik lenta qatori", sets: '2 × 10', freq: '3×/hafta', note: "Engil qarshilik. Postura tuzatish." },
      { name: "Qiyalikda yurish", sets: '15 daq', freq: 'Har kuni', note: "O'rtacha sur'at. YUR monitoringi. Glukoza nazorati." },
    ],
  },
]

const MEDS = [
  { time: '07:00', drug: 'Metformin',    dose: '1000mg',  instruction: 'Nonushta bilan. Mashqdan oldin glukoza tekshiruvi.' },
  { time: '07:00', drug: 'Lizinopril',   dose: '10mg',    instruction: "Ertalab. Mashq kunlarida AD kuzatish." },
  { time: '08:00', drug: 'Aspirin',      dose: '81mg',    instruction: "Ovqat bilan. DVT oldini olish." },
  { time: '14:00', drug: 'Paratsetamol', dose: '500mg',   instruction: "Og'riq > 4/10 da. Kuniga maks 4 ta." },
  { time: '21:00', drug: 'Atorvastatin', dose: '20mg',    instruction: "Uxlashdan oldin. Yurak himoyasi." },
]

const ALERTS_LIST = [
  { level: 'danger', text: "Har bir sessiyadan oldin qon bosimini tekshiring (Lizinopril). Agar AD > 180/110 — mashqni to'xtatish." },
  { level: 'warn',   text: "Mashqdan oldin va keyin glukoza tekshiruvi (Metformin + QShK). Gipoglikemiya xavfi." },
  { level: 'warn',   text: "Yelka mashqlari paytida: qizarish, shish yoki yiring bo'lsa to'xtatish." },
  { level: 'danger', text: "Favqulodda to'xtash: ko'krak og'rig'i, qo'l-oyoq zaifligi, nafas qiyinligi." },
]

export function ComposerPage() {
  const [patient, setPatient] = useState('')
  const [dx, setDx] = useState('')
  const [history, setHistory] = useState('')
  const [context, setContext] = useState('')
  const [generated, setGenerated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]))

  function generate() {
    if (!patient || !dx) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setGenerated(true) }, 1500)
  }

  function togglePhase(i: number) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Reja yaratish</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Bemor ma'lumotlarini kiriting va shaxsiy reabilitatsiya rejasini yarating</p>
        </div>
      </div>

      {/* Patient info */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Bemor ma'lumotlari</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)] block mb-1">Bemor ismi yoki ID</label>
            <input
              list="patientListOptions"
              value={patient}
              onChange={e => setPatient(e.target.value)}
              placeholder="Ismni kiriting..."
              className="w-full px-3 py-2 rounded-lg border border-[var(--border-secondary)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--fg-brand-primary)]"
            />
            <datalist id="patientListOptions">
              {SAMPLE_PATIENTS.map(p => <option key={p} value={p} />)}
            </datalist>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[var(--text-tertiary)] block mb-1">Yosh</label>
              <input type="number" placeholder="47" className="w-full px-3 py-2 rounded-lg border border-[var(--border-secondary)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--fg-brand-primary)]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-tertiary)] block mb-1">Jins</label>
              <select className="w-full px-3 py-2 rounded-lg border border-[var(--border-secondary)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--fg-brand-primary)]">
                <option>Ayol</option>
                <option>Erkak</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnosis */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Tashxis va kasallik tarixi</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)] block mb-1">Asosiy tashxis</label>
            <textarea
              value={dx}
              onChange={e => setDx(e.target.value)}
              rows={3}
              placeholder="Asosiy tashxis..."
              className="w-full px-3 py-2 rounded-lg border border-[var(--border-secondary)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--fg-brand-primary)] resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)] block mb-1">Qo'shimcha kasalliklar va dorilar</label>
            <textarea
              value={history}
              onChange={e => setHistory(e.target.value)}
              rows={2}
              placeholder="Boshqa kasalliklar, dorilar, allergiyalar..."
              className="w-full px-3 py-2 rounded-lg border border-[var(--border-secondary)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--fg-brand-primary)] resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--text-tertiary)] block mb-1">Klinik izohlar</label>
            <textarea
              value={context}
              onChange={e => setContext(e.target.value)}
              rows={2}
              placeholder="Reabilitatsiya maqsadlari va maxsus mulohazalar..."
              className="w-full px-3 py-2 rounded-lg border border-[var(--border-secondary)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--fg-brand-primary)] resize-none"
            />
          </div>
        </div>
      </div>

      {/* File uploads */}
      <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Fayllari biriktirish</h2>
        <div className="flex flex-wrap gap-2">
          {['Tahlillar yuklash', 'Tasvirlar yuklash', 'Hujjatlar yuklash'].map(btn => (
            <button key={btn} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border-secondary)] text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--fg-brand-primary)] hover:text-[var(--fg-brand-primary)] transition-colors">
              <FileText size={13} /> {btn}
            </button>
          ))}
        </div>
        <div className="mt-2 px-3 py-2 border border-dashed border-[var(--border-secondary)] rounded-lg text-xs text-[var(--text-tertiary)]">
          Fayl biriktirmagan.
        </div>
      </div>

      {/* Generate button */}
      <div className="flex gap-3">
        <button
          onClick={generate}
          disabled={loading || !patient || !dx}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[var(--fg-brand-primary)] text-white font-semibold text-sm disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {loading ? (
            <><span className="animate-spin">⟳</span> Reja yaratilmoqda...</>
          ) : (
            <><Sparkles size={18} /> Reabilitatsiya rejasini yaratish</>
          )}
        </button>
        <button className="px-4 py-3.5 rounded-xl border border-[var(--border-secondary)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
          Qoralama
        </button>
      </div>

      {/* Generated plan */}
      {generated && (
        <div className="space-y-4">
          <div className="bg-[var(--bg-primary)] rounded-xl border-2 border-[var(--fg-brand-primary)] overflow-hidden">
            <div className="px-4 py-3 bg-[var(--bg-brand-primary)] border-b border-[var(--border-brand)]">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-sm font-bold text-[var(--text-primary)]">Yaratilgan reabilitatsiya rejasi</h2>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{patient || 'Tursunova Dilnoza (P-1042)'} · 47F</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400">Ishonch: 78%</span>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">12 manba</span>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400">1 xavfsizlik bayrog'i</span>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Timeline */}
              <div className="p-4 rounded-xl bg-[var(--bg-brand-primary)] border border-[var(--border-brand)]">
                <div className="flex gap-6 flex-wrap">
                  {[
                    { label: 'Boshlanish sanasi', value: '28-aprel, 2026' },
                    { label: 'Jami davomiyligi',  value: '6 hafta (42 kun)' },
                    { label: 'Reabilitatsiya kuni', value: '1 / 42' },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wide">{item.label}</p>
                      <p className="font-bold text-[var(--text-primary)] mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phases */}
              {PHASES.map((phase, i) => (
                <div key={i} className={['rounded-xl border p-4', phase.color].join(' ')}>
                  <button
                    className="w-full flex items-center justify-between"
                    onClick={() => togglePhase(i)}
                  >
                    <h3 className="text-sm font-bold text-[var(--text-primary)] text-left">{phase.label}</h3>
                    {expanded.has(i) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {expanded.has(i) && (
                    <div className="mt-3 space-y-3">
                      <p className="text-xs text-[var(--text-secondary)]"><strong>Maqsad:</strong> {phase.goal}</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-[var(--border-secondary)]">
                              {['Mashq', 'Set × Marta', 'Chastota', 'Izoh'].map(h => (
                                <th key={h} className="text-left py-1.5 pr-3 font-semibold text-[var(--text-tertiary)]">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border-secondary)]">
                            {phase.exercises.map((ex, j) => (
                              <tr key={j}>
                                <td className="py-1.5 pr-3 font-medium text-[var(--text-primary)]">{ex.name}</td>
                                <td className="py-1.5 pr-3 text-[var(--text-secondary)]">{ex.sets}</td>
                                <td className="py-1.5 pr-3 text-[var(--text-secondary)]">{ex.freq}</td>
                                <td className="py-1.5 text-[var(--text-tertiary)]">{ex.note}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Medications */}
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 px-3 py-2 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900">
                  Dori jadvali
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-[var(--bg-secondary)]">
                      <tr>
                        {['Vaqt', 'Dori', 'Dozasi', "Ko'rsatma"].map(h => (
                          <th key={h} className="text-left px-3 py-2 font-semibold text-[var(--text-tertiary)]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-secondary)]">
                      {MEDS.map((m, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2 font-medium text-[var(--text-secondary)]">{m.time}</td>
                          <td className="px-3 py-2 font-semibold text-[var(--text-primary)]">{m.drug}</td>
                          <td className="px-3 py-2 text-[var(--text-secondary)]">{m.dose}</td>
                          <td className="px-3 py-2 text-[var(--text-tertiary)]">{m.instruction}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Safety alerts */}
              <div>
                <h3 className="text-sm font-bold text-red-600 mb-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                  Xavfsizlik ogohlantirishlari
                </h3>
                <div className="space-y-2">
                  {ALERTS_LIST.map((al, i) => (
                    <div
                      key={i}
                      className={[
                        'flex gap-2 p-3 rounded-lg text-xs',
                        al.level === 'danger'
                          ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900'
                          : 'bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900',
                      ].join(' ')}
                    >
                      <AlertTriangle size={14} className={al.level === 'danger' ? 'text-red-500 shrink-0 mt-0.5' : 'text-orange-500 shrink-0 mt-0.5'} />
                      <span className="text-[var(--text-secondary)]">{al.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2 border-t border-[var(--border-secondary)] flex-wrap">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--fg-brand-primary)] text-white text-sm font-bold hover:opacity-90 transition-opacity">
                  <CheckCircle2 size={16} /> Tasdiqlash va bemorga yuborish
                </button>
                <button className="px-4 py-3 rounded-xl border border-[var(--border-secondary)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
                  Tahrirlash
                </button>
                <button className="px-4 py-3 rounded-xl border border-red-200 dark:border-red-900 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                  Rad etish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
