import crypto from 'crypto';
import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import {
  CARRIER_STATUS,
  LEAD_STATUS,
  ONBOARDING_SESSION_STATUS,
} from '../config/constants.js';
import { env } from '../config/env.js';
import { evaluateSubmission } from '../services/submissionRequirements.js';
import { verificationService } from '../services/verificationService.js';
import { signatureService } from '../services/signatureService.js';
import { auditLogService } from '../services/auditLogService.js';
import { emailService } from '../services/emailService.js';

const SECTION_FIELD_MAP = {
  1: ['legalName', 'dbaName', 'authorityNumber', 'dotNumber', 'ein', 'address', 'phone', 'email'],
  2: ['activeTrucksCount', 'truckType', 'trailerConfig', 'maxFreightWeight', 'carriesTarps', 'tarpSize', 'strapCount', 'chainBinderCount', 'hasFastCard', 'hasTwicCard'],
  3: ['preferredOrigins', 'preferredDestinations', 'minRatePerMile', 'prohibitedLocations', 'comfortableWithLayovers'],
  4: ['paymentPreference', 'factoringCompanyName', 'factoringNoaEmail'],
  5: ['dispatchContactName', 'dispatchPhone', 'dispatchEmail', 'afterHoursCell', 'accountingEmail'],
  6: [],
  7: [],
};

const sanitize = (value) => (value === '' ? null : value);

export const getOnboardingSession = asyncHandler(async (req, res) => {
  const session = req.onboardingSession;

  let documents = [];

  if (session.carrier) {
    documents = Array.isArray(session.carrier.documents)
      ? session.carrier.documents
      : await prisma.carrierDocument.findMany({
          where: { carrierId: session.carrier.id },
        });
  }

  return res.json({
    success: true,
    data: {
      status: session.status,
      readOnly: session.readOnly,
      expiresAt: session.expiresAt,
      submittedAt: session.submittedAt ?? null,
      furthestCompletedSection: session.furthestCompletedSection ?? 0,
      lead: {
        companyName: session.lead.companyName,
        contactName: session.lead.contactName,
        email: session.lead.email,
        phone: session.lead.phone ?? null,
      },
      carrier: session.carrier
        ? {
            id: session.carrier.id,
            status: session.carrier.status,
            verificationStatus: session.carrier.verificationStatus,
            agreementStatus: session.carrier.agreementStatus,
            legalName: session.carrier.legalName,
            dbaName: session.carrier.dbaName,
            authorityNumber: session.carrier.authorityNumber,
            dotNumber: session.carrier.dotNumber,
            ein: session.carrier.ein,
            address: session.carrier.address,
            phone: session.carrier.phone,
            email: session.carrier.email,
            paymentPreference: session.carrier.paymentPreference,
            factoringCompanyName: session.carrier.factoringCompanyName,
            documents: documents.map((doc) => ({
              id: doc.id,
              documentType: doc.documentType,
              fileName: doc.fileName,
              reviewStatus: doc.reviewStatus,
            })),
          }
        : null,
    },
  });
});

export const saveCarrierSection = asyncHandler(async (req, res) => {
  const session = req.onboardingSession;

  if (session.readOnly) {
    throw new ApiError(
      423,
      'This onboarding session has already been submitted and is now read-only.',
      { code: 'session_locked' }
    );
  }

  const { section, data = {} } = req.body;

  const carrierUpdates = {};

  for (const field of SECTION_FIELD_MAP[section] ?? []) {
    if (data[field] !== undefined) {
      carrierUpdates[field] = sanitize(data[field]);
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    const carrier = session.carrier
      ? await tx.carrier.update({
          where: { id: session.carrier.id },
          data: carrierUpdates,
        })
      : await tx.carrier.create({
          data: {
            onboardingSessionId: session.id,
            status: CARRIER_STATUS.DRAFT,
            ...carrierUpdates,
          },
        });

    if (
      session.lead.status === LEAD_STATUS.NEW ||
      session.lead.status === LEAD_STATUS.LINK_SENT
    ) {
      await tx.lead.update({
        where: { id: session.leadId },
        data: { status: LEAD_STATUS.ONBOARDING_STARTED },
      });
    }

    const updatedSession = await tx.onboardingSession.update({
      where: { id: session.id },
      data: {
        status: ONBOARDING_SESSION_STATUS.ACTIVE,
        furthestCompletedSection: Math.max(
          session.furthestCompletedSection ?? 0,
          section
        ),
      },
    });

    return { carrier, updatedSession };
  });

  return res.json({
    success: true,
    data: {
      section,
      furthestCompletedSection: result.updatedSession.furthestCompletedSection,
      carrier: {
        id: result.carrier.id,
        status: result.carrier.status,
        legalName: result.carrier.legalName,
        paymentPreference: result.carrier.paymentPreference,
        factoringCompanyName: result.carrier.factoringCompanyName,
      },
    },
  });
});

