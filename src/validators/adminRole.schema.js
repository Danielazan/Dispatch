import { z } from 'zod';
import { PERMISSIONS } from '../config/constants.js';

const permissionKeysEnum = z.enum([
  PERMISSIONS.LEADS_VIEW,
  PERMISSIONS.LEADS_RESEND,
  PERMISSIONS.CARRIERS_VIEW,
  PERMISSIONS.CARRIERS_APPROVE,
  PERMISSIONS.DOCUMENTS_VIEW,
  PERMISSIONS.DOCUMENTS_REVIEW,
  PERMISSIONS.VERIFICATION_VIEW,
  PERMISSIONS.VERIFICATION_OVERRIDE,
  PERMISSIONS.LOADS_VIEW,
  PERMISSIONS.LOADS_MANAGE,
  PERMISSIONS.STAFF_MANAGE,
  PERMISSIONS.ROLES_MANAGE,
]);

export const createAdminRoleSchema = z.object({
  name: z.string().trim().min(2, 'Role name must be at least 2 characters.'),
  permissionKeys: z.array(permissionKeysEnum).optional(),
});

export const updateRolePermissionsSchema = z.object({
  permissionKeys: z.array(permissionKeysEnum).min(1, 'At least one permission key is required.'),
});