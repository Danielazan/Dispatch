import { prisma } from '../config/prisma.js';
import { logger } from '../utils/logger.js';

export const auditLogService = {
  async log({
    actorUserId = null,
    actorEmail = null,
    action,
    entityType,
    entityId = null,
    details = null,
    ipAddress = null,
    userAgent = null,
  } = {}) {
    try {
      const payload = {
        action,
        entityType,
        entityId,
        ipAddress,
        userAgent,
      };

      if (actorUserId) {
        payload.adminUser = { connect: { id: actorUserId } };
      }

      const mergedDetails = details ?? (actorEmail ? { actorEmail } : undefined);
      if (mergedDetails !== undefined) {
        payload.details = mergedDetails;
      }

      await prisma.auditLog.create({ data: payload });
    } catch (err) {
      logger.warn({ err, action }, 'Audit log write failed (non-blocking)');
    }
  },
};