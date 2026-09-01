import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { auditLogService } from '../services/auditLogService.js';

export const getCarrierVerificationResults = asyncHandler(async (req, res) => {
  const { id: carrierId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = Math.min(parseInt(req.query.pageSize, 10) || 20, 100);

  const carrier = await prisma.carrier.findUnique({ where: { id: carrierId } });
  if (!carrier) {
    throw new ApiError(404, 'Carrier not found', { code: 'carrier_not_found' });
  }

  const skip = (page - 1) * pageSize;

  const [items, totalItems] = await prisma.$transaction([
    prisma.verificationResult.findMany({
      where: { carrierId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.verificationResult.count({ where: { carrierId } }),
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

export const overrideVerificationResult = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const result = await prisma.verificationResult.findUnique({
    where: { id },
    include: { carrier: true },
  });

  if (!result) {
    throw new ApiError(404, 'Verification result not found', { code: 'verification_result_not_found' });
  }

  await prisma.$transaction(async (tx) => {
    await tx.verificationResult.update({
      where: { id },
      data: {
        adminNotes: adminNotes || null,
      },
    });

    await tx.carrier.update({
      where: { id: result.carrierId },
      data: { verificationStatus: status },
    });
  });

  await auditLogService.log({
    actorUserId: req.adminUser.id,
    actorEmail: req.adminUser.email,
    action: 'verification_override',
    entityType: 'VerificationResult',
    entityId: id,
    details: { carrierId: result.carrierId, newStatus: status, adminNotes },
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  });

  return res.json({
    success: true,
    data: {
      message: 'Verification override successful',
      carrierId: result.carrierId,
      newVerificationStatus: status,
    },
  });
});