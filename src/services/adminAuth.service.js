import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';

export const REFRESH_COOKIE_NAME = 'aik_refresh_token';

const parseDurationToMs = (duration) => {
  const match = /^(\d+)(s|m|h|d)$/.exec(String(duration).trim());
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const units = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
  return parseInt(match[1], 10) * units[match[2]];
};

export const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

export const signAccessToken = (admin) =>
  jwt.sign(
    { sub: admin.id, email: admin.email, isSuperAdmin: Boolean(admin.isSuperAdmin) },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN }
  );

export const cookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api/admin/auth', // cookie only sent to auth endpoints
  maxAge: parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN),
});

export const createRefreshToken = async ({ adminUserId, req }) => {
  const rawToken = crypto.randomBytes(48).toString('hex');
  await prisma.adminRefreshToken.create({
    data: {
      adminUserId,
      tokenHash: hashToken(rawToken),
      expiresAt: new Date(Date.now() + parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN)),
      userAgent: req.headers['user-agent']?.slice(0, 500) ?? null,
      ipAddress: req.ip ?? null,
    },
  });
  return rawToken;
};

export const revokeRefreshToken = async (rawToken) => {
  if (!rawToken) return;
  await prisma.adminRefreshToken.updateMany({
    where: { tokenHash: hashToken(rawToken), revokedAt: null },
    data: { revokedAt: new Date() },
  });
};

export const revokeAllForUser = async (adminUserId) => {
  await prisma.adminRefreshToken.updateMany({
    where: { adminUserId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
};

export const findAdminWithRole = (where) =>
  prisma.adminUser.findUnique({
    where,
    include: { role: { include: { rolePermissions: { include: { permission: true } } } } },
  });

export const toPublicAdmin = (adminUser) => ({
  id: adminUser.id,
  email: adminUser.email,
  fullName: adminUser.fullName,
  roleId: adminUser.roleId,
  roleName: adminUser.role?.name ?? null,
  isSuperAdmin: adminUser.role?.isSuperAdmin ?? false,
  permissions: adminUser.role?.isSuperAdmin
    ? ['*']
    : adminUser.role?.rolePermissions?.map((rp) => rp.permission.key) ?? [],
});