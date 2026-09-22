// ============================================================
// UNIT TESTS — space.service.ts
// ============================================================
// Mockea spaces.repository — testea la lógica de negocio pura,
// sin tocar MongoDB. Dominio: Coworking Space.
// ============================================================

jest.mock('../repositories/space.repository');

import * as spacesRepo from '../repositories/space.repository';
import * as spacesService from '../services/space.service';

const mockFindAll = spacesRepo.findAllSpaces as jest.MockedFunction<
  typeof spacesRepo.findAllSpaces
>;
const mockFindById = spacesRepo.findSpaceById as jest.MockedFunction<
  typeof spacesRepo.findSpaceById
>;
const mockCreate = spacesRepo.createSpace as jest.MockedFunction<typeof spacesRepo.createSpace>;
const mockUpdate = spacesRepo.updateSpace as jest.MockedFunction<typeof spacesRepo.updateSpace>;
const mockDelete = spacesRepo.deleteSpace as jest.MockedFunction<typeof spacesRepo.deleteSpace>;

import type { ISpace } from '../models/space.model';

const spaceBase: ISpace = {
  _id: 'space-id-123',
  name: 'Sala Ártico',
  code: 'SP-001',
  capacity: 8,
  pricePerHour: 25,
  available: true,
  createdBy: 'user-id-owner',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
} as ISpace;

const createDto = {
  name: 'Sala Ártico',
  code: 'SP-001',
  capacity: 8,
  pricePerHour: 25,
};

describe('SpacesService — Unit Tests', () => {
  describe('getAll()', () => {
    it('should return all spaces', async () => {
      // ARRANGE
      mockFindAll.mockResolvedValue([spaceBase] as Awaited<ReturnType<typeof spacesRepo.findAllSpaces>>);

      // ACT
      const result = await spacesService.getAll();

      // ASSERT
      expect(result).toHaveLength(1);
      expect(result[0]?.code).toBe('SP-001');
    });

    it('should return empty array when no spaces exist', async () => {
      // ARRANGE
      mockFindAll.mockResolvedValue([]);

      // ACT
      const result = await spacesService.getAll();

      // ASSERT
      expect(result).toEqual([]);
    });
  });

  describe('getById()', () => {
    it('should return the space when found', async () => {
      // ARRANGE
      mockFindById.mockResolvedValue(spaceBase);

      // ACT
      const result = await spacesService.getById('space-id-123');

      // ASSERT
      expect(result.code).toBe('SP-001');
    });

    it('should throw AppError 404 when space does not exist', async () => {
      // ARRANGE
      mockFindById.mockResolvedValue(null);

      // ACT + ASSERT
      await expect(spacesService.getById('non-existent-id')).rejects.toMatchObject({
        statusCode: 404,
        message: 'Space not found',
      });
    });
  });

  describe('create()', () => {
    it('should create and return the new space', async () => {
      // ARRANGE
      mockCreate.mockResolvedValue(spaceBase);

      // ACT
      const result = await spacesService.create(createDto, 'user-id-owner');

      // ASSERT
      expect(result.code).toBe('SP-001');
      expect(mockCreate).toHaveBeenCalledWith(createDto, 'user-id-owner');
    });

    it('should throw AppError 409 when code is duplicated', async () => {
      // ARRANGE — simula el error de índice único (code 11000) de Mongo
      mockCreate.mockRejectedValue({ code: 11000 });

      // ACT + ASSERT
      await expect(spacesService.create(createDto, 'user-id-owner')).rejects.toMatchObject({
        statusCode: 409,
      });
    });
  });

  describe('update()', () => {
    it('should update and return the space when requester is the owner', async () => {
      // ARRANGE
      mockFindById.mockResolvedValue(spaceBase);
      mockUpdate.mockResolvedValue({ ...spaceBase, pricePerHour: 30 } as Awaited<
        ReturnType<typeof spacesRepo.updateSpace>
      >);

      // ACT
      const result = await spacesService.update(
        'space-id-123',
        { pricePerHour: 30 },
        'user-id-owner',
        'user'
      );

      // ASSERT
      expect(result.pricePerHour).toBe(30);
    });

    it('should throw AppError 403 when requester is not the owner nor admin', async () => {
      // ARRANGE
      mockFindById.mockResolvedValue(spaceBase);

      // ACT + ASSERT
      await expect(
        spacesService.update('space-id-123', { pricePerHour: 30 }, 'another-user-id', 'user')
      ).rejects.toMatchObject({ statusCode: 403 });

      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('should throw AppError 404 when space does not exist', async () => {
      // ARRANGE
      mockFindById.mockResolvedValue(null);

      // ACT + ASSERT
      await expect(
        spacesService.update('non-existent-id', { pricePerHour: 30 }, 'user-id-owner', 'user')
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('remove()', () => {
    it('should delete the space when requester is admin', async () => {
      // ARRANGE
      mockFindById.mockResolvedValue(spaceBase);
      mockDelete.mockResolvedValue(spaceBase as Awaited<ReturnType<typeof spacesRepo.deleteSpace>>);

      // ACT
      await spacesService.remove('space-id-123', 'admin-id', 'admin');

      // ASSERT
      expect(mockDelete).toHaveBeenCalledWith('space-id-123');
    });

    it('should throw AppError 403 when requester is not owner or admin', async () => {
      // ARRANGE
      mockFindById.mockResolvedValue(spaceBase);

      // ACT + ASSERT
      await expect(
        spacesService.remove('space-id-123', 'another-user-id', 'user')
      ).rejects.toMatchObject({ statusCode: 403 });

      expect(mockDelete).not.toHaveBeenCalled();
    });

    it('should throw AppError 404 when space does not exist', async () => {
      // ARRANGE
      mockFindById.mockResolvedValue(null);

      // ACT + ASSERT
      await expect(
        spacesService.remove('non-existent-id', 'user-id-owner', 'user')
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});

export {};
