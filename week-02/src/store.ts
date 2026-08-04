import type { Space, CreateSpaceDto, UpdateSpaceDto } from './types.js';

// Store en memoria — simula una base de datos sin persistencia
// Los datos se pierden al reiniciar el servidor (se usará BD a partir de week-05)
const spaces: Space[] = [
  { id: 1, name: 'Sala Ártico', type: 'sala_reunion', capacity: 8, pricePerHour: 25, floor: 2, available: true },
  { id: 2, name: 'Oficina Privada Deluxe', type: 'oficina_privada', capacity: 4, pricePerHour: 45, floor: 3, available: true },
  { id: 3, name: 'Escritorio Flex A1', type: 'escritorio_flexible', capacity: 1, pricePerHour: 6.5, floor: 1, available: true },
];
let nextId = spaces.length + 1;

export function getAll(): Space[] {
  return spaces;
}

export function getById(id: number): Space | undefined {
  return spaces.find((space) => space.id === id);
}

export function create(data: CreateSpaceDto): Space {
  const newSpace: Space = { id: nextId++, ...data };
  spaces.push(newSpace);
  return newSpace;
}

export function update(id: number, data: UpdateSpaceDto): Space | undefined {
  const space = spaces.find((s) => s.id === id);
  if (!space) return undefined;

  Object.assign(space, data);
  return space;
}

export function remove(id: number): boolean {
  const index = spaces.findIndex((space) => space.id === id);
  if (index === -1) return false;

  spaces.splice(index, 1);
  return true;
}
