// src/controllers/spaces.controller.ts — Capa HTTP

import { Request, Response, NextFunction } from 'express';
import * as service from '../services/spaces.service';
import { createSpaceSchema, updateSpaceSchema } from '../schemas/spaces.schema';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query['page'] as string, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query['limit'] as string, 10) || 10));

    const result = await service.listSpaces(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params['id'] as string, 10);
    const space = await service.getSpace(id);
    res.json({ data: space });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createSpaceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        status: 'error',
        message: 'Datos de entrada inválidos',
        issues: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      });
      return;
    }

    const space = await service.createSpace(parsed.data);
    res.status(201).json({ data: space });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params['id'] as string, 10);
    const parsed = updateSpaceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        status: 'error',
        message: 'Datos de entrada inválidos',
        issues: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      });
      return;
    }

    const space = await service.updateSpace(id, parsed.data);
    res.json({ data: space });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params['id'] as string, 10);
    await service.deleteSpace(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
