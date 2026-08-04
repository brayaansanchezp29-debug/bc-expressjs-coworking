// ============================================
// TIPOS — Dominio: Coworking Space
// ============================================
// Recurso principal: Space (espacio reservable dentro del coworking)
// category representa el tipo de espacio:
//   'sala_reunion' | 'oficina_privada' | 'escritorio_flexible' | 'cabina_llamadas'

export interface Space {
  id: string;
  name: string;
  category: string;
  price: number; // precio por hora (USD)
  capacity: number; // número de personas que caben en el espacio
  active: boolean; // si el espacio está actualmente disponible para reservar
}

// Resumen que el procesador debe calcular
export interface SpaceSummary {
  total: number;
  active: number;
  inactive: number;
  averagePrice: number;
  mostExpensive: Space;
  cheapest: Space;
  categories: string[];
}

// Reporte final que se escribirá en output/report.json
export interface Report {
  generatedAt: string;
  appliedFilter: string | null;
  summary: SpaceSummary;
  items: Space[];
}
