import { Request, Response, NextFunction } from 'express';

// ============================================
// Sanitización anti NoSQL-injection — reemplazo de express-mongo-sanitize
// ============================================
// express-mongo-sanitize@2.2.0 no es compatible con Express 5: intenta
// reasignar req.query por completo, pero Express 5 convirtió esa propiedad
// en un getter de solo lectura ("Cannot set property query of
// #<IncomingMessage> which has only a getter"), lo que tumba TODA petición.
//
// Esta implementación logra el mismo objetivo (eliminar claves que empiecen
// con '$' o contengan '.', usadas para inyectar operadores de MongoDB como
// { "$gt": "" }) mutando las propiedades EXISTENTES de body/query/params en
// vez de reasignar el objeto completo — así nunca toca el setter inexistente.

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (isPlainObject(value)) {
    const clean: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      if (key.startsWith('$') || key.includes('.')) continue; // clave peligrosa: se descarta
      clean[key] = sanitizeValue(val);
    }
    return clean;
  }
  return value;
}

function sanitizeInPlace(target: Record<string, unknown>): void {
  const clean = sanitizeValue(target) as Record<string, unknown>;
  for (const key of Object.keys(target)) delete target[key];
  Object.assign(target, clean);
}

export function mongoSanitize(req: Request, _res: Response, next: NextFunction): void {
  if (isPlainObject(req.body)) sanitizeInPlace(req.body);
  if (isPlainObject(req.query)) sanitizeInPlace(req.query as Record<string, unknown>);
  if (isPlainObject(req.params)) sanitizeInPlace(req.params);
  next();
}
