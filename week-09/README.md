# Semana 09 — Testing de API REST (Coworking Spaces)

## Dominio: Coworking Space

Suite completa de tests con Jest + Supertest + MongoDB Memory Server para
la API del recurso `Space`, con cobertura ≥ 80% configurada en
`jest.config.ts`.

## ⚠️ 2 bugs reales del starter oficial, corregidos

1. **`jest.config.ts` sin `moduleNameMapper`** — todo el código fuente usa
   imports relativos con extensión `.js` (estilo ESM: `from
   '../errors/AppError.js'`), pero el proyecto compila a CommonJS. El
   resolvedor de módulos de Jest (a diferencia de `tsc`, que sí lo tolera)
   **no** mapea automáticamente `.js` → `.ts`, así que **cada test suite**
   fallaba con `Cannot find module './archivo.js'` antes de correr un solo
   test. Se agregó:
   ```ts
   moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' }
   ```
2. **`auth.service.ts` no compilaba** — `user as Record<string, unknown>`
   falla en TypeScript strict porque `IUser` (de Mongoose) no tiene un
   índice de tipo `string`. Se corrigió a
   `user as unknown as Record<string, unknown>`, tal como TypeScript
   sugiere en su propio mensaje de error.

Ambos bugs son del starter oficial (verificado comparando línea por línea),
no de la adaptación al dominio.

## Estructura de tests

| Archivo | Tipo | Qué prueba |
|---------|------|------------|
| `__tests__/auth.service.test.ts` | Unit | `auth.service.ts` con `users.repository` mockeado |
| `__tests__/space.service.test.ts` | Unit | `space.service.ts` con `space.repository` mockeado |
| `__tests__/space.routes.test.ts` | Integration | Rutas HTTP completas con Supertest + MongoDB en memoria |

### Unit tests (19 tests, mocks — **verificados, todos pasan**)

- `auth.service`: registro exitoso, email duplicado (409), login con
  usuario inexistente (401), contraseña incorrecta (401), login exitoso,
  verificación de argumentos con `toHaveBeenCalledWith`.
- `space.service`: `getAll` (con y sin datos), `getById` (happy path y
  404), `create` (happy path y 409 por código duplicado), `update` (dueño,
  403 sin permiso, 404), `remove` (admin, 403 sin permiso, 404).

### Integration tests (Supertest + `mongodb-memory-server`)

- `GET /api/v1/spaces` → 200 con array vacío inicialmente
- `POST /api/v1/spaces` → 201 válido / 401 sin token / 422 datos inválidos
- `GET /api/v1/spaces/:id` → 200 existente / 404 inexistente
- `PUT /api/v1/spaces/:id` → 200 dueño / 403 no-dueño
- `DELETE /api/v1/spaces/:id` → 204 dueño / 403 no-dueño-no-admin / 204 admin

`afterEach` limpia todas las colecciones entre tests; `beforeAll`/`afterAll`
levantan y apagan el servidor de Mongo en memoria.

## Cómo ejecutar

```bash
pnpm install
pnpm test              # todos los tests
pnpm test:watch        # modo watch
pnpm test:coverage     # reporte de cobertura → coverage/index.html
```

> **Primera vez:** `mongodb-memory-server` descarga el binario real de
> MongoDB la primera vez que corres los integration tests (~1-2 minutos).
> Las siguientes veces usa la copia en caché y es instantáneo.

## Nota sobre verificación

Los **19 unit tests** (`auth.service.test.ts` + `space.service.test.ts`)
fueron ejecutados y confirmados pasando durante el desarrollo. Los
**integration tests** (`space.routes.test.ts`) siguen exactamente el patrón
oficial del ejercicio 02 del bootcamp, pero no pude ejecutarlos yo mismo
por una restricción de red de mi entorno (sin acceso a
`fastdl.mongodb.org`, de donde `mongodb-memory-server` descarga el binario).
Corre `pnpm test` en tu máquina para confirmarlos — si algo falla, es fácil
de ajustar.
