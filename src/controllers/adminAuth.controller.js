import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { auditLogService } from '../services/auditLogService.js';
import {
  REFRESH_COOKIE_NAME,
  hashToken,
  signAccessToken,
  cookieOptions,
  createRefreshToken,
  revokeRefreshToken,
  findAdminWithRole,
  toPublicAdmin,
} from '../services/adminAuth.service.js';

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const adminUser = await findAdminWithRole({ email });
  const passwordOk = adminUser ? await bcrypt.compare(password, adminUser.passwordHash) : false;

  if (!adminUser || !passwordOk) {
    throw new ApiError(401, 'Invalid email or password', { code: 'invalid_credentials' });
  }
  if (!adminUser.isActive) {
    throw new ApiError(401, 'Account is inactive. Contact your administrator.', {
      code: 'account_inactive',
    });
  }

  const publicAdmin = toPublicAdmin(adminUser);
  const accessToken = signAccessToken(publicAdmin);
  const rawRefreshToken = await createRefreshToken({ adminUserId: adminUser.id, req });

  res.cookie(REFRESH_COOKIE_NAME, rawRefreshToken, cookieOptions());

  // Non-blocking last login update
  prisma.adminUser
    .update({ where: { id: adminUser.id }, data: { lastLoginAt: new Date() } })
    .catch(() => {});

  await auditLogService.log({
    actorUserId: adminUser.id,
    actorEmail: adminUser.email,
    action: 'admin.login',
    entityType: 'admin_user',
    entityId: adminUser.id,
    ipAddress: req.ip,
  });

  return res.json({
    success: true,
    data: {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
      admin: publicAdmin,
    },
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!rawRefreshToken) {
    throw new ApiError(401, 'No refresh token provided', { code: 'refresh_token_missing' });
  }

  const stored = await prisma.adminRefreshToken.findFirst({
    where: { tokenHash: hashToken(rawRefreshToken) },
    include: { adminUser: { include: { role: { include: { rolePermissions: { include: { permission: true } } } } } } },
  });

  if (!stored) throw new ApiError(401, 'Invalid refresh token', { code: 'token_invalid' });
  if (stored.revokedAt) throw new ApiError(401, 'Refresh token has been revoked', { code: 'token_revoked' });
  if (stored.expiresAt < new Date()) throw new ApiError(401, 'Refresh token has expired', { code: 'token_expired' });
  if (!stored.adminUser.isActive) {
    throw new ApiError(401, 'Account is inactive or no longer exists', { code: 'account_invalid' });
  }

  // Rotation (Decision 1): old token dies, new one is born
  await revokeRefreshToken(rawRefreshToken);
  const newRawRefreshToken = await createRefreshToken({ adminUserId: stored.adminUserId, req });
  res.cookie(REFRESH_COOKIE_NAME, newRawRefreshToken, cookieOptions());

  const publicAdmin = toPublicAdmin(stored.adminUser);
  return res.json({
    success: true,
    data: {
      accessToken: signAccessToken(publicAdmin),
      tokenType: 'Bearer',
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
      admin: publicAdmin,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

  if (rawRefreshToken) {
    const stored = await prisma.adminRefreshToken.findFirst({
      where: { tokenHash: hashToken(rawRefreshToken), revokedAt: null },
    });
    await revokeRefreshToken(rawRefreshToken);
    if (stored) {
      await auditLogService.log({
        actorUserId: stored.adminUserId,
        action: 'admin.logout',
        entityType: 'admin_user',
        entityId: stored.adminUserId,
        ipAddress: req.ip,
      });
    }
  }

  res.clearCookie(REFRESH_COOKIE_NAME, cookieOptions());
  return res.json({ success: true, data: { message: 'Logged out successfully' } });
});

export const me = asyncHandler(async (req, res) => {
  return res.json({ success: true, data: { admin: req.adminUser } });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const adminUser = await prisma.adminUser.findUnique({ where: { id: req.adminUser.id } });
  const ok = await bcrypt.compare(currentPassword, adminUser.passwordHash);
  if (!ok) {
    // Decision 20 alignment: 401 invalid_credentials
    throw new ApiError(401, 'Current password is incorrect', { code: 'invalid_credentials' });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.adminUser.update({ where: { id: adminUser.id }, data: { passwordHash } });

  await auditLogService.log({
    actorUserId: adminUser.id,
    actorEmail: adminUser.email,
    action: 'admin.password_changed',
    entityType: 'admin_user',
    entityId: adminUser.id,
    ipAddress: req.ip,
  });

  return res.json({ success: true, data: { message: 'Password updated successfully' } });
});