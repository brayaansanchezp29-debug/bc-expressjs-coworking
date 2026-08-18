# Semana 04 — Validación, Errores y Logging (Coworking Spaces)

## Dominio: Coworking Space

API REST del recurso `Space`, con validación de datos (Zod), manejo
estructurado de errores (`AppError`) y logging profesional (Winston + Morgan).

## Recurso: `Space`

| Campo        | Tipo    | Validación                                                              |
|--------------|---------|---------------------------------------------------------------------------|
| id           | number  | Autoincremental                                                          |
| name         | string  | Obligatorio, no vacío                                                    |
| type         | enum    | Obligatorio: `sala_reunion` \| `oficina_privada` \| `escritorio_flexible` \| `cabina_llamadas` |
| capacity     | number  | Obligatorio, entero, mayor a 0                                          |
| pricePerHour | number  | Obligatorio, mayor a 0                                                  |
| available    | boolean | Opcional, default `true`                                                |
| createdAt    | Date    | Autogenerado                                                             |

Schemas en `src/schemas/space.schema.ts`: `createSpaceSchema` con todas las
validaciones, y `updateSpaceSchema = createSpaceSchema.partial()` reutilizado
sin duplicar código. Los DTOs (`CreateSpaceDto`, `UpdateSpaceDto`) están
inferidos con `z.infer<>`.

## Manejo de errores

- **`AppError`** (`src/errors/AppError.ts`): extiende `Error`, con
  `statusCode` e `isOperational`. Se lanza desde el service cuando un
  `Space` no existe: `throw new AppError(404, ...)`.
- **`errorHandler`** (`src/middlewares/errorHandler.ts`): único middleware
  con 4 parámetros, registrado al final de `app.ts`. Distingue:
  - `ZodError` → `400` con `issues[]`
  - `AppError` → `err.statusCode`, con `logger.warn()`
  - Error genérico → `500`, stack oculto en producción, con `logger.error()`
- **`notFound`** (`src/middlewares/notFound.ts`): middleware de 3 parámetros
  registrado justo antes del `errorHandler`, captura cualquier ruta no
  registrada y delega un `AppError(404, ...)`.

## Logging

- `src/config/logger.ts`: Winston con nivel `http` en desarrollo / `warn`
  en producción; formato colorizado en dev, JSON en producción; transport
  de archivo `logs/error.log` solo en producción.
- Morgan integrado vía `morganMiddleware`, escribiendo a través de la
  stream de Winston (`logger.http`).

## Endpoints

| Método | Ruta                    | Status exitoso | Descripción                          |
|--------|-------------------------|----------------|------------------------------------------|
| GET    | `/api/v1/spaces`        | 200            | Listar con paginación `?page&limit`      |
| GET    | `/api/v1/spaces/:id`    | 200            | Obtener por ID (`:id` validado con Zod)  |
| POST   | `/api/v1/spaces`        | 201            | Crear (validado con `createSpaceSchema`) |
| PUT    | `/api/v1/spaces/:id`    | 200            | Actualizar (validado con `updateSpaceSchema`) |
| DELETE | `/api/v1/spaces/:id`    | 204            | Eliminar                                 |

## Cómo ejecutar

```bash
pnpm install
cp .env.example .env
pnpm dev      # http://localhost:3000
pnpm build    # verifica que compila sin errores TS
```

## Pruebas con curl

```bash
# Crear un space inválido -> 400 con issues
curl -s -X POST http://localhost:3000/api/v1/spaces \
  -H "Content-Type: application/json" \
  -d '{"name":"","capacity":-1}'

# id no numérico -> 400
curl -s http://localhost:3000/api/v1/spaces/abc

# id inexistente -> 404
curl -s http://localhost:3000/api/v1/spaces/999

# ruta inexistente -> 404 JSON
curl -s http://localhost:3000/api/v1/no-existe

# Crear válido -> 201
curl -s -X POST http://localhost:3000/api/v1/spaces \
  -H "Content-Type: application/json" \
  -d '{"name":"Sala Boreal","type":"sala_reunion","capacity":12,"pricePerHour":30}'
```
