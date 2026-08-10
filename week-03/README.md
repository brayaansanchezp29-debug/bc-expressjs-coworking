# Semana 03 — API REST con Arquitectura en Capas (Coworking Spaces)

## Dominio: Coworking Space

API REST del recurso `Space`, construida con arquitectura en 4 capas:

```
routes → controllers → services → repositories
```

## Recurso: `Space`

| Campo        | Tipo    | Descripción                                                        |
|--------------|---------|-----------------------------------------------------------------------|
| id           | number  | Identificador autoincremental                                       |
| name         | string  | Nombre del espacio                                                   |
| type         | string  | `sala_reunion` \| `oficina_privada` \| `escritorio_flexible` \| `cabina_llamadas` |
| capacity     | number  | Aforo máximo                                                         |
| pricePerHour | number  | Precio por hora en USD                                               |
| available    | boolean | Si el espacio está disponible para reservar                          |
| createdAt    | string  | Fecha de creación (ISO)                                              |

## Arquitectura

- **`repositories/spaces.repository.ts`** — único punto de acceso al store en
  memoria. Todos los métodos `async`, retorna copias defensivas y
  `undefined` cuando no encuentra un recurso.
- **`services/spaces.service.ts`** — sin imports de Express. Contiene la
  paginación (`findAll`) y las reglas de negocio del dominio: `pricePerHour`
  debe ser mayor a 0, `capacity` debe ser al menos 1.
- **`controllers/spaces.controller.ts`** — thin controllers: extraer → llamar
  service → responder. Traduce `undefined`/`false` del service a `404`.
- **`routes/spaces.routes.ts`** — solo mapea URL + método HTTP → función del
  controller.

## Endpoints

| Método | Ruta                    | Status exitoso | Descripción                          |
|--------|-------------------------|----------------|----------------------------------------|
| GET    | `/api/v1/spaces`        | 200            | Listar con paginación `?page&limit`   |
| GET    | `/api/v1/spaces/:id`    | 200            | Obtener por ID                        |
| POST   | `/api/v1/spaces`        | 201            | Crear nuevo espacio                   |
| PUT    | `/api/v1/spaces/:id`    | 200            | Actualizar espacio existente          |
| DELETE | `/api/v1/spaces/:id`    | 204            | Eliminar espacio                      |

## Contratos de respuesta

```json
// GET /spaces?page=1&limit=5 → 200
{ "data": [...], "total": 4, "page": 1, "limit": 5 }

// GET /spaces/1 → 200
{ "data": { "id": 1, "name": "Sala Ártico", ... } }

// POST /spaces → 201
{ "data": { "id": 5, ... } }

// GET /spaces/999 → 404
{ "error": "Not Found", "message": "Space 999 not found" }
```

## Cómo ejecutar

```bash
pnpm install
cp .env.example .env
pnpm dev      # http://localhost:3000
pnpm build    # verifica que compila sin errores TS
```

## Pruebas con curl

```bash
curl "http://localhost:3000/api/v1/spaces?page=1&limit=2"

curl -X POST http://localhost:3000/api/v1/spaces \
  -H "Content-Type: application/json" \
  -d '{"name":"Sala Boreal","type":"sala_reunion","capacity":12,"pricePerHour":30,"available":true}'

curl http://localhost:3000/api/v1/spaces/1

curl -X PUT http://localhost:3000/api/v1/spaces/1 \
  -H "Content-Type: application/json" \
  -d '{"pricePerHour":28}'

curl -X DELETE http://localhost:3000/api/v1/spaces/1

curl http://localhost:3000/api/v1/spaces/999   # 404
```
