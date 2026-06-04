# MyRehab — Xususiy klinikalar uchun reabilitatsiya platformasi

> Reabilitatsiya bo'limini boshqarish uchun klinik veb-ilova.
> Shifokorlar, fizioterapevtlar va klinika xodimlari uchun mo'ljallangan.

[![Production](https://img.shields.io/badge/app-myrehab.onrender.com-blue)](https://myrehab.onrender.com)
![License: MIT](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%E2%89%A520-brightgreen)

---

## Loyiha haqida

**MyRehab** — xususiy klinikalar uchun ortopedik va reabilitatsiya bo'limini
raqamli boshqarish platformasi. Tizim klinika xodimlariga quyidagilarda yordam beradi:

- **Bemorlar jarayonini kuzatish** — jarrohlikdan oldingi tayyorgarlikdan
  tiklash tugaguncha (Pre-op → Rehab → Discharge)
- **Klinik xavfni baholash** — ASA klassifikatsiyasi, ICU zaruriyati,
  allergiya va dorilar to'qnashuvi bo'yicha ogohlantirishlar
- **Jamoa koordinatsiyasi** — shifokorlar, fizioterapevtlar, hamshiralar
  jadvalini birgalikda boshqarish
- **Tahlil va hisobot** — PROMs ko'rsatkichlari, asoratlar darajasi,
  protsedura kechikishi tendensiyalari

Platforma faqat **klinika ichki xodimlari** (Back-office) uchun — bemorlar
o'z hisobi orqali kirmaydi.

---

## Texnologiyalar

**Runtime:** Node ≥ 20 · npm · Vite 6

| Qatlam | Texnologiya |
|--------|-------------|
| UI framework | React 19 + TypeScript 5.8 |
| Routing | TanStack Router v1 |
| Server state | TanStack Query v5 |
| Client state | Zustand v5 |
| UI komponentlar | Base UI (`@base-ui/react`) |
| Stillar | Tailwind CSS v4 · tailwind-merge · clsx |
| Ikonkalar | Lucide React |
| Diagrammalar | Recharts v3 |
| i18n | i18next + react-i18next (UZ / EN / RU) |
| Sana | date-fns v4 |
| Deploy | Render (Web Service · Starter · Frankfurt) |

**Dizayn tizimi:** Untitled UI — Blue (`brand-600: #155EEF`, Inter shrift)

---

## Asosiy funksiyalar

### 1. Bosh sahifa — Dashboard
Bugungi ish ko'rinishi: reabilitatsiya sessiyalari soni va holati,
xavf ostidagi bemorlar, muhim ogohlantirishlar, jamoa Gantt jadvali,
shifokorlar mavjudligi.

### 2. Bemorlar — Patients
Klinikadagi barcha bemorlar ro'yxati. Grid va jadval ko'rinishi,
qidiruv, holat bo'yicha filtr (Tayyor / Xavf ostida / Jarayonda /
Ruxsat kutilmoqda). Har bir bemor kartasida klinik ma'lumotlar,
hujjatlar, kontrol ro'yxati va ogohlantirishlar.

### 3. Tahlillar — Insights
Asoratlar darajasi (vaqt bo'yicha), tana qismlari × jamoa issiqlik
xaritasi, PROMs tendensiyasi (qoniqish / harakatchanlik / og'riq),
protsedura kechikish grafigi. Filtr: davr, protsedura turi, jamoa, bo'lim.

### 4. Uchrashuvlar — Appointments
Oylik kalendarli va kunlik rejali ko'rinish. Uchrashuv turları:
fizioterapiya, konsultatsiya, kuzatuv, baholash. Holat:
Tasdiqlangan / Kutilmoqda / Bekor qilingan.

### 5. Hujjatlar — Documents
Klinik protokollar, bemorlar shakllari, tadqiqotlar va shablonlar
ro'yxati. Kategoriya bo'yicha filtr, ko'rish va yuklab olish.

### 6. Jamoa — Team
Klinika xodimlari kartochkalari: shifokorlar, fizioterapevtlar,
radiologlar, nevrologlar. Mutaxassislik filtri, mavjudlik vaqti,
to'g'ridan-to'g'ri qo'ng'iroq tugmasi.

---

## Lokal o'rnatish

```bash
# 1. Reponi klonlash
git clone https://github.com/istamovx/myrehab.git
cd myrehab

# 2. Bog'liqliklarni o'rnatish
npm install

# 3. Dev serverni ishga tushirish
npm run dev
# Ilova http://localhost:3000 da ochiladi
```

> Backend hozircha ulangan emas — barcha ma'lumotlar `src/data/mock-data.ts`
> da. API integratsiya rejalashtirilmoqda.

---

## Skriptlar

| Buyruq | Vazifa |
|--------|--------|
| `npm run dev` | Dev server (port 3000) |
| `npm run build` | Production build (`dist/`) |
| `npm run preview` | Build natijasini lokal ko'rish |
| `npm run start` | Production serverni ishga tushirish (`serve`) |

---

## Loyiha tuzilishi

```
src/
├── components/
│   ├── layout/        # AppLayout, Sidebar
│   ├── charts/        # DonutChart (Recharts wrappers)
│   └── ui/            # Button, Input, Badge, Avatar, Select, Checkbox
├── data/
│   └── mock-data.ts   # Vaqtinchalik: bemorlar, shifokorlar, tahlil ma'lumotlari
├── features/
│   ├── dashboard/     # Bosh sahifa
│   ├── patients/      # Ro'yxat + tafsilot
│   ├── insights/      # Tahlillar
│   ├── appointments/  # Uchrashuvlar
│   ├── team/          # Jamoa
│   └── docs/          # Hujjatlar
├── i18n/
│   ├── index.ts       # i18next konfiguratsiya
│   └── locales/       # uz.ts · en.ts · ru.ts
├── lib/
│   └── utils.ts       # cn(), formatDate()
├── store/
│   └── lang.ts        # Til tanlash (Zustand + localStorage)
├── styles/
│   └── globals.css    # Tailwind + Untitled UI dizayn tokenlari
└── router.tsx         # TanStack Router marshrut konfiguratsiyasi
```

---

## Deployment

Ilova **Render Web Service** orqali deploy qilingan.
Konfiguratsiya: `render.yaml`

| Parametr | Qiymat |
|----------|--------|
| Runtime | Node 22 |
| Region | Frankfurt (EU) |
| Plan | Starter |
| Build | `npm install && npm run build` |
| Start | `npm run start` |
| Health check | `/` |

Har qanday `main` branchga push qilinganida avtomatik deploy ishga tushadi.

---

## Tillar (i18n)

Ilova uch tilda ishlaydi. Asosiy til — o'zbek tili.
Sidebar quyi qismidagi **O'z / EN / РУ** tugmalari orqali almashtiriladi.
Tanlov `localStorage` da saqlanadi.

| Til | Fayl |
|-----|------|
| O'zbek | `src/i18n/locales/uz.ts` |
| English | `src/i18n/locales/en.ts` |
| Русский | `src/i18n/locales/ru.ts` |

---

## Keyingi bosqich (Roadmap)

- [ ] Backend API integratsiyasi (`api.myrehab.uz`)
- [ ] Autentifikatsiya (JWT / session)
- [ ] Rol asosida ruxsatlar — RBAC (Shifokor / Klinika admini / Hamshira)
- [ ] Bemor qo'shish / tahrirlash formasini joriy etish
- [ ] Real-time bildirishnomalar (WebSocket)
- [ ] Testlar (Vitest unit + Playwright E2E)
- [ ] CI/CD pipeline (GitHub Actions)

---

## Litsenziya

MIT
