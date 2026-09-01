import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const requireAdminAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication required', { code: 'authentication_required' });
  }

  const token = authHeader.split(' ')[1];
  let payload;
  try {
    payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
  } catch {
    throw new ApiError(401, 'Invalid or expired access token', { code: 'token_invalid' });
  }

  // DB lookup per request (correctness first — role changes apply immediately)
  const adminUser = await prisma.adminUser.findUnique({
    where: { id: payload.sub },
    include: { role: { include: { rolePermissions: { include: { permission: true } } } } },
  });

  if (!adminUser || !adminUser.isActive) {
    throw new ApiError(401, 'Account is inactive or no longer exists', { code: 'account_invalid' });
  }

  req.adminUser = {
    id: adminUser.id,
    email: adminUser.email,
    fullName: adminUser.fullName,
    roleId: adminUser.roleId,
    roleName: adminUser.role.name,
    isSuperAdmin: adminUser.role.isSuperAdmin,
    permissions: adminUser.role.isSuperAdmin
      ? ['*']
      : adminUser.role.rolePermissions.map((rp) => rp.permission.key),
  };

  next();
});