import cron from 'node-cron';
import { logger } from '../utils/logger.js';
import { loadBoardService } from '../services/loadBoardService.js';

const TASK_NAME = 'syncExternalLoads';

async function run() {
  try {
    const result = await loadBoardService.syncExternalLoads();
    if (!result.skipped) {
      logger.info(result, `Job [${TASK_NAME}]: Sync complete`);
    }
  } catch (err) {
    logger.error({ err }, `Job [${TASK_NAME}] failed`);
  }
}

export const syncExternalLoadsJob = {
  start: () => cron.schedule('*/15 * * * *', run, { name: TASK_NAME }), // Every 15 mins
  stop: () => cron.getTasks().get(TASK_NAME)?.stop(),
  runNow: run,
};