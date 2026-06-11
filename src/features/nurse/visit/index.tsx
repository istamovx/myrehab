import { useState } from 'react'
import { MapPin, AlertTriangle, CheckCircle2, Camera } from 'lucide-react'

const MEDS = [
  { name: 'Metformin 1000 mg', expected: 24, status: 'ok' as const },
  { name: 'Lizinopril 10 mg',  expected: 12, status: 'ok' as const },
  { name: 'Aspirin 100 mg',    expected: 18, status: 'warn' as const, note: '2 taga yetishmaydigan' },
  { name: 'Atorvastatin 20 mg',expected: 28, status: 'ok' as const },
]

const EXERCISE_OBS = [
  { name: 'Yurish — 10 daq tekis yuzada', note: "Yaxshi sur'at, chapda ozgina oqsoqlik. Trast yordami yo'q. YUR 82→94 zarba/daq.", status: 'good' },
  { name: 'Yelka ROM — o\'tirib', note: "Fleksiya ~90°, abduksiya ~75°. Abduksiya paytida tana kompensatsiyasi. Og'riq 3/10.", status: 'warn' },
  { name: "Nafas olish mashqlari", note: "5 daq diafragmatik. To'g'ri texnika. Bemor so'ngra xotirjamroq his qilmoqda.", status: 'good' },
]

const EDU_ITEMS = [
  { id: '1', label: "Dori jadvali ko'rib chiqildi", done: true },
  { id: '2', label: "Parhez bo'yicha ko'rsatma (tuz, oqsil)", done: true },
  { id: '3', label: "Yara/tana joyini o'z-o'zi kuzatish", done: false },
  { id: '4', label: "Uy mashqi texnikasini to'g'irlash", done: true },
  { id: '5', label: "Favqulodda belgilar tushuntirildi (103)", done: false },
]

