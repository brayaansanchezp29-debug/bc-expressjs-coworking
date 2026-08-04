// ============================================
// TYPES: Interfaz del recurso principal
// ============================================
// Dominio: Coworking Space
// Recurso: Space — un espacio reservable dentro del coworking
// (sala de reuniones, oficina privada, escritorio flexible, cabina de llamadas)

export interface Space {
  id: number;
  name: string; // ej. "Sala Ártico"
  type: 'sala_reunion' | 'oficina_privada' | 'escritorio_flexible' | 'cabina_llamadas';
  capacity: number; // aforo máximo
  pricePerHour: number; // precio por hora en USD
  floor: number; // piso donde está ubicado
  available: boolean; // si está disponible para reservar
}

// DTO usado para crear un nuevo espacio (sin id, se genera automáticamente)
export type CreateSpaceDto = Omit<Space, 'id'>;

// DTO para actualización (todos los campos editables)
export type UpdateSpaceDto = Partial<CreateSpaceDto>;
