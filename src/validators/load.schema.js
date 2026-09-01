import { z } from 'zod';

export const listLoadsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: z.string().optional(),
  carrierId: z.string().optional(),
  merged: z.enum(['true', 'false']).default('false'),
});

const loadBodyFields = {
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  pickupDate: z.string().datetime().optional().nullable(),
  deliveryDate: z.string().datetime().optional().nullable(),
  rate: z.number().positive().optional().nullable(),
  carrierId: z.string().optional().nullable(),
};

export const createLoadSchema = z.object(loadBodyFields);
export const updateLoadSchema = z.object(loadBodyFields).partial();