// ============================================
// SCHEMA ZOD: Space (entidad principal, con ref a category)
// ============================================

import { z } from 'zod';

// ObjectId: 24 caracteres hexadecimales
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const objectIdSchema = z.string().regex(objectIdRegex, 'ID inválido');

export const createSpaceSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(150),
  code: z.string().regex(/^SP-\d{3,}$/i, 'code debe tener el formato SP-001'),
  capacity: z.number().int().positive('capacity debe ser mayor a 0'),
  pricePerHour: z.number().nonnegative('pricePerHour no puede ser negativo'),
  available: z.boolean().default(true),
  category: z.string().regex(objectIdRegex, 'ID de categoría inválido'),
});

export const updateSpaceSchema = createSpaceSchema.partial();

export type CreateSpaceDto = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceDto = z.infer<typeof updateSpaceSchema>;
