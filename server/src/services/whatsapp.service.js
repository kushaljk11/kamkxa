/**
 * Twilio WhatsApp Notification Service
 * Sends automated deadline and reminder alerts using Twilio REST API.
 */
class WhatsAppService {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_WHATSAPP_FROM; // e.g. "+14155238886"
  }

  /**
   * Format phone number to E.164 and add whatsapp: prefix
   */
  _formatWhatsAppNumber(number) {
    let clean = number.trim();
    if (!clean.startsWith('+')) {
      clean = `+${clean}`;
    }
    return `whatsapp:${clean}`;
  }

  /**
   * Send WhatsApp message via Twilio REST API
   */
  async sendMessage(toPhone, messageBody) {
    if (!this.accountSid || !this.authToken || !this.fromNumber) {
      console.warn('[WhatsApp Service] Twilio credentials not fully configured in environment.');
      return {
        success: false,
        message: 'Twilio credentials not configured in server environment.',
      };
    }

    try {
      const from = this.fromNumber.startsWith('whatsapp:')
        ? this.fromNumber
        : `whatsapp:${this.fromNumber}`;
      const to = this._formatWhatsAppNumber(toPhone);

      const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
      const authHeader = `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`;

      const params = new URLSearchParams();
      params.append('From', from);
      params.append('To', to);
      params.append('Body', messageBody);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('[WhatsApp Service Error]', data);
        return {
          success: false,
          error: data.message || 'Twilio message dispatch failed',
          code: data.code,
        };
      }

      return {
        success: true,
        sid: data.sid,
        status: data.status,
      };
    } catch (err) {
      console.error('[WhatsApp Service Exception]', err);
      return {
        success: false,
        error: err.message || 'Network error communicating with Twilio',
      };
    }
  }

  /**
   * Send a test WhatsApp reminder to verify the user's connection
   */
  async sendTestReminder(toPhone, userName = 'Kushal') {
    const text = `🔔 *GoTaskManager WhatsApp Alert*\n\nHello ${userName}! Your WhatsApp reminder channel is active.\n\nYou will receive timely notifications before scheduled deadlines.\n\n_— Sent from GoTaskManager_`;
    return this.sendMessage(toPhone, text);
  }
}

module.exports = new WhatsAppService();
