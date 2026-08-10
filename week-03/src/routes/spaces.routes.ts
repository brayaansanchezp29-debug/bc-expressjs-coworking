// ============================================
// ROUTES — Mapeo de URLs a controllers
// ============================================
// Solo conecta: URL + Método HTTP → función del controller. Sin lógica.

import { Router } from 'express';
import * as controller from '../controllers/spaces.controller';

export const spacesRouter = Router();

spacesRouter.get('/', controller.getAll);
spacesRouter.get('/:id', controller.getById);
spacesRouter.post('/', controller.create);
spacesRouter.put('/:id', controller.update);
spacesRouter.delete('/:id', controller.remove);
