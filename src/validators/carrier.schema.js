import { z } from 'zod';

export const listCarriersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: z.string().optional(),
});

export const rejectCarrierSchema = z.object({
  reason: z.string().min(1, 'Rejection reason is required'),
});