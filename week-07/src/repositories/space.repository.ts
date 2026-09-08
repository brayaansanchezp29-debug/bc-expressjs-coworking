import { SpaceModel, ISpace } from '../models/space.model';
import { CreateSpaceDto, UpdateSpaceDto } from '../schemas/space.schema';

// ============================================
// REPOSITORIO DEL RECURSO PRINCIPAL — Space
// ============================================

export async function findAll(): Promise<ISpace[]> {
  return SpaceModel.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
}

export async function findById(id: string): Promise<ISpace | null> {
  return SpaceModel.findById(id).populate('createdBy', 'name email');
}

export async function create(data: CreateSpaceDto & { createdBy: string }): Promise<ISpace> {
  return SpaceModel.create(data);
}

export async function updateById(id: string, data: UpdateSpaceDto): Promise<ISpace | null> {
  return SpaceModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('createdBy', 'name email');
}

export async function deleteById(id: string): Promise<boolean> {
  const deleted = await SpaceModel.findByIdAndDelete(id);
  return deleted !== null;
}
