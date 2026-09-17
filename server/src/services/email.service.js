const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initTransporter();
  }

  initTransporter() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass,
        },
        tls: {
          rejectUnauthorized: process.env.NODE_ENV === 'production',
        },
      });
      console.log(`[EmailService] Nodemailer configured with SMTP host: ${host}:${port} (SSL/TLS: ${secure})`);
    } else {
      console.warn('[EmailService] SMTP credentials not fully configured in .env. Operating in fallback mock mode.');
      this.transporter = null;
    }
  }

  // Verify transporter connectivity
  async verifyConnection() {
    if (!this.transporter) {
      return {
        configured: false,
        message: 'SMTP credentials (SMTP_HOST, SMTP_USER, SMTP_PASS) not configured in .env',
      };
    }

    try {
      await this.transporter.verify();
      return { configured: true, message: 'SMTP server connection verified successfully' };
    } catch (error) {
      console.error('[EmailService] SMTP connection verification failed:', error.message);
      return { configured: false, error: error.message };
    }
  }

  // Base sendEmail method
  async sendEmail({ to, subject, html, text }) {
    const from = process.env.EMAIL_FROM || '"GoTaskManager" <noreply@gotaskmanager.app>';

    // Fallback if SMTP is not configured yet
    if (!this.transporter) {
      console.log(`[EmailService Mock Delivery]
--------------------------------------------------
To: ${to}
From: ${from}
Subject: ${subject}
Preview: ${text || subject}
--------------------------------------------------`);
      return {
        success: true,
        mock: true,
        message: 'Email simulated in dev/test mode. Configure SMTP credentials in .env to send real emails.',
        to,
        subject,
      };
    }

    try {
      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
      });

      console.log(`[EmailService] Email sent successfully to ${to} (Message ID: ${info.messageId})`);
      return {
        success: true,
        mock: false,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error(`[EmailService] Failed to send email to ${to}:`, error.message);
      throw new Error(`Email delivery failed: ${error.message}`);
    }
  }

  // Password reset email
  async sendPasswordResetEmail({ to, firstName, resetUrl }) {
    const name = firstName || 'there';
    const subject = 'Reset Your GoTaskManager Password';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F7F8FA; margin: 0; padding: 24px; color: #1E293B; }
    .container { max-width: 560px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .logo { font-size: 20px; font-weight: 700; color: #6366F1; margin-bottom: 24px; display: flex; align-items: center; gap: 8px; }
    h1 { font-size: 22px; font-weight: 700; color: #0F172A; margin: 0 0 16px 0; }
    p { font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 20px 0; }
    .btn-container { margin: 28px 0; }
    .btn { display: inline-block; background-color: #6366F1; color: #FFFFFF !important; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 8px; box-shadow: 0 2px 4px rgba(99, 102, 241, 0.2); }
    .footer { font-size: 13px; color: #94A3B8; margin-top: 32px; padding-top: 20px; border-top: 1px solid #F1F5F9; line-height: 1.5; }
    .warning { font-size: 13px; color: #64748B; background: #F8FAFC; border-left: 3px solid #CBD5E1; padding: 10px 14px; margin: 20px 0; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">✦ GoTaskManager</div>
    <h1>Password Reset Request</h1>
    <p>Hi ${name},</p>
    <p>We received a request to reset your password for your GoTaskManager account. Click the button below to set a new password:</p>
    
    <div class="btn-container">
      <a href="${resetUrl}" class="btn" target="_blank">Reset My Password</a>
    </div>

    <div class="warning">
      This link is valid for <strong>60 minutes</strong>. If you did not request a password reset, you can safely ignore this email — your account remains completely secure.
    </div>

    <p style="font-size: 13px; color: #64748B;">If the button above does not work, copy and paste this link into your browser:<br>
      <a href="${resetUrl}" style="color: #6366F1; word-break: break-all;">${resetUrl}</a>
    </p>

    <div class="footer">
      Sent with care by GoTaskManager • Your daily productivity companion<br>
      © ${new Date().getFullYear()} GoTaskManager. All rights reserved.
    </div>
  </div>
</body>
</html>`;

    const text = `Hi ${name},\n\nWe received a request to reset your password for GoTaskManager.\n\nReset your password here: ${resetUrl}\n\nThis link will expire in 60 minutes. If you did not request this, you can ignore this email.`;

    return this.sendEmail({ to, subject, html, text });
  }

  // Welcome email
  async sendWelcomeEmail({ to, firstName }) {
    const name = firstName || 'there';
    const subject = 'Welcome to GoTaskManager! 🚀';
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F7F8FA; margin: 0; padding: 24px; color: #1E293B; }
    .container { max-width: 560px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; padding: 32px; }
    .logo { font-size: 20px; font-weight: 700; color: #6366F1; margin-bottom: 24px; }
    h1 { font-size: 22px; font-weight: 700; color: #0F172A; }
    p { font-size: 15px; line-height: 1.6; color: #475569; }
    .btn { display: inline-block; background-color: #6366F1; color: #FFFFFF !important; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">✦ GoTaskManager</div>
    <h1>Welcome, ${name}!</h1>
    <p>Your GoTaskManager workspace is ready. You now have one unified place to organize your tasks, projects, schedules, and daily focus.</p>
    <p>Start your day with clarity by capturing your high-priority items:</p>
    <a href="${clientUrl}/my-day" class="btn" target="_blank">Open My Day</a>
    <p style="font-size: 13px; color: #64748B;">Tip: Press <kbd style="background:#F1F5F9;padding:2px 6px;border-radius:4px;border:1px solid #CBD5E1;">C</kbd> anywhere in the app to create a task in 10 seconds.</p>
  </div>
</body>
</html>`;

    const text = `Welcome to GoTaskManager, ${name}!\n\nYour workspace is ready: ${clientUrl}/my-day`;

    return this.sendEmail({ to, subject, html, text });
  }

  // Task reminder email
  async sendTaskReminderEmail({ to, firstName, task }) {
    const name = firstName || 'there';
    const subject = `Reminder: "${task.title}" is due soon`;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F7F8FA; margin: 0; padding: 24px; color: #1E293B; }
    .container { max-width: 560px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; padding: 32px; }
    .logo { font-size: 20px; font-weight: 700; color: #6366F1; margin-bottom: 20px; }
    .card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 18px; margin: 20px 0; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; background: #EEF2FF; color: #4F46E5; }
    .btn { display: inline-block; background-color: #6366F1; color: #FFFFFF !important; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">✦ GoTaskManager</div>
    <h2>Upcoming Deadline Reminder</h2>
    <p>Hi ${name}, you have a scheduled task due soon:</p>
    <div class="card">
      <div style="font-size: 17px; font-weight: 600; color: #0F172A; margin-bottom: 6px;">${task.title}</div>
      ${task.description ? `<p style="font-size: 14px; color: #64748B; margin: 0 0 10px 0;">${task.description}</p>` : ''}
      <span class="badge">Priority: ${task.priority || 'MEDIUM'}</span>
    </div>
    <a href="${clientUrl}/tasks" class="btn" target="_blank">View Task in GoTaskManager</a>
  </div>
</body>
</html>`;

    const text = `Hi ${name},\n\nReminder: "${task.title}" is due soon.\nPriority: ${task.priority || 'MEDIUM'}\nView task: ${clientUrl}/tasks`;

    return this.sendEmail({ to, subject, html, text });
  }

  // Test email
  async sendTestEmail({ to }) {
    const subject = 'GoTaskManager — Test Email Alert';
    const timestamp = new Date().toLocaleString();

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F7F8FA; margin: 0; padding: 24px; color: #1E293B; }
    .container { max-width: 560px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; padding: 32px; }
    .badge { display: inline-block; background: #ECFDF5; color: #059669; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div style="font-size: 20px; font-weight: 700; color: #6366F1; margin-bottom: 16px;">✦ GoTaskManager</div>
    <div class="badge">✓ SMTP Configuration Verified</div>
    <h2 style="margin: 0 0 12px 0;">Nodemailer Delivery Succeeded</h2>
    <p>Your GoTaskManager email delivery engine is operational.</p>
    <p style="font-size: 13px; color: #64748B;">Dispatched to: <strong>${to}</strong><br>Timestamp: ${timestamp}</p>
  </div>
</body>
</html>`;

    const text = `GoTaskManager — Test Email Alert\n\nNodemailer delivery succeeded. Your SMTP connection is operational.\nDispatched to: ${to} at ${timestamp}`;

    return this.sendEmail({ to, subject, html, text });
  }
}

module.exports = new EmailService();
