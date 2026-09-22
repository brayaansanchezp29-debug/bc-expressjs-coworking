import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import * as spacesService from '../services/space.service.js';
import { createSpaceSchema, updateSpaceSchema, spaceIdSchema } from '../validators/space.schema.js';

export async function getAllHandler(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const spaces = await spacesService.getAll();
    res.status(200).json({ data: spaces, total: spaces.length });
  } catch (err) {
    next(err);
  }
}

export async function getByIdHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { params } = spaceIdSchema.parse({ params: req.params });
    const space = await spacesService.getById(params.id);
    res.status(200).json({ data: space });
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
}

export async function createHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = createSpaceSchema.parse({ body: req.body });
    const user = res.locals['user'] as { sub: string };
    const space = await spacesService.create(body, user.sub);
    res.status(201).json({ data: space });
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
}

export async function updateHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { params } = spaceIdSchema.parse({ params: req.params });
    const { body } = updateSpaceSchema.parse({ body: req.body });
    const user = res.locals['user'] as { sub: string; role: string };
    const space = await spacesService.update(params.id, body, user.sub, user.role);
    res.status(200).json({ data: space });
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
}

export async function deleteHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { params } = spaceIdSchema.parse({ params: req.params });
    const user = res.locals['user'] as { sub: string; role: string };
    await spacesService.remove(params.id, user.sub, user.role);
    res.status(204).send();
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
}
