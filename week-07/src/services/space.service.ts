import { ISpace } from '../models/space.model';
import * as spaceRepository from '../repositories/space.repository';
import { CreateSpaceDto, UpdateSpaceDto } from '../schemas/space.schema';
import { AppError } from '../errors/AppError';

// ============================================
// SERVICIO DEL RECURSO PRINCIPAL — Space
// ============================================

export async function getAll(): Promise<ISpace[]> {
  return spaceRepository.findAll();
}

export async function getById(id: string): Promise<ISpace> {
  const space = await spaceRepository.findById(id);
  if (!space) throw new AppError(404, 'Espacio no encontrado');
  return space;
}

export async function create(dto: CreateSpaceDto, userId: string): Promise<ISpace> {
  return spaceRepository.create({ ...dto, createdBy: userId });
}

export async function update(id: string, dto: UpdateSpaceDto): Promise<ISpace> {
  // Verifica existencia primero — reutiliza getById, que ya lanza 404
  await getById(id);

  const updated = await spaceRepository.updateById(id, dto);
  if (!updated) throw new AppError(404, 'Espacio no encontrado');
  return updated;
}

export async function remove(id: string): Promise<void> {
  const deleted = await spaceRepository.deleteById(id);
  if (!deleted) throw new AppError(404, 'Espacio no encontrado');
}
