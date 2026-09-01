import { Router } from 'express';
import { requireAdminAuth } from '../middleware/auth.js';
import { requirePermission } from '../middleware/requirePermission.js';
import { validate } from '../middleware/validate.js';
import { PERMISSIONS } from '../config/constants.js';
import { listLoadsSchema, createLoadSchema, updateLoadSchema } from '../validators/load.schema.js';
import * as loadsController from '../controllers/loads.controller.js';

const router = Router();

router.get(
  '/',
  requireAdminAuth,
  requirePermission(PERMISSIONS.LOADS_VIEW),
  validate({ query: listLoadsSchema }),
  loadsController.listLoads
);

router.post(
  '/',
  requireAdminAuth,
  requirePermission(PERMISSIONS.LOADS_MANAGE),
  validate({ body: createLoadSchema }),
  loadsController.createLoad
);

router.patch(
  '/:id',
  requireAdminAuth,
  requirePermission(PERMISSIONS.LOADS_MANAGE),
  validate({ body: updateLoadSchema }),
  loadsController.updateLoad
);

router.delete(
  '/:id',
  requireAdminAuth,
  requirePermission(PERMISSIONS.LOADS_MANAGE),
  loadsController.deleteLoad
);

export default router;