// src/lib/prisma.ts — Singleton de PrismaClient
// ============================================================
// Evita crear una nueva conexión en cada hot-reload de tsx watch / cada
// request. En desarrollo, guarda la instancia en `global` para reutilizarla
// entre recargas del módulo.

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env['NODE_ENV'] === 'production' ? ['warn', 'error'] : ['query', 'warn', 'error'],
  });

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = prisma;
}
