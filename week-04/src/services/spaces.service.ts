// ============================================
// SERVICE — lógica de negocio
// ============================================
import { Space, PaginatedResponse } from '../types';
import * as repo from '../repositories/spaces.repository';
import { AppError } from '../errors/AppError';

interface FindAllOptions {
  page: number;
  limit: number;
}

export async function findAll(opts: FindAllOptions): Promise<PaginatedResponse<Space>> {
  const { page, limit } = opts;
  const all = await repo.findAll();
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);
  return { data, total: all.length, page, limit };
}

export async function findById(id: number): Promise<Space> {
  const space = await repo.findById(id);
  if (!space) throw new AppError(404, `Space ${id} not found`);
  return space;
}

export async function create(dto: repo.CreateSpaceRepoDto): Promise<Space> {
  return repo.create(dto);
}

export async function update(id: number, dto: repo.UpdateSpaceRepoDto): Promise<Space> {
  const exists = await repo.findById(id);
  if (!exists) throw new AppError(404, `Space ${id} not found`);

  const updated = await repo.update(id, dto);
  return updated!;
}

export async function remove(id: number): Promise<void> {
  const exists = await repo.findById(id);
  if (!exists) throw new AppError(404, `Space ${id} not found`);

  await repo.remove(id);
}
