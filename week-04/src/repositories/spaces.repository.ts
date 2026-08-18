// ============================================
// REPOSITORY — capa de acceso a datos (en memoria)
// ============================================
import { Space } from '../types';

export type CreateSpaceRepoDto = Omit<Space, 'id' | 'createdAt'>;
export type UpdateSpaceRepoDto = Partial<CreateSpaceRepoDto>;

let spaces: Space[] = [
  { id: 1, name: 'Sala Ártico', type: 'sala_reunion', capacity: 8, pricePerHour: 25, available: true, createdAt: new Date() },
  { id: 2, name: 'Oficina Privada Deluxe', type: 'oficina_privada', capacity: 4, pricePerHour: 45, available: true, createdAt: new Date() },
  { id: 3, name: 'Escritorio Flex A1', type: 'escritorio_flexible', capacity: 1, pricePerHour: 6.5, available: true, createdAt: new Date() },
  { id: 4, name: 'Cabina de Llamadas 1', type: 'cabina_llamadas', capacity: 1, pricePerHour: 4, available: false, createdAt: new Date() },
];

let nextId = 5;

export async function findAll(): Promise<Space[]> {
  return [...spaces];
}

export async function findById(id: number): Promise<Space | undefined> {
  const space = spaces.find((s) => s.id === id);
  return space ? { ...space } : undefined;
}

export async function create(dto: CreateSpaceRepoDto): Promise<Space> {
  const space: Space = { id: nextId++, ...dto, createdAt: new Date() };
  spaces.push(space);
  return { ...space };
}

export async function update(id: number, dto: UpdateSpaceRepoDto): Promise<Space | undefined> {
  const index = spaces.findIndex((s) => s.id === id);
  if (index === -1) return undefined;

  spaces[index] = { ...spaces[index]!, ...dto };
  return { ...spaces[index]! };
}

export async function remove(id: number): Promise<boolean> {
  const index = spaces.findIndex((s) => s.id === id);
  if (index === -1) return false;

  spaces.splice(index, 1);
  return true;
}
