// ============================================
// APP — configuración de Express
// Registra middlewares, rutas y manejo de errores en el ORDEN CORRECTO.
// ============================================
import express from 'express';
import { morganMiddleware } from './config/logger';
import spacesRouter from './routes/spaces.routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// 1. Middlewares generales
app.use(express.json());
app.use(morganMiddleware);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', week: '04', project: 'validacion-errores-coworking' });
});

// 2. Rutas del dominio
app.use('/api/v1/spaces', spacesRouter);

// 3. notFound — DESPUÉS de todas las rutas
app.use(notFound);

// 4. errorHandler — SIEMPRE el último middleware (4 parámetros)
app.use(errorHandler);

export default app;
