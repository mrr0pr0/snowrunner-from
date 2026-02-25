import z from 'zod';
import { create, update, remove } from '../controllers/markerController.js';
import { authMiddleware, loadUserMiddleware } from '../middleware/index.js';
import { validateBody, validateParams } from '../middleware/validate.js';
import { createMarkerSchema, updateMarkerSchema } from 'shared/schemas';
import { Router, type IRouter } from 'express';

const idParam = z.object({ id: z.string().uuid() });

const router: IRouter = Router();

router.post(
    '/',
    authMiddleware,
    loadUserMiddleware,
    validateBody(createMarkerSchema),
    update
);
router.delete(
    '/:id',
    authMiddleware,
    loadUserMiddleware,
    validateParams(idParam),
    validateBody(updateMarkerSchema),
    update
)
router.delete(
    '/:id',
    authMiddleware,
    loadUserMiddleware,
    validateParams(idParam),
    remove
);

export default router