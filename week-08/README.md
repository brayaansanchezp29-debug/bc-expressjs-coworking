# Semana 08 — API Segura con RBAC y Capas de Seguridad (Coworking Spaces)

## Dominio: Coworking Space

API REST del recurso `Space`, protegida con RBAC (roles `user`/`admin`) y
todas las capas de seguridad de la semana: Helmet, CORS con whitelist,
rate limiting diferenciado y sanitización anti NoSQL-injection.

## ⚠️ Bugs de compatibilidad con Express 5 corregidos

El starter oficial del bootcamp trae dos líneas que **no funcionan** con
Express 5 (probado y confirmado): tumban el servidor en la primera petición
que llega. Se corrigieron así:

1. **`app.options('*', cors(corsOptions))` → `app.options('/*splat', ...)`**
   Express 5 (path-to-regexp v8) eliminó el comodín `'*'` a secas; ahora
   exige un nombre para el segmento comodín (`/*splat`).

2. **`express-mongo-sanitize` → middleware propio (`src/middlewares/sanitize.ts`)**
   Ese paquete intenta reasignar `req.query` por completo
   (`req.query = sanitized`), pero Express 5 convirtió `req.query` en un
   getter de **solo lectura**, lo que lanza
   `TypeError: Cannot set property query of #<IncomingMessage> which has
   only a getter` en cualquier request. El middleware propio logra la misma
   protección (elimina claves que empiecen con `$` o contengan `.`) mutando
   las propiedades existentes de `body`/`query`/`params` en vez de reasignar
   el objeto completo.

Ambos son bugs reales del starter, no de la adaptación al dominio.

## Sistema de autenticación (dado, sin modificar)

Igual que la semana 07, pero el `accessToken` viaja en el **body de la
respuesta** (no en cookie) y se envía en cada request como
`Authorization: Bearer <token>`; solo el `refreshToken` va en cookie
`httpOnly`.

| Ruta | Método | Rate limit |
|------|--------|------------|
| `/api/v1/auth/register` | POST | 5 req / 15 min |
| `/api/v1/auth/login` | POST | 5 req / 15 min |
| `/api/v1/auth/refresh` | POST | — (global: 100 req / 15 min) |
| `/api/v1/auth/logout` | POST | — |
| `/api/v1/auth/me` | GET | — |

Usuarios de prueba (creados automáticamente al arrancar el servidor si la
colección está vacía):
- `user@test.com` / `User1234!` → rol `user`
- `admin@test.com` / `Admin1234!` → rol `admin`

## Recurso principal: `Space`

| Campo        | Tipo    | Validación                                   |
|--------------|---------|-------------------------------------------------|
| name         | string  | 2–150 caracteres, sin `<`/`>` (anti-XSS)         |
| code         | string  | Único, formato `SP-001`                          |
| capacity     | number  | Entero, mayor a 0                                |
| pricePerHour | number  | No negativo                                      |
| available    | boolean | Opcional, default `true`                         |
| createdBy    | string  | ID del usuario autenticado que lo creó           |

## RBAC — política de acceso de `Space`

| Método | Ruta | Acceso | Status |
|--------|------|--------|--------|
| GET | `/api/v1/spaces` | Público (sin token) | 200 |
| GET | `/api/v1/spaces/:id` | Público (sin token) | 200 / 404 |
| POST | `/api/v1/spaces` | Autenticado | 201 / 401 |
| PATCH | `/api/v1/spaces/:id` | Autenticado + dueño **o** admin | 200 / 401 / 403 / 404 |
| DELETE | `/api/v1/spaces/:id` | Solo `admin` | 204 / 401 / 403 / 404 |

**Decisión de diseño:** el catálogo de espacios es público (como cualquier
sitio de reservas real donde puedes ver disponibilidad sin cuenta), pero
crear/editar requiere sesión, y solo un `admin` puede eliminar espacios.

## Capas de seguridad aplicadas

| Capa | Configuración |
|------|---------------|
| **Helmet** | Aplicado globalmente — cabeceras como `X-Content-Type-Options: nosniff` visibles en toda respuesta |
| **CORS** | Whitelist explícita (`localhost:5173`, `localhost:3001`) — **no** `cors()` sin opciones ni `*` |
| **Rate limit — auth** | 5 requests / 15 min en `/register` y `/login` (protección contra fuerza bruta) |
| **Rate limit — global** | 100 requests / 15 min en toda la API |
| **Sanitización NoSQL** | Middleware propio — elimina claves `$...`/`...con punto` de `body`, `query` y `params` |
| **RBAC** | `authMiddleware` (verifica JWT) + `requireRole('admin')` (verifica rol) |
| **Errores seguros** | `errorHandler` nunca expone `stack trace`; solo `{ error: message }` |
| **Secretos** | Todo en `.env` (JWT secrets, Mongo URI) — nada hardcodeado en el código |

## Cómo ejecutar

```bash
docker compose up -d
pnpm install
cp .env.example .env
# Genera los dos secretos JWT (deben ser distintos):
#   openssl rand -base64 64   →  JWT_ACCESS_SECRET
#   openssl rand -base64 64   →  JWT_REFRESH_SECRET
pnpm dev
```

## Flujo de prueba con Postman / Thunder Client

1. `POST /api/v1/auth/login` con `admin@test.com` / `Admin1234!` → `200`, copia el `accessToken` del body
2. `GET /api/v1/spaces` **sin** header → `200` (público)
3. `POST /api/v1/spaces` **sin** header `Authorization` → `401`
4. `POST /api/v1/spaces` con `Authorization: Bearer <accessToken>` → `201`
5. Login con `user@test.com` / `User1234!`, y con ese token: `DELETE /api/v1/spaces/:id` → `403` (no es admin)
6. Con el token de `admin@test.com`: `DELETE /api/v1/spaces/:id` → `204`
7. Revisa los headers de cualquier respuesta: `X-Content-Type-Options`, `RateLimit-*`
8. Manda 6 requests seguidos a `/api/v1/auth/login` → el 6to debe dar `429`
