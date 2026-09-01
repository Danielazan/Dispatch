import { Router } from 'express';
import { env } from '../config/env.js';
import { publicLeadLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';
import { createLeadSchema } from '../validators/lead.schema.js';
import * as leadsController from '../controllers/leads.controller.js';

const router = Router();

/* POST /api/leads — public lead creation + onboarding email */
router.post(
  '/',
  publicLeadLimiter,
  validate({ body: createLeadSchema }),
  leadsController.createLead
);

/* GET /api/leads/dev/last-token — dev-only helper to bypass email round-trip */
if (env.NODE_ENV !== 'production') {
  router.get('/dev/last-token', leadsController.getLastToken);
}

export default router;