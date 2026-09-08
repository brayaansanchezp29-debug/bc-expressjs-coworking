// ============================================
// REPOSITORY: SpaceCategory
// ============================================

import mongoose from 'mongoose';
import { MongoServerError } from 'mongodb';
import { SpaceCategory, ISpaceCategory } from '../models/spaceCategory.model';
import { AppError } from '../errors/AppError';
import type { CreateSpaceCategoryDto, UpdateSpaceCategoryDto } from '../schemas/spaceCategory.schema';

export async function findAll(): Promise<ISpaceCategory[]> {
  return SpaceCategory.find().sort({ name: 1 }).lean();
}

export async function findById(id: string): Promise<ISpaceCategory> {
  try {
    const category = await SpaceCategory.findById(id).lean();
    if (!category) throw new AppError(404, 'Categoría no encontrada');
    return category;
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      throw new AppError(400, 'ID inválido');
    }
    throw err;
  }
}

export async function create(dto: CreateSpaceCategoryDto): Promise<ISpaceCategory> {
  try {
    const category = await SpaceCategory.create(dto);
    return category.toJSON();
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      throw new AppError(409, 'Ya existe una categoría con ese nombre');
    }
    throw err;
  }
}

export async function update(id: string, dto: UpdateSpaceCategoryDto): Promise<ISpaceCategory> {
  try {
    const category = await SpaceCategory.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    }).lean();
    if (!category) throw new AppError(404, 'Categoría no encontrada');
    return category;
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      throw new AppError(400, 'ID inválido');
    }
    if (err instanceof MongoServerError && err.code === 11000) {
      throw new AppError(409, 'Ya existe una categoría con ese nombre');
    }
    throw err;
  }
}

export async function remove(id: string): Promise<void> {
  try {
    const category = await SpaceCategory.findByIdAndDelete(id).lean();
    if (!category) throw new AppError(404, 'Categoría no encontrada');
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      throw new AppError(400, 'ID inválido');
    }
    throw err;
  }
}
