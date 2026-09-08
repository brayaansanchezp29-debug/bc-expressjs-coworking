import * as repo from '../repositories/space.repository';
import type { CreateSpaceDto, UpdateSpaceDto } from '../schemas/space.schema';

export async function getAll(page: number, limit: number, search?: string) {
  return repo.findAll(page, limit, search);
}

export async function getById(id: string) {
  return repo.findById(id);
}

export async function createSpace(dto: CreateSpaceDto) {
  return repo.create(dto);
}

export async function updateSpace(id: string, dto: UpdateSpaceDto) {
  return repo.update(id, dto);
}

export async function deleteSpace(id: string) {
  return repo.remove(id);
}
