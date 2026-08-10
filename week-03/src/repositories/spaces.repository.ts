// ============================================
// REPOSITORY — Capa de acceso a datos
// ============================================
// Único punto de acceso al store. Todos los métodos son async Promise<T>.
// Retorna copias defensivas (nunca la referencia interna del store).
// Si no encuentra un elemento, retorna undefined.

import { Space, CreateSpaceDto, UpdateSpaceDto } from '../types';

const store: Space[] = [
  { id: 1, name: 'Sala Ártico', type: 'sala_reunion', capacity: 8, pricePerHour: 25, available: true, createdAt: new Date().toISOString() },
  { id: 2, name: 'Oficina Privada Deluxe', type: 'oficina_privada', capacity: 4, pricePerHour: 45, available: true, createdAt: new Date().toISOString() },
  { id: 3, name: 'Escritorio Flex A1', type: 'escritorio_flexible', capacity: 1, pricePerHour: 6.5, available: true, createdAt: new Date().toISOString() },
  { id: 4, name: 'Cabina de Llamadas 1', type: 'cabina_llamadas', capacity: 1, pricePerHour: 4, available: false, createdAt: new Date().toISOString() },
];
let nextId = store.length + 1;

export async function findAll(): Promise<Space[]> {
  return [...store];
}

export async function findById(id: number): Promise<Space | undefined> {
  const space = store.find((s) => s.id === id);
  return space ? { ...space } : undefined;
}

export async function create(dto: CreateSpaceDto): Promise<Space> {
  const space: Space = { id: nextId++, ...dto, createdAt: new Date().toISOString() };
  store.push(space);
  return { ...space };
}

export async function update(id: number, dto: UpdateSpaceDto): Promise<Space | undefined> {
  const index = store.findIndex((s) => s.id === id);
  if (index === -1) return undefined;

  store[index] = { ...store[index]!, ...dto };
  return { ...store[index]! };
}

export async function remove(id: number): Promise<boolean> {
  const index = store.findIndex((s) => s.id === id);
  if (index === -1) return false;

  store.splice(index, 1);
  return true;
}
