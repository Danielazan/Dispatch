import cron from 'node-cron';
import { prisma } from '../config/prisma.js';
import { logger } from '../utils/logger.js';
import { emailService } from '../services/emailService.js';
import { ONBOARDING_SESSION_STATUS } from '../config/constants.js';

const TASK_NAME = 'onboardingReminder';

async function run() {
  try {
    const activeSessions = await prisma.onboardingSession.findMany({
      where: { status: ONBOARDING_SESSION_STATUS.ACTIVE },
      include: { lead: true },
    });

    if (activeSessions.length === 0) return;

    const now = new Date();
    let sentCount = 0;

    for (const session of activeSessions) {
      // Count existing reminder emails for this lead (avoids schema migration)
      const reminderEmails = await prisma.emailLog.count({
        where: {
          leadId: session.leadId,
          subject: { contains: 'Onboarding Reminder' },
          status: 'sent',
        },
      });

      if (reminderEmails >= 3) continue;

      const daysSinceCreation = Math.floor((now - session.createdAt) / (1000 * 60 * 60 * 24));
      let shouldSend = false;
      let reminderNumber = 0;

      // Decision 22: 3 days, then every 7 days (Day 3, Day 10, Day 17)
      if (reminderEmails === 0 && daysSinceCreation >= 3) {
        shouldSend = true;
        reminderNumber = 1;
      } else if (reminderEmails === 1 && daysSinceCreation >= 10) {
        shouldSend = true;
        reminderNumber = 2;
      } else if (reminderEmails === 2 && daysSinceCreation >= 17) {
        shouldSend = true;
        reminderNumber = 3;
      }

      if (shouldSend) {
        await emailService.sendOnboardingReminder({
          lead: session.lead,
          token: session.token,
          reminderNumber,
        });
        sentCount++;
      }
    }

    if (sentCount > 0) {
      logger.info({ sentCount }, `Job [${TASK_NAME}]: Sent reminder emails`);
    }
  } catch (err) {
    logger.error({ err }, `Job [${TASK_NAME}] failed`);
  }
}

export const onboardingReminderJob = {
  start: () => cron.schedule('0 9 * * *', run, { name: TASK_NAME }), // Daily at 9 AM
  stop: () => cron.getTasks().get(TASK_NAME)?.stop(),
  runNow: run,
};