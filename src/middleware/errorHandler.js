import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import multer from 'multer';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message, details: err.details },
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'validation_error',
        message: 'Request validation failed',
        details: err.issues.flatMap((issue) => {
          if (issue.code === 'unrecognized_keys' && Array.isArray(issue.keys)) {
            return issue.keys.map((key) => ({
              path: [...issue.path, key].join('.'),
              message: `Unrecognized key: '${key}'`,
            }));
          }
          return [{ path: issue.path.join('.'), message: issue.message }];
        }),
      },
    });
  }

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        error: { code: 'file_too_large', message: 'File exceeds the 10MB size limit' },
      });
    }
    return res.status(400).json({
      success: false,
      error: { code: 'upload_error', message: err.message },
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: { code: 'unique_constraint_violation', message: 'A record with this value already exists' },
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: { code: 'record_not_found', message: 'Record not found' },
      });
    }
  }

  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: { code: 'unauthorized', message: 'Invalid or expired token' },
    });
  }

  logger.error(err);
  return res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: 'internal_server_error',
      message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message || 'Internal server error',
    },
  });
};