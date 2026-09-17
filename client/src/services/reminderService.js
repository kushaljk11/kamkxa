import api from './api';

export const reminderService = {
  /**
   * Get user reminder & notification preferences
   */
  async getPreferences() {
    const res = await api.get('/reminders/preferences');
    return res.data.data;
  },

  /**
   * Update user reminder & notification preferences
   */
  async updatePreferences(data) {
    const res = await api.patch('/reminders/preferences', data);
    return res.data.data;
  },

  /**
   * Trigger a test WhatsApp notification
   */
  async sendTestWhatsApp(phoneNumber) {
    const res = await api.post('/reminders/test-whatsapp', { phoneNumber });
    return res.data;
  },

  /**
   * Trigger a test Email notification
   */
  async sendTestEmail(email) {
    const res = await api.post('/reminders/test-email', { email });
    return res.data;
  },
};
