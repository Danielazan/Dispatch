import { Router } from 'express';
import { requireAdminAuth } from '../middleware/auth.js';
import { requirePermission } from '../middleware/requirePermission.js';
import { validate } from '../middleware/validate.js';
import { PERMISSIONS } from '../config/constants.js';
import { createAdminRoleSchema, updateRolePermissionsSchema } from '../validators/adminRole.schema.js';
import { listAdminRoles, createAdminRole, updateRolePermissions } from '../controllers/adminRoles.controller.js';

const router = Router();

router.use(requireAdminAuth);
router.use(requirePermission(PERMISSIONS.ROLES_MANAGE));

router.get('/', listAdminRoles);
router.post('/', validate({ body: createAdminRoleSchema }), createAdminRole);
router.patch('/:id/permissions', validate({ body: updateRolePermissionsSchema }), updateRolePermissions);

export default router;