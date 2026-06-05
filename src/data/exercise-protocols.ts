export interface ExerciseProtocol {
  id: string
  title: string
  category: string
  bodyPart: string
  duration: string
  level: 'Boshlang\'ich' | 'O\'rta' | 'Yuqori'
  updatedAt: string
  markdown: string
}

export const EXERCISE_PROTOCOLS: ExerciseProtocol[] = [
  {
    id: 'acl',
    title: 'ACL operatsiyadan keyingi reabilitatsiya',
    category: 'Ortopediya',
    bodyPart: 'Tizza',
    duration: '12 hafta',
    level: "O'rta",
    updatedAt: '04 iyun 2026',
    markdown: `# ACL operatsiyadan keyingi reabilitatsiya

Oldingi xochsimon boylam (ACL) tiklanganidan keyingi bosqichma-bosqich reabilitatsiya protokoli. Har bir bosqichga o'tishdan oldin **og'riq va shish** nazorat qilinishi shart.

> ⚠️ Diqqat: Og'riq 4/10 dan oshsa yoki shish kuchaysa, yuklamani kamaytiring va shifokorga murojaat qiling.

## 1-bosqich — Dastlabki tiklanish (0–2 hafta)

Maqsad: shishni kamaytirish, to'liq yozilishni tiklash, kvadritsepsni faollashtirish.

- **Kvadritseps mashqi** (Quad sets) — 3 yondosh × 10 marta, kuniga 4 marta
- **To'piq nasoslari** (Ankle pumps) — 3 × 20, qon aylanishini yaxshilaydi
- **Tizza to'liq yozilishi** — kuniga 3 marta, 10 daqiqa
- Muz qo'yish — har 2 soatda 15–20 daqiqa

## 2-bosqich — Harakat doirasi (2–6 hafta)

Maqsad: **0–120°** bukilishga erishish, yurish qadamini tiklash.

1. Tovon sirpanishi (Heel slides) — 3 × 15
2. Mini cho'qqayish (Mini squats) — 0–45°, 3 × 12
3. Statsionar velosiped — kuniga 10–15 daqiqa
4. To'g'ri oyoq ko'tarish — 3 × 12

## 3-bosqich — Kuch va muvozanat (6–12 hafta)

- **Leg press** — 0–90°, 3 × 12 (yengil yuklama)
- Bir oyoqda turish — 30 soniya × 5
- Wobble board muvozanati — 3 × 60 soniya
- Step-up mashqi — 3 × 10

\`\`\`
Yuklamani oshirish qoidasi:
  og'riqsiz 3 seans → keyingi bosqichga o'tish
  og'riq bilan → joriy bosqichda qolish
\`\`\`

---

**Tugatish mezoni:** Operatsiya qilingan oyoq kuchi sog'lom oyoqning **90%** dan kam bo'lmasligi kerak.`,
  },
  {
    id: 'knee-tkr',
    title: 'Tizza bo\'g\'imini almashtirish (TKR)',
    category: 'Ortopediya',
    bodyPart: 'Tizza',
    duration: '8 hafta',
    level: "Boshlang'ich",
    updatedAt: '03 iyun 2026',
    markdown: `# Tizza bo'g'imini almashtirgandan keyin

Total Knee Replacement (TKR) operatsiyasidan keyingi erta harakatlantirish dasturi.

## Erta bosqich (0–2 hafta)

Maqsad: shishni kamaytirish va bo'g'imni harakatga keltirish.

- **Kvadritseps siqish** — 3 × 10, kuniga 3 marta
- **Dumba siqish** (Glute sets) — 3 × 10
- Tizzani yostiq ustida yozish — 10 daqiqa, kuniga 3 marta
- To'piq nasoslari — tez-tez

> Yurish: yordamchi vosita (tayoq/walker) bilan, og'riqqa qarab.

## O'rta bosqich (2–6 hafta)

1. O'tirgan holda tizza bukish — 3 × 15
2. Statsionar velosiped — qarshiliksiz, 10 daqiqa
3. Mini cho'qqayish — devorga suyanib, 3 × 10
4. Yon tomonga oyoq ko'tarish — 3 × 12

## Kuchaytirish (6–8 hafta)

- Step-up (past zina) — 3 × 10
- Terra-bant bilan mashqlar — 3 × 15
- Muvozanat mashqlari — bir oyoqda turish

---

**Eslatma:** Har seansdan keyin muz qo'yish shishni oldini oladi.`,
  },
  {
    id: 'shoulder',
    title: 'Yelka rotator manjeti reabilitatsiyasi',
    category: 'Ortopediya',
    bodyPart: 'Yelka',
    duration: '10 hafta',
    level: "O'rta",
    updatedAt: '02 iyun 2026',
    markdown: `# Yelka rotator manjeti reabilitatsiyasi

Rotator manjet yirtilishi yoki yallig'lanishidan keyingi tiklanish protokoli.

## 1-bosqich — Himoya (0–3 hafta)

> Bu bosqichda **faol** harakatlardan saqlaning. Faqat passiv harakatlar.

- **Mayatnik mashqi** (Pendulum) — 2 daqiqa, kuniga 3 marta
- Passiv tashqi rotatsiya — tayoq yordamida, 3 × 10
- Yelka pichoqlarini siqish — 3 × 10

## 2-bosqich — Harakat tiklash (3–6 hafta)

1. Devor bo'ylab barmoq yurishi — 3 × 10
2. Faol yordamli ko'tarish — 3 × 12
3. Tashqi/ichki rotatsiya — yengil terra-bant, 3 × 15

## 3-bosqich — Kuchaytirish (6–10 hafta)

- Terra-bant tashqi rotatsiya — 3 × 15
- Yon ko'tarish (lateral raise) — yengil gantel, 3 × 12
- Eshkak tortish (row) — 3 × 12
- **Scapular** barqarorlik mashqlari — 3 × 15

---

**Diqqat:** Yelka tepasidan yuqori og'irlik ko'tarishdan 8-haftagacha saqlaning.`,
  },
  {
    id: 'spine',
    title: 'Bel umurtqasi (disk churrasi) dasturi',
    category: 'Nevrologiya',
    bodyPart: 'Umurtqa',
    duration: '6 hafta',
    level: "Boshlang'ich",
    updatedAt: '01 iyun 2026',
    markdown: `# Bel umurtqasi — disk churrasi dasturi

Bel sohasidagi disk churrasi (L4–L5, L5–S1) uchun konservativ mashqlar dasturi.

## Og'riqni boshqarish (1–2 hafta)

- **McKenzie ekstenziya** — qorin ustida yotib, 10 marta
- Tizzani ko'krakka tortish — 3 × 10
- Mushuk-tuya mashqi (Cat-camel) — 3 × 10

> Og'riq oyoqqa tarqalsa, mashqni to'xtating va holatni o'zgartiring.

## Barqarorlik (2–4 hafta)

1. Ko'prik mashqi (Bridge) — 3 × 12
2. Qorin transversini faollashtirish — 3 × 10
3. Bird-dog mashqi — 3 × 10 (har tomon)
4. Plank — 3 × 20 soniya

## Kuchaytirish (4–6 hafta)

- Yarim cho'qqayish — 3 × 12
- Dead bug mashqi — 3 × 12
- Yengil yurish — kuniga 20–30 daqiqa

---

**Profilaktika:** To'g'ri o'tirish holati va og'irlikni to'g'ri ko'tarish texnikasi o'rgatiladi.`,
  },
  {
    id: 'stroke',
    title: 'Insultdan keyingi harakat tiklash',
    category: 'Nevrologiya',
    bodyPart: 'Umumiy',
    duration: '16 hafta',
    level: 'Yuqori',
    updatedAt: '31 may 2026',
    markdown: `# Insultdan keyingi harakat tiklash

Miya qon aylanishi buzilishidan keyingi neyroreabilitatsiya — harakat va muvozanatni qayta tiklash.

## Erta bosqich — yotoq mashqlari

- Passiv bo'g'im harakatlari — har bo'g'im 10 marta
- Ko'prik mashqi — 3 × 8
- Yon tomonga ag'darilish — yordamli
- O'tirish balansini tiklash

## O'rta bosqich — vertikalizatsiya

1. O'tirishdan turishga o'tish — 3 × 8
2. Qo'llab turish — 1–2 daqiqa
3. Vazn ko'chirish mashqlari — 3 × 10
4. Qo'l-barmoq nozik motorikasi

## Yurish va funksiya

- Yordamli yurish — parallel turniklar orasida
- Qadam balandligini oshirish
- Muvozanat mashqlari — nazorat ostida
- **Kundalik faoliyat** (ADL) mashqlari: kiyinish, ovqatlanish

---

> Neyroreabilitatsiya **takrorlash** va **muntazamlik** asosida samarali. Kuniga 2 seans tavsiya etiladi.`,
  },
]
