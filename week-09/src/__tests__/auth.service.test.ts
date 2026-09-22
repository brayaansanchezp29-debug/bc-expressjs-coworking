// ============================================================
// UNIT TESTS — auth.service.ts
// ============================================================
// auth.service se testea en aislamiento total: la capa de repositorio
// se mockea con jest.mock() — nunca toca una base de datos real.
// Patrón AAA: Arrange → Act → Assert
// ============================================================

import bcrypt from 'bcrypt';

jest.mock('../repositories/users.repository');

import * as usersRepo from '../repositories/users.repository';
import * as authService from '../services/auth.service';

const mockFindByEmail = usersRepo.findUserByEmail as jest.MockedFunction<
  typeof usersRepo.findUserByEmail
>;
const mockCreateUser = usersRepo.createUser as jest.MockedFunction<typeof usersRepo.createUser>;

const userBase = {
  _id: 'user-id-abc123',
  name: 'Alice',
  email: 'alice@test.com',
  role: 'user' as const,
  createdAt: new Date('2025-01-01'),
};

const registerDto = {
  name: 'Alice',
  email: 'alice@test.com',
  password: 'Password1!',
};

const loginDto = {
  email: 'alice@test.com',
  password: 'Password1!',
};

describe('Auth Service — Unit Tests', () => {
  it('should have mocked repository functions', () => {
    expect(jest.isMockFunction(usersRepo.findUserByEmail)).toBe(true);
    expect(jest.isMockFunction(usersRepo.createUser)).toBe(true);
  });

  describe('register()', () => {
    it('should create a user and return it without the password', async () => {
      // ARRANGE — el email no existe aún en la DB
      mockFindByEmail.mockResolvedValue(null);

      // La DB devuelve el usuario creado (con contraseña hasheada)
      const hashedPwd = await bcrypt.hash(registerDto.password, 1);
      mockCreateUser.mockResolvedValue({
        ...userBase,
        password: hashedPwd,
      } as Awaited<ReturnType<typeof usersRepo.createUser>>);

      // ACT
      const result = await authService.register(registerDto);

      // ASSERT
      expect(result.email).toBe(registerDto.email);
      expect(result.name).toBe(registerDto.name);
      expect(result.role).toBe('user');
      // La contraseña NUNCA debe estar en el resultado
      expect((result as Record<string, unknown>).password).toBeUndefined();
    });

    it('should throw AppError 409 if email already exists', async () => {
      // ARRANGE — el email YA existe en la DB
      mockFindByEmail.mockResolvedValue({
        ...userBase,
        password: 'hashed-password',
      } as Awaited<ReturnType<typeof usersRepo.findUserByEmail>>);

      // ACT + ASSERT
      await expect(authService.register(registerDto)).rejects.toMatchObject({
        statusCode: 409,
        message: 'Email already registered',
      });

      // createUser NUNCA debe haber sido llamado
      expect(mockCreateUser).not.toHaveBeenCalled();
    });
  });

  describe('login()', () => {
    it('should throw AppError 401 when user is not found', async () => {
      // ARRANGE — email no existe en la DB
      mockFindByEmail.mockResolvedValue(null);

      // ACT + ASSERT
      await expect(authService.login(loginDto)).rejects.toMatchObject({
        statusCode: 401,
      });
    });

    it('should throw AppError 401 when password is wrong', async () => {
      // ARRANGE — el usuario existe pero la contraseña es distinta
      const realHash = await bcrypt.hash('OtraContrasena1!', 1);
      mockFindByEmail.mockResolvedValue({
        ...userBase,
        password: realHash,
      } as Awaited<ReturnType<typeof usersRepo.findUserByEmail>>);

      // ACT + ASSERT
      await expect(authService.login(loginDto)).rejects.toMatchObject({
        statusCode: 401,
      });
    });

    it('should return accessToken on valid credentials', async () => {
      // ARRANGE — hashear la contraseña CORRECTA (la misma que loginDto.password)
      const correctHash = await bcrypt.hash(loginDto.password, 1);
      mockFindByEmail.mockResolvedValue({
        ...userBase,
        password: correctHash,
      } as Awaited<ReturnType<typeof usersRepo.findUserByEmail>>);

      // ACT
      const result = await authService.login(loginDto);

      // ASSERT
      expect(result.accessToken).toBeDefined();
      expect(typeof result.accessToken).toBe('string');
    });

    it('should call findByEmail with the correct email', async () => {
      mockFindByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toBeDefined();

      // Verificar que el repositorio recibió el email correcto
      expect(mockFindByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockFindByEmail).toHaveBeenCalledTimes(1);
    });
  });
});

export {};
