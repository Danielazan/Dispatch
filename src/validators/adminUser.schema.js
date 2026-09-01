import { z } from 'zod';

export const createAdminUserSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  roleId: z.string().uuid('Invalid role ID format.').min(1, 'Role ID is required.'),
});

export const updateAdminUserSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.').optional(),
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters.').optional(),
  roleId: z.string().uuid('Invalid role ID format.').min(1).optional(),
  isActive: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update.',
  path: [],
});