// src/routes/spaces.routes.ts — Definición de rutas del recurso Space

import { Router } from 'express';
import * as ctrl from '../controllers/spaces.controller';

const router = Router();

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

export default router;
