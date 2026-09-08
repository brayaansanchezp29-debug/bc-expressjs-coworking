// ============================================
// app.ts — Configuración de Express
// ============================================

import express from 'express';
import spaceCategoryRouter from './routes/spaceCategory.routes';
import spaceRouter from './routes/space.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', week: '06', project: 'mongodb-mongoose-coworking' });
});

app.use('/api/v1/space-categories', spaceCategoryRouter);
app.use('/api/v1/spaces', spaceRouter);

app.use(notFound);
app.use(errorHandler);
