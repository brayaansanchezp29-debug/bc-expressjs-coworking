// src/services/spaces.service.ts — Lógica de negocio

import * as repo from '../repositories/spaces.repository';
import { AppError } from '../errors/AppError';
import { CreateSpaceDto, UpdateSpaceDto } from '../schemas/spaces.schema';

export async function listSpaces(page: number, limit: number) {
  return repo.findAll(page, limit);
}

export async function getSpace(id: number) {
  const space = await repo.findById(id);
  if (!space) {
    throw new AppError(404, 'Espacio no encontrado');
  }
  return space;
}

export async function createSpace(data: CreateSpaceDto) {
  return repo.create(data);
}

export async function updateSpace(id: number, data: UpdateSpaceDto) {
  return repo.update(id, data);
}

export async function deleteSpace(id: number): Promise<void> {
  await repo.remove(id);
}
