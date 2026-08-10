// ============================================
// CONTROLLER — Interfaz HTTP
// ============================================
// Exactamente 3 pasos: extraer → llamar service → responder.
// Sin lógica de negocio. Maneja 404 cuando el service retorna undefined/false.

import { Request, Response, NextFunction } from 'express';
import * as service from '../services/spaces.service';
import { CreateSpaceDto, UpdateSpaceDto, ErrorResponse } from '../types';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Paso 1 — extraer
    const page = parseInt(req.query['page'] as string, 10) || 1;
    const limit = parseInt(req.query['limit'] as string, 10) || 10;

    // Paso 2 — llamar service
    const result = await service.findAll({ page, limit });

    // Paso 3 — responder
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Paso 1 — extraer
    const id = parseInt(req.params['id'] as string, 10);

    // Paso 2 — llamar service
    const space = await service.findById(id);

    // Paso 3 — responder
    if (!space) {
      const response: ErrorResponse = { error: 'Not Found', message: `Space ${id} not found` };
      res.status(404).json(response);
      return;
    }
    res.json({ data: space });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Paso 1 — extraer
    const dto: CreateSpaceDto = req.body;

    // Paso 2 — llamar service
    const space = await service.create(dto);

    // Paso 3 — responder
    res.status(201).json({ data: space });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Paso 1 — extraer
    const id = parseInt(req.params['id'] as string, 10);
    const dto: UpdateSpaceDto = req.body;

    // Paso 2 — llamar service
    const space = await service.update(id, dto);

    // Paso 3 — responder
    if (!space) {
      const response: ErrorResponse = { error: 'Not Found', message: `Space ${id} not found` };
      res.status(404).json(response);
      return;
    }
    res.json({ data: space });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Paso 1 — extraer
    const id = parseInt(req.params['id'] as string, 10);

    // Paso 2 — llamar service
    const wasRemoved = await service.remove(id);

    // Paso 3 — responder
    if (!wasRemoved) {
      const response: ErrorResponse = { error: 'Not Found', message: `Space ${id} not found` };
      res.status(404).json(response);
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
