# Coworking API — Bootcamp Express.js

Repositorio de entregas del [Bootcamp de Express.js](https://github.com/ergrato-dev/bc-expressjs).
Cada semana se desarrolla un proyecto distinto aplicado a mi dominio asignado:
**Coworking Space**.

Cada semana vive en su propia rama (`week-01`, `week-02`, ..., `week-16`), partiendo
siempre desde `main`. Esta rama (`main`) solo contiene la documentación general
del progreso.

## 🏢 Dominio: Coworking Space

Plataforma para gestionar un espacio de coworking: sus espacios reservables,
los miembros que los usan, las reservas que hacen y los servicios adicionales
que pueden contratar.

### Entidades

| Entidad    | Descripción                                                        |
|------------|---------------------------------------------------------------------|
| `spaces`   | Espacios reservables (salas de reunión, oficinas privadas, escritorios flexibles, cabinas de llamadas) |
| `members`  | Miembros/usuarios registrados en el coworking                       |
| `bookings` | Reservas hechas por un miembro sobre un espacio                     |
| `services` | Servicios adicionales contratables (café, impresión, parqueadero, etc.) |

> Las entidades se van incorporando progresivamente a medida que el bootcamp
> lo requiere (relaciones, autenticación, base de datos, etc.). El detalle de
> qué entidad se usa en cada semana está en la tabla de progreso.

## 🛠️ Stack

- Node.js + TypeScript
- Express.js
- Zod (validación) · Winston + Morgan (logging)
- PostgreSQL + Prisma ORM (desde semana 05)
- MongoDB + Mongoose (desde semana 06)
- Autenticación JWT (access/refresh) + bcrypt (desde semana 07)

## 📅 Progreso semanal

| Semana | Tema | Rama | Estado |
|--------|------|------|--------|
| 01 | Node.js Fundamentals | [`week-01`](https://github.com/brayaansanchezp29-debug/bc-expressjs-coworking/tree/week-01) | ✅ |
| 02 | Express Intro (CRUD API) | [`week-02`](https://github.com/brayaansanchezp29-debug/bc-expressjs-coworking/tree/week-02) | ✅ |
| 03 | REST API y Arquitectura | [`week-03`](https://github.com/brayaansanchezp29-debug/bc-expressjs-coworking/tree/week-03) | ✅ |
| 04 | Validación y Error Handling | [`week-04`](https://github.com/brayaansanchezp29-debug/bc-expressjs-coworking/tree/week-04) | ✅ |
| 05 | PostgreSQL + Prisma | [`week-05`](https://github.com/brayaansanchezp29-debug/bc-expressjs-coworking/tree/week-05) | ✅ |
| 06 | MongoDB + Mongoose | [`week-06`](https://github.com/brayaansanchezp29-debug/bc-expressjs-coworking/tree/week-06) | ✅ |
| 07 | Autenticación JWT | [`week-07`](https://github.com/brayaansanchezp29-debug/bc-expressjs-coworking/tree/week-07) | ✅ |
| 08 | Autorización y Seguridad | `week-08` | ⏳ |
| 09 | Testing | `week-09` | ⏳ |
| 10 | Uploads y Emails | `week-10` | ⏳ |
| 11 | WebSockets | `week-11` | ⏳ |
| 12 | Caching y Performance | `week-12` | ⏳ |
| 13 | OpenAPI / Swagger | `week-13` | ⏳ |
| 14 | Docker | `week-14` | ⏳ |
| 15 | CI/CD y Deployment | `week-15` | ⏳ |
| 16 | Proyecto Final | `week-16` | ⏳ |

> ✅ Entregado &nbsp;·&nbsp; ⏳ Pendiente

## 📂 Cómo navegar el repositorio

Cada rama `week-NN` es independiente y contiene su propio proyecto completo
(código + README con instrucciones para correrlo):

```bash
git checkout week-01   # ver/correr el proyecto de la semana 1
git checkout week-05   # ver/correr el proyecto de la semana 5
```

## 👤 Autor

Entregas del Bootcamp de Express.js — dominio Coworking Space.

Brayan Sanchez — 3228973B — dominio Coworking Space.