import 'dotenv/config';
import { z } from 'zod';

// Safe boolean parser: avoids z.coerce.boolean() which turns "false" string into true
const safeBoolean = z.enum(['true', 'false']).default('false').transform(v => v === 'true');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 chars'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 chars'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  
  FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL'),
  
  SMTP_HOST: z.string().min(1, 'SMTP_HOST is required'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().min(1, 'SMTP_USER is required'),
  SMTP_PASS: z.string().min(1, 'SMTP_PASS is required'),
  SMTP_FROM_EMAIL: z.string().email().default('no-reply@aikfreight.com'),
  
  UPLOAD_DIR: z.string().min(1, 'UPLOAD_DIR is required'),
  ONBOARDING_TOKEN_TTL_DAYS: z.coerce.number().default(30),

  // Feature Flags (Decision 26)
  DOCUSIGN_ENABLED: safeBoolean,
  FMCSA_ENABLED: safeBoolean,
  CANADA_AGGREGATOR_ENABLED: safeBoolean,
  LOADBOARD_123_ENABLED: safeBoolean,

  // Optional Integrations
  DOCUSIGN_INTEGRATION_KEY: z.string().optional(),
  DOCUSIGN_USER_ID: z.string().optional(),
  DOCUSIGN_ACCOUNT_ID: z.string().optional(),
  DOCUSIGN_PRIVATE_KEY: z.string().optional(),
  DOCUSIGN_BASE_URL: z.string().optional(),
  DOCUSIGN_TEMPLATE_ID: z.string().optional(),
  DOCUSIGN_WEBHOOK_SECRET: z.string().optional(),
  
  FMCSA_WEBKEY: z.string().optional(),
  CANADA_AGGREGATOR_API_KEY: z.string().optional(),
  CANADA_AGGREGATOR_BASE_URL: z.string().optional(),
  LOADBOARD_123_API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error('Environment validation failed');
}

export const env = parsed.data;