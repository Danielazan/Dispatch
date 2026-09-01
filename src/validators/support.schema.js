import { z } from 'zod';

export const supportMessageSchema = z.object({
  name: z.string().trim().min(1, 'Name cannot be empty'),
  email: z.string().trim().email('Please enter a valid email address'),
  subject: z.string().trim().min(1, 'Subject cannot be empty'),
  message: z.string().trim().min(1, 'Message cannot be empty').max(2000, 'Message is too long'),
});