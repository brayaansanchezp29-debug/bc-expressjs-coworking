# Semana 05 — API con PostgreSQL y Prisma ORM (Coworking Spaces)

## Dominio: Coworking Space

Migración de la API de `Space` de almacenamiento en memoria a **PostgreSQL**
usando **Prisma ORM**, con migraciones versionadas, seed idempotente y
manejo de errores de base de datos.

## Modelo de datos

```
SpaceCategory (1) ──── (N) Space
```

- **`SpaceCategory`** (recurso secundario): agrupa los espacios por tipo
  (Sala de Reunión, Oficina Privada, Escritorio Flexible, Cabina de
  Llamadas).
- **`Space`** (recurso principal): un espacio reservable, pertenece a una
  `SpaceCategory`.

```prisma
model SpaceCategory {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  description String?
  createdAt   DateTime @default(now())
  spaces      Space[]
}

model Space {
  id           Int      @id @default(autoincrement())
  name         String
  code         String   @unique   // ej. "SP-001"
  capacity     Int
  pricePerHour Float
  available    Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  category     SpaceCategory @relation(fields: [categoryId], references: [id])
  categoryId   Int
}
```

## Arquitectura

```
routes → controllers → services → repositories (Prisma Client) → PostgreSQL
```

- **`src/lib/prisma.ts`** — singleton de `PrismaClient` (patrón
  `globalForPrisma`, evita múltiples conexiones en hot-reload).
- **`src/repositories/spaces.repository.ts`** — único lugar que llama a
  Prisma. Captura `PrismaClientKnownRequestError`:
  - `P2002` (código duplicado) → `AppError(409, 'Ya existe un espacio con ese código')`
  - `P2025` (no encontrado en `update`/`delete`) → `AppError(404, 'Espacio no encontrado')`
  - `P2003` (categoría inexistente) → `AppError(400, ...)`
- **`src/services/spaces.service.ts`** — `getSpace` lanza `AppError(404, ...)`
  cuando `findUnique` retorna `null`.
- **`src/controllers/spaces.controller.ts`** — valida `req.body` con
  `createSpaceSchema` / `updateSpaceSchema` (Zod) antes de llamar al service.
- Tipos derivados directamente de Prisma Client (`Prisma.SpaceGetPayload<...>`)
  — no se duplican interfaces manualmente.

## Endpoints

| Método | Ruta                    | Status      | Descripción                              |
|--------|-------------------------|-------------|--------------------------------------------|
| GET    | `/api/v1/spaces`        | 200         | Listado paginado `?page&limit`, con `category` incluida |
| GET    | `/api/v1/spaces/:id`    | 200 / 404   | Detalle con `category`                    |
| POST   | `/api/v1/spaces`        | 201/400/409 | Crear (Zod + `code` único)                |
| PUT    | `/api/v1/spaces/:id`    | 200 / 404   | Actualizar                                |
| DELETE | `/api/v1/spaces/:id`    | 204 / 404   | Eliminar                                  |

### Ejemplos de respuesta

```json
// GET /api/v1/spaces?page=1&limit=2 → 200
{
  "data": [
    { "id": 7, "name": "Cabina de Llamadas 1", "code": "SP-007", "capacity": 1,
      "pricePerHour": 4, "available": true, "categoryId": 4,
      "category": { "id": 4, "name": "Cabina de Llamadas", ... }, ... }
  ],
  "total": 7,
  "page": 1,
  "limit": 2
}

// POST /api/v1/spaces con code repetido → 409
{ "status": "error", "message": "Ya existe un espacio con ese código" }

// GET /api/v1/spaces/999 → 404
{ "status": "error", "message": "Espacio no encontrado" }
```

## Cómo ejecutar

```bash
# 1. Levantar PostgreSQL
docker compose up -d

# 2. Instalar dependencias (ejecuta prisma generate automáticamente)
pnpm install

# 3. Variables de entorno
cp .env.example .env

# 4. Migración inicial
pnpm dlx prisma migrate dev --name init

# 5. Seed (idempotente — se puede correr varias veces)
pnpm dlx prisma db seed

# 6. Servidor en desarrollo
pnpm dev
```

## Seed

`prisma/seed.ts` limpia `Space` y `SpaceCategory` (en ese orden, por la
foreign key) y vuelve a crear 4 categorías + 7 espacios. Es idempotente:
correrlo varias veces siempre deja los mismos 7 registros, nunca duplica.

```
🌱 Iniciando seed...
✅ 4 categorías creadas
✅ 7 espacios creados
🌱 Seed completado.
```
