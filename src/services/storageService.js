import fs from 'fs/promises';
import path from 'path';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const storageService = {
  resolvePath(fileName) {
    return path.join(env.UPLOAD_DIR, fileName);
  },
  async exists(fileName) {
    try {
      await fs.access(this.resolvePath(fileName));
      return true;
    } catch {
      return false;
    }
  },
  async deleteFile(fileName) {
    try {
      await fs.unlink(this.resolvePath(fileName));
      return true;
    } catch (err) {
      if (err.code === 'ENOENT') return false;
      logger.error({ err, fileName }, 'Failed to delete file from storage');
      throw err;
    }
  },
};