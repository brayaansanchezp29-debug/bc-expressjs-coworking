# Semana 01 — Procesador de Datos de Espacios de Coworking

## Dominio: Coworking Space

Este proyecto adapta el "Procesador de Datos" de la Semana 01 al dominio de un
espacio de **coworking**. El recurso principal es `Space`, que representa un
espacio reservable dentro del coworking (sala de reuniones, oficina privada,
escritorio flexible o cabina de llamadas).

## Recurso: `Space`

| Campo    | Tipo    | Descripción                                            |
|----------|---------|---------------------------------------------------------|
| id       | string  | Identificador único del espacio                        |
| name     | string  | Nombre del espacio                                      |
| category | string  | Tipo de espacio (`sala_reunion`, `oficina_privada`, `escritorio_flexible`, `cabina_llamadas`) |
| price    | number  | Precio por hora en USD                                  |
| capacity | number  | Aforo máximo del espacio                                |
| active   | boolean | Si el espacio está actualmente disponible para reservar |

## Cómo ejecutar

```bash
pnpm install
pnpm dev                          # sin filtro — muestra todos los espacios
pnpm dev -- --category sala_reunion   # filtrado por categoría
pnpm build                        # verifica que compila sin errores TS
```

El reporte generado se guarda en `output/report.json`.

## Funcionalidades implementadas

- Lectura asíncrona de `data/spaces.json` con `fs/promises`.
- Resumen con total, activos/inactivos, precio promedio, más caro y más
  económico.
- Filtro por categoría vía `--category`.
- Generación de reporte en `output/report.json`.
- Manejo de errores: archivo inexistente y categoría inexistente (con listado
  de categorías disponibles).
