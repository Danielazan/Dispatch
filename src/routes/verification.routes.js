import { Router } from 'express';
import { requireAdminAuth } from '../middleware/auth.js';
import { requirePermission } from '../middleware/requirePermission.js';
import { validate } from '../middleware/validate.js';
import { PERMISSIONS } from '../config/constants.js';
import {
  getCarrierVerificationResults,
  overrideVerificationResult,
} from '../controllers/verification.controller.js';
import { overrideVerificationSchema } from '../validators/verification.schema.js';

const router = Router();

router.get(
  '/carriers/:id/verification-results',
  requireAdminAuth,
  requirePermission(PERMISSIONS.VERIFICATION_VIEW),
  getCarrierVerificationResults
);

router.patch(
  '/verification-results/:id/override',
  requireAdminAuth,
  requirePermission(PERMISSIONS.VERIFICATION_OVERRIDE),
  validate({ body: overrideVerificationSchema }),
  overrideVerificationResult
);

export default router;