// prisma/seed.ts — Datos iniciales del dominio Coworking Space
// Ejecutar con: pnpm dlx prisma db seed

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Iniciando seed...');

  // 1. Limpiar datos existentes (idempotencia) — primero el lado "muchos"
  //    de la relación (Space) para no violar la foreign key
  await prisma.space.deleteMany();
  await prisma.spaceCategory.deleteMany();

  // 2. Crear las categorías (recurso secundario)
  const [salaReunion, oficinaPrivada, escritorioFlexible, cabinaLlamadas] = await Promise.all([
    prisma.spaceCategory.create({
      data: { name: 'Sala de Reunión', description: 'Espacios equipados para reuniones de equipo' },
    }),
    prisma.spaceCategory.create({
      data: { name: 'Oficina Privada', description: 'Oficinas cerradas para equipos pequeños' },
    }),
    prisma.spaceCategory.create({
      data: { name: 'Escritorio Flexible', description: 'Puestos individuales de trabajo compartido' },
    }),
    prisma.spaceCategory.create({
      data: { name: 'Cabina de Llamadas', description: 'Cabinas insonorizadas para llamadas privadas' },
    }),
  ]);

  console.log(`✅ ${4} categorías creadas`);

  // 3. Crear los espacios (recurso principal), referenciando cada categoría
  const result = await prisma.space.createMany({
    data: [
      { name: 'Sala Ártico', code: 'SP-001', capacity: 8, pricePerHour: 25, available: true, categoryId: salaReunion.id },
      { name: 'Sala Boreal', code: 'SP-002', capacity: 12, pricePerHour: 30, available: true, categoryId: salaReunion.id },
      { name: 'Oficina Privada Deluxe', code: 'SP-003', capacity: 4, pricePerHour: 45, available: true, categoryId: oficinaPrivada.id },
      { name: 'Oficina Privada Executive', code: 'SP-004', capacity: 6, pricePerHour: 60, available: true, categoryId: oficinaPrivada.id },
      { name: 'Escritorio Flex A1', code: 'SP-005', capacity: 1, pricePerHour: 6.5, available: true, categoryId: escritorioFlexible.id },
      { name: 'Escritorio Flex A2', code: 'SP-006', capacity: 1, pricePerHour: 6.5, available: false, categoryId: escritorioFlexible.id },
      { name: 'Cabina de Llamadas 1', code: 'SP-007', capacity: 1, pricePerHour: 4, available: true, categoryId: cabinaLlamadas.id },
    ],
  });

  console.log(`✅ ${result.count} espacios creados`);
  console.log('🌱 Seed completado.');
}

main()
  .catch((err: unknown) => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
