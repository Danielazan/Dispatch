import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ONBOARDING_SESSION_STATUS } from '../config/constants.js';

export const validateOnboardingToken = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    throw new ApiError(404, 'Onboarding token is required', {
      code: 'token_required',
    });
  }

    const session = await prisma.onboardingSession.findUnique({
    where: { token },
    include: {
      lead: true,
      carrier: {
        include: {
          documents: true, // <-- ADD THIS
        },
      },
    },
  });

  if (!session) {
    throw new ApiError(404, 'Onboarding session not found', {
      code: 'session_not_found',
    });
  }

  const now = new Date();
  const isExpiredByStatus =
    session.status === ONBOARDING_SESSION_STATUS.EXPIRED ||
    session.status === ONBOARDING_SESSION_STATUS.REVOKED;
  const isExpiredByDate = session.expiresAt < now;

  if (isExpiredByStatus || isExpiredByDate) {
    throw new ApiError(410, 'Onboarding link has expired', {
      code: 'expired',
    });
  }

  if (session.status === ONBOARDING_SESSION_STATUS.SUBMITTED) {
    req.onboardingSession = { ...session, readOnly: true };
    return next();
  }

  req.onboardingSession = { ...session, readOnly: false };
  next();
});