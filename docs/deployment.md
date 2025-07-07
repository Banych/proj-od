# Руководство по деплою

Это руководство описывает процесс развертывания Project OD в различных окружениях.

## Обзор архитектуры развертывания

### Компоненты системы

- **Frontend + Backend**: Next.js приложение (Full-Stack)
- **База данных**: PostgreSQL
- **Аутентификация**: NextAuth.js (session-based)
- **Файловое хранилище**: Локальная файловая система (для логов)

### Требования к окружению

- **Node.js**: 18.0+
- **PostgreSQL**: 12.0+
- **Memory**: минимум 1GB RAM
- **Storage**: минимум 5GB свободного места

## Подготовка к деплою

### 1. Переменные окружения

Создайте файл `.env.production`:

```env
# Обязательные переменные
NODE_ENV=production
NEXTAUTH_SECRET=your-super-secure-secret-key-here
NEXTAUTH_URL=https://your-domain.com

# База данных
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
DIRECT_URL="postgresql://username:password@host:port/database?sslmode=require"

# Дополнительные настройки
TZ=Europe/Moscow
PORT=3000
```

#### Генерация NEXTAUTH_SECRET

```bash
# Используйте одну из команд
openssl rand -base64 32
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Настройка базы данных

#### Создание продакшен базы данных

```sql
-- Подключитесь к PostgreSQL
psql -h your-host -U your-user

-- Создайте базу данных
CREATE DATABASE proj_od_prod;

-- Создайте пользователя (рекомендуется)
CREATE USER proj_od_prod_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE proj_od_prod TO proj_od_prod_user;

-- Включите необходимые расширения
\c proj_od_prod
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 3. Подготовка кода

```bash
# Клонирование репозитория
git clone <repository-url>
cd proj-od

# Установка зависимостей
npm ci --production=false

# Генерация Prisma Client
npx prisma generate

# Применение миграций
npx prisma migrate deploy

# Сборка приложения
npm run build
```

## Варианты развертывания

## 1. Развертывание на VPS/Dedicated сервере

### Подготовка сервера

```bash
# Обновление системы (Ubuntu/Debian)
sudo apt update && sudo apt upgrade -y

# Установка Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка PostgreSQL
sudo apt install postgresql postgresql-contrib

# Установка PM2 для управления процессами
sudo npm install -g pm2

# Установка Nginx (опционально)
sudo apt install nginx
```

### Настройка PostgreSQL

```bash
# Переключение на пользователя postgres
sudo -u postgres psql

# Создание пользователя и базы данных
CREATE USER proj_od_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE proj_od OWNER proj_od_user;
GRANT ALL PRIVILEGES ON DATABASE proj_od TO proj_od_user;

# Выход
\q
```

### Развертывание приложения

```bash
# Создание пользователя для приложения
sudo adduser --system --group proj-od

# Создание директории приложения
sudo mkdir -p /var/www/proj-od
sudo chown proj-od:proj-od /var/www/proj-od

# Переключение на пользователя приложения
sudo -u proj-od bash

# Клонирование и настройка
cd /var/www/proj-od
git clone <repository-url> .
npm ci
cp .env.example .env
# Отредактируйте .env файл

# Сборка и запуск
npx prisma migrate deploy
npm run build

# Запуск через PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### ecosystem.config.js

```javascript
module.exports = {
  apps: [
    {
      name: 'proj-od',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/proj-od',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '1G',
      error_file: '/var/log/proj-od/error.log',
      out_file: '/var/log/proj-od/out.log',
      log_file: '/var/log/proj-od/combined.log',
      time: true,
    },
  ],
}
```

### Настройка Nginx (обратный прокси)

```nginx
# /etc/nginx/sites-available/proj-od
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Перенаправление HTTP на HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL сертификаты
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # SSL настройки
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Проксирование на Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Статические файлы
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Безопасность
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
}
```

Активация конфигурации:

```bash
sudo ln -s /etc/nginx/sites-available/proj-od /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 2. Развертывание на Vercel

### Подготовка

1. Создайте аккаунт на [Vercel](https://vercel.com)
2. Подключите GitHub репозиторий
3. Настройте переменные окружения

### Конфигурация проекта

Создайте `vercel.json`:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "env": {
    "DATABASE_URL": "@database_url",
    "DIRECT_URL": "@direct_url",
    "NEXTAUTH_SECRET": "@nextauth_secret",
    "NEXTAUTH_URL": "@nextauth_url"
  },
  "build": {
    "env": {
      "DATABASE_URL": "@database_url",
      "DIRECT_URL": "@direct_url"
    }
  }
}
```

### Настройка базы данных

Используйте один из вариантов:

#### Вариант 1: Supabase

1. Создайте проект на [Supabase](https://supabase.com)
2. Получите connection string
3. Добавьте в переменные окружения Vercel

#### Вариант 2: PlanetScale

1. Создайте базу данных на [PlanetScale](https://planetscale.com)
2. Получите connection string
3. Настройте Prisma для работы с PlanetScale

#### Вариант 3: Neon

1. Создайте базу данных на [Neon](https://neon.tech)
2. Получите connection string
3. Добавьте в Vercel

### Деплой

```bash
# Установка Vercel CLI
npm i -g vercel

# Инициализация проекта
vercel

