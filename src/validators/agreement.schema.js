import { z } from 'zod';

export const customSignatureSchema = z.object({
  signerName: z.string().min(2, 'Signer name must be at least 2 characters'),
  signatureImage: z.string().min(100, 'Signature image data is required'),
  consentAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the consent terms' }),
  }),
});