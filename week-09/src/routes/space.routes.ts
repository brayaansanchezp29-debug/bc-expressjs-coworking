import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  getAllHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
} from '../controllers/space.controller.js';

export const spacesRouter = Router();

spacesRouter.get('/', getAllHandler);
spacesRouter.get('/:id', getByIdHandler);
spacesRouter.post('/', authenticate, createHandler);
spacesRouter.put('/:id', authenticate, updateHandler);
spacesRouter.delete('/:id', authenticate, deleteHandler);