export function NurseVisitPage() {
  const [bp, setBp] = useState({ sys: '138', dia: '85' })
  const [hr, setHr] = useState('76')
  const [spo2, setSpo2] = useState('97')
  const [temp, setTemp] = useState('36.8')
  const [weight, setWeight] = useState('82')
  const [glucose, setGlucose] = useState('7.2')
  const [edu, setEdu] = useState(EDU_ITEMS)
  const [family, setFamily] = useState("Ha — Turmush o'rtog'i")
  const [homeRisk, setHomeRisk] = useState("Xavf aniqlanmadi")
  const [notes, setNotes] = useState("AD ozgina baland. Aspirin hisob-kitobi yetishmayapti — bemor kechki dozani 2 marta unutganini aytdi. Yelka abduksiyasi tana bilan kompensatsiya qilinyapti. Tuz kamayishi haqida gaplashdi. Oila qo'llab-quvvatlaydi.")
  const [nextVisit, setNextVisit] = useState("3 kunda (standart)")
  const [escalated, setEscalated] = useState(false)
  const [completed, setCompleted] = useState(false)

  function toggleEdu(id: string) {
    setEdu(prev => prev.map(e => e.id === id ? { ...e, done: !e.done } : e))
  }

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Uy tashrifi — Karimov Alisher</h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Tuzilgan tashrifm protokoli. GPS tekshirish joylashuvni tasdiqlaydi.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-[var(--border-secondary)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
            Qoralama
          </button>
          <button
            onClick={() => setCompleted(true)}
            className="px-4 py-2 rounded-lg bg-[var(--fg-brand-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Tashrifmni yakunlash
          </button>
        </div>
      </div>

      {completed && (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-green-600 shrink-0" />
          <p className="text-sm font-semibold text-green-700 dark:text-green-400">
            Tashrifm muvaffaqiyatli yakunlandi. Ma'lumot poliklinikaga va shifokorga yuborildi.
          </p>
        </div>
      )}

      {/* GPS checkin */}
      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-xl p-4 flex items-start gap-3">
        <MapPin size={18} className="text-green-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-green-700 dark:text-green-400">GPS tekshirish tasdiqlandi</p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Bemor manzili: Bunyodkor mahallasi, Chilanzar tumani, 12-dom, 45-kvartira. Kirish vaqti: 09:02.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-4">
          {/* Vitals */}
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">1. Vital ko'rsatkichlar</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Qon bosimi', value: `${bp.sys}/${bp.dia} mmHg`, isCustom: true },
                { label: 'Yurak tezligi', value: hr, unit: 'zarba/daq', onChange: setHr },
                { label: 'SpO₂', value: spo2, unit: '%', onChange: setSpo2 },
                { label: 'Harorat', value: temp, unit: '°C', onChange: setTemp },
                { label: 'Vazn', value: weight, unit: 'kg', onChange: setWeight },
                { label: 'Glukoza', value: glucose, unit: 'mmol/L', onChange: setGlucose },
              ].map((field, i) => (
                <div key={i}>
                  <label className="text-xs font-medium text-[var(--text-tertiary)] block mb-1">{field.label}</label>
                  {field.isCustom ? (
                    <div className="flex items-center gap-1">
                      <input
                        value={bp.sys}
                        onChange={e => setBp(p => ({ ...p, sys: e.target.value }))}
                        className="w-full px-2 py-1.5 rounded-lg border border-[var(--border-secondary)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] text-center focus:outline-none focus:border-[var(--fg-brand-primary)]"
                      />
                      <span className="font-bold">/</span>
                      <input
                        value={bp.dia}
                        onChange={e => setBp(p => ({ ...p, dia: e.target.value }))}
                        className="w-full px-2 py-1.5 rounded-lg border border-[var(--border-secondary)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] text-center focus:outline-none focus:border-[var(--fg-brand-primary)]"
                      />
                    </div>
                  ) : (
                    <input
                      value={field.value}
                      onChange={e => field.onChange?.(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-[var(--border-secondary)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--fg-brand-primary)]"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pill count */}
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">2. Dori donalarini hisoblash</h2>
            <div className="space-y-2">
              {MEDS.map((med, i) => (
                <div
                  key={i}
                  className={[
                    'flex items-center justify-between p-2.5 rounded-lg',
                    med.status === 'ok' ? 'bg-green-50 dark:bg-green-950/20' : 'bg-orange-50 dark:bg-orange-950/20',
                  ].join(' ')}
                >
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">{med.name}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">Kutilgan: {med.expected} ta</p>
                  </div>
                  <span className={[
                    'text-xs font-bold px-2 py-1 rounded-full',
                    med.status === 'ok'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
                  ].join(' ')}>
                    {med.status === 'ok' ? 'Mos' : med.note}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg">
              <AlertTriangle size={14} className="text-orange-500 shrink-0 mt-0.5" />
              <p className="text-xs text-orange-700 dark:text-orange-400">
                Aspirin hisob-kitobi yetishmayapti. Bemordan so'rang. Agar qasddan bo'lmasa shifokorga xabar bering.
              </p>
            </div>
          </div>

          {/* Exercise observation */}
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">3. Mashq kuzatish</h2>
            <div className="space-y-2">
              {EXERCISE_OBS.map((ex, i) => (
                <div
                  key={i}
                  className={[
                    'p-2.5 rounded-lg',
                    ex.status === 'good' ? 'bg-green-50 dark:bg-green-950/20' : 'bg-orange-50 dark:bg-orange-950/20',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-[var(--text-primary)]">{ex.name}</p>
                    <span className={[
                      'text-xs font-bold px-2 py-0.5 rounded-full shrink-0',
                      ex.status === 'good'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
                    ].join(' ')}>
                      {ex.status === 'good' ? 'Yaxshi forma' : 'Kompensatsiya'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">{ex.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Education */}
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">4. Bemorga ta'lim</h2>
            <div className="space-y-2">
              {edu.map(item => (
                <label key={item.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-[var(--bg-secondary)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleEdu(item.id)}
                    className="accent-[var(--fg-brand-primary)]"
                  />
                  <span className={['text-xs font-medium', item.done ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'].join(' ')}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Home environment */}
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">5. Uy muhiti va oila</h2>
            <div className="space-y-2">
              <div>
                <label className="text-xs font-medium text-[var(--text-tertiary)] block mb-1">Oila a'zosi bor</label>
                <select
                  value={family}
                  onChange={e => setFamily(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-secondary)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--fg-brand-primary)]"
                >
                  <option>Ha — Turmush o'rtog'i</option>
                  <option>Ha — O'g'il/Qiz</option>
                  <option>Ha — Ota/Ona</option>
                  <option>Yo'q — Bemor yolg'iz</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--text-tertiary)] block mb-1">Uy xavfsizligi xavflari</label>
                <select
                  value={homeRisk}
                  onChange={e => setHomeRisk(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-secondary)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--fg-brand-primary)]"
                >
                  <option>Xavf aniqlanmadi</option>
                  <option>Yiqilish xavfi (gilamlar, zinapoyalar)</option>
                  <option>Harorat muammosi (juda issiq/sovuq)</option>
                  <option>Kirish muammolari</option>
                </select>
              </div>
            </div>
          </div>

          {/* Visit notes and escalation */}
          <div className="bg-[var(--bg-primary)] rounded-xl border border-[var(--border-secondary)] p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">6. Eslatmalar va eskalatsiya</h2>
              <button
                onClick={() => setEscalated(true)}
                className={[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                  escalated
                    ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/20 dark:text-green-400'
                    : 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/20 dark:border-red-900',
                ].join(' ')}
              >
                <AlertTriangle size={12} />
                {escalated ? 'Eskalatsiya yuborildi' : 'Shifokorga eskalatsiya'}
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-[var(--text-tertiary)] block mb-1">Tashrifm eslatmalari</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-secondary)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--fg-brand-primary)] resize-none"
                />
              </div>

              {/* Photo upload */}
              <div>
                <label className="text-xs font-medium text-[var(--text-tertiary)] block mb-1 flex items-center gap-1">
                  <Camera size={12} /> Tashrifm fotosuratlarini yuklash
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Yara joyi", "Dori javoni", "Uy muhiti"].map(btn => (
                    <button key={btn} className="px-3 py-1.5 rounded-lg border border-[var(--border-secondary)] text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--fg-brand-primary)] hover:text-[var(--fg-brand-primary)] transition-colors">
                      {btn}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--text-tertiary)] block mb-1">Keyingi tashrifm rejasi</label>
                <select
                  value={nextVisit}
                  onChange={e => setNextVisit(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border-secondary)] bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--fg-brand-primary)]"
                >
                  <option>3 kunda (standart)</option>
                  <option>Ertaga (nazorat talab etiladi)</option>
                  <option>7 kunda (barqaror bemor)</option>
                  <option>Maxsus sana</option>
                </select>
              </div>
            </div>
          </div>

          {/* Polyclinic sync notice */}
          <div className="bg-[var(--bg-brand-primary)] border border-[var(--border-brand)] rounded-xl p-4">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Poliklinika sinxronizatsiyasi</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Tashrifm ma'lumoti Poliklinika #42 (Dr. Karimova Z.T.) va kasalxona shifokori (Dr. Maruf S.) ga 1 soat ichida yuboriladi.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
