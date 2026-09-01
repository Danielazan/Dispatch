import rateLimit from 'express-rate-limit';

const createLimiter = ({ windowMs, limit, message, keyGenerator }) => {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    ...(keyGenerator ? { keyGenerator } : {}),
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: { code: 'rate_limited', message },
      });
    },
  });
};

export const publicLeadLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: 'Too many lead submissions, please try again later',
});

export const onboardingPublicLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  message: 'Too many onboarding requests, please try again later',
});

export const adminLoginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: 'Too many login attempts, please try again later',
});

export const documentUploadLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 20,
  message: 'Too many uploads, please try again later',
  keyGenerator: (req) => req.params?.token || req.ip,
});

export const customSignatureLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: 'Too many signature attempts, please try again later',
  keyGenerator: (req) => req.params?.token || req.ip,
});

/* PART 3 / GAP-005 — public resend (3/hour/token-or-IP) */
export const resendOnboardingLinkLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  message: 'Too many resend attempts — please wait before requesting another link.',
  keyGenerator: (req) => req.params?.token || req.ip,
});

/* PART 4 / GAP-013 — support message (5/hour/token-or-IP) */
export const supportMessageLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: 'Too many support messages — please wait a few minutes before sending another.',
  keyGenerator: (req) => req.params?.token || req.ip,
});