/* ============ leads.controller v3 ============ */
/* v3 fix: pass consentAccepted into prisma.lead.create() — the column is
   required (Boolean, no default). v2 omitted it → PrismaClientValidationError. */
import crypto from 'crypto';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { emailService } from '../services/emailService.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../utils/logger.js';
import { LEAD_STATUS, ONBOARDING_SESSION_STATUS } from '../config/constants.js';

/* 64-hex opaque token — not a JWT, instantly revocable by design. */
function generateOnboardingToken() {
  return crypto.randomBytes(32).toString('hex');
}

export const createLead = asyncHandler(async (req, res) => {
  const { companyName, contactName, email, phone, authorityNumber, consentAccepted } = req.body;

  /* Company name fallback: the landing form doesn't collect companyName,
     but the Prisma column is required. Contact name stands in until the
     real legalName arrives in onboarding Scene 1. */
  const resolvedCompanyName = (companyName ?? '').trim() || contactName;

  const token = generateOnboardingToken();
  const expiresAt = new Date(
    Date.now() + (env.ONBOARDING_TOKEN_TTL_DAYS ?? 14) * 24 * 60 * 60 * 1000
  );

  const result = await prisma.$transaction(async (tx) => {
    const lead = await tx.lead.create({
      data: {
        companyName: resolvedCompanyName,
        contactName,
        email,
        phone: phone || null,
        authorityNumber: authorityNumber || null,
        consentAccepted, // ← the fix (required column)
        status: LEAD_STATUS.LINK_SENT,
      },
    });

    const session = await tx.onboardingSession.create({
      data: {
        leadId: lead.id,
        token,
        expiresAt,
        status: ONBOARDING_SESSION_STATUS.ACTIVE,
      },
    });

    return { lead, session };
  });

  /* Email the magic link to the address on file. Failures are logged,
     never crash the 201 — the session row already exists. */
  try {
    await emailService.sendOnboardingLink({
      lead: { ...result.lead, onboardingSessions: [result.session] },
      token,
    });
  } catch (err) {
    logger.error({ err, leadId: result.lead.id }, 'Failed to send onboarding email after lead creation');
  }

  /* Token is NEVER returned to the public caller — email is the only channel. */
  return res.status(201).json({ success: true, data: { message: 'Lead created and onboarding link sent.' } });
});

/* Dev-only helper (route gated by NODE_ENV !== 'production'). */
export const getLastToken = asyncHandler(async (req, res) => {
  const session = await prisma.onboardingSession.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { token: true, expiresAt: true, createdAt: true },
  });
  if (!session) {
    throw new ApiError(404, 'no_sessions', 'No onboarding sessions exist yet');
  }
  return res.status(200).json({ success: true, data: session });
});