import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { VERIFICATION_METHOD } from '../config/constants.js';

async function withRetry(fn, maxAttempts = 3) {
  let lastError;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      logger.warn({ err: err.message, attempt: i + 1 }, 'Verification provider call failed, retrying...');
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw lastError;
}

function performFormatCheck(carrier) {
  const dotValid = carrier.dotNumber && /^\d{1,8}$/.test(carrier.dotNumber);
  const mcValid = !carrier.authorityNumber || /^MC\d{1,7}$/.test(carrier.authorityNumber);
  const einValid = !carrier.ein || /^\d{2}-\d{7}$/.test(carrier.ein);

  if (dotValid && mcValid && einValid) {
    return {
      status: 'manual_pending',
      raw: { formatCheck: 'passed', reason: 'Credentials missing, queued for manual review' },
    };
  }
  return {
    status: 'not_found',
    raw: { formatCheck: 'failed', reason: 'Invalid format for DOT/MC/EIN' },
  };
}

export const verificationService = {
  async triggerVerification({ carrierId }) {
    try {
      const carrier = await prisma.carrier.findUnique({ where: { id: carrierId } });
      if (!carrier) {
        logger.error({ carrierId }, 'Carrier not found for verification');
        return;
      }

      let method = VERIFICATION_METHOD.FORMAT_CHECK;
      let resultStatus = 'manual_pending';
      let rawResponse = {};

      const hasFmcsa = !!env.FMCSA_WEBKEY;
      const hasCanada = !!env.CANADA_AGGREGATOR_API_KEY;

      try {
        if (hasFmcsa) {
          method = VERIFICATION_METHOD.FMCSA_API;
          await withRetry(async () => {
            // Real FMCSA implementation lands when credentials arrive
            throw new Error('FMCSA real implementation pending');
          });
        } else if (hasCanada) {
          method = VERIFICATION_METHOD.AGGREGATOR_API;
          await withRetry(async () => {
            // Real Canada aggregator implementation lands when credentials arrive
            throw new Error('Canada aggregator real implementation pending');
          });
        } else {
          const fallback = performFormatCheck(carrier);
          method = VERIFICATION_METHOD.FORMAT_CHECK;
          resultStatus = fallback.status;
          rawResponse = fallback.raw;
        }
      } catch (providerError) {
        logger.error(
          { err: providerError.message, carrierId },
          'Verification provider failed, falling back to manual_pending'
        );
        method = VERIFICATION_METHOD.MANUAL_REVIEW;
        resultStatus = 'manual_pending';
        rawResponse = { error: providerError.message, fallback: true };
      }

      await prisma.$transaction(async (tx) => {
        await tx.verificationResult.create({
          data: {
            carrierId,
            method,
            status: resultStatus,
            rawResponse,
            legalNameMatch: null,
            activeStatusMatch: null,
          },
        });

        await tx.carrier.update({
          where: { id: carrierId },
          data: { verificationStatus: resultStatus },
        });
      });

      logger.info({ carrierId, method, resultStatus }, 'Verification completed');
    } catch (err) {
      logger.error({ err, carrierId }, 'Failed to process verification');
    }
  },
};