// ============================================
// SCHEMA ZOD: SpaceCategory (entidad secundaria)
// ============================================

import { z } from 'zod';

export const createSpaceCategorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  description: z.string().max(500).optional(),
});

export const updateSpaceCategorySchema = createSpaceCategorySchema.partial();

export type CreateSpaceCategoryDto = z.infer<typeof createSpaceCategorySchema>;
export type UpdateSpaceCategoryDto = z.infer<typeof updateSpaceCategorySchema>;
