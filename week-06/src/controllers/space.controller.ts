// ============================================
// CONTROLLER: Space
// ============================================

import { Request, Response, NextFunction } from 'express';
import * as service from '../services/space.service';
import { createSpaceSchema, updateSpaceSchema, objectIdSchema } from '../schemas/space.schema';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 10;
    const search = req.query['search'] as string | undefined;

    const result = await service.getAll(page, limit, search);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = objectIdSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }
    const item = await service.getById(parsedId.data);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createSpaceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Datos de entrada inválidos',
        issues: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      });
      return;
    }
    const item = await service.createSpace(parsed.data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = objectIdSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }
    const parsed = updateSpaceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Datos de entrada inválidos',
        issues: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      });
      return;
    }
    const item = await service.updateSpace(parsedId.data, parsed.data);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = objectIdSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      res.status(400).json({ message: 'ID inválido' });
      return;
    }
    await service.deleteSpace(parsedId.data);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
