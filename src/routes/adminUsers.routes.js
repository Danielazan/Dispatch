import { Router } from 'express';
import { requireAdminAuth } from '../middleware/auth.js';
import { requirePermission } from '../middleware/requirePermission.js';
import { validate } from '../middleware/validate.js';
import { PERMISSIONS } from '../config/constants.js';
import { createAdminUserSchema, updateAdminUserSchema } from '../validators/adminUser.schema.js';
import { listAdminUsers, createAdminUser, updateAdminUser } from '../controllers/adminUsers.controller.js';

const router = Router();

router.use(requireAdminAuth);
router.use(requirePermission(PERMISSIONS.STAFF_MANAGE));

router.get('/', listAdminUsers);
router.post('/', validate({ body: createAdminUserSchema }), createAdminUser);
router.patch('/:id', validate({ body: updateAdminUserSchema }), updateAdminUser);

export default router;