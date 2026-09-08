// ============================================
// CONTROLLER: SpaceCategory
// ============================================

import { Request, Response, NextFunction } from 'express';
import * as service from '../services/spaceCategory.service';
import {
  createSpaceCategorySchema,
  updateSpaceCategorySchema,
} from '../schemas/spaceCategory.schema';
import { objectIdSchema } from '../schemas/space.schema';

export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const items = await service.getAll();
    res.json(items);
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
    const parsed = createSpaceCategorySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Datos de entrada inválidos',
        issues: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      });
      return;
    }
    const item = await service.createCategory(parsed.data);
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
    const parsed = updateSpaceCategorySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Datos de entrada inválidos',
        issues: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      });
      return;
    }
    const item = await service.updateCategory(parsedId.data, parsed.data);
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
    await service.deleteCategory(parsedId.data);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
