// ============================================
// MIDDLEWARES — notFound
// ============================================
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

// Middleware normal (3 parámetros) que captura cualquier request que no
// coincidió con ninguna ruta registrada y delega el 404 al errorHandler
export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, `Ruta ${req.method} ${req.path} no encontrada`));
}
