# API Справочник

Этот документ содержит полное описание всех API эндпоинтов Project OD.

## Базовые сведения

- **Базовый URL**: `http://localhost:3000/api`
- **Формат данных**: JSON
- **Аутентификация**: Session-based через NextAuth.js
- **Кодировка**: UTF-8

## Аутентификация

### POST /api/auth/register

Регистрация нового пользователя в системе.

**Параметры запроса:**

```json
{
  "username": "string", // Имя пользователя (уникальное)
  "password": "string", // Пароль (минимум 6 символов)
  "name": "string", // Имя (опционально)
  "surname": "string", // Фамилия (опционально)
  "email": "string", // Email (опционально, уникальный)
  "rfRu": "string" // РФ ID (опционально, до 24 символов)
}
```

**Ответы:**

- `201` - Пользователь создан успешно
- `400` - Неверные данные запроса
- `409` - Пользователь с таким именем уже существует
- `500` - Внутренняя ошибка сервера

**Пример запроса:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "secure123",
    "name": "John",
    "surname": "Doe",
    "email": "john@example.com"
  }'
```

### POST /api/auth/login

Авторизация пользователя.

**Параметры запроса:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Ответы:**

- `200` - Успешная авторизация
- `401` - Неверные учетные данные
- `400` - Неверные данные запроса

### GET /api/auth/session

Получение информации о текущей сессии.

**Ответ:**

```json
{
  "user": {
    "id": "string",
    "username": "string",
    "name": "string",
    "surname": "string",
    "email": "string",
    "role": "ADMIN|MANAGER|DISPATCHER"
  },
  "expires": "string"
}
```

## Управление пользователями

### GET /api/admin/users

Получение списка всех пользователей (только для администраторов).

**Заголовки:**

- Требуется аутентификация
- Роль: ADMIN

**Ответ:**

```json
[
  {
    "id": "string",
    "username": "string",
    "name": "string",
    "surname": "string",
    "email": "string",
    "role": "ADMIN|MANAGER|DISPATCHER",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

### PUT /api/admin/users/[id]

Обновление данных пользователя.

**Параметры запроса:**

```json
{
  "name": "string",
  "surname": "string",
  "email": "string",
  "role": "ADMIN|MANAGER|DISPATCHER",
  "rfRu": "string"
}
```

**Ответы:**

- `200` - Пользователь обновлен
- `404` - Пользователь не найден
- `403` - Недостаточно прав

### DELETE /api/admin/users/[id]

Удаление пользователя.

**Ответы:**

- `200` - Пользователь удален
- `404` - Пользователь не найден
- `403` - Недостаточно прав

## Управление заявками

### GET /api/requests

Получение списка заявок с фильтрацией.

**Query параметры:**

- `status` - Статус заявки (CREATED, COMPLETED, INCORRECT)
- `type` - Тип заявки (ONE_DAY_DELIVERY, CORRECTION_SALE, CORRECTION_RETURN, SAMPLING)
- `salesOrganization` - Организация продаж (SALES_3801-3806)
- `priority` - Приоритет (MEDIUM, HIGH)
- `page` - Номер страницы (по умолчанию 1)
- `limit` - Количество записей на странице (по умолчанию 10)

**Ответ:**

```json
{
  "requests": [
    {
      "id": "string",
      "orderNumber": "number",
      "type": "string",
      "salesOrganization": "string",
      "status": "string",
      "priority": "string",
      "warehouse": "string",
      "date": "string",
      "odNumber": "string",
      "comment": "string",
      "resource": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "user": {
        "id": "string",
        "username": "string",
        "name": "string",
        "surname": "string"
      }
    }
  ],
  "totalCount": "number",
  "totalPages": "number",
  "currentPage": "number"
}
```

### POST /api/requests

Создание новой заявки.

**Параметры запроса:**

```json
{
  "type": "ONE_DAY_DELIVERY|CORRECTION_SALE|CORRECTION_RETURN|SAMPLING",
  "salesOrganization": "SALES_3801|SALES_3802|SALES_3803|SALES_3804|SALES_3805|SALES_3806",
  "priority": "MEDIUM|HIGH",
  "warehouse": "string",
  "date": "string", // ISO 8601 format
  "odNumber": "string",
  "comment": "string",
  "resource": "string"
}
```

**Ответы:**

- `201` - Заявка создана
- `400` - Неверные данные
- `401` - Не авторизован

### GET /api/requests/[orderNumber]

Получение детальной информации о заявке.

**Ответ:**

```json
{
  "id": "string",
  "orderNumber": "number",
  "type": "string",
  "salesOrganization": "string",
  "status": "string",
  "priority": "string",
  "warehouse": "string",
  "date": "string",
  "odNumber": "string",
  "comment": "string",
  "resource": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "user": {
    "id": "string",
    "username": "string",
    "name": "string",
    "surname": "string"
  },
  "messages": [
    {
      "id": "string",
      "message": "string",
      "createdAt": "string",
      "user": {
        "username": "string",
        "name": "string",
        "surname": "string"
      }
    }
  ]
}
```

### PUT /api/requests/[orderNumber]

Обновление заявки.

**Параметры запроса:**

```json
{
  "status": "CREATED|COMPLETED|INCORRECT",
  "priority": "MEDIUM|HIGH",
  "odNumber": "string",
  "comment": "string"
}
```

**Ответы:**

- `200` - Заявка обновлена
- `404` - Заявка не найдена
- `403` - Недостаточно прав

### DELETE /api/requests/[orderNumber]

Удаление заявки (только создатель или админ).

**Ответы:**

- `200` - Заявка удалена
- `404` - Заявка не найдена
- `403` - Недостаточно прав

## Сообщения

### GET /api/messages/[requestId]

Получение сообщений для конкретной заявки.

**Ответ:**

```json
[
  {
    "id": "string",
    "message": "string",
    "createdAt": "string",
    "user": {
      "id": "string",
      "username": "string",
      "name": "string",
      "surname": "string"
    }
  }
]
```

### POST /api/messages

Отправка нового сообщения к заявке.

**Параметры запроса:**

```json
{
  "requestId": "string",
  "message": "string"
}
```

**Ответы:**

- `201` - Сообщение отправлено
- `400` - Неверные данные
- `404` - Заявка не найдена

## Профиль пользователя

### GET /api/profile

Получение данных профиля текущего пользователя.

**Ответ:**

```json
{
  "id": "string",
  "username": "string",
  "name": "string",
  "surname": "string",
  "email": "string",
  "rfRu": "string",
  "role": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

### PUT /api/profile

Обновление данных профиля.

**Параметры запроса:**

```json
{
  "name": "string",
  "surname": "string",
  "email": "string",
  "rfRu": "string"
}
```

**Ответы:**

- `200` - Профиль обновлен
- `400` - Неверные данные
- `409` - Email уже используется

## Коды ошибок

### Общие коды ошибок

- `400` - Bad Request (неверные данные запроса)
- `401` - Unauthorized (не авторизован)
- `403` - Forbidden (недостаточно прав)
- `404` - Not Found (ресурс не найден)
- `409` - Conflict (конфликт данных)
- `500` - Internal Server Error (внутренняя ошибка сервера)

### Формат ошибки

```json
{
  "error": "string", // Краткое описание ошибки
  "message": "string", // Подробное сообщение
  "details": "object" // Дополнительные детали (опционально)
}
```

## Примеры использования

### Создание заявки с отправкой сообщения

```javascript
// 1. Создание заявки
const requestResponse = await fetch('/api/requests', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    type: 'ONE_DAY_DELIVERY',
    salesOrganization: 'SALES_3801',
    priority: 'HIGH',
    warehouse: 'Склад А',
    date: '2025-07-08T10:00:00Z',
    odNumber: 'OD-12345',
    comment: 'Срочная доставка',
    resource: 'Ресурс 1',
  }),
})

const request = await requestResponse.json()

// 2. Отправка сообщения к заявке
await fetch('/api/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    requestId: request.id,
    message: 'Заявка создана и требует обработки',
  }),
})
```

### Фильтрация заявок

```javascript
const params = new URLSearchParams({
  status: 'CREATED',
  type: 'ONE_DAY_DELIVERY',
  page: '1',
  limit: '20',
})

const response = await fetch(`/api/requests?${params}`)
const data = await response.json()
```

## Rate Limiting

API имеет ограничения на количество запросов:

- **Аутентификация**: 5 попыток в минуту на IP
- **Создание заявок**: 10 заявок в минуту на пользователя
- **Отправка сообщений**: 30 сообщений в минуту на пользователя
- **Общие запросы**: 100 запросов в минуту на пользователя

При превышении лимитов возвращается ошибка `429 Too Many Requests`.
