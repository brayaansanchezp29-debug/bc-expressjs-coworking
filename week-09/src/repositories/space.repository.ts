import { SpaceModel, type ISpace } from '../models/space.model.js';
import type { CreateSpaceDto, UpdateSpaceDto } from '../types/index.js';

// ============================================================
// REPOSITORIO DE SPACES — capa de acceso a datos
// ============================================================
// En los unit tests, ESTE módulo se mockea con jest.mock().
// En los integration tests, accede a MongoDB Memory Server.
// ============================================================

export async function findAllSpaces(createdBy?: string): Promise<ISpace[]> {
  const filter = createdBy ? { createdBy } : {};
  return SpaceModel.find(filter).lean<ISpace[]>().exec();
}

export async function findSpaceById(id: string): Promise<ISpace | null> {
  return SpaceModel.findById(id).lean<ISpace>().exec();
}

export async function createSpace(dto: CreateSpaceDto, createdBy: string): Promise<ISpace> {
  const space = new SpaceModel({ ...dto, createdBy });
  return space.save() as unknown as ISpace;
}

export async function updateSpace(id: string, dto: UpdateSpaceDto): Promise<ISpace | null> {
  return SpaceModel.findByIdAndUpdate(id, dto, { new: true }).lean<ISpace>().exec();
}

export async function deleteSpace(id: string): Promise<ISpace | null> {
  return SpaceModel.findByIdAndDelete(id).lean<ISpace>().exec();
}
