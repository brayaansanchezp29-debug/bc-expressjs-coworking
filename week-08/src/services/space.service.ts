import { Space, ISpace } from '../models/space.model.js';
import type { CreateSpaceDto, UpdateSpaceDto } from '../schemas/space.schema.js';

// ============================================
// Dominio: Coworking Space
// ============================================

export async function findAll(): Promise<ISpace[]> {
  return Space.find().sort({ createdAt: -1 });
}

export async function findById(id: string): Promise<ISpace | null> {
  return Space.findById(id);
}

export async function create(data: CreateSpaceDto, userId: string): Promise<ISpace> {
  // createdBy guarda quién creó el espacio (usado en update para autorización)
  return Space.create({ ...data, createdBy: userId });
}

export async function update(
  id: string,
  data: UpdateSpaceDto,
  requesterId: string,
  requesterRole: string
): Promise<ISpace | null> {
  const space = await Space.findById(id);
  if (!space) return null;

  // Un usuario solo puede editar SU espacio; admin puede editar cualquiera
  if (requesterRole !== 'admin' && space.createdBy !== requesterId) {
    throw new Error('FORBIDDEN'); // capturado en el controller → AppError(403)
  }

  return Space.findByIdAndUpdate(id, data, { new: true });
}

export async function remove(id: string): Promise<ISpace | null> {
  // Eliminación: solo admin — enforced en space.routes.ts con requireRole('admin')
  return Space.findByIdAndDelete(id);
}
