import { Router } from 'express';
import { requireAdminAuth } from '../middleware/auth.js';
import { requirePermission } from '../middleware/requirePermission.js';
import { PERMISSIONS } from '../config/constants.js';
import { getCarrierAgreement } from '../controllers/agreement.controller.js';

const router = Router();

router.get(
  '/carriers/:id/agreement',
  requireAdminAuth,
  requirePermission(PERMISSIONS.CARRIERS_VIEW),
  getCarrierAgreement
);

export default router;