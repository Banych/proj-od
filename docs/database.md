# Управление базой данных

Это руководство описывает работу с базой данных в Project OD, включая структуру, миграции и обслуживание.

## Обзор

Project OD использует:

- **СУБД**: PostgreSQL 12+
- **ORM**: Prisma 6.6.0
- **Миграции**: Prisma Migrate
- **Типизация**: Автогенерация TypeScript типов

## Структура базы данных

### Схема данных

#### Таблица `User` (Пользователи)

```sql
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT,
  "surname" TEXT,
  "username" TEXT NOT NULL UNIQUE,
  "email" TEXT UNIQUE,
  "password" TEXT NOT NULL,
  "rfRu" VARCHAR(24),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "role" "Role" NOT NULL,

  PRIMARY KEY ("id")
);
```

**Поля:**

- `id` - Уникальный идентификатор (CUID)
- `name` - Имя пользователя
- `surname` - Фамилия пользователя
- `username` - Имя пользователя для входа (уникальное)
- `email` - Email адрес (уникальный, опционально)
- `password` - Хешированный пароль
- `rfRu` - Российский идентификатор (до 24 символов)
- `role` - Роль пользователя (ADMIN, MANAGER, DISPATCHER)

#### Таблица `Request` (Заявки)

```sql
CREATE TABLE "Request" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "type" "RequestType" NOT NULL,
  "salesOrganization" "SalesOrganizationType" NOT NULL,
  "status" "RequestStatus" NOT NULL DEFAULT 'CREATED',
  "priority" "RequestPriority",
  "warehouse" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "odNumber" TEXT NOT NULL DEFAULT '',
  "comment" TEXT NOT NULL,
  "resource" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "orderNumber" SERIAL UNIQUE,

  PRIMARY KEY ("id"),
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT
);
```

**Поля:**

- `id` - Уникальный идентификатор (CUID)
- `type` - Тип заявки
- `salesOrganization` - Организация продаж
- `status` - Статус заявки
- `priority` - Приоритет заявки
- `warehouse` - Склад
- `date` - Дата выполнения
- `odNumber` - Номер OD
- `comment` - Комментарий
- `resource` - Ресурс
- `orderNumber` - Порядковый номер (автоинкремент)
- `userId` - ID создателя заявки

#### Таблица `Message` (Сообщения)

```sql
CREATE TABLE "Message" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "message" TEXT NOT NULL,
  "requestId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,

  PRIMARY KEY ("id"),
  FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT
);
```

### Перечисления (Enums)

#### RequestType (Типы заявок)

```sql
CREATE TYPE "RequestType" AS ENUM (
  'ONE_DAY_DELIVERY',     -- Однодневная доставка
  'CORRECTION_SALE',      -- Корректировка продажи
  'CORRECTION_RETURN',    -- Корректировка возврата
  'SAMPLING'              -- Отбор проб
);
```

#### SalesOrganizationType (Организации продаж)

```sql
CREATE TYPE "SalesOrganizationType" AS ENUM (
  'SALES_3801',
  'SALES_3802',
  'SALES_3803',
  'SALES_3804',
  'SALES_3805',
  'SALES_3806'
);
```

#### RequestStatus (Статусы заявок)

```sql
CREATE TYPE "RequestStatus" AS ENUM (
  'CREATED',     -- Создана
  'COMPLETED',   -- Выполнена
  'INCORRECT'    -- Некорректна
);
```

#### RequestPriority (Приоритеты)

```sql
CREATE TYPE "RequestPriority" AS ENUM (
  'MEDIUM',   -- Средний
  'HIGH'      -- Высокий
);
```

#### Role (Роли пользователей)

```sql
CREATE TYPE "Role" AS ENUM (
  'ADMIN',       -- Администратор
  'MANAGER',     -- Менеджер
  'DISPATCHER'   -- Диспетчер
);
```

## Работа с миграциями

### Создание новой миграции

При изменении схемы в `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name название_миграции
```

Пример:

```bash
npx prisma migrate dev --name add_user_phone_field
```

### Применение миграций

На продакшене:

```bash
npx prisma migrate deploy
```

### Просмотр статуса миграций

```bash
npx prisma migrate status
```

### Сброс базы данных (только для разработки!)

```bash
npx prisma migrate reset
```

### Создание миграции без применения

```bash
npx prisma migrate dev --create-only --name название_миграции
```

## Генерация Prisma Client

После изменений в схеме:

```bash
npx prisma generate
```

Клиент генерируется в папку `generated/prisma-client/`.

## Seed данные

### Создание seed файла

Создайте файл `prisma/seed.ts`:

