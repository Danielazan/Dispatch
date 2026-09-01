import { Router } from 'express';
import { requireAdminAuth } from '../middleware/auth.js';
import { requirePermission } from '../middleware/requirePermission.js';
import { validate } from '../middleware/validate.js';
import { PERMISSIONS } from '../config/constants.js';
import { listCarriersSchema, rejectCarrierSchema } from '../validators/carrier.schema.js';
import * as carriersController from '../controllers/carriers.controller.js';

const router = Router();

router.use(requireAdminAuth);

router.get(
  '/',
  requirePermission(PERMISSIONS.CARRIERS_VIEW),
  validate({ query: listCarriersSchema }),
  carriersController.listCarriers
);

router.get(
  '/:id',
  requirePermission(PERMISSIONS.CARRIERS_VIEW),
  carriersController.getCarrier
);

router.patch(
  '/:id/approve',
  requirePermission(PERMISSIONS.CARRIERS_APPROVE),
  carriersController.approveCarrier
);

router.patch(
  '/:id/activate',
  requirePermission(PERMISSIONS.CARRIERS_APPROVE), // Decision 11
  carriersController.activateCarrier
);

router.patch(
  '/:id/reject',
  requirePermission(PERMISSIONS.CARRIERS_APPROVE), // Using approve permission as agreed
  validate({ body: rejectCarrierSchema }),
  carriersController.rejectCarrier
);

export default router;