// ============================================
// TYPES — Dominio: Coworking Space
// Recurso: Space — un espacio reservable dentro del coworking
// ============================================

export interface Space {
  id: number;
  name: string; // ej. "Sala Ártico"
  type: 'sala_reunion' | 'oficina_privada' | 'escritorio_flexible' | 'cabina_llamadas';
  capacity: number; // aforo máximo
  pricePerHour: number; // precio por hora en USD
  available: boolean; // si está disponible para reservar
  createdAt: Date;
}

// Tipos de respuesta genéricos
export interface SingleResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ValidationErrorResponse {
  error: string;
  message: string;
  issues: Array<{ field: string; message: string }>;
}

export interface ErrorResponse {
  error: string;
  message: string;
  stack?: string;
}
