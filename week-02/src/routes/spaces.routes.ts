import { Router } from 'express';
import * as store from '../store.js';
import type { CreateSpaceDto, UpdateSpaceDto } from '../types.js';

export const spacesRouter = Router();

const REQUIRED_FIELDS: Array<keyof CreateSpaceDto> = [
  'name',
  'type',
  'capacity',
  'pricePerHour',
  'floor',
  'available',
];

function getMissingFields(body: Record<string, unknown>): string[] {
  return REQUIRED_FIELDS.filter((field) => body[field] === undefined);
}

// GET /api/v1/spaces — Listar todos los espacios
spacesRouter.get('/', (_req, res) => {
  res.status(200).json(store.getAll());
});

// GET /api/v1/spaces/:id — Obtener espacio por ID
spacesRouter.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const space = store.getById(id);

  if (!space) {
    res.status(404).json({ error: `Space with id ${id} not found` });
    return;
  }

  res.status(200).json(space);
});

// POST /api/v1/spaces — Crear nuevo espacio
spacesRouter.post('/', (req, res) => {
  const missing = getMissingFields(req.body ?? {});
  if (missing.length > 0) {
    res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    return;
  }

  const dto: CreateSpaceDto = req.body;
  const newSpace = store.create(dto);
  res.status(201).json(newSpace);
});

// PUT /api/v1/spaces/:id — Actualizar espacio completo
spacesRouter.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const dto: UpdateSpaceDto = req.body ?? {};

  const updated = store.update(id, dto);
  if (!updated) {
    res.status(404).json({ error: `Space with id ${id} not found` });
    return;
  }

  res.status(200).json(updated);
});

// DELETE /api/v1/spaces/:id — Eliminar espacio
spacesRouter.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const removed = store.remove(id);

  if (!removed) {
    res.status(404).json({ error: `Space with id ${id} not found` });
    return;
  }

  res.status(204).send();
});
