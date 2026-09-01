import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { LEGAL_TEXT } from '../config/legalText.js';
import { AGREEMENT_STATUS, AGREEMENT_METHOD } from '../config/constants.js';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const getAgreement = asyncHandler(async (req, res) => {
  const session = req.onboardingSession;
  if (!session.carrier) {
    throw new ApiError(404, 'Carrier not found for this session', { code: 'carrier_not_found' });
  }

  const agreement = await prisma.agreement.findFirst({
    where: { carrierId: session.carrier.id },
    orderBy: { createdAt: 'desc' },
  });

  return res.json({
    success: true,
    data: {
      status: agreement ? agreement.status : AGREEMENT_STATUS.PENDING,
      method: agreement ? agreement.method : null,
      legalText: LEGAL_TEXT,
      signedAt: agreement?.signedAt || null,
    },
  });
});

export const getSignatureUrl = asyncHandler(async (req, res) => {
  // Flag OFF: return custom_capture method so frontend routes to custom UI
  return res.json({
    success: true,
    data: {
      method: AGREEMENT_METHOD.CUSTOM_CAPTURE,
    },
  });
});

export const submitCustomSignature = asyncHandler(async (req, res) => {
  const session = req.onboardingSession;
  if (!session.carrier) {
    throw new ApiError(404, 'Carrier not found for this session', { code: 'carrier_not_found' });
  }
  const carrierId = session.carrier.id;

  // session.readOnly is FINE here (signing happens AFTER submit)
  
  const latestAgreement = await prisma.agreement.findFirst({
    where: { carrierId },
    orderBy: { createdAt: 'desc' },
  });

  if (latestAgreement && latestAgreement.status === AGREEMENT_STATUS.SIGNED) {
    throw new ApiError(409, 'Agreement has already been signed', { code: 'agreement_already_signed' });
  }

  if (!latestAgreement || latestAgreement.status !== AGREEMENT_STATUS.SENT) {
     throw new ApiError(400, 'No active agreement found to sign', { code: 'no_active_agreement' });
  }

  const { signerName, signatureImage } = req.body;

  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page.drawText(LEGAL_TEXT.agreementTitle, { x: 50, y: 750, size: 20, font: boldFont, color: rgb(0, 0, 0) });
    
    const bodyLines = LEGAL_TEXT.agreementBody.match(/.{1,70}/g) || [LEGAL_TEXT.agreementBody];
    let y = 700;
    for (const line of bodyLines) {
      page.drawText(line, { x: 50, y, size: 12, font });
      y -= 15;
    }

    page.drawText(`Consent: ${LEGAL_TEXT.consentCheckboxLabel}`, { x: 50, y: y - 30, size: 12, font, color: rgb(0.2, 0.2, 0.2) });
    page.drawText(`Signed by: ${signerName}`, { x: 50, y: y - 80, size: 14, font: boldFont });
    page.drawText(`Date: ${new Date().toISOString()}`, { x: 50, y: y - 100, size: 12, font });

    // Embed signature image (strip data URL prefix if present)
    let imageBytes = signatureImage;
    if (signatureImage.includes(',')) {
      imageBytes = signatureImage.split(',')[1];
    }
    
    try {
      const imgBuffer = Buffer.from(imageBytes, 'base64');
      let img;
      try { img = await pdfDoc.embedPng(imgBuffer); } 
      catch { img = await pdfDoc.embedJpg(imgBuffer); }
      
      const imgDims = img.scale(0.5);
      page.drawImage(img, { x: 50, y: y - 180, width: imgDims.width, height: imgDims.height });
    } catch (imgErr) {
      logger.warn({ err: imgErr }, 'Failed to embed signature image, drawing placeholder box');
      page.drawRectangle({ x: 50, y: y - 180, width: 200, height: 80, borderColor: rgb(0, 0, 0), borderWidth: 1 });
      page.drawText('[Signature Image]', { x: 60, y: y - 140, size: 12, font });
    }

    const pdfBytes = await pdfDoc.save();
    
    const agreementsDir = path.join(env.UPLOAD_DIR, 'agreements');
    await fs.mkdir(agreementsDir, { recursive: true });
    
    const fileName = `agreement-${carrierId}-${Date.now()}.pdf`;
    const filePath = path.join(agreementsDir, fileName);
    await fs.writeFile(filePath, pdfBytes);

    const signedAt = new Date();
    const relativePath = path.join('agreements', fileName);

    await prisma.$transaction(async (tx) => {
      await tx.agreement.update({
        where: { id: latestAgreement.id },
        data: {
          status: AGREEMENT_STATUS.SIGNED,
          signerName,
          signerIp: req.ip,
          consentTextShown: LEGAL_TEXT.consentCheckboxLabel,
          signedPdfPath: relativePath,
          signedAt,
        },
      });

      await tx.carrier.update({
        where: { id: carrierId },
        data: { agreementStatus: AGREEMENT_STATUS.SIGNED },
      });
    });

    return res.json({
      success: true,
      data: {
        message: 'Agreement signed',
        status: AGREEMENT_STATUS.SIGNED,
      },
    });

  } catch (err) {
    logger.error({ err, carrierId }, 'Failed to generate/store custom signature PDF');
    await prisma.carrier.update({
      where: { id: carrierId },
      data: { agreementStatus: AGREEMENT_STATUS.FAILED },
    }).catch(e => logger.error({ e }, 'Failed to set agreement status to failed'));
    throw new ApiError(500, 'Failed to process signature', { code: 'pdf_generation_failed' });
  }
});

export const getCarrierAgreement = asyncHandler(async (req, res) => {
  const { id: carrierId } = req.params;
  
  const carrier = await prisma.carrier.findUnique({ where: { id: carrierId } });
  if (!carrier) {
    throw new ApiError(404, 'Carrier not found', { code: 'carrier_not_found' });
  }

  const agreement = await prisma.agreement.findFirst({
    where: { carrierId },
    orderBy: { createdAt: 'desc' },
  });

  return res.json({
    success: true,
    data: agreement ? {
      id: agreement.id,
      method: agreement.method,
      status: agreement.status,
      signerName: agreement.signerName,
      signerIp: agreement.signerIp,
      consentTextShown: agreement.consentTextShown,
      signedPdfPath: agreement.signedPdfPath,
      signedAt: agreement.signedAt,
      createdAt: agreement.createdAt,
    } : null,
  });
});