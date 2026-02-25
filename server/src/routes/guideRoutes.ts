import { Router, type IRouter } from 'express';
import {
  list,
  getById,
  getBySlug,
  create,
  update,
  remove,
  getGuideMarkers,
} from '../controllers/guideController.js';
import { authMiddleware, loadUserMiddleware, optionalAuthMiddleware } from '../middleware/index.js';
import { validateBody, validateQuery, validateParams } from '../middleware/validate.js';
import {
  createGuideSchema,
  updateGuideSchema,
  guideListQuerySchema,
} from 'shared/schemas';
import { z } from 'zod';

const idParam = z.object({ id: z.string().uuid() });
const slugParam = z.object({ slug: z.string().min(1) });
const guideIdParam = z.object({ guideId: z.string().uuid() });

const router: IRouter = Router();

router.get(
  '/',
  optionalAuthMiddleware,
  loadUserMiddleware,
  validateQuery(guideListQuerySchema),
  list
);
router.get(
  '/slug/:slug',
  optionalAuthMiddleware,
  loadUserMiddleware,
  validateParams(slugParam),
  getBySlug
);
router.get(
  '/:id',
  optionalAuthMiddleware,
  loadUserMiddleware,
  validateParams(idParam),
  getById
);
router.post(
  '/',
  authMiddleware,
  loadUserMiddleware,
  validateBody(createGuideSchema),
  create
);
router.patch(
  '/:id',
  authMiddleware,
  loadUserMiddleware,
  validateParams(idParam),
  validateBody(updateGuideSchema),
  update
);
router.delete(
  '/:id',
  authMiddleware,
  loadUserMiddleware,
  validateParams(idParam),
  remove
);
router.get(
  '/:guideId/markers',
  optionalAuthMiddleware,
  loadUserMiddleware,
  validateParams(guideIdParam),
  getGuideMarkers
);

export default router;
