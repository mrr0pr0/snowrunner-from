import authRoutes from './authRoutes.js';
import guideRoutes from './guideRoutes.js';
import markerRoutes from './markerRoutes.js';
import commentRoutes from './commentRoutes.js';
import { Router, type IRouter } from 'express';

 const router: IRouter = Router();

router.use('/auth', authRoutes);
router.use('/guides', guideRoutes);
router.use('/markers', markerRoutes);
router.use('/comments', commentRoutes);

export default router;