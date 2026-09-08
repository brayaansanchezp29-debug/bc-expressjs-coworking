import * as repo from '../repositories/spaceCategory.repository';
import type { CreateSpaceCategoryDto, UpdateSpaceCategoryDto } from '../schemas/spaceCategory.schema';

export async function getAll() {
  return repo.findAll();
}

export async function getById(id: string) {
  return repo.findById(id);
}

export async function createCategory(dto: CreateSpaceCategoryDto) {
  return repo.create(dto);
}

export async function updateCategory(id: string, dto: UpdateSpaceCategoryDto) {
  return repo.update(id, dto);
}

export async function deleteCategory(id: string) {
  return repo.remove(id);
}
