// ============================================
// ENTRY POINT — Orquesta todo el flujo
// ============================================

import { readSpaces } from './reader.js';
import { filterByCategory, calculateSummary } from './processor.js';
import { writeReport } from './writer.js';
import type { Report } from './types.js';

function parseCategoryArg(): string | null {
  const args = process.argv.slice(2);
  const categoryIndex = args.indexOf('--category');
  return categoryIndex !== -1 ? args[categoryIndex + 1] ?? null : null;
}

async function main(): Promise<void> {
  try {
    const categoryFilter = parseCategoryArg();

    const allSpaces = await readSpaces();
    const filteredSpaces = filterByCategory(allSpaces, categoryFilter);
    const summary = calculateSummary(filteredSpaces);

    const report: Report = {
      generatedAt: new Date().toISOString(),
      appliedFilter: categoryFilter,
      summary,
      items: filteredSpaces,
    };

    console.log('\n📊 Resumen de Espacios de Coworking');
    console.log('─────────────────────────────────────');
    console.log(`Filtro aplicado:     ${categoryFilter ?? 'ninguno'}`);
    console.log(`Total de espacios:   ${summary.total}`);
    console.log(`Activos:             ${summary.active}`);
    console.log(`Inactivos:           ${summary.inactive}`);
    console.log(`Precio promedio:     $${summary.averagePrice}/hora`);
    console.log(`Más caro:            ${summary.mostExpensive.name} ($${summary.mostExpensive.price}/hora)`);
    console.log(`Más económico:       ${summary.cheapest.name} ($${summary.cheapest.price}/hora)`);
    console.log(`Categorías:          ${summary.categories.join(', ')}`);

    await writeReport(report);
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error(`\n❌ Error: ${reason}`);
    process.exit(1);
  }
}

main();
