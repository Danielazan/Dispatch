import './src/config/env.js';
import app from './src/app.js';
import { env } from './src/config/env.js';
import { logger } from './src/utils/logger.js';
import { prisma } from './src/config/prisma.js';

// Job imports
import { expireOnboardingSessionsJob } from './src/jobs/expireOnboardingSessions.job.js';
import { onboardingReminderJob } from './src/jobs/onboardingReminder.job.js';
import { syncExternalLoadsJob } from './src/jobs/syncExternalLoads.job.js';

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 AIK backend running on port ${env.PORT}`);

  // Start scheduled jobs (skip in test environment)
  if (env.NODE_ENV !== 'test') {
    expireOnboardingSessionsJob.start();
    onboardingReminderJob.start();
    syncExternalLoadsJob.start();
    logger.info('⏰ Scheduled jobs started');
  }
});

const shutdown = async (signal) => {
  logger.info(`${signal} received, shutting down gracefully...`);
  
  // Stop jobs cleanly
  expireOnboardingSessionsJob.stop();
  onboardingReminderJob.stop();
  syncExternalLoadsJob.stop();
  logger.info('⏰ Scheduled jobs stopped');

  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));