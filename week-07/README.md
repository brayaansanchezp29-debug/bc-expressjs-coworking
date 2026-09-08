# Semana 07 — Autenticación JWT Completa (Coworking Spaces)

## Dominio: Coworking Space

Sistema de autenticación completo (registro, login, refresh con rotación,
logout) protegiendo el CRUD del recurso principal `Space`, usando **bcrypt**,
**JWT access/refresh tokens** y **cookies HttpOnly**.

## Sistema de autenticación

| Ruta | Método | Protegida | Descripción |
|------|--------|-----------|-------------|
| `/api/v1/auth/register` | POST | No | Registro con `bcrypt.hash()` (salt rounds 10) |
| `/api/v1/auth/login` | POST | No | Emite `accessToken` (15 min) + `refreshToken` (7 días) en cookies HttpOnly |
| `/api/v1/auth/me` | GET | Sí | Perfil del usuario autenticado |
| `/api/v1/auth/refresh` | POST | No (usa cookie) | Rota el refresh token — invalida el anterior |
| `/api/v1/auth/logout` | POST | Sí | Limpia cookies e invalida `refreshToken` en DB |

**Seguridad implementada:**
- Contraseña hasheada con `bcrypt.hash()`, nunca en texto plano.
- `password` y `refreshToken` con `select: false` en el schema — nunca se
  devuelven salvo que se pidan explícitamente (`.select('+password')`).
- **Dos secretos JWT distintos** (`JWT_ACCESS_SECRET` ≠ `JWT_REFRESH_SECRET`).
- Mismo mensaje de error (`"Credenciales inválidas"`) tanto si el email no
  existe como si la contraseña es incorrecta — previene user enumeration.
- Refresh token almacenado **hasheado** en la base de datos (nunca en claro).
- **Rotación**: cada `/refresh` genera un par nuevo de tokens e invalida el
  anterior.
- Cookies `httpOnly: true`, `secure` en producción, `sameSite: 'lax'`.
- `refreshToken` en cookie con `path: '/api/v1/auth'` (no se envía a otras rutas).

## Recurso principal: `Space`

| Campo        | Tipo     | Validación                                  |
|--------------|----------|----------------------------------------------|
| name         | string   | 2–150 caracteres                             |
| code         | string   | Único, formato `SP-001`                      |
| capacity     | number   | Entero, mayor a 0                            |
| pricePerHour | number   | No negativo                                  |
| available    | boolean  | Default `true`                               |
| createdBy    | ObjectId | Referencia al `User` autenticado que lo creó |

## Endpoints del recurso (todos protegidos con `authMiddleware`)

| Método | Ruta                  | Status      |
|--------|-----------------------|-------------|
| GET    | `/api/v1/spaces`      | 200 / 401   |
| GET    | `/api/v1/spaces/:id`  | 200 / 401 / 404 |
| POST   | `/api/v1/spaces`      | 201 / 401   |
| PATCH  | `/api/v1/spaces/:id`  | 200 / 401 / 404 |
| DELETE | `/api/v1/spaces/:id`  | 204 / 401 / 404 |

## Cómo ejecutar

```bash
# 1. Levantar MongoDB
docker compose up -d

# 2. Instalar dependencias
pnpm install

# 3. Variables de entorno
cp .env.example .env
# Genera los dos secretos JWT (deben ser distintos):
#   openssl rand -base64 64   →  JWT_ACCESS_SECRET
#   openssl rand -base64 64   →  JWT_REFRESH_SECRET

# 4. Servidor en desarrollo
pnpm dev
```

## Flujo de prueba con Postman / Thunder Client

1. `POST /api/v1/auth/register` → `{ "email": "...", "password": "Clave123", "name": "..." }` → `201`
2. `POST /api/v1/auth/login` → mismo email/password → `200`, revisa que llegaron las cookies `accessToken` y `refreshToken`
3. `GET /api/v1/spaces` **sin** cookies → `401`
4. `GET /api/v1/spaces` **con** cookies (Postman las guarda solo) → `200`, `[]`
5. `POST /api/v1/spaces` → `{ "name": "Sala Ártico", "code": "SP-001", "capacity": 8, "pricePerHour": 25 }` → `201`
6. `GET /api/v1/spaces/:id` → `200`
7. `PATCH /api/v1/spaces/:id` → `{ "pricePerHour": 28 }` → `200`
8. `DELETE /api/v1/spaces/:id` → `204`
9. `POST /api/v1/auth/refresh` → `200`, nuevas cookies (compara que el `refreshToken` cambió)
10. `POST /api/v1/auth/logout` → `200`, cookies limpiadas
11. `POST /api/v1/auth/refresh` de nuevo (con el token viejo) → `401` (ya fue invalidado)
