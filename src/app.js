import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { asyncHandler } from './utils/asyncHandler.js';

// Route imports
import adminAuthRoutes from './routes/adminAuth.routes.js';
import leadRoutes from './routes/leads.routes.js';
import carrierDocumentsRoutes from './routes/carrierDocuments.routes.js';
import onboardingRoutes from './routes/onboarding.routes.js';
import verificationRoutes from './routes/verification.routes.js';
import agreementsRoutes from './routes/agreements.routes.js';
import carriersRoutes from './routes/carriers.routes.js';
import loadsRoutes from './routes/loads.routes.js';
import adminUsersRoutes from './routes/adminUsers.routes.js';
import adminRolesRoutes from './routes/adminRoles.routes.js';

// Job imports (for dev trigger)
import { expireOnboardingSessionsJob } from './jobs/expireOnboardingSessions.job.js';
import { onboardingReminderJob } from './jobs/onboardingReminder.job.js';
import { syncExternalLoadsJob } from './jobs/syncExternalLoads.job.js';

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
});

// Dev-only routes (DELETE AT STAGE 15)
if (env.NODE_ENV !== 'production') {
  app.get('/api/dev/trigger-jobs', asyncHandler(async (req, res) => {
    await expireOnboardingSessionsJob.runNow();
    await onboardingReminderJob.runNow();
    await syncExternalLoadsJob.runNow();
    return res.json({ success: true, data: { message: 'All jobs triggered manually' } });
  }));
}

// Mount routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/onboarding-sessions', onboardingRoutes);
app.use('/api/carrier-documents', carrierDocumentsRoutes);
app.use('/api', verificationRoutes);
app.use('/api', agreementsRoutes);
app.use('/api/carriers', carriersRoutes);
app.use('/api/loads', loadsRoutes);
app.use('/api/admin-users', adminUsersRoutes);
app.use('/api/admin-roles', adminRolesRoutes);

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;