# MyRehab — Arxitektura hujjati

## 1. Umumiy ko'rinish

MyRehab — bitta React SPA (Single Page Application) sifatida ishlovchi
**frontend-only** ilova. Hozirgi holatda backend yo'q: barcha ma'lumotlar
`src/data/mock-data.ts` da saqlangan. Backend integratsiyasi rejalashtirilmoqda.

```
Foydalanuvchi (brauzer)
       │
       ▼
 React SPA (Vite build)
       │
       ├── TanStack Router  ──→ Sahifa komponentlari (features/)
       ├── TanStack Query   ──→ [keyinchalik] api.myrehab.uz (REST)
       ├── Zustand          ──→ Til tanlash (localStorage)
       └── i18next          ──→ UZ / EN / RU tarjimalar
```

---

## 2. Papka tuzilishi va mas'uliyat

```
src/
├── components/        Qayta ishlatiladigan UI qismlari
│   ├── layout/        AppLayout (desktop + mobil sidebar)
│   ├── charts/        Recharts wrappers
│   └── ui/            Dizayn tizimi komponentlari
│
├── features/          Sahifa-darajali modullar (har biri mustaqil)
│   ├── dashboard/
│   ├── patients/      list.tsx · detail.tsx
│   ├── insights/
│   ├── appointments/
│   ├── team/
│   └── docs/
│
├── data/              Vaqtinchalik mock ma'lumotlar
│   └── mock-data.ts   Patient, Doctor, Alert, Checklist tiplari va namunalar
│
├── i18n/              Ko'p tillilik
│   ├── index.ts       i18next init (localStorage dan til o'qiydi)
│   └── locales/       uz.ts · en.ts · ru.ts
│
├── store/             Zustand store'lar
│   └── lang.ts        useLangStore — til holati va localStorage sinxronizatsiya
│
├── lib/               Yordamchi funksiyalar
│   └── utils.ts       cn() (clsx + tailwind-merge), formatDate()
│
├── styles/
│   └── globals.css    Tailwind v4 + Untitled UI Blue dizayn tokenlari
│
└── router.tsx         TanStack Router — barcha marshrut ta'riflari
```

---

## 3. Marshrut (Routing)

TanStack Router **code-based** konfiguratsiyada ishlatilgan (`router.tsx`).
Himoyalangan marshrut mexanizmi hozircha yo'q — autentifikatsiya keyinroq.

| Marshrut | Komponent |
|----------|-----------|
| `/` | `/dashboard` ga yo'naltirish |
| `/dashboard` | `DashboardPage` |
| `/patients` | `PatientsListPage` |
| `/patients/$patientId` | `PatientDetailPage` |
| `/insights` | `InsightsPage` |
| `/appointments` | `AppointmentsPage` |
| `/docs` | `DocsPage` |
| `/team` | `TeamPage` |

---

## 4. Layout tizimi

`AppLayout` ikki rejimda ishlaydi:

```
Desktop (≥1024px)                 Mobil (<1024px)
┌─────────┬──────────────────┐   ┌──────────────────┐
│         │                  │   │ ☰  MyRehab       │  ← top bar
│ Sidebar │   Asosiy kontent │   ├──────────────────┤
│ 280px   │   (to'liq keng)  │   │   Asosiy kontent │
│  fixed  │                  │   │                  │
└─────────┴──────────────────┘   └──────────────────┘
                                  ▼ hamburger bosilganda
                                 ┌──────────────────┐
                                 │█████  overlay    │
                                 │Sidebar  (drawer) │
                                 └──────────────────┘
```

Sidebar tarkibi:
- Logo + "Klinik platforma" taglavha
- Asosiy navigatsiya (Dashboard, Bemorlar, Tahlillar, Uchrashuvlar)
- Boshqaruv bo'limi (Hujjatlar, Jamoa)
- **Til almashtiruvchi** (O'z / EN / РУ pill)
- Yordam + Sozlamalar tugmalari
- Foydalanuvchi profil bloki

---

## 5. Til tizimi (i18n)

```
LocalStorage ("lang")
       │
       ▼
 useLangStore (Zustand)  ──setLang()──→  i18n.changeLanguage()
                                                │
                                                ▼
                                    useTranslation() → t('key')
```

Barcha UI matnlari `t('section.key')` orqali olinadi. Standart til: **uz**.
Yangi til qo'shish uchun `src/i18n/locales/` ga fayl qo'shing va
`src/i18n/index.ts` da ro'yxatdan o'tkazing.

---

## 6. Ma'lumot qatlami (hozirgi holat)

Hozirda barcha ma'lumotlar `src/data/mock-data.ts` da — real API yo'q.

**Asosiy tiplar:**

```ts
Patient       // bemor (klinik ma'lumotlar, hujjatlar, nazorat ro'yxati)
Doctor        // shifokor (jadval bloklar bilan)
Alert         // ogohlantirish (high / medium / low)
DocumentGroup // hujjat guruh → fayllar
ChecklistGroup // nazorat ro'yxati bandi
```

**Backend integratsiya qo'shilganda:**
- `src/services/*.service.ts` API qatlami sifatida qo'shiladi
- TanStack Query hook'lari mock import'larni almashtiradi
- `mock-data.ts` dan ma'lumot o'qish olib tashlanadi

---

## 7. Dizayn tizimi

**Untitled UI — Blue** tokenlariga asoslangan:

```css
--color-brand-600: #155EEF   /* asosiy rang */
--color-gray-{25-900}        /* kulrang gradatsiya */
--color-success-{50,600,700} /* yashil */
--color-error-{50,600,700}   /* qizil */
--color-warning-{50,600,700} /* sariq */
```

Base font: **Inter** (Google Fonts), `font-size: 16px`.

UI komponentlari (`src/components/ui/`):

| Komponent | Kutubxona |
|-----------|-----------|
| Button | Base UI (`@base-ui/react`) |
| Input | Base UI |
| Select / PillSelect | Base UI |
| Checkbox | Base UI |
| Avatar | Yozilgan (initials + rang) |
| Badge (Status / Tag) | Yozilgan |

---

## 8. Deploy arxitekturasi

```
GitHub (main branch)
       │  push
       ▼
  Render (autoDeploy: true)
       │
       ├── npm install && npm run build
       │         (tsc -b && vite build → dist/)
       │
       └── npm run start
                 (serve -s dist  → SPA fallback)
```

`serve -s` bayrog'i har qanday URL uchun `index.html` qaytaradi —
TanStack Router client-side routing uchun zarur.

---

## 9. Keyingi arxitektura qarorlari

| Qaror | Variantlar | Tavsiya |
|-------|-----------|---------|
| Auth | JWT + refresh / Session cookie | JWT (stateless API uchun yaxshiroq) |
| RBAC | Markazlashgan permissions.ts | Shifokor / Klinika admini / Hamshira |
| API qatlam | service.ts fayllar | `src/services/` papkasi |
| Real-time | WebSocket / SSE | Bildirishnomalar uchun SSE yetarli |
| Testlar | Vitest + Playwright | Muhim sahifalar uchun avval E2E |
| File routing | Code-based → file-based | Routelar ko'payganda o'tkazish |
