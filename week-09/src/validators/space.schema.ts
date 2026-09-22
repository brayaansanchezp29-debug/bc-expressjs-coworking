import { z } from 'zod';

// ============================================================
// Dominio: Coworking Space
// ============================================================

export const createSpaceSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150),
    code: z.string().regex(/^SP-\d{3,}$/i, 'code debe tener el formato SP-001'),
    capacity: z.number().int().positive(),
    pricePerHour: z.number().nonnegative(),
    available: z.boolean().optional(),
  }),
});

export const updateSpaceSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(150).optional(),
    code: z
      .string()
      .regex(/^SP-\d{3,}$/i)
      .optional(),
    capacity: z.number().int().positive().optional(),
    pricePerHour: z.number().nonnegative().optional(),
    available: z.boolean().optional(),
  }),
});

export const spaceIdSchema = z.object({
  params: z.object({
    id: z.string().length(24, 'Invalid MongoDB ID'),
  }),
});
