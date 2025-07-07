# Руководство по разработке

Это руководство содержит информацию для разработчиков, работающих с Project OD.

## Настройка среды разработки

### Рекомендуемые инструменты

#### IDE и редакторы

- **VS Code** с расширениями:
  - Prisma
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Auto Rename Tag
  - GitLens

#### Браузерные расширения

- React Developer Tools
- Prisma Studio (встроенный)

### Настройка VS Code

Создайте `.vscode/settings.json`:

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

## Архитектура проекта

### Структура директорий

```
proj-od/
├── app/                           # Next.js App Router
│   ├── (auth)/                    # Группа маршрутов для аутентификации
│   │   ├── login/                 # Страница входа
│   │   └── register/              # Страница регистрации
│   ├── admin/                     # Административная панель
│   ├── api/                       # API маршруты
│   │   ├── auth/                  # Аутентификация
│   │   ├── requests/              # CRUD для заявок
│   │   ├── messages/              # Сообщения
│   │   └── profile/               # Профиль пользователя
│   ├── profile/                   # Профиль пользователя
│   ├── requests/                  # Управление заявками
│   ├── globals.css                # Глобальные стили
│   ├── layout.tsx                 # Корневой layout
│   ├── loading.tsx                # Компонент загрузки
│   └── page.tsx                   # Главная страница
├── components/                    # React компоненты
│   ├── ui/                        # Базовые UI компоненты
│   ├── providers/                 # Провайдеры контекста
│   └── [feature-components].tsx   # Компоненты функций
├── lib/                           # Утилиты и конфигурация
│   ├── auth-options.ts            # Настройки NextAuth
│   ├── db.ts                      # Подключение к БД
│   ├── utils.ts                   # Общие утилиты
│   ├── db-clients/                # Клиенты для работы с БД
│   └── validators/                # Схемы валидации Zod
├── types/                         # TypeScript типы
├── constants/                     # Константы приложения
├── hooks/                         # Custom React hooks
├── prisma/                        # Схема и миграции БД
└── docs/                          # Документация
```

### Принципы архитектуры

1. **Separation of Concerns** - разделение ответственности между слоями
2. **Component-Based Architecture** - модульная структура компонентов
3. **Type Safety** - строгая типизация во всем приложении
4. **Database First** - схема БД как источник истины
5. **API First** - API как основной интерфейс взаимодействия

## Соглашения по коду

### Именование

#### Файлы и папки

- **Компоненты**: `PascalCase.tsx` (например, `UserProfile.tsx`)
- **Страницы**: `page.tsx`, `layout.tsx`, `loading.tsx`
- **Утилиты**: `kebab-case.ts` (например, `auth-helpers.ts`)
- **Константы**: `kebab-case.ts` (например, `api-endpoints.ts`)
- **Типы**: `kebab-case.d.ts` (например, `user-types.d.ts`)

#### Переменные и функции

```typescript
// Константы - UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:3000/api'

// Функции - camelCase
function getUserById(id: string) {}

// React компоненты - PascalCase
function UserProfile() {}

// Хуки - camelCase с префиксом 'use'
function useUserData() {}

// Типы и интерфейсы - PascalCase
interface UserProfile {
  id: string
  name: string
}

type RequestStatus = 'CREATED' | 'COMPLETED' | 'INCORRECT'
```

### Структура компонентов

```typescript
// Импорты сторонних библиотек
import React from 'react';
import { NextPage } from 'next';

// Импорты локальных модулей
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

// Типы и интерфейсы
interface Props {
  title: string;
  onSubmit: () => void;
}

// Константы компонента
const DEFAULT_TITLE = 'Заголовок по умолчанию';

// Основной компонент
export default function MyComponent({ title, onSubmit }: Props) {
  // Хуки состояния
  const [isLoading, setIsLoading] = React.useState(false);

  // Custom хуки
  const { user } = useAuth();

  // Обработчики событий
  const handleSubmit = React.useCallback(() => {
    setIsLoading(true);
    onSubmit();
    setIsLoading(false);
  }, [onSubmit]);

  // Рендер
  return (
    <div className="p-4">
      <h1>{title || DEFAULT_TITLE}</h1>
      <Button onClick={handleSubmit} disabled={isLoading}>
        Отправить
      </Button>
    </div>
  );
}
```

### API маршруты

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionUser } from '@/lib/get-session-user'
import { db } from '@/lib/db'

// Схема валидации
const requestSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
})

