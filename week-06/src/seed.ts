// ============================================
// SEED — Datos iniciales del dominio Coworking Space
// Inserta SpaceCategory primero, luego Space referenciando sus _id
// ============================================

import 'dotenv/config';
import { connectDB, disconnectDB } from './lib/mongoose';
import { SpaceCategory } from './models/spaceCategory.model';
import { Space } from './models/space.model';

async function seed(): Promise<void> {
  await connectDB();

  // Limpiar colecciones — orden inverso: Space (principal) primero, luego SpaceCategory
  await Space.deleteMany({});
  await SpaceCategory.deleteMany({});
  console.log('Collections cleared');

  // Paso A — Insertar categorías (entidad secundaria) y capturar _id
  const [salaReunion, oficinaPrivada, escritorioFlexible, cabinaLlamadas] = await SpaceCategory.insertMany([
    { name: 'Sala de Reunión', description: 'Espacios equipados para reuniones de equipo' },
    { name: 'Oficina Privada', description: 'Oficinas cerradas para equipos pequeños' },
    { name: 'Escritorio Flexible', description: 'Puestos individuales de trabajo compartido' },
    { name: 'Cabina de Llamadas', description: 'Cabinas insonorizadas para llamadas privadas' },
  ]);
  console.log('Categories inserted');

  // Paso B — Insertar espacios (entidad principal) referenciando category._id
  await Space.insertMany([
    { name: 'Sala Ártico', code: 'SP-001', capacity: 8, pricePerHour: 25, available: true, category: salaReunion._id },
    { name: 'Sala Boreal', code: 'SP-002', capacity: 12, pricePerHour: 30, available: true, category: salaReunion._id },
    { name: 'Oficina Privada Deluxe', code: 'SP-003', capacity: 4, pricePerHour: 45, available: true, category: oficinaPrivada._id },
    { name: 'Oficina Privada Executive', code: 'SP-004', capacity: 6, pricePerHour: 60, available: true, category: oficinaPrivada._id },
    { name: 'Escritorio Flex A1', code: 'SP-005', capacity: 1, pricePerHour: 6.5, available: true, category: escritorioFlexible._id },
    { name: 'Escritorio Flex A2', code: 'SP-006', capacity: 1, pricePerHour: 6.5, available: false, category: escritorioFlexible._id },
    { name: 'Cabina de Llamadas 1', code: 'SP-007', capacity: 1, pricePerHour: 4, available: true, category: cabinaLlamadas._id },
  ]);
  console.log('Spaces inserted');

  console.log('Seed completed successfully');
  await disconnectDB();
}

seed().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
