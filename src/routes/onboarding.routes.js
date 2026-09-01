import { Router } from 'express';
import { env } from '../config/env.js';
import {
  onboardingPublicLimiter,
  documentUploadLimiter,
  customSignatureLimiter,
  resendOnboardingLinkLimiter,
  supportMessageLimiter,
} from '../middleware/rateLimiter.js';
import { validateOnboardingToken } from '../middleware/validateOnboardingToken.js';
import { validate } from '../middleware/validate.js';
import { uploadDocument } from '../middleware/upload.js';
import { saveCarrierSectionSchema, submitOnboardingSchema } from '../validators/onboarding.schema.js';
import { customSignatureSchema } from '../validators/agreement.schema.js';
import { supportMessageSchema } from '../validators/support.schema.js';
import * as onboardingController from '../controllers/onboarding.controller.js';
import * as carrierDocumentsController from '../controllers/carrierDocuments.controller.js';
import * as agreementController from '../controllers/agreement.controller.js';

const router = Router();

router.use(onboardingPublicLimiter);

router.get('/:token', validateOnboardingToken, onboardingController.getOnboardingSession);

router.patch(
  '/:token/carrier',
  validateOnboardingToken,
  validate({ body: saveCarrierSectionSchema }),
  onboardingController.saveCarrierSection
);

// Stage 10 Agreement Endpoints
router.get('/:token/agreement', validateOnboardingToken, agreementController.getAgreement);
router.get('/:token/signature-url', validateOnboardingToken, agreementController.getSignatureUrl);
router.post(
  '/:token/custom-signature',
  validateOnboardingToken,
  customSignatureLimiter,
  validate({ body: customSignatureSchema }),
  agreementController.submitCustomSignature
);

if (env.NODE_ENV !== 'production') {
  router.post('/:token/documents/dev-seed', validateOnboardingToken, carrierDocumentsController.devSeedDocument);
}

router.post(
  '/:token/documents',
  validateOnboardingToken,
  documentUploadLimiter,
  carrierDocumentsController.preflightDocumentUpload,
  uploadDocument,
  carrierDocumentsController.uploadDocument
);

router.post(
  '/:token/submit',
  validateOnboardingToken,
  validate({ body: submitOnboardingSchema }),
  onboardingController.submitOnboarding
);

router.delete('/:token/documents/:documentId', validateOnboardingToken, carrierDocumentsController.deleteDocument);

/* PART 3 / GAP-005 — public resend. Deliberately NO validateOnboardingToken:
   it must work on expired-but-not-revoked tokens (Decision 5). */
router.post(
  '/:token/resend',
  resendOnboardingLinkLimiter,
  onboardingController.resendOnboardingLink
);

/* PART 4 / GAP-013 — direct support message (backend delivers via emailService). */
router.post(
  '/:token/support-message',
  supportMessageLimiter,
  validate({ body: supportMessageSchema }),
  onboardingController.sendSupportMessage
);

export default router;