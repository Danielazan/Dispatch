import { z } from 'zod';

const section1Data = z
  .object({
    legalName: z.string().trim().min(1, 'Legal name cannot be empty').optional(),
    dbaName: z.string().trim().optional(),
    authorityNumber: z.string().trim().optional(),
    dotNumber: z.string().trim().optional(),
    ein: z.string().trim().optional(),
    address: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    email: z.string().trim().email('Please enter a valid email address').optional(),
  })
  .strict();

const section2Data = z
  .object({
    paymentPreference: z.string().trim().optional(),
    factoringCompanyName: z.string().trim().optional(),
  })
  .strict();

// Sections 3-5: no carrier columns yet — accept payload, track progress only.
const permissiveData = z.object({}).passthrough();

export const saveCarrierSectionSchema = z.discriminatedUnion('section', [
  z.object({ section: z.literal(1), data: section1Data.default({}) }),
  z.object({ section: z.literal(2), data: section2Data.default({}) }),
  z.object({ section: z.literal(3), data: permissiveData.default({}) }),
  z.object({ section: z.literal(4), data: permissiveData.default({}) }),
  z.object({ section: z.literal(5), data: permissiveData.default({}) }),
]);