export const submitOnboarding = asyncHandler(async (req, res) => {
  const session = req.onboardingSession;

  if (session.readOnly) {
    throw new ApiError(423, 'Onboarding session is already submitted or locked', {
      code: 'session_locked',
    });
  }

  const evaluation = evaluateSubmission(session);

  if (!evaluation.complete) {
    const details = [
      ...evaluation.missingCarrierFields.map((field) => ({
        path: `carrier.${field}`,
        message: `Missing required field: ${field}`,
      })),
      ...evaluation.missingDocuments.map((docType) => ({
        path: `documents.${docType}`,
        message: `Missing required document: ${docType}`,
      })),
    ];

    return res.status(422).json({
      success: false,
      error: {
        code: 'submission_incomplete',
        message: 'Onboarding is incomplete',
        details,
      },
    });
  }

  const now = new Date();
  const currentFurthest = session.furthestCompletedSection || 0;
  const newFurthest = Math.max(currentFurthest, 7);

  await prisma.$transaction(async (tx) => {
    await tx.onboardingSession.update({
      where: { id: session.id },
      data: {
        status: ONBOARDING_SESSION_STATUS.SUBMITTED,
        submittedAt: now,
        furthestCompletedSection: newFurthest,
      },
    });

    await tx.carrier.update({
      where: { id: session.carrier.id },
      data: {
        status: CARRIER_STATUS.ADMIN_REVIEW,
        verificationStatus: 'pending',
        agreementStatus: 'sent',
      },
    });

    await tx.lead.update({
      where: { id: session.leadId },
      data: { status: LEAD_STATUS.ONBOARDING_SUBMITTED },
    });
  });

  // Fire and forget async services
  verificationService.triggerVerification({ carrierId: session.carrier.id }).catch(() => {});
  signatureService.triggerSignature({ carrierId: session.carrier.id }).catch(() => {});

  auditLogService
    .log({
      action: 'onboarding_submitted',
      entityType: 'OnboardingSession',
      entityId: session.id,
      details: { carrierId: session.carrier.id, leadId: session.leadId },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    })
    .catch(() => {});

  return res.status(200).json({
    success: true,
    data: {
      message: 'Onboarding submitted',
      status: 'submitted',
      submittedAt: now.toISOString(),
    },
  });
});


/* ============ resendOnboardingLink v1 (PART 3 / GAP-005) ============ */
export const resendOnboardingLink = asyncHandler(async (req, res) => {
  const { token } = req.params;

  // Looser lookup on purpose: resend must work on EXPIRED tokens (Decision 5),
  // so we do NOT use validateOnboardingToken here (it 410s expired tokens).
  const session = await prisma.onboardingSession.findUnique({
    where: { token },
    include: { lead: true },
  });

  if (!session) {
    throw new ApiError(404, 'Onboarding session not found', { code: 'session_not_found' });
  }
  if (session.status === ONBOARDING_SESSION_STATUS.SUBMITTED) {
    throw new ApiError(423, 'This application has already been submitted.', { code: 'session_locked' });
  }
  if (session.status === ONBOARDING_SESSION_STATUS.REVOKED) {
    throw new ApiError(410, 'This onboarding link has been revoked.', { code: 'revoked' });
  }

  const newToken = crypto.randomBytes(32).toString('hex');
  const newExpiresAt = new Date();
  newExpiresAt.setDate(newExpiresAt.getDate() + env.ONBOARDING_TOKEN_TTL_DAYS);

  // SAME row: old token dies immediately (Decision 5)
  await prisma.onboardingSession.update({
    where: { id: session.id },
    data: {
      token: newToken,
      expiresAt: newExpiresAt,
      status: ONBOARDING_SESSION_STATUS.ACTIVE,
    },
  });

  // Email ONLY the address on file ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â no email field in the request
  emailService.sendOnboardingLink({ lead: session.lead, token: newToken }).catch(() => {});

  auditLogService
    .log({
      action: 'onboarding_link_resent',
      entityType: 'OnboardingSession',
      entityId: session.id,
      details: { leadId: session.leadId, previousTokenPrefix: token.slice(0, 8) },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    })
    .catch(() => {});

  return res.status(200).json({
    success: true,
    data: { message: 'A new onboarding link has been sent to the email on file.' },
  });
});

/* ============ sendSupportMessage v1 (PART 4 / GAP-013 direct send) ============ */
export const sendSupportMessage = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { name, email, subject, message } = req.body;

  // Loose lookup (same pattern as resend) ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â ties the message to the carrier's file.
  const session = await prisma.onboardingSession.findUnique({
    where: { token },
    include: { lead: true, carrier: true },
  });
  if (!session) {
    throw new ApiError(404, 'Onboarding session not found', { code: 'session_not_found' });
  }

  const carrierId = session.carrier?.id;
  const applicationId = carrierId
    ? `AIK-${carrierId.slice(0, 4).toUpperCase()}-${carrierId.slice(4, 8).toUpperCase()}`
    : null;

  await emailService.sendSupportMessage({ name, email, subject, message, applicationId, leadId: session.leadId });

  return res.status(200).json({
    success: true,
    data: { message: 'Support message sent. We will reply to your email.' },
  });
});