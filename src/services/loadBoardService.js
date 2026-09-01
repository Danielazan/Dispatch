import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { LOAD_SOURCE, LOAD_STATUS } from '../config/constants.js';

const hasLoadboard = () => !!env.LOADBOARD_123_API_KEY;

async function fetchExternalLoads() {
  // Real 123Loadboard implementation lands when credentials arrive
  throw new Error('123Loadboard real implementation pending');
}

export const loadBoardService = {
  isExternalEnabled: hasLoadboard,

  async syncExternalLoads() {
    if (!hasLoadboard()) {
      logger.info('123Loadboard flag OFF - skipping external load sync');
      return { synced: 0, skipped: true };
    }
    try {
      const rawLoads = await fetchExternalLoads();
      const seenIds = [];
      for (const raw of rawLoads) {
        const providerLoadId = String(raw.providerLoadId || raw.id);
        seenIds.push(providerLoadId);
        await prisma.externalLoadCache.upsert({
          where: {
            provider_providerLoadId: {
              provider: LOAD_SOURCE.ONE_TWENTY_THREE_LOADBOARD,
              providerLoadId,
            },
          },
          update: { payload: raw, updatedAt: new Date() },
          create: {
            provider: LOAD_SOURCE.ONE_TWENTY_THREE_LOADBOARD,
            providerLoadId,
            payload: raw,
          },
        });
      }
      // Remove rows not present in the latest snapshot (stale loads)
      await prisma.externalLoadCache.deleteMany({
        where: {
          provider: LOAD_SOURCE.ONE_TWENTY_THREE_LOADBOARD,
          providerLoadId: { notIn: seenIds },
        },
      });
      return { synced: seenIds.length, skipped: false };
    } catch (err) {
      logger.error({ err: err.message }, 'External load sync failed');
      return { synced: 0, error: err.message };
    }
  },

  async getExternalLoads() {
    if (!hasLoadboard()) return [];
    const rows = await prisma.externalLoadCache.findMany({
      where: { provider: LOAD_SOURCE.ONE_TWENTY_THREE_LOADBOARD },
    });
    return rows.map((row) => {
      const p = row.payload || {};
      return {
        id: row.providerLoadId,
        title: p.title || 'External load',
        description: p.description || null,
        origin: p.origin || '',
        destination: p.destination || '',
        pickupDate: p.pickupDate || null,
        deliveryDate: p.deliveryDate || null,
        rate: p.rate ?? null,
        status: LOAD_STATUS.AVAILABLE,
        source: LOAD_SOURCE.ONE_TWENTY_THREE_LOADBOARD,
        readOnly: true,
        carrier: null,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      };
    });
  },
};