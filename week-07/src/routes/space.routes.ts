import { Router } from 'express';
import * as spaceController from '../controllers/space.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

// ============================================
// RUTAS DEL RECURSO PRINCIPAL — Space
// ============================================
// Todas las rutas están protegidas con authMiddleware.
// ============================================

const router = Router();

// Todas las rutas de este router requieren autenticación
router.use(authMiddleware);

// GET /api/v1/spaces — listar todos
router.get('/', spaceController.getAll);

// GET /api/v1/spaces/:id — obtener uno por ID
router.get('/:id', spaceController.getById);

// POST /api/v1/spaces — crear uno nuevo
router.post('/', spaceController.create);

// PATCH /api/v1/spaces/:id — actualizar parcialmente
router.patch('/:id', spaceController.update);

// DELETE /api/v1/spaces/:id — eliminar
router.delete('/:id', spaceController.remove);

export default router;
