// src/repositories/spaces.repository.ts — Acceso a datos con Prisma

import { Prisma, Space } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prisma } from '../lib/prisma';
import { AppError } from '../errors/AppError';
import { CreateSpaceDto, UpdateSpaceDto } from '../schemas/spaces.schema';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Incluye siempre la categoría (recurso secundario) — evita N+1 al no
// necesitar una segunda query por cada space
const withCategory = { include: { category: true } } satisfies Prisma.SpaceDefaultArgs;

export type SpaceWithCategory = Prisma.SpaceGetPayload<typeof withCategory>;

export async function findAll(page: number, limit: number): Promise<PaginatedResult<SpaceWithCategory>> {
  const [data, total] = await Promise.all([
    prisma.space.findMany({
      ...withCategory,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.space.count(),
  ]);

  return { data, total, page, limit };
}

export async function findById(id: number): Promise<SpaceWithCategory | null> {
  return prisma.space.findUnique({
    where: { id },
    ...withCategory,
  });
}

export async function create(data: CreateSpaceDto): Promise<SpaceWithCategory> {
  try {
    return await prisma.space.create({ data, ...withCategory });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError(409, 'Ya existe un espacio con ese código');
    }
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2003') {
      throw new AppError(400, 'La categoría indicada (categoryId) no existe');
    }
    throw err;
  }
}

export async function update(id: number, data: UpdateSpaceDto): Promise<SpaceWithCategory> {
  try {
    return await prisma.space.update({ where: { id }, data, ...withCategory });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError(404, 'Espacio no encontrado');
    }
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError(409, 'Ya existe un espacio con ese código');
    }
    throw err;
  }
}

export async function remove(id: number): Promise<Space> {
  try {
    return await prisma.space.delete({ where: { id } });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError(404, 'Espacio no encontrado');
    }
    throw err;
  }
}
