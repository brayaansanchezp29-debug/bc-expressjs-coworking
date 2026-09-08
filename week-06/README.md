# Semana 06 — API con MongoDB y Mongoose (Coworking Spaces)

## Dominio: Coworking Space

Misma pareja de entidades que la semana 05 (`SpaceCategory` ── `Space`),
migrada de PostgreSQL/Prisma a **MongoDB + Mongoose**, con `populate()`,
paginación, seed, y manejo de errores `11000` / `CastError`.

## Modelo de datos

```
SpaceCategory (secundaria, sin refs) ──── Space (principal, con ref)
```

```ts
// SpaceCategory
{ name: string (unique), description?: string, createdAt, updatedAt }

// Space
{
  name: string,
  code: string (unique, formato SP-001),
  capacity: number (min 1),
  pricePerHour: number (min 0),
  available: boolean (default true),
  category: ObjectId (ref: 'SpaceCategory'),
  createdAt, updatedAt
}
```

## Arquitectura

```
routes → controllers → services → repositories (Model de Mongoose) → MongoDB
```

- **`src/models/`** — `SpaceCategory` y `Space`, ambos con `{ timestamps: true }`
  y validadores (`required`, `trim`, `min`, `max`, `match`, `unique`).
- **`src/repositories/`** — único lugar que usa `Model` de Mongoose (nunca
  arrays en memoria). Maneja:
  - `mongoose.Error.CastError` (ID mal formado) → `AppError(400, 'ID inválido')`
  - `MongoServerError` código `11000` (duplicado) → `AppError(409, ...)`
  - Documento no encontrado → `AppError(404, ...)`
- **`space.repository.ts`** → `findAll` y `findById` usan `.populate('category')`
  y `.lean()` en todas las queries de lectura.
- **`src/controllers/`** — validan `req.body`/`req.params.id` con Zod
  (`safeParse`) antes de llamar al service; responden `400` directamente si
  la validación falla (el `errorHandler` dado solo maneja `AppError`, no
  `ZodError`, por eso se valida en el controller).

## Endpoints

### `SpaceCategory` (secundaria)

| Método | Ruta                          | Status      |
|--------|-------------------------------|-------------|
| GET    | `/api/v1/space-categories`    | 200         |
| GET    | `/api/v1/space-categories/:id`| 200/400/404 |
| POST   | `/api/v1/space-categories`    | 201/400/409 |
| PUT    | `/api/v1/space-categories/:id`| 200/400/404/409 |
| DELETE | `/api/v1/space-categories/:id`| 204/400/404 |

### `Space` (principal, con `populate`)

| Método | Ruta                | Status          | Descripción                         |
|--------|---------------------|-----------------|----------------------------------------|
| GET    | `/api/v1/spaces`    | 200             | Paginado `?page&limit&search`, con `category` poblada |
| GET    | `/api/v1/spaces/:id`| 200/400/404     | Con `category` poblada                 |
| POST   | `/api/v1/spaces`    | 201/400/409     | Valida `category` como ObjectId        |
| PUT    | `/api/v1/spaces/:id`| 200/400/404/409 | —                                       |
| DELETE | `/api/v1/spaces/:id`| 204/400/404     | —                                       |

### Ejemplo de respuesta paginada

```json
// GET /api/v1/spaces?page=1&limit=2 → 200
{
  "data": [
    {
      "_id": "...", "name": "Cabina de Llamadas 1", "code": "SP-007",
      "capacity": 1, "pricePerHour": 4, "available": true,
      "category": { "_id": "...", "name": "Cabina de Llamadas", ... },
      "createdAt": "...", "updatedAt": "..."
    }
  ],
  "total": 7,
  "page": 1,
  "totalPages": 4
}
```

## Cómo ejecutar

```bash
# 1. Levantar MongoDB
docker compose up -d

# 2. Instalar dependencias
pnpm install

# 3. Variables de entorno
cp .env.example .env

# 4. Cargar los datos de ejemplo
pnpm seed

# 5. Servidor en desarrollo
pnpm dev
```

## Pruebas con curl

```bash
# 400 — id mal formado
curl http://localhost:3000/api/v1/spaces/abc123

# 404 — id válido pero inexistente
curl http://localhost:3000/api/v1/spaces/507f1f77bcf86cd799439011

# 409 — code duplicado (SP-001 ya existe del seed)
curl -X POST http://localhost:3000/api/v1/spaces \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","code":"SP-001","capacity":5,"pricePerHour":20,"category":"<id de una categoría>"}'

# 201 — creación válida
curl -X POST http://localhost:3000/api/v1/spaces \
  -H "Content-Type: application/json" \
  -d '{"name":"Sala Cumbre","code":"SP-010","capacity":10,"pricePerHour":28,"category":"<id de una categoría>"}'
```
