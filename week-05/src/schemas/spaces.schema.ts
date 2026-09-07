// src/schemas/spaces.schema.ts — Validación Zod para el recurso Space

import { z } from 'zod';

export const createSpaceSchema = z.object({
  name: z.string().min(1, 'name no puede estar vacío').max(200),
  code: z
    .string()
    .regex(/^SP-\d{3,}$/, 'code debe tener el formato SP-001'),
  capacity: z.number().int().positive('capacity debe ser mayor a 0'),
  pricePerHour: z.number().positive('pricePerHour debe ser mayor a 0'),
  available: z.boolean().default(true),
  categoryId: z.number().int().positive('categoryId debe ser un id válido'),
});

export const updateSpaceSchema = createSpaceSchema.partial();

export type CreateSpaceDto = z.infer<typeof createSpaceSchema>;
export type UpdateSpaceDto = z.infer<typeof updateSpaceSchema>;
