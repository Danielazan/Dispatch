/* ============ lead.schema v2 ============ */
/*
LANDING LEAD CONTRACT.
v2 change: companyName is now OPTIONAL — the landing form does not collect it,
and the real company name (legalName) arrives later in onboarding Scene 1.
The controller falls back to the contact's name so the Prisma-required column
is never empty. Postman 02.01 (sends companyName) and 02.03 (empty contactName,
bad email, missing consent) remain green.
*/
import { z } from 'zod';

export const createLeadSchema = z.object({
  companyName: z.string().trim().optional(),
  contactName: z.string().trim().min(1, 'Contact name is required'),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().optional(),
  authorityNumber: z.string().trim().optional(),
  consentAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and consent to proceed',
  }),
});