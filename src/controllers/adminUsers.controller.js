import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { auditLogService } from '../services/auditLogService.js';

export const listAdminUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize, 10) || 20));
  const skip = (page - 1) * pageSize;

  const [items, totalItems] = await Promise.all([
    prisma.adminUser.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        fullName: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            id: true,
            name: true,
            isSuperAdmin: true,
          },
        },
      },
    }),
    prisma.adminUser.count(),
  ]);

  return res.json({
    success: true,
    data: {
      items,
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    },
  });
});

export const createAdminUser = asyncHandler(async (req, res) => {
  const { email, fullName, password, roleId } = req.body;

  const role = await prisma.adminRole.findUnique({ where: { id: roleId } });
  if (!role) {
    throw new ApiError(400, 'Role not found', { code: 'role_not_found' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.adminUser.create({
      data: {
        email: email.toLowerCase().trim(),
        fullName,
        passwordHash,
        roleId,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        isActive: true,
        createdAt: true,
        role: { select: { id: true, name: true, isSuperAdmin: true } },
      },
    });

    await auditLogService.log({
      actorUserId: req.adminUser.id,
      actorEmail: req.adminUser.email,
      action: 'admin_user_created',
      entityType: 'admin_user',
      entityId: user.id,
      details: { email: user.email, roleName: user.role.name },
      ipAddress: req.ip,
    });

    return res.status(201).json({ success: true, data: user });
  } catch (err) {
    if (err.code === 'P2002') {
      throw new ApiError(409, 'An admin user with this email already exists.', { code: 'email_exists' });
    }
    throw err;
  }
});

export const updateAdminUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const targetUser = await prisma.adminUser.findUnique({
    where: { id },
    include: { role: true },
  });

  if (!targetUser) {
    throw new ApiError(404, 'Admin user not found', { code: 'user_not_found' });
  }

  // Self-deactivate guard
  if (updates.isActive === false && targetUser.id === req.adminUser.id) {
    throw new ApiError(409, 'You cannot deactivate your own account.', { code: 'self_deactivate_guard' });
  }

  // Last super admin guard
  const isChangingRole = updates.roleId && updates.roleId !== targetUser.roleId;
  const isDeactivating = updates.isActive === false;

  if (isChangingRole || isDeactivating) {
    if (targetUser.role.isSuperAdmin && targetUser.isActive) {
      const activeSuperAdmins = await prisma.adminUser.count({
        where: {
          isActive: true,
          role: { isSuperAdmin: true },
        },
      });

      if (activeSuperAdmins <= 1) {
        throw new ApiError(409, 'Cannot deactivate or demote the last active Super Admin.', { code: 'last_super_admin_guard' });
      }
    }
  }

  const dataToUpdate = {};
  if (updates.email) dataToUpdate.email = updates.email.toLowerCase().trim();
  if (updates.fullName) dataToUpdate.fullName = updates.fullName;
  if (updates.isActive !== undefined) dataToUpdate.isActive = updates.isActive;
  if (updates.roleId) {
    const role = await prisma.adminRole.findUnique({ where: { id: updates.roleId } });
    if (!role) throw new ApiError(400, 'Role not found', { code: 'role_not_found' });
    dataToUpdate.roleId = updates.roleId;
  }

  const updatedUser = await prisma.adminUser.update({
    where: { id },
    data: dataToUpdate,
    select: {
      id: true,
      email: true,
      fullName: true,
      isActive: true,
      updatedAt: true,
      role: { select: { id: true, name: true, isSuperAdmin: true } },
    },
  });

  await auditLogService.log({
    actorUserId: req.adminUser.id,
    actorEmail: req.adminUser.email,
    action: 'admin_user_updated',
    entityType: 'admin_user',
    entityId: updatedUser.id,
    details: { changes: Object.keys(dataToUpdate) },
    ipAddress: req.ip,
  });

  return res.json({ success: true, data: updatedUser });
});