export async function GET(request: NextRequest) {
  try {
    // Проверка аутентификации
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Логика обработки
    const data = await db.user.findMany()

    return NextResponse.json(data)
  } catch (error) {
    console.error('GET /api/example error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Проверка аутентификации
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Валидация данных
    const body = await request.json()
    const validatedData = requestSchema.parse(body)

    // Логика создания
    const newRecord = await db.user.create({
      data: validatedData,
    })

    return NextResponse.json(newRecord, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation Error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('POST /api/example error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
```

## Работа с состоянием

### React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Схема валидации
const userFormSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  email: z.string().email('Некорректный email'),
  age: z.number().min(18, 'Возраст должен быть не менее 18'),
});

type UserFormData = z.infer<typeof userFormSchema>;

export function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Ошибка создания пользователя');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('name')}
        placeholder="Имя"
      />
      {errors.name && <span>{errors.name.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        Создать
      </button>
    </form>
  );
}
```

### Custom Hooks

```typescript
// hooks/use-requests.ts
import { useState, useEffect } from 'react'
import { Request } from '@/types/dtos'

interface UseRequestsOptions {
  status?: string
  page?: number
  limit?: number
}

export function useRequests(options: UseRequestsOptions = {}) {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRequests() {
      try {
        setLoading(true)
        const params = new URLSearchParams(
          Object.entries(options).filter(([_, value]) => value !== undefined)
        )

        const response = await fetch(`/api/requests?${params}`)

        if (!response.ok) {
          throw new Error('Ошибка загрузки заявок')
        }

        const data = await response.json()
        setRequests(data.requests)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [options.status, options.page, options.limit])

  return { requests, loading, error, refetch: fetchRequests }
}
```

## Стилизация

### Tailwind CSS

Используйте utility-first подход:

```tsx
// Хорошо
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Кнопка
</button>

// Избегайте
<button style={{ backgroundColor: 'blue', color: 'white' }}>
  Кнопка
</button>
```

### Компонентные классы

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Использование
const buttonVariants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
};

function Button({ variant = 'default', className, ...props }) {
  return (
    <button
      className={cn(buttonVariants[variant], className)}
      {...props}
    />
  );
}
```

## Тестирование

### Unit тесты (Jest + Testing Library)

```typescript
// components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../ui/button';

describe('Button', () => {
  it('рендерится с правильным текстом', () => {
    render(<Button>Тест кнопки</Button>);
    expect(screen.getByText('Тест кнопки')).toBeInTheDocument();
  });

  it('вызывает onClick при клике', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Кликни меня</Button>);

    fireEvent.click(screen.getByText('Кликни меня'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### API тесты

```typescript
// __tests__/api/requests.test.ts
import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/requests/route'

describe('/api/requests', () => {
  it('возвращает список заявок', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(Array.isArray(data.requests)).toBe(true)
  })
})
```

## Производительность

### Оптимизация рендеринга

```typescript
import React from 'react';

// Мемоизация компонентов
const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
  return <div>{/* сложная логика рендеринга */}</div>;
});

// Мемоизация значений
function ParentComponent({ items }) {
  const expensiveValue = React.useMemo(() => {
    return items.reduce((acc, item) => acc + item.value, 0);
  }, [items]);

  const handleClick = React.useCallback(() => {
    // обработчик события
  }, []);

  return (
    <ExpensiveComponent
      data={expensiveValue}
      onClick={handleClick}
    />
  );
}
```

### Lazy Loading

```typescript
import dynamic from 'next/dynamic';

// Ленивая загрузка компонентов
const AdminPanel = dynamic(() => import('./AdminPanel'), {
  loading: () => <div>Загрузка...</div>,
  ssr: false,
});

// Условная загрузка
function App() {
  const { user } = useAuth();

  return (
    <div>
      {user?.role === 'ADMIN' && <AdminPanel />}
    </div>
  );
}
```

## Отладка

### Логирование

```typescript
// lib/logger.ts
const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  debug: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[DEBUG] ${message}`, data)
    }
  },

  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data)
  },

  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error)
  },
}

// Использование
import { logger } from '@/lib/logger'

export async function createRequest(data: RequestData) {
  logger.debug('Создание заявки', data)

  try {
    const request = await db.request.create({ data })
    logger.info('Заявка создана', { id: request.id })
    return request
  } catch (error) {
    logger.error('Ошибка создания заявки', error)
    throw error
  }
}
```

### DevTools

```typescript
// Только для разработки
if (process.env.NODE_ENV === 'development') {
  // React Query DevTools
  import('@tanstack/react-query-devtools').then(({ ReactQueryDevtools }) => {
    // Инициализация devtools
  })
}
```

## Git Workflow

### Соглашения о коммитах

Используйте Conventional Commits:

```bash
# Типы коммитов
feat: новая функциональность
fix: исправление бага
docs: обновление документации
style: изменения стилей (не влияющие на логику)
refactor: рефакторинг кода
test: добавление/изменение тестов
chore: обновление зависимостей, конфигурации

# Примеры
git commit -m "feat: добавить фильтрацию заявок по статусу"
git commit -m "fix: исправить ошибку валидации email"
git commit -m "docs: обновить README с инструкциями по установке"
```

### Ветвление

```bash
# Основные ветки
main          # Продакшен
develop       # Разработка

# Функциональные ветки
feature/название-функции
bugfix/название-бага
hotfix/критическое-исправление

# Пример
git checkout -b feature/request-filtering
git checkout -b bugfix/login-validation
```

## CI/CD

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: yarn install

      - name: Run type check
        run: yarn type-check

      - name: Run linter
        run: yarn lint

      - name: Run tests
        run: yarn test
```

## Полезные команды

```bash
# Разработка
yarn dev              # Запуск dev сервера
yarn build            # Сборка проекта
yarn start            # Запуск prod версии

# Качество кода
yarn lint             # Проверка ESLint
yarn lint:fix         # Исправление ESLint ошибок
yarn format           # Форматирование Prettier
yarn type-check       # Проверка TypeScript

# База данных
npx prisma studio     # Открыть Prisma Studio
npx prisma migrate dev    # Создать/применить миграцию
npx prisma generate   # Генерация клиента
npx prisma db seed    # Заполнение БД

# Очистка
rm -rf .next          # Очистить кеш Next.js
rm -rf node_modules   # Очистить node_modules
yarn install         # Переустановить зависимости
```
