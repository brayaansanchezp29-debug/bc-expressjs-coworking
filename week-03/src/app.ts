// ============================================
// APP — Configuración Express
// ============================================
import express from 'express';
import { spacesRouter } from './routes/spaces.routes';
import { ErrorResponse } from './types';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', week: '03', project: 'api-arquitectura-coworking' });
});

app.use('/api/v1/spaces', spacesRouter);

// Handler 404 para rutas no registradas
app.use((_req, res) => {
  const response: ErrorResponse = { error: 'Not Found', message: 'Route not found' };
  res.status(404).json(response);
});

// Error handler global
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.message);
  const response: ErrorResponse = {
    error: 'Internal Server Error',
    message: err.message,
  };
  res.status(500).json(response);
});

export default app;
