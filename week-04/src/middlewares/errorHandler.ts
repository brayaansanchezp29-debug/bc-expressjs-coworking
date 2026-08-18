// ============================================
// MIDDLEWARES — errorHandler (4 parámetros)
// ============================================
// ⚠️ Express detecta un error handler por tener exactamente 4 parámetros.
// Debe ser el ÚLTIMO middleware registrado en app.ts.
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { logger } from '../config/logger';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  // 1. Errores de validación de Zod → 400 con detalle de issues
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Datos de entrada inválidos',
      issues: err.issues.map((issue) => ({
        field: issue.path.join('.') || 'body',
        message: issue.message,
      })),
    });
    return;
  }

  // 2. Errores operacionales del dominio → statusCode propio
  if (err instanceof AppError) {
    logger.warn(`AppError ${err.statusCode}: ${err.message}`);
    res.status(err.statusCode).json({
      error: 'Application Error',
      message: err.message,
    });
    return;
  }

  // 3. Error genérico / no controlado → 500
  const isProduction = process.env['NODE_ENV'] === 'production';
  const message = err instanceof Error ? err.message : 'Unknown error';
  const stack = err instanceof Error ? err.stack : undefined;

  logger.error(`Unhandled error: ${message}`);

  res.status(500).json({
    error: 'Internal Server Error',
    message: isProduction ? 'Something went wrong' : message,
    ...(isProduction ? {} : { stack }),
  });
}
