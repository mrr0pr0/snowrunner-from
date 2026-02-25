import { IRouter, Router } from 'express';
import { list, create, update, remove } from '../controllers/commentController.js';
import { authMiddleware, loadUserMiddleware, optionalAuthMiddleware } from '../middleware/index.js';
import { validateBody, validateParams } from '../middleware/validate.js';
import { createCommentSchema, updateCommentSchema } from 'shared/schemas';
import z from "zod";

const guideIdParam = z.object({ guideId: z.string().uuid() });
const idParam = z.object({ id: z.string().uuid() });

const router: IRouter = Router();

router.get(
    '/guide/:guideId',
    optionalAuthMiddleware,
    loadUserMiddleware,
    validateParams(guideIdParam),
    list
);
router.post(
    '/',
    authMiddleware,
    loadUserMiddleware,
    validateBody(createCommentSchema),
    create
);
router.patch(
    '/:id',
    authMiddleware,
    loadUserMiddleware,
    validateParams(idParam),
    validateBody(updateCommentSchema),
    update
)
router.delete(
    '/:id',
    authMiddleware,
    loadUserMiddleware,
    validateParams(idParam),
    remove
);

export default router;