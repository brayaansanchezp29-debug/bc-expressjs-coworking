// ============================================
// SERVICE — Lógica de negocio
// ============================================
// Cero imports de Express. Contiene paginación y validaciones de dominio.
// Retorna undefined cuando no encuentra; el controller maneja el 404.

import { CreateSpaceDto, UpdateSpaceDto, Space, PaginatedResponse, PaginationParams } from '../types';
import * as repo from '../repositories/spaces.repository';

export async function findAll(params: PaginationParams): Promise<PaginatedResponse<Space>> {
  const { page, limit } = params;
  const all = await repo.findAll();
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);
  return { data, total: all.length, page, limit };
}

export async function findById(id: number): Promise<Space | undefined> {
  return repo.findById(id);
}

export async function create(dto: CreateSpaceDto): Promise<Space> {
  // Regla de negocio: el precio por hora no puede ser negativo ni cero
  if (dto.pricePerHour <= 0) {
    throw new Error('pricePerHour must be greater than 0');
  }
  // Regla de negocio: la capacidad debe ser al menos 1 persona
  if (dto.capacity < 1) {
    throw new Error('capacity must be at least 1');
  }

  return repo.create(dto);
}

export async function update(id: number, dto: UpdateSpaceDto): Promise<Space | undefined> {
  const exists = await repo.findById(id);
  if (!exists) return undefined;

  if (dto.pricePerHour !== undefined && dto.pricePerHour <= 0) {
    throw new Error('pricePerHour must be greater than 0');
  }
  if (dto.capacity !== undefined && dto.capacity < 1) {
    throw new Error('capacity must be at least 1');
  }

  return repo.update(id, dto);
}

export async function remove(id: number): Promise<boolean> {
  const exists = await repo.findById(id);
  if (!exists) return false;

  return repo.remove(id);
}