# Деплой
vercel --prod
```

### Автоматические деплои

Настройте GitHub Actions для автоматического деплоя:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install Vercel CLI
        run: npm install --global vercel@latest

      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build Project
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 3. Развертывание на Railway

### Подготовка

1. Создайте аккаунт на [Railway](https://railway.app)
2. Подключите GitHub репозиторий
3. Добавьте PostgreSQL сервис

### Настройка

Railway автоматически определит Next.js проект. Добавьте переменные окружения:

```env
NODE_ENV=production
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=${{RAILWAY_STATIC_URL}}
DATABASE_URL=${{Postgres.DATABASE_URL}}
DIRECT_URL=${{Postgres.DATABASE_URL}}
```

### Конфигурация сборки

Создайте `railway.json`:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}
```

## 4. Развертывание через Docker

### Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Установка зависимостей
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Сборка приложения
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Генерация Prisma Client
RUN npx prisma generate

# Сборка Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Продакшен образ
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/generated ./generated

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/proj_od
      - DIRECT_URL=postgresql://postgres:password@postgres:5432/proj_od
      - NEXTAUTH_SECRET=your-secret
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - postgres
    volumes:
      - ./logs:/app/logs

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=proj_od
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - app

volumes:
  postgres_data:
```

### Запуск

```bash
# Сборка и запуск
docker-compose up -d

# Применение миграций
docker-compose exec app npx prisma migrate deploy

# Просмотр логов
docker-compose logs -f app
```

## Мониторинг и обслуживание

### Логирование

#### PM2 Logs

```bash
# Просмотр логов
pm2 logs proj-od

# Ротация логов
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

#### Настройка системных логов

```bash
# Создание директории для логов
sudo mkdir -p /var/log/proj-od
sudo chown proj-od:proj-od /var/log/proj-od

# Настройка logrotate
sudo tee /etc/logrotate.d/proj-od << EOF
/var/log/proj-od/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 0644 proj-od proj-od
}
EOF
```

### Мониторинг производительности

#### Healthcheck endpoint

Добавьте в `app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Проверка подключения к БД
    await db.$queryRaw`SELECT 1`

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
```

#### Мониторинг с помощью cron

```bash
# Добавьте в crontab
*/5 * * * * curl -f http://localhost:3000/api/health || echo "Health check failed" | mail -s "Service Down" admin@company.com
```

### Резервное копирование

#### Автоматическое резервное копирование БД

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/proj-od"
DB_NAME="proj_od"
DB_USER="proj_od_user"

# Создание директории для бэкапов
mkdir -p $BACKUP_DIR

# Создание бэкапа
pg_dump -h localhost -U $DB_USER -d $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Удаление старых бэкапов (старше 30 дней)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

Добавьте в crontab:

```bash
# Ежедневный бэкап в 2:00
0 2 * * * /path/to/backup.sh >> /var/log/proj-od/backup.log 2>&1
```

### Обновление приложения

#### Zero-downtime deployment

```bash
#!/bin/bash
# deploy.sh

APP_DIR="/var/www/proj-od"
BACKUP_DIR="/var/backups/proj-od/app"

cd $APP_DIR

# Создание бэкапа текущей версии
cp -r .next $BACKUP_DIR/.next.$(date +%Y%m%d_%H%M%S)

# Получение обновлений
git pull origin main

# Установка зависимостей
npm ci

# Применение миграций
npx prisma migrate deploy

# Сборка нового кода
npm run build

# Плавная перезагрузка через PM2
pm2 reload ecosystem.config.js

echo "Deployment completed successfully"
```

## Безопасность

### SSL/TLS сертификаты

#### Let's Encrypt с Certbot

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Автоматическое обновление
sudo crontab -e
# Добавьте: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Firewall

```bash
# Настройка UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Безопасность базы данных

```sql
-- Ограничение подключений
ALTER SYSTEM SET max_connections = 100;

-- Настройка SSL
ALTER SYSTEM SET ssl = on;

-- Перезагрузка конфигурации
SELECT pg_reload_conf();
```

## Troubleshooting

### Частые проблемы

#### Ошибка подключения к БД

```bash
# Проверка статуса PostgreSQL
sudo systemctl status postgresql

# Проверка подключения
psql -h localhost -U proj_od_user -d proj_od -c "SELECT version();"
```

#### Проблемы с памятью

```bash
# Увеличение лимитов для PM2
pm2 start ecosystem.config.js --max-memory-restart 2G

# Мониторинг использования памяти
pm2 monit
```

#### Проблемы с миграциями

```bash
# Принудительная миграция
npx prisma migrate resolve --applied "migration_name"

# Сброс миграций (осторожно!)
npx prisma migrate reset --force
```

### Диагностика

```bash
# Проверка статуса всех сервисов
sudo systemctl status nginx postgresql

# Проверка логов
journalctl -u nginx -f
tail -f /var/log/proj-od/error.log

# Проверка производительности
htop
iostat -x 1
```

## Масштабирование

### Горизонтальное масштабирование

При росте нагрузки:

1. **Load Balancer**: Nginx или cloud load balancer
2. **Кластер приложений**: Несколько инстансов Next.js
3. **Database clustering**: PostgreSQL master-slave
4. **CDN**: CloudFlare или AWS CloudFront для статических ресурсов

### Вертикальное масштабирование

1. **Увеличение ресурсов сервера**
2. **Оптимизация PostgreSQL**
3. **Настройка PM2 кластера**

```javascript
// ecosystem.config.js для масштабирования
module.exports = {
  apps: [
    {
      name: 'proj-od',
      script: 'npm',
      args: 'start',
      instances: 'max', // Использует все CPU ядра
      exec_mode: 'cluster',
      max_memory_restart: '2G',
    },
  ],
}
```
