import { Router } from 'express';
import { requireAdminAuth } from '../middleware/auth.js';
import { requirePermission } from '../middleware/requirePermission.js';
import { PERMISSIONS } from '../config/constants.js';
import * as carrierDocumentsController from '../controllers/carrierDocuments.controller.js';

const router = Router();

router.get('/:id/download', requireAdminAuth, requirePermission(PERMISSIONS.DOCUMENTS_VIEW), carrierDocumentsController.downloadDocument);
router.patch('/:id/review', requireAdminAuth, requirePermission(PERMISSIONS.DOCUMENTS_REVIEW), carrierDocumentsController.reviewDocument);

export default router;
