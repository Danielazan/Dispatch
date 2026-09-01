import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { loginSchema, changePasswordSchema } from '../validators/adminAuth.schema.js';
import { adminLoginLimiter } from '../middleware/rateLimiter.js';
import { requireAdminAuth } from '../middleware/auth.js';
import { login, refresh, logout, me, changePassword } from '../controllers/adminAuth.controller.js';

const router = Router();

router.post('/login', adminLoginLimiter, validate({ body: loginSchema }), login);
router.post('/refresh', refresh);
router.post('/logout', requireAdminAuth, logout);
router.get('/me', requireAdminAuth, me);
router.patch('/password', requireAdminAuth, validate({ body: changePasswordSchema }), changePassword);

export default router;