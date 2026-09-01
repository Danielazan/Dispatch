import { z } from 'zod';

// Section 1: Company Profile & Authorities
const section1Data = z.object({
  legalName: z.string().trim().min(1, 'Legal name cannot be empty').optional(),
  dbaName: z.string().trim().optional(),
  authorityNumber: z.string().trim().optional(),
  dotNumber: z.string().trim().optional(),
  ein: z.string().trim().optional(),
  address: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().email('Please enter a valid email address').optional(),
}).strict();

// Section 2: Technical Equipment Specifications
const section2Data = z.object({
  activeTrucksCount: z.coerce.number().int().min(0).optional(),
  truckType: z.string().trim().optional(),
  trailerConfig: z.any().optional(), // JSON object
  maxFreightWeight: z.string().trim().optional(),
  carriesTarps: z.boolean().optional(),
  tarpSize: z.string().trim().optional(),
  strapCount: z.coerce.number().int().min(0).optional(),
  chainBinderCount: z.coerce.number().int().min(0).optional(),
  hasFastCard: z.boolean().optional(),
  hasTwicCard: z.boolean().optional(),
}).strict();

// Section 3: Freight Preferences & Lanes
const section3Data = z.object({
  preferredOrigins: z.string().trim().optional(),
  preferredDestinations: z.string().trim().optional(),
  minRatePerMile: z.coerce.number().min(0).optional(),
  prohibitedLocations: z.string().trim().optional(),
  comfortableWithLayovers: z.boolean().optional(),
}).strict();

// Section 4: Billing & Payment Logistics
const section4Data = z.object({
  paymentPreference: z.string().trim().optional(),
  factoringCompanyName: z.string().trim().optional(),
  factoringNoaEmail: z.string().trim().email('Invalid email').optional(),
}).strict();

// Section 5: Directory & Contact Details
const section5Data = z.object({
  dispatchContactName: z.string().trim().optional(),
  dispatchPhone: z.string().trim().optional(),
  dispatchEmail: z.string().trim().email('Please enter a valid email address').optional(),
  afterHoursCell: z.string().trim().optional(),
  accountingEmail: z.string().trim().email('Please enter a valid email address').optional(),
}).strict();

// Section 6: Documents (handled via multipart, no carrier fields here)
const section6Data = z.object({}).passthrough();

// Section 7: Legal (handled via submit endpoint, no carrier fields here)
const section7Data = z.object({}).passthrough();

export const saveCarrierSectionSchema = z.discriminatedUnion('section', [
  z.object({ section: z.literal(1), data: section1Data.default({}) }),
  z.object({ section: z.literal(2), data: section2Data.default({}) }),
  z.object({ section: z.literal(3), data: section3Data.default({}) }),
  z.object({ section: z.literal(4), data: section4Data.default({}) }),
  z.object({ section: z.literal(5), data: section5Data.default({}) }),
  z.object({ section: z.literal(6), data: section6Data.default({}) }),
  z.object({ section: z.literal(7), data: section7Data.default({}) }),
]);

export const submitOnboardingSchema = z.object({
  consentAccepted: z.boolean().refine(v => v === true, {
    message: 'You must accept the terms to submit',
  }),
});