// ============================================
// TYPES — Dominio: Coworking Space
// ============================================
// Recurso: Space — un espacio reservable dentro del coworking

export interface Space {
  id: number;
  name: string; // ej. "Sala Ártico"
  type: 'sala_reunion' | 'oficina_privada' | 'escritorio_flexible' | 'cabina_llamadas';
  capacity: number; // aforo máximo
  pricePerHour: number; // precio por hora en USD
  available: boolean; // si está disponible para reservar
  createdAt: string;
}

// DTO para crear — sin campos auto-generados
export type CreateSpaceDto = Omit<Space, 'id' | 'createdAt'>;

// DTO para actualizar — todos los campos opcionales
export type UpdateSpaceDto = Partial<CreateSpaceDto>;

// Contratos de respuesta (genéricos — no cambiar nombres)
export interface SingleResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}
