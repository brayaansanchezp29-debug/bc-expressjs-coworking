// ============================================
// ERRORS — AppError (clase de errores operacionales)
// ============================================
// Errores esperados del dominio (404, 409, 400 de negocio, etc.), a
// diferencia de bugs no controlados que sí deben tumbar el proceso o
// alertar. isOperational permite distinguir ambos casos en el errorHandler.

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Restaura la cadena de prototipos (necesario al extender clases nativas
    // como Error cuando se compila a ES2022/CommonJS)
    Object.setPrototypeOf(this, new.target.prototype);

    // Excluye el constructor del stack trace para que apunte a donde se
    // lanzó el error, no aquí dentro
    Error.captureStackTrace(this, this.constructor);
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}
