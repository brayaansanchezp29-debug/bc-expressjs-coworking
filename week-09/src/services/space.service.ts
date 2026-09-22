import { AppError } from '../errors/AppError.js';
import type { CreateSpaceDto, UpdateSpaceDto } from '../types/index.js';
import type { ISpace } from '../models/space.model.js';
import * as spacesRepo from '../repositories/space.repository.js';

// ============================================================
// SPACES SERVICE — lógica de negocio del dominio Coworking Space
// ============================================================

function isDuplicateKeyError(err: unknown): boolean {
  return typeof err === 'object' && err !== null && (err as { code?: unknown }).code === 11000;
}

export async function getAll(createdBy?: string): Promise<ISpace[]> {
  return spacesRepo.findAllSpaces(createdBy);
}

export async function getById(id: string): Promise<ISpace> {
  const space = await spacesRepo.findSpaceById(id);
  if (!space) throw new AppError(404, 'Space not found');
  return space;
}

export async function create(dto: CreateSpaceDto, createdBy: string): Promise<ISpace> {
  try {
    return await spacesRepo.createSpace(dto, createdBy);
  } catch (err) {
    // El índice único de `code` en Mongo lanza un error con code 11000
    if (isDuplicateKeyError(err)) {
      throw new AppError(409, 'A space with this code already exists');
    }
    throw err;
  }
}

export async function update(
  id: string,
  dto: UpdateSpaceDto,
  requesterId: string,
  requesterRole: string
): Promise<ISpace> {
  const existing = await spacesRepo.findSpaceById(id);
  if (!existing) throw new AppError(404, 'Space not found');

  // Solo el creador o un admin puede actualizar
  if (existing.createdBy !== requesterId && requesterRole !== 'admin') {
    throw new AppError(403, 'Insufficient permissions');
  }

  try {
    const updated = await spacesRepo.updateSpace(id, dto);
    if (!updated) throw new AppError(404, 'Space not found');
    return updated;
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      throw new AppError(409, 'A space with this code already exists');
    }
    throw err;
  }
}

export async function remove(id: string, requesterId: string, requesterRole: string): Promise<void> {
  const existing = await spacesRepo.findSpaceById(id);
  if (!existing) throw new AppError(404, 'Space not found');

  // Solo el creador o un admin puede eliminar
  if (existing.createdBy !== requesterId && requesterRole !== 'admin') {
    throw new AppError(403, 'Insufficient permissions');
  }

  await spacesRepo.deleteSpace(id);
}
