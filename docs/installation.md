# Руководство по установке

Это руководство поможет вам настроить и запустить проект Project OD на вашем локальном компьютере или сервере.

## Системные требования

### Обязательные компоненты

- **Node.js**: версия 18.0 или выше
- **PostgreSQL**: версия 12 или выше
- **Git**: для клонирования репозитория

### Рекомендуемые компоненты

- **Yarn**: как менеджер пакетов (можно использовать npm)
- **VS Code**: как IDE с расширениями для TypeScript и Prisma

## Пошаговая установка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd proj-od
```

### 2. Установка зависимостей

Используя Yarn (рекомендуется):

```bash
yarn install
```

Или используя npm:

```bash
npm install
```

### 3. Настройка базы данных

#### Создание базы данных

1. Подключитесь к PostgreSQL:

```bash
psql -U postgres
```

2. Создайте новую базу данных:

```sql
CREATE DATABASE proj_od;
```

3. Создайте пользователя (опционально):

```sql
CREATE USER proj_od_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE proj_od TO proj_od_user;
```

### 4. Настройка переменных окружения

1. Создайте файл `.env` на основе примера:

```bash
cp .env.example .env
```

2. Отредактируйте `.env` файл:

```env
# Секретный ключ для NextAuth (сгенерируйте уникальный)
NEXTAUTH_SECRET=your_super_secret_key_here

# URL приложения
NEXTAUTH_URL=http://localhost:3000

# URL базы данных для Prisma с пулом соединений
DATABASE_URL="postgresql://username:password@localhost:5432/proj_od?pgbouncer=true"

# Прямой URL для миграций (без пула)
DIRECT_URL="postgresql://username:password@localhost:5432/proj_od"
```

#### Генерация NEXTAUTH_SECRET

Для генерации безопасного секретного ключа используйте:

```bash
openssl rand -base64 32
```

### 5. Настройка базы данных с Prisma

1. Выполните миграции для создания таблиц:

```bash
npx prisma migrate dev --name init
```

2. Сгенерируйте Prisma Client:

```bash
npx prisma generate
```

3. (Опционально) Заполните базу начальными данными:

```bash
npx prisma db seed
```

### 6. Запуск приложения

#### Режим разработки

```bash
yarn dev
```

Приложение будет доступно по адресу: `http://localhost:3000`

#### Режим продакшена

1. Сборка приложения:

```bash
yarn build
```

2. Запуск:

```bash
yarn start
```

## Проверка установки

### 1. Проверка подключения к базе данных

```bash
npx prisma studio
```

Это откроет Prisma Studio в браузере для управления данными.

### 2. Проверка работы API

Откройте браузер и перейдите по адресам:

- `http://localhost:3000/api/auth/signin` - страница входа
- `http://localhost:3000/api/auth/session` - информация о сессии

### 3. Создание первого пользователя

1. Перейдите на `http://localhost:3000/auth/register`
2. Зарегистрируйте первого пользователя
3. Войдите в систему через `http://localhost:3000/auth/login`

## Возможные проблемы и решения

### Ошибка подключения к базе данных

**Проблема**: `Error: P1001: Can't reach database server`

**Решение**:

1. Убедитесь, что PostgreSQL запущен
2. Проверьте правильность данных в `DATABASE_URL`
3. Проверьте доступность порта 5432

### Ошибка миграций

**Проблема**: `Migration failed`

**Решение**:

1. Сбросьте миграции: `npx prisma migrate reset`
2. Выполните миграции заново: `npx prisma migrate dev`

### Ошибка NEXTAUTH_SECRET

**Проблема**: `[next-auth][error][NO_SECRET]`

**Решение**:

1. Добавьте `NEXTAUTH_SECRET` в `.env` файл
2. Перезапустите сервер

### Порт уже занят

**Проблема**: `Error: listen EADDRINUSE: address already in use :::3000`

**Решение**:

1. Остановите процесс на порту 3000:

```bash
lsof -ti:3000 | xargs kill -9
```

2. Или используйте другой порт:

```bash
yarn dev -p 3001
```

## Docker установка (опционально)

Если у вас установлен Docker, вы можете использовать контейнеризованную версию:

1. Создайте `docker-compose.yml`:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: proj_od
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

2. Запустите PostgreSQL:

```bash
docker-compose up -d postgres
```

3. Обновите `DATABASE_URL` в `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/proj_od"
```

## Следующие шаги

После успешной установки:

1. Изучите [документацию по разработке](./development.md)
2. Ознакомьтесь с [API справочником](./api-reference.md)
3. Настройте [деплой для продакшена](./deployment.md)
