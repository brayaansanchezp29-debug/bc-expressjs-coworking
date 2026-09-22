import { z } from 'zod';

// ============================================
// Dominio: Coworking Space
// ============================================
// La regex /^[^<>]*$/ previene XSS rechazando caracteres HTML en campos
// de texto libre (name).

export const createSpaceSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'name debe tener al menos 2 caracteres')
      .max(150)
      .regex(/^[^<>]*$/, 'name no debe contener caracteres HTML'),
    code: z.string().regex(/^SP-\d{3,}$/i, 'code debe tener el formato SP-001'),
    capacity: z.number().int().positive('capacity debe ser mayor a 0'),
    pricePerHour: z.number().nonnegative('pricePerHour no puede ser negativo'),
    available: z.boolean().optional(),
  }),
});

export const updateSpaceSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2)
      .max(150)
      .regex(/^[^<>]*$/)
      .optional(),
    code: z
      .string()
      .regex(/^SP-\d{3,}$/i)
      .optional(),
    capacity: z.number().int().positive().optional(),
    pricePerHour: z.number().nonnegative().optional(),
    available: z.boolean().optional(),
  }),
});

export type CreateSpaceDto = z.infer<typeof createSpaceSchema>['body'];
export type UpdateSpaceDto = z.infer<typeof updateSpaceSchema>['body'];
