import cron from 'node-cron';
import { prisma } from '../config/prisma.js';
import { logger } from '../utils/logger.js';
import { ONBOARDING_SESSION_STATUS, LEAD_STATUS } from '../config/constants.js';

const TASK_NAME = 'expireOnboardingSessions';

async function run() {
  try {
    const now = new Date();
    const expiredSessions = await prisma.onboardingSession.findMany({
      where: {
        status: ONBOARDING_SESSION_STATUS.ACTIVE,
        expiresAt: { lt: now },
      },
      include: { lead: true },
    });

    if (expiredSessions.length === 0) return;

    logger.info({ count: expiredSessions.length }, `Job [${TASK_NAME}]: Found expired sessions`);

    for (const session of expiredSessions) {
      await prisma.$transaction([
        prisma.onboardingSession.update({
          where: { id: session.id },
          data: { status: ONBOARDING_SESSION_STATUS.EXPIRED },
        }),
        // Decision 16: Lead becomes abandoned if session expires without submission
        ...(session.lead.status !== LEAD_STATUS.CONVERTED && session.lead.status !== LEAD_STATUS.ONBOARDING_SUBMITTED
          ? [prisma.lead.update({
              where: { id: session.leadId },
              data: { status: LEAD_STATUS.ABANDONED },
            })]
          : []),
      ]);
    }
  } catch (err) {
    logger.error({ err }, `Job [${TASK_NAME}] failed`);
  }
}

export const expireOnboardingSessionsJob = {
  start: () => cron.schedule('0 * * * *', run, { name: TASK_NAME }), // Every hour
  stop: () => cron.getTasks().get(TASK_NAME)?.stop(),
  runNow: run,
};