```typescript
import { PrismaClient } from '../generated/prisma-client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Создание администратора
  const adminPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      name: 'Администратор',
      surname: 'Системы',
      email: 'admin@company.com',
      role: 'ADMIN',
    },
  })

  // Создание тестовых пользователей
  const managerPassword = await bcrypt.hash('manager123', 10)

  const manager = await prisma.user.upsert({
    where: { username: 'manager' },
    update: {},
    create: {
      username: 'manager',
      password: managerPassword,
      name: 'Тестовый',
      surname: 'Менеджер',
      email: 'manager@company.com',
      role: 'MANAGER',
    },
  })

  console.log('Seed данные созданы:', { admin, manager })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

### Обновление package.json

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

### Запуск seed

```bash
npx prisma db seed
```

## Резервное копирование и восстановление

### Создание резервной копии

```bash
# Полная копия
pg_dump -h localhost -U username -d proj_od > backup.sql

# Только схема
pg_dump -h localhost -U username -d proj_od --schema-only > schema.sql

# Только данные
pg_dump -h localhost -U username -d proj_od --data-only > data.sql
```

### Восстановление из копии

```bash
# Восстановление полной копии
psql -h localhost -U username -d proj_od < backup.sql

# Восстановление только данных
psql -h localhost -U username -d proj_od < data.sql
```

## Prisma Studio

Графический интерфейс для просмотра и редактирования данных:

```bash
npx prisma studio
```

Откроется в браузере по адресу `http://localhost:5555`

## Оптимизация производительности

### Индексы

Основные индексы уже настроены:

```sql
-- Автоматически созданные Prisma
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Request_orderNumber_key" ON "Request"("orderNumber");

-- Дополнительные индексы для производительности
CREATE INDEX "Request_status_idx" ON "Request"("status");
CREATE INDEX "Request_type_idx" ON "Request"("type");
CREATE INDEX "Request_userId_idx" ON "Request"("userId");
CREATE INDEX "Request_date_idx" ON "Request"("date");
CREATE INDEX "Message_requestId_idx" ON "Message"("requestId");
```

### Пагинация

Используйте `cursor` или `offset` пагинацию:

```typescript
// Cursor пагинация (рекомендуется)
const requests = await prisma.request.findMany({
  take: 10,
  skip: 1,
  cursor: {
    id: lastRequestId,
  },
  orderBy: {
    createdAt: 'desc',
  },
})

// Offset пагинация
const requests = await prisma.request.findMany({
  take: 10,
  skip: (page - 1) * 10,
  orderBy: {
    createdAt: 'desc',
  },
})
```

### Агрегация

```typescript
// Подсчет заявок по статусам
const statusCounts = await prisma.request.groupBy({
  by: ['status'],
  _count: {
    status: true,
  },
})

// Статистика по пользователям
const userStats = await prisma.user.findMany({
  include: {
    _count: {
      select: {
        Request: true,
        Message: true,
      },
    },
  },
})
```

## Мониторинг и логирование

### Логирование запросов

В `lib/db.ts`:

```typescript
import { PrismaClient } from '../generated/prisma-client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

### Метрики производительности

```typescript
// Измерение времени выполнения запросов
const startTime = Date.now()
const result = await prisma.request.findMany()
const duration = Date.now() - startTime
console.log(`Запрос выполнен за ${duration}ms`)
```

## Troubleshooting

### Общие проблемы

**Проблема**: `PrismaClientInitializationError`
**Решение**: Проверьте `DATABASE_URL` и доступность базы данных

**Проблема**: `Migration failed`
**Решение**:

1. Проверьте синтаксис в `schema.prisma`
2. Убедитесь, что база данных доступна
3. При необходимости выполните `prisma migrate reset`

**Проблема**: `Type 'xxx' is not assignable`
**Решение**: Выполните `npx prisma generate` после изменений схемы

### Очистка кеша

```bash
# Очистка Prisma кеша
rm -rf node_modules/.prisma
npx prisma generate

# Пересборка проекта
rm -rf .next
yarn build
```

## Безопасность

### Основные принципы

1. **Никогда не передавайте пароли в открытом виде**
2. **Используйте prepared statements** (Prisma делает это автоматически)
3. **Валидируйте входные данные** с помощью Zod
4. **Ограничивайте доступ** на основе ролей

### Пример безопасного запроса

```typescript
import { z } from 'zod'

const createRequestSchema = z.object({
  type: z.enum([
    'ONE_DAY_DELIVERY',
    'CORRECTION_SALE',
    'CORRECTION_RETURN',
    'SAMPLING',
  ]),
  warehouse: z.string().min(1).max(100),
  comment: z.string().max(1000),
})

export async function createRequest(data: unknown, userId: string) {
  // Валидация входных данных
  const validatedData = createRequestSchema.parse(data)

  // Безопасное создание записи
  return await prisma.request.create({
    data: {
      ...validatedData,
      userId, // Используем ID из сессии, а не из запроса
    },
  })
}
```
