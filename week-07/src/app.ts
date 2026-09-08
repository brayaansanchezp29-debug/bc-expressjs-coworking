import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes';
import spaceRouter from './routes/space.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

export const app = express();

app.use(express.json());
app.use(cookieParser());

// Rutas de autenticación
app.use('/api/v1/auth', authRouter);

// Rutas del recurso principal — dominio Coworking Space
app.use('/api/v1/spaces', spaceRouter);

// Middlewares de errores (siempre al final)
app.use(notFound);
app.use(errorHandler);
