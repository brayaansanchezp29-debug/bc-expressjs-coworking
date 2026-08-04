// ============================================
// PROCESSOR — Filtra y calcula estadísticas
// ============================================

import type { Space, SpaceSummary } from './types.js';

export function filterByCategory(
  spaces: Space[],
  categoryFilter: string | null
): Space[] {
  if (categoryFilter === null) {
    return spaces;
  }

  const normalizedFilter = categoryFilter.toLowerCase();
  const filtered = spaces.filter(
    (space) => space.category.toLowerCase() === normalizedFilter
  );

  if (filtered.length === 0) {
    const availableCategories = Array.from(
      new Set(spaces.map((space) => space.category))
    );
    throw new Error(
      `No existen espacios en la categoría "${categoryFilter}". ` +
        `Categorías disponibles: ${availableCategories.join(', ')}`
    );
  }

  return filtered;
}

export function calculateSummary(spaces: Space[]): SpaceSummary {
  if (spaces.length === 0) {
    throw new Error('No hay espacios para calcular el resumen.');
  }

  const total = spaces.length;
  const active = spaces.filter((space) => space.active).length;
  const inactive = total - active;

  const totalPrice = spaces.reduce((sum, space) => sum + space.price, 0);
  const averagePrice = Math.round((totalPrice / total) * 100) / 100;

  const mostExpensive = spaces.reduce((max, space) =>
    space.price > max.price ? space : max
  );
  const cheapest = spaces.reduce((min, space) =>
    space.price < min.price ? space : min
  );

  const categories = Array.from(new Set(spaces.map((space) => space.category)));

  return {
    total,
    active,
    inactive,
    averagePrice,
    mostExpensive,
    cheapest,
    categories,
  };
}
