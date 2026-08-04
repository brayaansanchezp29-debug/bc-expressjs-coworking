// ============================================
// READER — Lee el archivo de datos JSON
// ============================================

import { readFile } from 'fs/promises';
import { join } from 'path';
import type { Space } from './types.js';

export async function readSpaces(): Promise<Space[]> {
  const filePath = join(import.meta.dirname, '..', 'data', 'spaces.json');

  try {
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw) as Space[];
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    throw new Error(
      `No se pudo leer el archivo de espacios en "${filePath}": ${reason}`
    );
  }
}
