import { z } from 'zod';

export const overrideVerificationSchema = z.object({
  status: z.enum(['admin_confirmed', 'rejected']),
  adminNotes: z.string().min(1).optional(),
});