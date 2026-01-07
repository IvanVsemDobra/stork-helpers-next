# Pregnancy App

## Опис
Pregnancy App — веб-застосунок для супроводу вагітності:
щотижнева інформація, стан мами, емоції, поради та щоденні нотатки.

---

## Технології
- Next.js 15 (App Router)
- TypeScript
- React Query
- Zustand
- Axios
- Formik + Yup

---

## Вимоги
- Node.js 18+ (рекомендовано 20 LTS)
- npm або pnpm

Перевір версію:
```bash
node -v

Архітектурні правила

ES modules (import / export)

Усі HTTP-запити тільки через services/api.ts

Серверні дані — React Query

Глобальний стан — Zustand

Компоненти не містять бізнес-логіки