import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { auditLogService } from '../services/auditLogService.js';
import { CARRIER_STATUS, LEAD_STATUS, VERIFICATION_STATUS, AGREEMENT_STATUS } from '../config/constants.js';

export const listCarriers = asyncHandler(async (req, res) => {
  const { page, pageSize, status } = req.query;
  const skip = (page - 1) * pageSize;

  const where = {};
  if (status) {
    where.status = status;
  }

  const [items, totalItems] = await prisma.$transaction([
    prisma.carrier.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        onboardingSession: {
          select: {
            lead: {
              select: { companyName: true, contactName: true, email: true }
            }
          }
        }
      }
    }),
    prisma.carrier.count({ where }),
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

export const getCarrier = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const carrier = await prisma.carrier.findUnique({
    where: { id },
    include: {
      documents: true,
      verificationResults: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      agreements: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      onboardingSession: {
        include: {
          lead: true,
        },
      },
    },
  });

  if (!carrier) {
    throw new ApiError(404, 'Carrier not found', { code: 'carrier_not_found' });
  }

  return res.json({
    success: true,
    data: carrier,
  });
});

export const approveCarrier = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const carrier = await prisma.carrier.findUnique({ where: { id } });
  if (!carrier) {
    throw new ApiError(404, 'Carrier not found', { code: 'carrier_not_found' });
  }

  // Decision 14/15: Preconditions for approval
  const blockers = [];
  if (carrier.verificationStatus !== VERIFICATION_STATUS.ADMIN_CONFIRMED) {
    blockers.push(`Verification status is '${carrier.verificationStatus}', must be 'admin_confirmed'`);
  }
  if (carrier.agreementStatus !== AGREEMENT_STATUS.SIGNED) {
    blockers.push(`Agreement status is '${carrier.agreementStatus}', must be 'signed'`);
  }

  if (blockers.length > 0) {
    throw new ApiError(409, 'Carrier cannot be approved yet', {
      code: 'approval_blocked',
      details: blockers.map((msg) => ({ path: 'carrier', message: msg })),
    });
  }

  const updated = await prisma.carrier.update({
    where: { id },
    data: { status: CARRIER_STATUS.APPROVED },
  });

  await auditLogService.log({
    actorUserId: req.adminUser.id,
    action: 'carrier_approved',
    entityType: 'Carrier',
    entityId: id,
    details: { newStatus: CARRIER_STATUS.APPROVED },
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  }).catch(() => {});

  return res.json({
    success: true,
    data: {
      message: 'Carrier approved',
      carrier: updated,
    },
  });
});

export const activateCarrier = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const carrier = await prisma.carrier.findUnique({
    where: { id },
    include: { onboardingSession: true }
  });

  if (!carrier) {
    throw new ApiError(404, 'Carrier not found', { code: 'carrier_not_found' });
  }

  if (carrier.status !== CARRIER_STATUS.APPROVED) {
    throw new ApiError(409, 'Carrier must be approved before activation', {
      code: 'activation_blocked',
      details: [{ path: 'carrier.status', message: `Current status is '${carrier.status}', must be 'approved'` }],
    });
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedCarrier = await tx.carrier.update({
      where: { id },
      data: { status: CARRIER_STATUS.ACTIVE },
    });

    // Decision 16: Lead becomes converted when carrier becomes active
    if (carrier.onboardingSession && carrier.onboardingSession.leadId) {
      await tx.lead.update({
        where: { id: carrier.onboardingSession.leadId },
        data: { status: LEAD_STATUS.CONVERTED },
      });
    }

    return updatedCarrier;
  });

  await auditLogService.log({
    actorUserId: req.adminUser.id,
    action: 'carrier_activated',
    entityType: 'Carrier',
    entityId: id,
    details: { newStatus: CARRIER_STATUS.ACTIVE },
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  }).catch(() => {});

  return res.json({
    success: true,
    data: {
      message: 'Carrier activated',
      carrier: result,
    },
  });
});

export const rejectCarrier = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const carrier = await prisma.carrier.findUnique({ where: { id } });
  if (!carrier) {
    throw new ApiError(404, 'Carrier not found', { code: 'carrier_not_found' });
  }

  const updated = await prisma.carrier.update({
    where: { id },
    data: { status: CARRIER_STATUS.REJECTED },
  });

  await auditLogService.log({
    actorUserId: req.adminUser.id,
    action: 'carrier_rejected',
    entityType: 'Carrier',
    entityId: id,
    details: { reason, newStatus: CARRIER_STATUS.REJECTED },
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  }).catch(() => {});

  return res.json({
    success: true,
    data: {
      message: 'Carrier rejected',
      carrier: updated,
    },
  });
});