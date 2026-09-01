import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { auditLogService } from '../services/auditLogService.js';

export const listAdminRoles = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize, 10) || 20));
  const skip = (page - 1) * pageSize;

  const [items, totalItems] = await Promise.all([
    prisma.adminRole.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'asc' },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
        _count: { select: { users: true } },
      },
    }),
    prisma.adminRole.count(),
  ]);

  const formattedItems = items.map((role) => ({
    id: role.id,
    name: role.name,
    isSuperAdmin: role.isSuperAdmin,
    permissions: role.rolePermissions.map((rp) => rp.permission.key),
    userCount: role._count.users,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  }));

  return res.json({
    success: true,
    data: {
      items: formattedItems,
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    },
  });
});

export const createAdminRole = asyncHandler(async (req, res) => {
  const { name, permissionKeys = [] } = req.body;

  const permissions = await prisma.adminPermission.findMany({
    where: { key: { in: permissionKeys } },
  });

  if (permissions.length !== permissionKeys.length) {
    throw new ApiError(400, 'One or more permission keys are invalid.', { code: 'invalid_permissions' });
  }

  try {
    const newRole = await prisma.adminRole.create({
      data: {
        name,
        isSuperAdmin: false, // Seeded role is the only Super Admin
        rolePermissions: {
          create: permissions.map((p) => ({ permissionId: p.id })),
        },
      },
      include: {
        rolePermissions: { include: { permission: true } },
      },
    });

    await auditLogService.log({
      actorUserId: req.adminUser.id,
      actorEmail: req.adminUser.email,
      action: 'admin_role_created',
      entityType: 'admin_role',
      entityId: newRole.id,
      details: { name: newRole.name, permissions: permissionKeys },
      ipAddress: req.ip,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: newRole.id,
        name: newRole.name,
        isSuperAdmin: newRole.isSuperAdmin,
        permissions: newRole.rolePermissions.map((rp) => rp.permission.key),
        createdAt: newRole.createdAt,
      },
    });
  } catch (err) {
    if (err.code === 'P2002') {
      throw new ApiError(409, 'A role with this name already exists.', { code: 'role_name_exists' });
    }
    throw err;
  }
});

export const updateRolePermissions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { permissionKeys } = req.body;

  const role = await prisma.adminRole.findUnique({ where: { id } });
  if (!role) {
    throw new ApiError(404, 'Role not found', { code: 'role_not_found' });
  }

  if (role.isSuperAdmin) {
    throw new ApiError(409, 'Cannot modify permissions of the seeded Super Admin role.', { code: 'seeded_role_guard' });
  }

  const permissions = await prisma.adminPermission.findMany({
    where: { key: { in: permissionKeys } },
  });

  if (permissions.length !== permissionKeys.length) {
    throw new ApiError(400, 'One or more permission keys are invalid.', { code: 'invalid_permissions' });
  }

  await prisma.$transaction([
    prisma.adminRolePermission.deleteMany({ where: { roleId: id } }),
    prisma.adminRolePermission.createMany({
      data: permissions.map((p) => ({
        roleId: id,
        permissionId: p.id,
      })),
    }),
  ]);

  const updatedRole = await prisma.adminRole.findUnique({
    where: { id },
    include: { rolePermissions: { include: { permission: true } } },
  });

  await auditLogService.log({
    actorUserId: req.adminUser.id,
    actorEmail: req.adminUser.email,
    action: 'admin_role_permissions_updated',
    entityType: 'admin_role',
    entityId: id,
    details: { roleName: role.name, newPermissions: permissionKeys },
    ipAddress: req.ip,
  });

  return res.json({
    success: true,
    data: {
      id: updatedRole.id,
      name: updatedRole.name,
      isSuperAdmin: updatedRole.isSuperAdmin,
      permissions: updatedRole.rolePermissions.map((rp) => rp.permission.key),
      updatedAt: updatedRole.updatedAt,
    },
  });
});