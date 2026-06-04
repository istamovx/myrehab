# MyRehab — Rollar va Ruxsatlar (RBAC)

> **Holat:** Rejalashtirilgan — hozircha autentifikatsiya va RBAC joriy etilmagan.
> Bu hujjat kelajakdagi arxitektura uchun qo'llanma sifatida yozilgan.

---

## 1. Asosiy tamoyil

Platforma xususiy klinikalar uchun ishlatiladi. Bitta klinikada bir nechta
rol bo'ladi — har bir rol faqat o'z vazifasiga tegishli bo'limlarni ko'radi.

**Inline rol tekshiruvlari taqiqlangan.** Barcha ruxsat tekshiruvlari
markazlashgan `PERMISSION_MATRIX` (`src/lib/rbac/permissions.ts`) orqali
amalga oshiriladi. Bu fayl hozircha mavjud emas — implementatsiya vaqtida yaratiladi.

---

## 2. Rejalashtirilgan rollar

| Rol | Kim? | Deployment |
|-----|------|------------|
| `CLINIC_ADMIN` | Klinika direktori / administratori | `app.myrehab.uz` |
| `DOCTOR` | Ortoped, nevrolog, jarroh | `app.myrehab.uz` |
| `NURSE` | Hamshira | `app.myrehab.uz` |
| `SUPER_ADMIN` | MyRehab tizim administratori | `admin.myrehab.uz` |

> **Eslatma:** Bemorlar ushbu platformaga kirish huquqiga ega emas.
> Bu klinika ichki xodimlari uchun back-office ilova.

---

## 3. Rejalashtirilgan ruxsatlar matritsasi

| Sahifa / Funksiya | CLINIC_ADMIN | DOCTOR | NURSE |
|-------------------|:------------:|:------:|:-----:|
| Dashboard (ko'rish) | ✅ | ✅ | ✅ |
| Bemorlar ro'yxati | ✅ | ✅ | ✅ |
| Bemor tafsiloti | ✅ | ✅ | ✅ |
| Bemor qo'shish / tahrirlash | ✅ | ✅ | — |
| Bemor o'chirish | ✅ | — | — |
| Tahlillar (Insights) | ✅ | ✅ | — |
| Uchrashuvlar (ko'rish) | ✅ | ✅ | ✅ |
| Uchrashuv qo'shish | ✅ | ✅ | — |
| Hujjatlar (ko'rish) | ✅ | ✅ | ✅ |
| Hujjat yuklash | ✅ | ✅ | — |
| Jamoa ko'rish | ✅ | ✅ | ✅ |
| Jamoa tahrirlash | ✅ | — | — |
| Klinika sozlamalari | ✅ | — | — |

---

## 4. Implementatsiya rejasi

RBAC joriy etilganda quyidagi fayllar yaratiladi:

```
src/
├── lib/
│   └── rbac/
│       ├── permissions.ts    # PERMISSION_MATRIX
│       ├── roles.ts          # Role enum
│       └── hooks.ts          # usePermission(), useRole()
├── config/
│   └── app-mode.ts           # qaysi rol qaysi deploymentda login qila oladi
└── routes/
    └── _authenticated/       # Himoyalangan routelar
```

**Komponentlarda foydalanish:**

```tsx
// ❌ Taqiqlangan — inline rol tekshiruvi
if (user.role === 'DOCTOR') { ... }

// ✅ To'g'ri — permission kalit orqali
const canEdit = usePermission('EDIT_PATIENT')
```

---

## 5. Autentifikatsiya

Rejalashtirilgan oqim:

```
Login sahifasi
    │ email + parol
    ▼
POST /api/auth/login
    │ { accessToken, refreshToken, role }
    ▼
Zustand authStore (token + foydalanuvchi ma'lumotlari)
    │
    ▼
TanStack Router beforeLoad → ruxsat tekshiruvi
```

Token `localStorage` yoki `httpOnly cookie` da saqlanadi
(xavfsizlik talablariga qarab tanlanadi).
