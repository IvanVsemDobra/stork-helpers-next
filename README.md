# 🍼 Stork Helpers


## 🇺🇦 Українська | 🇬🇧 English



🇺🇦 Опис проєкту

Stork Helpers — це вебзастосунок для підтримки молодих батьків.
Проєкт допомагає відстежувати щоденний стан мами та дитини, керувати завданнями, вести щоденник і працювати з тижневими етапами розвитку.

Проєкт складається з:

Backend API (Node.js, Express, MongoDB)

Frontend (Next.js, TypeScript)

🇬🇧 Project Description

Stork Helpers is a web application designed to support new parents.
It helps track daily baby and mom status, manage tasks, keep a diary, and work with weekly development journeys.

The project consists of:

Backend API (Node.js, Express, MongoDB)

Frontend (Next.js, TypeScript)

🧩 Архітектура проєкту | Project Architecture
stork-helpers/
├── backend/
└── frontend/
🖥 Backend
📁 Структура backend
src/
├── config/
├── constants/
├── controllers/
├── db/
├── docs/
├── middlewares/
├── models/
├── routes/
├── services/
├── utils/
├── validations/
├── server.js
🔑 Основні можливості backend

JWT + Google authentication

Робота з користувачами

Щоденники (diaries)

Завдання (tasks)

Емоційний стан

Тижні розвитку (weeks)

Rate limiting, validation, middleware

⚙️ Запуск backend
npm install
npm run dev

Створи .env на основі .env.example
