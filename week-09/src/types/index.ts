export type UserRole = 'user' | 'admin';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface TokenPayload {
  sub: string;
  role: UserRole;
}

// ============================================================
// Dominio: Coworking Space
// ============================================================

export interface CreateSpaceDto {
  name: string;
  code: string;
  capacity: number;
  pricePerHour: number;
  available?: boolean;
}

export interface UpdateSpaceDto {
  name?: string;
  code?: string;
  capacity?: number;
  pricePerHour?: number;
  available?: boolean;
}
