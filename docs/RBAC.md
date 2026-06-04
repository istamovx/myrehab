# MyRehab — RBAC (Rol va Ruxsatlar) Hujjati

Bu hujjat tizimdagi rollar va ularning ruxsatlarini tavsiflaydi.
Manba: `src/lib/rbac/permissions.ts`

---

## 1. Asosiy tamoyil

> **Inline rol tekshiruvlari taqiqlangan.** Barcha ruxsat tekshiruvlari
> permission kalitlari orqali, markazlashgan `PERMISSION_MATRIX` ga
> asoslangan holda amalga oshiriladi.

```ts
// permissions.ts
export const PERMISSION_MATRIX: Record<RoleType, readonly PermissionType[]> = {
  [Role.SUPER_ADMIN]:  [ ... ],
  [Role.CLINIC_ADMIN]: [ ... ],
  [Role.DOCTOR]:       [ ... ],
  [Role.NURSE]:        [ ... ],
  [Role.PATIENT]:      [ ... ],
  [Role.CAREGIVER]:    [ ... ],
}
```

---

## 2. Rollar

| Rol | Deployment | Ko'rinadi (UI)* |
|-----|-----------|------------------|
| `SUPER_ADMIN` | admin.myrehab.uz | ❌ |
| `CLINIC_ADMIN` | app.myrehab.uz | ✅ |
| `DOCTOR` | app.myrehab.uz | ✅ |
| `NURSE` | app.myrehab.uz | ❌ |
| `PATIENT` | app.myrehab.uz | ✅ |
| `CAREGIVER` | app.myrehab.uz | ❌ |

\* `VISIBLE_ROLES` — login/rol tanlash oynasida ko'rinadigan rollar.
Boshqalar RBAC va backend kontraktlarida saqlanadi, lekin tanlovdan yashirilgan.

---

## 3. Ruxsatlar matritsasi (asosiy)

> ⚠️ Bu jadval qisqartirilgan ko'rinish. To'liq, eng so'nggi ro'yxat uchun
> har doim `src/lib/rbac/permissions.ts` ga murojaat qiling.

| Ruxsat (Permission) | SUPER_ADMIN | CLINIC_ADMIN | DOCTOR | PATIENT |
|---------------------|:-----------:|:------------:|:------:|:-------:|
| **Tizim** |
| `VIEW_SYSTEM_ANALYTICS` | ✅ | — | — | — |
| `VIEW_AI_METRICS` | ✅ | — | — | — |
| `VIEW_AUDIT_LOGS` | ✅ | — | ✅ | — |
| `VIEW_LLM_PROVIDERS` | ✅ | — | — | — |
| `VIEW_PROVIDER_FAILOVER` | ✅ | — | — | — |
| **Klinika** |
| `CREATE_CLINIC` | ✅ | — | — | — |
| `READ_CLINIC` | ✅ | ✅ | — | — |
| `UPDATE_CLINIC` | ✅ | — | — | — |
| `DELETE_CLINIC` | ✅ | — | — | — |
| **Foydalanuvchilar** |
| `CREATE_USER` | ✅ | ✅¹ | — | — |
| `READ_USER` | ✅ | ✅ | — | — |
| `UPDATE_USER` | ✅ | ✅ | — | — |
| `DELETE_USER` | ✅ | ✅ | — | — |
| `ASSIGN_ROLE` | ✅ | ✅¹ | — | — |
| **Reabilitatsiya rejalari** |
| `READ_REHAB_PLAN` | ✅ | — | ✅ | ✅² |
| `CREATE_REHAB_PLAN` | — | — | ✅ | — |
| `APPROVE_PLAN` | ✅ | — | ✅ | — |
| `REJECT_PLAN` | ✅ | — | ✅ | — |
| `DELETE_REHAB_PLAN` | ✅ | — | — | — |
| **Klinik ko'rinishlar** |
| `VIEW_PATIENT_REGISTRY` | ✅ | ✅ | ✅ | — |
| `VIEW_PATIENTS_LIST` | — | ✅ | ✅ | — |
| `VIEW_SAFETY_GATE` | ✅ | — | ✅ | — |
| `VIEW_DRUG_INTERACTIONS` | ✅ | — | ✅ | — |
| `VIEW_PATIENT_PROGRESS` | ✅ | — | ✅ | — |
| `VIEW_MDT` | — | — | ✅ | — |
| `VIEW_TELECONSULT` | — | — | ✅ | ✅ |
| `VIEW_SALARIES` | — | — | ✅³ | — |
| **Bemor tomoni** |
| `VIEW_APPOINTMENTS` | — | — | — | ✅ |
| `VIEW_CARE_TEAM` | — | — | — | ✅ |
| `VIEW_PATIENT_SETTINGS` | — | — | — | ✅ |
| **Umumiy** |
| `VIEW_MESSAGES` | — | — | ✅ | ✅ |
| `VIEW_SETTINGS` | ✅ | ✅ | ✅ | ✅ |
| `VIEW_PROFILE` | ✅ | ✅ | ✅ | ✅ |

**Izohlar:**
¹ Clinic Admin o'z klinikasi doirasida foydalanuvchi yaratadi, lekin
SUPER_ADMIN yarata olmaydi.
² Bemor faqat o'z rejasini ko'radi.
³ "Daromad ko'rinishi" — hozircha faqat faollik metrikalarini ko'rsatadi.

> Bu jadval `permissions.ts` dan qo'lda ko'chirilgan — kodga o'zgartirish
> kiritilganda **shu hujjatni ham yangilang**.

---

## 4. Deployment ruxsatlari

`src/config/app-mode.ts` qaysi rol qaysi deploymentda login qila olishini
belgilaydi:

```ts
ALLOWED_ROLES (app)   = [DOCTOR, CLINIC_ADMIN, PATIENT, NURSE, CAREGIVER]
ALLOWED_ROLES (admin) = [SUPER_ADMIN]
ALLOWED_ROLES (local) = barcha rollar (test uchun)
```

---

## 5. Ma'lum muammo: Clinic Admin 403

Jonli muhitda `CLINIC_ADMIN` roli `app.myrehab.uz` da quyidagi endpointlarda
**403 Forbidden** oladi:
- `GET /api/clinic/stats`
- `GET /api/clinic/doctors`
- `GET /api/clinic/patients`

Frontend RBAC to'g'ri sozlangan (yuqoridagi matritsa bo'yicha Clinic Admin
bu ma'lumotlarga ruxsatga ega). Demak muammo **backend tomonda** yoki test
akkauntiga klinika biriktirilmaganligida. `/api/doctors/join-requests`
(a'zolik so'rovlari) to'g'ri ishlaydi.

**Keyingi qadam:** backend (`api.myrehab.uz`) tomonda `CLINIC_ADMIN`
ruxsatlarini va akkaunt↔klinika bog'lanishini tekshirish.
