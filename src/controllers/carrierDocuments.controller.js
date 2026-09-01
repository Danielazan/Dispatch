import fs from 'fs/promises';
import path from 'path';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { storageService } from '../services/storageService.js';
import { uploadDocumentSchema, reviewDocumentSchema } from '../validators/document.schema.js';
import { DOCUMENT_REVIEW_STATUS } from '../config/constants.js';

const DEV_SEED_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

const safeDocument = (doc) => ({
  id: doc.id, documentType: doc.documentType, fileName: doc.fileName,
  fileSize: doc.fileSize, mimeType: doc.mimeType, reviewStatus: doc.reviewStatus,
  reviewNotes: doc.reviewNotes || null,
});

const formatDetails = (issues) => issues.map((i) => ({ path: i.path.join('.'), message: i.message }));

export const preflightDocumentUpload = (req, res, next) => {
  if (req.onboardingSession.readOnly) return next(new ApiError(423, 'Read-only', { code: 'session_locked' }));
  if (!req.onboardingSession.carrier) return next(new ApiError(409, 'Carrier required', { code: 'carrier_required' }));
  next();
};

const upsertCarrierDocument = async ({ carrier, documentType, filePath, fileName, fileSize, mimeType }) => {
  const existing = await prisma.carrierDocument.findUnique({ where: { carrierId_documentType: { carrierId: carrier.id, documentType } } });
  if (existing) {
    await storageService.deleteFile(existing.filePath).catch(() => {});
    const document = await prisma.carrierDocument.update({
      where: { id: existing.id },
      data: { filePath, fileName, fileSize, mimeType, reviewStatus: DOCUMENT_REVIEW_STATUS.PENDING, reviewNotes: null },
    });
    return { document, replaced: true, status: 200 };
  }
  const document = await prisma.carrierDocument.create({
    data: { carrierId: carrier.id, documentType, filePath, fileName, fileSize, mimeType, reviewStatus: DOCUMENT_REVIEW_STATUS.PENDING },
  });
  return { document, replaced: false, status: 201 };
};

export const uploadDocument = asyncHandler(async (req, res) => {
  const parsed = uploadDocumentSchema.safeParse(req.body);
  if (!parsed.success) {
    if (req.file) await storageService.deleteFile(req.file.filename).catch(() => {});
    return res.status(400).json({ success: false, error: { code: 'validation_error', message: 'Validation failed', details: formatDetails(parsed.error.issues) } });
  }
  if (!req.file) throw new ApiError(400, 'No file uploaded.', { code: 'file_required' });
  const result = await upsertCarrierDocument({
    carrier: req.onboardingSession.carrier, documentType: parsed.data.documentType,
    filePath: req.file.filename, fileName: req.file.originalname, fileSize: req.file.size, mimeType: req.file.mimetype,
  });
  return res.status(result.status).json({ success: true, data: { replaced: result.replaced, document: safeDocument(result.document) } });
});

export const devSeedDocument = asyncHandler(async (req, res) => {
  if (env.NODE_ENV === 'production') throw new ApiError(404, 'Not found', { code: 'not_found' });
  const session = req.onboardingSession;
  if (session.readOnly) throw new ApiError(423, 'Read-only', { code: 'session_locked' });
  if (!session.carrier) throw new ApiError(409, 'Carrier required', { code: 'carrier_required' });
  const parsed = uploadDocumentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: { code: 'validation_error', message: 'Validation failed', details: formatDetails(parsed.error.issues) } });
  const documentType = parsed.data.documentType;
  const buffer = Buffer.from(DEV_SEED_PNG_BASE64, 'base64');
  const filePath = `${session.carrier.id}-${documentType}-devseed-${Date.now()}.png`;
  await fs.writeFile(path.join(env.UPLOAD_DIR, filePath), buffer);
  const result = await upsertCarrierDocument({ carrier: session.carrier, documentType, filePath, fileName: `devseed-${documentType}.png`, fileSize: buffer.length, mimeType: 'image/png' });
  return res.status(result.status).json({ success: true, data: { replaced: result.replaced, document: safeDocument(result.document) } });
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const session = req.onboardingSession;
  if (session.readOnly) throw new ApiError(423, 'Read-only', { code: 'session_locked' });
  const doc = await prisma.carrierDocument.findFirst({ where: { id: req.params.documentId, carrierId: session.carrier?.id } });
  if (!doc) throw new ApiError(404, 'Document not found', { code: 'document_not_found' });
  await prisma.carrierDocument.delete({ where: { id: doc.id } });
  await storageService.deleteFile(doc.filePath).catch(() => {});
  return res.json({ success: true, data: { message: 'Document deleted.' } });
});

export const downloadDocument = asyncHandler(async (req, res) => {
  const doc = await prisma.carrierDocument.findUnique({ where: { id: req.params.id } });
  if (!doc) throw new ApiError(404, 'Document not found', { code: 'record_not_found' });
  const fileExists = await storageService.exists(doc.filePath);
  if (!fileExists) throw new ApiError(404, 'File missing', { code: 'file_not_found' });
  return res.download(storageService.resolvePath(doc.filePath), doc.fileName);
});

/* v2: Closes GAP-024. Admin document review (accept/reject). */
export const reviewDocument = asyncHandler(async (req, res) => {
  const parsed = reviewDocumentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: { code: 'validation_error', message: 'Validation failed', details: formatDetails(parsed.error.issues) } });
  }
  const { status, notes } = parsed.data;
  const doc = await prisma.carrierDocument.findUnique({ where: { id: req.params.id } });
  if (!doc) throw new ApiError(404, 'Document not found', { code: 'record_not_found' });

  const updated = await prisma.carrierDocument.update({
    where: { id: doc.id },
    data: {
      reviewStatus: status,
      reviewNotes: status === 'rejected' ? notes : null,
      reviewedByAdminId: req.adminUser?.id || null,
    },
  });
  return res.json({ success: true, data: safeDocument(updated) });
});
