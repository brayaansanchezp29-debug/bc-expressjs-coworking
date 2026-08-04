# Semana 02 — API CRUD de Espacios de Coworking

## Dominio: Coworking Space

API REST con Express 5 + TypeScript para gestionar los espacios reservables
de un coworking (`Space`). Store en memoria, sin base de datos (se agrega a
partir de la semana 05).

## Recurso: `Space`

| Campo        | Tipo    | Descripción                                                        |
|--------------|---------|---------------------------------------------------------------------|
| id           | number  | Identificador autoincremental                                       |
| name         | string  | Nombre del espacio                                                   |
| type         | string  | `sala_reunion` \| `oficina_privada` \| `escritorio_flexible` \| `cabina_llamadas` |
| capacity     | number  | Aforo máximo                                                         |
| pricePerHour | number  | Precio por hora en USD                                               |
| floor        | number  | Piso donde está ubicado                                              |
| available    | boolean | Si el espacio está disponible para reservar                          |

## Endpoints

| Método | Ruta                    | Descripción                  | Status      |
|--------|-------------------------|-------------------------------|-------------|
| GET    | `/api/v1/spaces`        | Listar todos los espacios     | 200         |
| GET    | `/api/v1/spaces/:id`    | Obtener espacio por ID        | 200 / 404   |
| POST   | `/api/v1/spaces`        | Crear un nuevo espacio        | 201 / 400   |
| PUT    | `/api/v1/spaces/:id`    | Actualizar espacio completo   | 200 / 404   |
| DELETE | `/api/v1/spaces/:id`    | Eliminar espacio              | 204 / 404   |

## Cómo ejecutar

```bash
pnpm install
cp .env.example .env
pnpm dev      # levanta en http://localhost:3000
pnpm build    # verifica que compila sin errores TS
```

## Pruebas con curl

```bash
curl http://localhost:3000/api/v1/spaces

curl -X POST http://localhost:3000/api/v1/spaces \
  -H "Content-Type: application/json" \
  -d '{"name":"Sala Boreal","type":"sala_reunion","capacity":12,"pricePerHour":30,"floor":2,"available":true}'

curl http://localhost:3000/api/v1/spaces/1

curl -X PUT http://localhost:3000/api/v1/spaces/1 \
  -H "Content-Type: application/json" \
  -d '{"pricePerHour":28}'

curl -X DELETE http://localhost:3000/api/v1/spaces/1
```

## Middlewares

1. `express.json()` — parseo de body
2. Logger personalizado — método, URL, status y duración
3. Rutas de `spaces`
4. Handler 404
5. Error handler global (4 parámetros)

## Decisiones de diseño

- Validación básica en `POST`: si falta algún campo requerido, retorna `400`.
- `PUT` permite actualización parcial usando `UpdateSpaceDto` (`Partial`).
- Graceful shutdown ante `SIGTERM`/`SIGINT` en `server.ts`.
