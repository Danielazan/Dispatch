import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { auditLogService } from '../services/auditLogService.js';
import { loadBoardService } from '../services/loadBoardService.js';
import { CARRIER_STATUS, LOAD_SOURCE, LOAD_STATUS } from '../config/constants.js';

async function assertActiveCarrier(carrierId) {
  const carrier = await prisma.carrier.findUnique({ where: { id: carrierId } });
  if (!carrier) {
    throw new ApiError(404, 'Carrier not found', { code: 'carrier_not_found' });
  }
  if (carrier.status !== CARRIER_STATUS.ACTIVE) {
    throw new ApiError(409, 'Loads can only be assigned to active carriers', {
      code: 'assignment_blocked',
      details: [{ path: 'carrierId', message: `Carrier status is '${carrier.status}', must be 'active'` }],
    });
  }
  return carrier;
}

export const listLoads = asyncHandler(async (req, res) => {
  const { page, pageSize, status, carrierId, merged } = req.query;
  const skip = (page - 1) * pageSize;

  // Decision 18: hide cancelled by default
  const where = { status: status ? status : { not: LOAD_STATUS.CANCELLED } };
  if (carrierId) where.carrierId = carrierId;

  const internal = await prisma.load.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { carrier: { select: { id: true, legalName: true, status: true } } },
  });

  let combined = internal.map((l) => ({ ...l, source: LOAD_SOURCE.INTERNAL, readOnly: false }));

  if (merged === 'true') {
    let external = await loadBoardService.getExternalLoads();
    if (status) external = external.filter((e) => e.status === status);
    if (carrierId) external = []; // external loads are unassigned
    combined = [...combined, ...external].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  const totalItems = combined.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const items = combined.slice(skip, skip + pageSize);

  return res.json({
    success: true,
    data: { items, page, pageSize, totalItems, totalPages },
  });
});

export const createLoad = asyncHandler(async (req, res) => {
  const { title, description, origin, destination, pickupDate, deliveryDate, rate, carrierId } = req.body;

  if (carrierId) await assertActiveCarrier(carrierId); // Decision 19

  const load = await prisma.load.create({
    data: {
      title,
      description: description || null,
      origin,
      destination,
      pickupDate: pickupDate ? new Date(pickupDate) : null,
      deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
      rate: rate ?? null,
      source: LOAD_SOURCE.INTERNAL,
      status: LOAD_STATUS.AVAILABLE,
      carrierId: carrierId || null,
    },
  });

  return res.status(201).json({
    success: true,
    data: { ...load, source: LOAD_SOURCE.INTERNAL, readOnly: false },
  });
});

export const updateLoad = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, origin, destination, pickupDate, deliveryDate, rate, carrierId } = req.body;

  const existing = await prisma.load.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError(404, 'Load not found', { code: 'load_not_found' });
  }

  if (carrierId) await assertActiveCarrier(carrierId); // Decision 19

  const load = await prisma.load.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(origin !== undefined && { origin }),
      ...(destination !== undefined && { destination }),
      ...(pickupDate !== undefined && { pickupDate: pickupDate ? new Date(pickupDate) : null }),
      ...(deliveryDate !== undefined && { deliveryDate: deliveryDate ? new Date(deliveryDate) : null }),
      ...(rate !== undefined && { rate }),
      ...(carrierId !== undefined && { carrierId }),
    },
  });

  return res.json({ success: true, data: load });
});

export const deleteLoad = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.load.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError(404, 'Load not found', { code: 'load_not_found' });
  }

  // Decision 18: soft delete via cancelled status
  const load = await prisma.load.update({
    where: { id },
    data: { status: LOAD_STATUS.CANCELLED },
  });

  await auditLogService
    .log({
      actorUserId: req.adminUser.id,
      action: 'load_cancelled',
      entityType: 'Load',
      entityId: id,
      details: { title: existing.title },
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    })
    .catch(() => {});

  return res.json({ success: true, data: load });
});