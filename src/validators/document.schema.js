import { z } from 'zod';
import { DOCUMENT_TYPE } from '../config/constants.js';

export const uploadDocumentSchema = z.object({
  documentType: z.enum(Object.values(DOCUMENT_TYPE), { errorMap: () => ({ message: 'Invalid document type' }) }),
});

export const reviewDocumentSchema = z.object({
  status: z.enum(['accepted', 'rejected']),
  notes: z.string().trim().optional(),
}).refine(
  (data) => data.status !== 'rejected' || (data.notes && data.notes.trim().length > 0),
  { message: 'Rejection notes are required', path: ['notes'] }
);
