import { Request, Response, NextFunction } from 'express';
import * as spaceService from '../services/space.service.js';
import { createSpaceSchema, updateSpaceSchema } from '../schemas/space.schema.js';
import { AppError } from '../errors/AppError.js';

// ============================================
// Dominio: Coworking Space
// ============================================

export async function getSpaces(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const spaces = await spaceService.findAll();
    res.json({ data: spaces, total: spaces.length });
  } catch (err) {
    next(err);
  }
}

export async function getSpaceById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const space = await spaceService.findById(req.params.id);
    if (!space) throw new AppError(404, 'Space not found');
    res.json({ data: space });
  } catch (err) {
    next(err);
  }
}

export async function createSpace(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'Not authenticated');

    const { body } = createSpaceSchema.parse({ body: req.body });
    const space = await spaceService.create(body, req.user.sub);
    res.status(201).json({ message: 'Space created', data: space });
  } catch (err) {
    next(err);
  }
}

export async function updateSpace(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'Not authenticated');

    const { body } = updateSpaceSchema.parse({ body: req.body });
    const space = await spaceService.update(
      req.params.id,
      body,
      req.user.sub,
      req.user.role as string
    );

    if (!space) throw new AppError(404, 'Space not found');
    res.json({ message: 'Space updated', data: space });
  } catch (err) {
    if (err instanceof Error && err.message === 'FORBIDDEN') {
      return next(new AppError(403, 'You can only update your own resources'));
    }
    next(err);
  }
}

export async function deleteSpace(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const space = await spaceService.remove(req.params.id);
    if (!space) throw new AppError(404, 'Space not found');
    res.json({ message: 'Space deleted' });
  } catch (err) {
    next(err);
  }
}
