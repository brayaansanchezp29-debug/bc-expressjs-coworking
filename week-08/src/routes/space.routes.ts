import { Router } from 'express';
import {
  getSpaces,
  getSpaceById,
  createSpace,
  updateSpace,
  deleteSpace,
} from '../controllers/space.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = Router();

// ============================================
// Política de acceso — Dominio: Coworking Space
// ============================================
// Decisión de diseño: cualquier persona (con o sin cuenta) puede ver el
// catálogo de espacios disponibles, igual que en un sitio de reservas real.
// Solo se requiere cuenta para crear/editar, y solo un admin puede eliminar.
// IMPORTANTE: requireRole SIEMPRE después de authMiddleware.

// GET all — público, sin middleware
router.get('/', getSpaces);

// GET by ID — público, sin middleware
router.get('/:id', getSpaceById);

// POST — crear espacio requiere autenticación
router.post('/', authMiddleware, createSpace);

// PATCH — actualizar: autenticado (el service verifica si es dueño o admin)
router.patch('/:id', authMiddleware, updateSpace);

// DELETE — eliminar: solo admin
router.delete('/:id', authMiddleware, requireRole('admin'), deleteSpace);

export default router;
