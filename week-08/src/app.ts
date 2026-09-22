import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import { mongoSanitize } from './middlewares/sanitize.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import spaceRoutes from './routes/space.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { globalLimiter, corsOptions } from './config/security.js';

const app = express();

// Security layers — order matters
app.use(helmet());
app.use(globalLimiter);
// NOTA: '/*splat' en vez de '*' — Express 5 (path-to-regexp v8) ya no admite
// el comodín '*' a secas; requiere un nombre para el segmento comodín.
app.options('/*splat', cors(corsOptions)); // preflight
app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sanitize inputs AFTER parsing, BEFORE routes
// NOTA: middleware propio en vez de express-mongo-sanitize — ese paquete
// intenta reasignar req.query completo, y Express 5 lo hizo de solo lectura.
app.use(mongoSanitize);

// Health check
app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/spaces', spaceRoutes);

// Error handling (always last)
app.use(notFound);
app.use(errorHandler);

export { app };
