import { Request, Response, NextFunction } from 'express';
import * as spaceService from '../services/space.service';
import { createSpaceSchema, updateSpaceSchema } from '../schemas/space.schema';

// ============================================
// CONTROLADOR DEL RECURSO PRINCIPAL — Space
// ============================================

export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const spaces = await spaceService.getAll();
    res.status(200).json(spaces);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const space = await spaceService.getById(id);
    res.status(200).json(space);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = createSpaceSchema.parse(req.body);
    const userId = req.user!.sub;
    const space = await spaceService.create(dto, userId);
    res.status(201).json(space);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = updateSpaceSchema.parse(req.body);
    const id = req.params.id as string;
    const space = await spaceService.update(id, dto);
    res.status(200).json(space);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    await spaceService.remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
