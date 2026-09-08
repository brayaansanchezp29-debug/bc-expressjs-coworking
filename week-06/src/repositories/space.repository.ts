// ============================================
// REPOSITORY: Space (con populate a category)
// ============================================

import mongoose from 'mongoose';
import { MongoServerError } from 'mongodb';
import { Space, ISpace } from '../models/space.model';
import { AppError } from '../errors/AppError';
import type { CreateSpaceDto, UpdateSpaceDto } from '../schemas/space.schema';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export async function findAll(
  page: number,
  limit: number,
  search?: string,
): Promise<PaginatedResult<ISpace>> {
  const skip = (page - 1) * limit;
  const filter = search ? { name: { $regex: search, $options: 'i' } } : {};

  const [data, total] = await Promise.all([
    Space.find(filter)
      .populate('category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Space.countDocuments(filter),
  ]);

  return { data, total, page, totalPages: Math.ceil(total / limit) };
}

export async function findById(id: string): Promise<ISpace> {
  try {
    const space = await Space.findById(id).populate('category').lean();
    if (!space) throw new AppError(404, 'Espacio no encontrado');
    return space;
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      throw new AppError(400, 'ID inválido');
    }
    throw err;
  }
}

export async function create(dto: CreateSpaceDto): Promise<ISpace> {
  try {
    const space = await Space.create(dto);
    return space.toJSON();
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      throw new AppError(400, 'ID de categoría inválido');
    }
    if (err instanceof MongoServerError && err.code === 11000) {
      throw new AppError(409, 'Ya existe un espacio con ese código');
    }
    throw err;
  }
}

export async function update(id: string, dto: UpdateSpaceDto): Promise<ISpace> {
  try {
    const space = await Space.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    })
      .populate('category')
      .lean();
    if (!space) throw new AppError(404, 'Espacio no encontrado');
    return space;
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      throw new AppError(400, 'ID inválido');
    }
    if (err instanceof MongoServerError && err.code === 11000) {
      throw new AppError(409, 'Ya existe un espacio con ese código');
    }
    throw err;
  }
}

export async function remove(id: string): Promise<void> {
  try {
    const space = await Space.findByIdAndDelete(id).lean();
    if (!space) throw new AppError(404, 'Espacio no encontrado');
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      throw new AppError(400, 'ID inválido');
    }
    throw err;
  }
}
