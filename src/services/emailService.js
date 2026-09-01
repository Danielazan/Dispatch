import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';
import { logger } from '../utils/logger.js';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));

export const emailService = {
  async sendOnboardingLink({ lead, token }) {
    const link = `${env.FRONTEND_URL}/onboarding/${token}`;
    const subject = 'Your AIK Freight Dispatch Onboarding Link';
    const html = `<h2>Welcome to AIK Freight Dispatch, ${lead.contactName}!</h2>
      <p>Please click the link below to begin your carrier onboarding process.</p>
      <p><a href="${link}">Start Onboarding</a></p>
      <p>This link will expire on ${new Date(lead.onboardingSessions[0].expiresAt).toLocaleDateString()}.</p>`;

    try {
      await transporter.sendMail({
        from: env.SMTP_FROM_EMAIL,
        to: lead.email,
        subject,
        html,
      });
      await prisma.emailLog.create({
        data: {
          leadId: lead.id,
          recipientEmail: lead.email,
          subject,
          status: 'sent',
        },
      });
      logger.info({ leadId: lead.id }, 'Onboarding email sent successfully');
    } catch (error) {
      logger.error({ err: error, leadId: lead.id }, 'Failed to send onboarding email');
      await prisma.emailLog.create({
        data: {
          leadId: lead.id,
          recipientEmail: lead.email,
          subject,
          status: 'failed',
          errorMessage: error.message?.slice(0, 500),
        },
      });
    }
  },

  async sendOnboardingReminder({ lead, token, reminderNumber }) {
    const link = `${env.FRONTEND_URL}/onboarding/${token}`;
    const subject = `AIK Freight Dispatch Onboarding Reminder #${reminderNumber}`;
    const html = `<h2>Reminder: Complete your onboarding</h2>
      <p>Hi ${lead.contactName},</p>
      <p>This is reminder #${reminderNumber} to complete your carrier onboarding with AIK Freight Dispatch.</p>
      <p><a href="${link}">Continue Onboarding</a></p>
      <p>If you have any questions, please reply to this email.</p>`;

    try {
      await transporter.sendMail({
        from: env.SMTP_FROM_EMAIL,
        to: lead.email,
        subject,
        html,
      });
      await prisma.emailLog.create({
        data: {
          leadId: lead.id,
          recipientEmail: lead.email,
          subject,
          status: 'sent',
        },
      });
      logger.info({ leadId: lead.id, reminderNumber }, 'Reminder email sent');
    } catch (error) {
      logger.error({ err: error, leadId: lead.id }, 'Failed to send reminder email');
      await prisma.emailLog.create({
        data: {
          leadId: lead.id,
          recipientEmail: lead.email,
          subject,
          status: 'failed',
          errorMessage: error.message?.slice(0, 500),
        },
      });
    }
  },

  /* ============ sendSupportMessage v1 (PART 4 / GAP-013 — direct send) ============ */
  async sendSupportMessage({ name, email, subject, message, applicationId, leadId }) {
    const to = process.env.SUPPORT_EMAIL || env.SMTP_FROM_EMAIL;
    const finalSubject = `[Onboarding Support] ${subject}`;
    const html = `<h2>Carrier onboarding support request</h2>
      <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
      <p><strong>Application ID:</strong> ${escapeHtml(applicationId ?? '(not available)')}</p>
      <hr />
      <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
      <hr />
      <p style="color:#666">Reply directly to ${escapeHtml(email)}.</p>`;

    try {
      await transporter.sendMail({
        from: env.SMTP_FROM_EMAIL,
        to,
        replyTo: email,
        subject: finalSubject,
        html,
      });
      await prisma.emailLog.create({
        data: { leadId, recipientEmail: to, subject: finalSubject, status: 'sent' },
      });
      logger.info({ leadId }, 'Support message sent');
    } catch (error) {
      logger.error({ err: error, leadId }, 'Failed to send support message');
      await prisma.emailLog
        .create({
          data: {
            leadId,
            recipientEmail: to,
            subject: finalSubject,
            status: 'failed',
            errorMessage: error.message?.slice(0, 500),
          },
        })
        .catch(() => {});
      throw error; // surfaces as 500 → UI shows retry + mailto fallback
    }
  },
};