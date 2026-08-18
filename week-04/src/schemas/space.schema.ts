// ============================================
// SCHEMAS — Dominio: Coworking Space
// ============================================
import { z } from 'zod';

export const createSpaceSchema = z.object({
  name: z
    .string({ error: 'name es obligatorio' })
    .min(1, 'name no puede estar vacío')
    .trim(),

  type: z.enum(['sala_reunion', 'oficina_privada', 'escritorio_flexible', 'cabina_llamadas'], {
    error: 'type debe ser uno de: sala_reunion, oficina_privada, escritorio_flexible, cabina_llamadas',
  }),

  capacity: z
    .number({ error: 'capacity es obligatorio' })
    .int('capacity debe ser un número entero')
    .positive('capacity debe ser mayor a 0'),

  pricePerHour: z
    .number({ error: 'pricePerHour es obligatorio' })
    .positive('pricePerHour debe ser mayor a 0'),

  available: z.boolean().default(true),
});

// Reutiliza el schema de creación con .partial() — sin duplicar validaciones
export const updateSpaceSchema = createSpaceSchema.partial();

// Tipos inferidos desde los schemas — single source of truth
export type CreateSpaceDto = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceDto = z.infer<typeof updateSpaceSchema>;
