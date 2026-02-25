import { Router, type IRouter } from 'express';
import { register, login, me } from '../controllers/authController.js';
import { authMiddleware, loadUserMiddleware } from '../middleware/index.js';
import { validateBody } from '../middleware/validate.js';
import { loginSchema, registerSchema } from 'shared/schemas';

const router: IRouter = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.get('/me', authMiddleware, loadUserMiddleware, me);

export default router;
