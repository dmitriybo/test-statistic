# Техническое задание (Fullstack JS)

## Запуск проекта
Должен быть запущен Docker Engine.

Приложение запускается на http://localhost:3000

Потестировать GraphQL (после запуска приложения) можно на [тут](https://studio.apollographql.com/sandbox?endpoint=http%3A%2F%2Flocalhost%3A4000%2F)

### Запуск сразу с моковыми данными
```bash
npm i
npm run mock-start
```

### Запуск в production-режиме

```bash
npm i
npm run start

// Сидеры
npm run seed:currencies
npm run seed:test-data
```

### Запуск в dev-режиме

```bash
npm i
npm run dev

// Сидеры
npm run seed:currencies
npm run seed:test-data
```

## Что было сделано

1. **Схема БД** — спроектирована в Prisma ORM (Postgres ≥14).
1. **Идемпотентность** — гарантируется уникальными ключами.
1. **Агрегации** — kpi_hourly_agg + материализованные представления (daily/weekly/monthly) для SLA ≤ 10 сек.
1. **Скрипты обновления** — hourly refresh + REFRESH MATERIALIZED VIEW [CONCURRENTLY].
1. **GraphQL API (Apollo Server)** — запрос KPI с параметрами (from, to, interval, timezone, currency[]).
1. **Таймзона** — корректная нормализация по таймзоне пользователя.
1. **Фронтенд** (Next.js + Apollo Client) — форма выбора интервала, таблица метрик, автообновление (polling 5s), виртуализация строк.
1. **Docker-compose** — Postgres + backend + frontend.
1. **Наблюдаемость** — время выполнения запроса отображается в UI.
1. **Сидеры** — генерация ≥200k записей для тестирования.

## 1. Цель и результат
**Цель.** Расчёт статистики и отдача через GraphQL.  
На фронте — форма выбора интервала и таблица метрик с почти realtime-обновлением.  
**SLA ответа:** ≤ 10 секунд на запрос KPI при объёмах данных.  
**Результат:** Docker-компоуз проект с backend+frontend+Postgres, миграциями, сидерами.

## 2. Стек
- **Backend:** Node.js, TypeScript, Apollo Server (GraphQL), Prisma ORM.
- **DB:** PostgreSQL ≥14.
- **Frontend:** React/Next.js (App Router), TypeScript, Apollo Client.
- **Контейнеризация:** Docker + docker-compose.

## 3. Термины и расчёт
Все таймстемпы хранятся в UTC. Клиент передаёт `timezone` (по умолчанию `UTC`); преобразование ведёр и «Bucket Start» — только на чтение.

### Определения
- **Registration** — `user_registered`.
- **Try** — событие «попытки/пробы» (учитывать только повторный login). Для `Reg2Try` достаточно факта ≥1.
- **FD (First Deposit)** — первый депозит пользователя.
- **RD (Repeat Deposit)** — любой депозит после FD.
- **Total Deposit** — FD + все RD.

### Формулы
- `Reg2Try = (Try Count / Registrations) × 100%`
- `Reg2Dep = (First Deposit Count / Registrations) × 100%`
- `FD count` — число пользователей с FD
- `avg FD = First Deposit Sum / FD count`
- `RD/FD = Repeat Deposit Count / First Deposit Count`
- `Try2RD = (Repeat Deposit Count / Try Count) × 100%`
- `Average RD = Repeat Deposit Sum / Repeat Deposit Count`
- `Average Deposit = Total Deposit Sum / Total Deposit Count`

## 4. Функциональные требования

### 4.1 Инжест событий

### 4.2 Запрос статистики (GraphQL)
- Вход: `from`, `to`, `interval`,`timezone`, `currency[]?`.
- Выход: коллонки по каждой из формул.
- Валидация: `from < to`.

### 4.3 Realtime-обновление
- MVP: polling каждые 5–10 сек при **Auto-refresh**.

## 5. Нефункциональные требования
- **Время ответа KPI:** ≤ 10 сек при ≥200k записей в каждой таблице.
- **Надёжность:** строгая идемпотентность.
- **Наблюдаемость:** логирование времени ответа.

## 6. Данные и объёмы
- ≥200k записей в каждой таблице (регистрации, try, депозиты и т.д), покрывающими 365 дней.
- Реализовать сидеры для генерации данных.
- Валюта: фильтр по `currency[]`, без конверсий.
- Материализованные представления
