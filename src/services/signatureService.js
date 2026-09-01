import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { AGREEMENT_METHOD, AGREEMENT_STATUS } from '../config/constants.js';

export const signatureService = {
  async triggerSignature({ carrierId }) {
    try {
      const hasDocuSign = !!(
        env.DOCUSIGN_INTEGRATION_KEY &&
        env.DOCUSIGN_USER_ID &&
        env.DOCUSIGN_ACCOUNT_ID &&
        env.DOCUSIGN_PRIVATE_KEY &&
        env.DOCUSIGN_BASE_URL
      );

      if (hasDocuSign) {
        // DocuSign implementation will land here when credentials arrive
        logger.info({ carrierId }, 'DocuSign credentials found - implementation pending');
      }
      
      // Custom capture fallback (Decision 28)
      await prisma.$transaction(async (tx) => {
        // Void/expire any non-signed latest agreement (Decision 15)
        await tx.agreement.updateMany({
          where: {
            carrierId,
            status: {
              in: [AGREEMENT_STATUS.PENDING, AGREEMENT_STATUS.SENT],
            },
          },
          data: { status: AGREEMENT_STATUS.VOIDED },
        });

        // Create NEW Agreement row
        await tx.agreement.create({
          data: {
            carrierId,
            method: AGREEMENT_METHOD.CUSTOM_CAPTURE,
            status: AGREEMENT_STATUS.SENT,
          },
        });

        // Ensure carrier.agreementStatus = 'sent'
        await tx.carrier.update({
          where: { id: carrierId },
          data: { agreementStatus: AGREEMENT_STATUS.SENT },
        });
      });

      logger.info({ carrierId, method: AGREEMENT_METHOD.CUSTOM_CAPTURE }, 'Signature/Agreement triggered (custom capture)');
    } catch (err) {
      logger.error({ err, carrierId }, 'Failed to trigger signature');
      // Technical failure -> agreementStatus = 'failed' (Decision 12/13)
      await prisma.carrier.update({
        where: { id: carrierId },
        data: { agreementStatus: AGREEMENT_STATUS.FAILED },
      }).catch(e => logger.error({ e, carrierId }, 'Failed to update agreement status to failed'));
    }
  },
};