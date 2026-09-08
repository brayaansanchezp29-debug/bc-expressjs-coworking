import { z } from 'zod';

// ============================================
// SCHEMA DEL RECURSO PRINCIPAL — Space
// ============================================
// Dominio: Coworking Space
// ============================================

export const createSpaceSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(150),
  code: z.string().regex(/^SP-\d{3,}$/i, 'code debe tener el formato SP-001'),
  capacity: z.number().int().positive('capacity debe ser mayor a 0'),
  pricePerHour: z.number().nonnegative('pricePerHour no puede ser negativo'),
  available: z.boolean().default(true),
});

export const updateSpaceSchema = createSpaceSchema.partial();

export type CreateSpaceDto = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceDto = z.infer<typeof updateSpaceSchema>;
