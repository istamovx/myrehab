# MyRehab — Clinical Rehabilitation Platform (SaMD)

> Telereabilitatsiya va klinik qaror qo'llab-quvvatlash platformasi.
> Shifokorlar, klinikalar va bemorlar uchun yagona ekotizim.

[![Production](https://img.shields.io/badge/app-app.myrehab.uz-blue)](https://app.myrehab.uz)
![License: MIT](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Mundarija

- [Loyiha haqida](#loyiha-haqida)
- [Texnologiyalar](#texnologiyalar)
- [Arxitektura](#arxitektura)
- [Rollar (RBAC)](#rollar-rbac)
- [Lokal o'rnatish](#lokal-ornatish)
- [Skriptlar](#skriptlar)
- [Loyiha tuzilishi](#loyiha-tuzilishi)
- [Deployment](#deployment)
- [Testlash](#testlash)
- [Hissa qo'shish](#hissa-qoshish)

---

## Loyiha haqida

MyRehab — bu reabilitatsiya jarayonini boshqarish uchun mo'ljallangan
**SaMD (Software as a Medical Device)** platformasi. Tizim AI yordamida
individual reabilitatsiya rejalarini yaratadi, bemor xavfsizligini
("safety gate") nazorat qiladi va MDT (Multi-Disciplinary Team) jamoaviy
ishini muvofiqlashtiradi.

Platforma ikkita deploymentga bo'lingan:

| Deployment | Domen | Rollar |
|------------|-------|--------|
| **App** | `app.myrehab.uz` | Doctor, Clinic Admin, Patient, Nurse, Caregiver |
| **Admin** | `admin.myrehab.uz` | Super Admin |

---

## Texnologiyalar

**Core:** React 19 · TypeScript 5.9 · Vite 7 · pnpm · Node ≥22

| Qatlam | Texnologiya |
|--------|-------------|
| Routing | TanStack Router (file-based) |
| Server state | TanStack Query |
| Client state | Zustand |
| Forms / Validatsiya | React Hook Form + Zod |
| UI | Radix UI + Tailwind CSS 4 + CVA |
| i18n | i18next (UZ / RU / EN) |
| Real-time | WebSocket (chat, bildirishnomalar) |
| Video | Zoom Video SDK (telekonsultatsiya) |
| Monitoring | Sentry |
| Testlash | Vitest + Playwright (E2E) |

**Backend API:** `api.myrehab.uz` (alohida repoda)

---

## Arxitektura

Loyiha **feature-based** (xususiyatga asoslangan) arxitekturada qurilgan.
To'liq tavsif: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

```
Foydalanuvchi → app.myrehab.uz (React SPA)
                      │
                      ├── App Mode aniqlash (config/app-mode.ts)
                      ├── RBAC tekshiruvi (lib/rbac)
                      ├── TanStack Query → services/*.service.ts
                      │                         │
                      └─────────────────→ api.myrehab.uz (REST)
                                              │
                                          WebSocket (real-time)
```

---

## Rollar (RBAC)

Tizimda 6 ta rol mavjud. Ruxsatlar **markazlashgan permission matritsa**
orqali boshqariladi (`src/lib/rbac/permissions.ts`). Inline rol tekshiruvlari
**taqiqlangan** — barcha tekshiruvlar permission kalitlari orqali amalga oshiriladi.

| Rol | Tavsif |
|-----|--------|
| `SUPER_ADMIN` | Tizim administratori (admin.myrehab.uz) |
| `CLINIC_ADMIN` | Klinika administratori |
| `DOCTOR` | Shifokor |
| `NURSE` | Hamshira |
| `PATIENT` | Bemor |
| `CAREGIVER` | Vasiy / G'amxo'r |

To'liq rol×ruxsat matritsasi: [`docs/RBAC.md`](docs/RBAC.md)

---

## Lokal o'rnatish

```bash
# 1. Repozitoriyni klonlash
git clone https://github.com/shakhbozbekusmonov/myrehab-darshboard.git
cd myrehab-darshboard

# 2. Bog'liqliklarni o'rnatish (pnpm talab qilinadi)
pnpm install

# 3. Environment faylini sozlash
cp .env.example .env
# .env faylini tahrirlab API manzilini kiriting

# 4. Dev serverni ishga tushirish
pnpm dev          # app rejimi (app.myrehab.uz)
pnpm dev:admin    # admin rejimi (admin.myrehab.uz)
```

App `http://localhost:5173` da ochiladi. Localhost'da **barcha rollar**
test uchun ruxsat etilgan.

---

## Skriptlar

| Buyruq | Vazifa |
|--------|--------|
| `pnpm dev` | Dev server (app rejimi) |
| `pnpm dev:admin` | Dev server (admin rejimi) |
| `pnpm build` | Production build |
| `pnpm build:admin` | Admin production build |
| `pnpm lint` | ESLint tekshiruvi |
| `pnpm format` | Prettier formatlash |
| `pnpm test` | Unit testlar (Vitest) |
| `pnpm test:e2e` | E2E testlar (Playwright) |
| `pnpm knip` | Ishlatilmayotgan kodni topish |

---

## Loyiha tuzilishi

```
src/
├── assets/           # Statik resurslar
├── components/       # Umumiy UI komponentlar
├── config/           # app-mode, fonts
├── context/          # React context provayderlar
├── features/         # Rolga oid modullar (asosiy logika)
│   ├── admin/        ├── doctor/     ├── patient/
│   ├── clinic-admin/ ├── caregiver/  ├── care/
│   ├── mdt/          ├── auth/       └── settings/
├── hooks/            # Umumiy React hook'lar
├── lib/
│   ├── rbac/         # ⭐ Ruxsatlar tizimi (permission matritsa)
│   ├── api/          # Axios klient
│   └── ...           # i18n, websocket, validatsiya
├── locales/          # UZ / RU / EN tarjimalar
├── routes/           # TanStack Router (file-based)
│   └── _authenticated/   # Himoyalangan route'lar
├── services/         # API servis qatlami (*.service.ts)
├── stores/           # Zustand store'lar
└── styles/           # Global stillar
```

---

## Deployment

CI/CD **Vercel** orqali matrix strategiyasida (app + admin).
Workflow'lar: `.github/workflows/`

| Muhit | URL |
|-------|-----|
| Production (app) | https://app.myrehab.uz |
| Production (admin) | https://admin.myrehab.uz |

Monitoring sozlamalari: [`docs/monitoring.md`](docs/monitoring.md)
Falokatdan tiklanish: [`docs/disaster-recovery.md`](docs/disaster-recovery.md)

---

## Testlash

```bash
pnpm test            # Unit testlar
pnpm test:coverage   # Coverage hisoboti bilan
pnpm test:e2e        # Playwright E2E
pnpm test:e2e:ui     # Playwright UI rejimida
```

---

## Hissa qo'shish

1. Branch yarating: `feat/...` yoki `fix/...`
2. Commit'lar **Conventional Commits** formatida (`cz.yaml` ga qarang)
3. PR yuborishdan oldin: `pnpm lint && pnpm format:check && pnpm test`
4. PR ochilganda CI build-gate avtomatik ishlaydi

---

## Litsenziya

MIT — [`LICENSE`](LICENSE) fayliga qarang.
