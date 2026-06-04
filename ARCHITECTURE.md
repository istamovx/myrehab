# MyRehab — Arxitektura Hujjati

Bu hujjat MyRehab frontend platformasining texnik arxitekturasini tavsiflaydi.

---

## 1. Umumiy ko'rinish

MyRehab — **single-page application (SPA)**, lekin ikki xil deploymentga
("app mode") qurilgan. Bir kod bazasi, ikki maqsadli build:

```
                  ┌─────────────────────────────┐
                  │      Bitta kod bazasi        │
                  │   (myrehab-darshboard)       │
                  └──────────────┬──────────────┘
                                 │ VITE_APP_MODE
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
        ┌────────────────┐              ┌────────────────┐
        │   app build    │              │  admin build   │
        │ app.myrehab.uz │              │admin.myrehab.uz│
        └────────────────┘              └────────────────┘
        Doctor, Clinic Admin,            Super Admin
        Patient, Nurse, Caregiver
```

App mode `src/config/app-mode.ts` da host nomi yoki `VITE_APP_MODE`
environment o'zgaruvchisi orqali aniqlanadi.

---

## 2. Qatlamli arxitektura

```
┌──────────────────────────────────────────────────┐
│  Routes (TanStack Router, file-based)             │
│  src/routes/_authenticated/*                      │
├──────────────────────────────────────────────────┤
│  Features (rolga oid biznes-logika)               │
│  src/features/{doctor,patient,clinic-admin,...}   │
├──────────────────────────────────────────────────┤
│  RBAC Guard (permission tekshiruvi)               │
│  src/lib/rbac                                     │
├──────────────────────────────────────────────────┤
│  Services (API qatlami)        State              │
│  src/services/*.service.ts     TanStack Query     │
│                                Zustand            │
├──────────────────────────────────────────────────┤
│  HTTP klient (Axios) + WebSocket                  │
│  src/lib/api · src/lib/websocket.ts               │
└──────────────────────┬───────────────────────────┘
                       ▼
              api.myrehab.uz (REST + WS)
```

---

## 3. Asosiy qarorlar (Design Decisions)

### 3.1. Feature-based tashkillashtirish
Har bir rol/modul `src/features/` ichida o'z papkasiga ega. Bu:
- Kelajakda rollarni **alohida domenlarga** ajratishni osonlashtiradi
- Kodni rol bo'yicha izolyatsiya qiladi
- Lazy-loading va code-splitting uchun qulay

### 3.2. Markazlashgan RBAC
Barcha ruxsatlar `src/lib/rbac/permissions.ts` dagi `PERMISSION_MATRIX`
orqali boshqariladi. **Qoida:** komponentlarda `if (role === 'DOCTOR')`
kabi inline tekshiruvlar TAQIQLANGAN. Faqat permission kalitlari ishlatiladi:

```ts
// ❌ Noto'g'ri
if (user.role === 'DOCTOR') { ... }

// ✅ To'g'ri
if (hasPermission(user, Permission.VIEW_PATIENTS_LIST)) { ... }
```

### 3.3. Server state vs Client state
- **Server state** (API ma'lumotlari) → TanStack Query (kesh, qayta-yuklash)
- **Client state** (UI holati) → Zustand
- Bu ikkisi aralashtirilmaydi.

### 3.4. Servis qatlami
Har bir domen uchun alohida servis fayli mavjud (`src/services/`):
`doctor.service.ts`, `patient.service.ts`, `clinic-admin.service.ts`,
`mdt.service.ts`, `messaging.service.ts` va h.k. Komponentlar API'ga
to'g'ridan-to'g'ri murojaat qilmaydi — faqat servislar orqali.

---

## 4. Asosiy modullar (Routes)

`src/routes/_authenticated/` ostida 50+ route mavjud. Asosiylari:

| Modul | Route | Asosiy rol |
|-------|-------|-----------|
| Ish ro'yxati (Worklist) | `/` | Doctor |
| Biriktirilgan bemorlar | `/assigned-patients` | Doctor |
| Reabilitatsiya rejasi | `/rehab-plan` | Doctor |
| Reja tasdiqlash | `/plan-approvals` | Doctor / Admin |
| Xavfsizlik darvozasi | `/safety-gate` | Doctor |
| Telekonsultatsiya | `/teleconsult` | Doctor / Patient |
| MDT jamoasi | `/care-team`, `/mdt` | Doctor |
| Mashqlar kutubxonasi | `/exercises` | Doctor |
| Xabarlar (chat) | `/messages`, `/chat` | Barcha |
| Bildirishnomalar | `/notifications` | Barcha |
| Audit jurnali | `/audit-logs` | Doctor / Admin |
| Shifokorlar boshqaruvi | `/doctors` | Clinic Admin |
| A'zolik so'rovlari | `/membership-requests` | Clinic Admin |
| Bemorlar reestri | `/patients` | Clinic Admin / Doctor |
| Mening rejam | `/my-plan` | Patient |
| Mening progressim | `/my-progress` | Patient |
| Simptomlar / Vitallar | `/symptoms`, `/vitals` | Patient |
| Ovqatlanish | `/nutrition` | Patient |
| AI metrikalari | `/ai-metrics` | Super Admin |
| LLM provayderlari | `/llm-providers` | Super Admin |
| Provayder failover | `/provider-failover` | Super Admin |

---

## 5. AI va klinik qaror qo'llab-quvvatlash

Tizim reabilitatsiya rejalarini AI yordamida generatsiya qiladi
("smart plan hybrid generator"). Har bir tavsiyada **"Dalillar va asoslash"**
(evidence & justification) paneli ko'rsatiladi — bu SaMD talablariga muvofiq
shifokorga AI qarorini tushuntirishni ta'minlaydi.

LLM provayderlari **failover** mexanizmi bilan boshqariladi
(`/provider-failover`, `/llm-providers`) — bitta provayder ishlamay qolsa,
tizim avtomatik boshqasiga o'tadi.

---

## 6. Real-time qatlam

- **Chat:** WebSocket orqali (`src/lib/websocket.ts`) — shifokor↔bemor xabarlari
- **Bildirishnomalar:** real-time push
- **Telekonsultatsiya:** Zoom Video SDK + UI Toolkit

---

## 7. Xalqarolashtirish (i18n)

3 til qo'llab-quvvatlanadi: **O'zbek (default), Rus, Ingliz**.
Tarjimalar `src/locales/` da. Til localStorage'da saqlanadi
(`src/lib/i18n.ts`). Default til — O'zbek.

> **Eslatma:** Hozircha `<html lang>` atributi statik "en" da qolib ketgan —
> bu tuzatilishi kerak (SEO va accessibility uchun).

---

## 8. Kelajak yo'nalishlari (Roadmap)

| Ustuvorlik | Vazifa |
|-----------|--------|
| 🔴 Yuqori | Bemor ilovasini (PWA / Telegram) mustaqil mahsulot sifatida pishitish |
| 🔴 Yuqori | api/clinic/* 403 muammosini backend tomondan hal qilish |
| 🟡 O'rta | Bildirishnomalarni deduplikatsiya qilish |
| 🟡 O'rta | `<html lang>` ni dinamik qilish |
| 🟢 Past | Seed/test ma'lumotlarini tozalash (nomsiz bemorlar, null mashqlar) |
| 🟢 Past | GitHub Issues/Projects'ni yoqib, backlog yuritish |
