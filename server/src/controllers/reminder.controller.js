const whatsappService = require('../services/whatsapp.service');
const emailService = require('../services/email.service');
const User = require('../models/user.model');
const { isDBConnected } = require('../config/db');
const mongoose = require('mongoose');

// Fallback in-memory preferences for demo sessions
let memoryPreferences = {
  whatsappEnabled: false,
  whatsappPhone: '',
  defaultReminderOffset: '30',
  timezone: 'Asia/Kathmandu',
};

/**
 * @route   POST /api/reminders/test-whatsapp
 * @desc    Send a test WhatsApp reminder to user's phone
 * @access  Private
 */
const sendTestWhatsApp = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;
    const targetPhone = phoneNumber || req.user?.phone || memoryPreferences.whatsappPhone;

    if (!targetPhone || !targetPhone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required to send a test WhatsApp reminder.',
      });
    }

    const userName = req.user?.firstName || 'Kushal';
    const result = await whatsappService.sendTestReminder(targetPhone.trim(), userName);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error || 'Failed to dispatch WhatsApp message via Twilio',
        code: result.code,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Test WhatsApp message sent successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/reminders/test-email
 * @desc    Send a test email to verify Nodemailer SMTP delivery
 * @access  Private
 */
const sendTestEmail = async (req, res, next) => {
  try {
    const targetEmail = req.body.email || req.user?.email;

    if (!targetEmail || !targetEmail.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required to dispatch test email.',
      });
    }

    const result = await emailService.sendTestEmail({ to: targetEmail.trim() });

    return res.status(200).json({
      success: true,
      message: result.mock
        ? 'Test email logged (SMTP credentials not yet configured in .env).'
        : 'Test email successfully dispatched via Nodemailer!',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to dispatch email via Nodemailer',
    });
  }
};

/**
 * @route   GET /api/reminders/preferences
 * @desc    Get user's notification and reminder preferences
 * @access  Private
 */
const getPreferences = async (req, res, next) => {
  try {
    const isRealUser = isDBConnected() && mongoose.Types.ObjectId.isValid(req.userId);

    if (isRealUser) {
      const user = await User.findById(req.userId).select('phone reminderSettings timezone');
      if (user) {
        return res.status(200).json({
          success: true,
          data: {
            whatsappEnabled: user.reminderSettings?.whatsappEnabled || false,
            whatsappPhone: user.phone || '',
            defaultReminderOffset: user.reminderSettings?.defaultOffset || '30',
            timezone: user.timezone || 'Asia/Kathmandu',
          },
        });
      }
    }

    res.status(200).json({
      success: true,
      data: memoryPreferences,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/reminders/preferences
 * @desc    Update user's notification and reminder preferences
 * @access  Private
 */
const updatePreferences = async (req, res, next) => {
  try {
    const { whatsappEnabled, whatsappPhone, defaultReminderOffset, timezone } = req.body;

    const isRealUser = isDBConnected() && mongoose.Types.ObjectId.isValid(req.userId);

    if (isRealUser) {
      const updateData = {};
      if (whatsappPhone !== undefined) updateData.phone = whatsappPhone;
      if (timezone !== undefined) updateData.timezone = timezone;
      if (whatsappEnabled !== undefined || defaultReminderOffset !== undefined) {
        updateData.reminderSettings = {
          whatsappEnabled: Boolean(whatsappEnabled),
          defaultOffset: defaultReminderOffset || '30',
        };
      }

      await User.findByIdAndUpdate(req.userId, { $set: updateData });
    } else {
      memoryPreferences = {
        ...memoryPreferences,
        ...(whatsappEnabled !== undefined && { whatsappEnabled }),
        ...(whatsappPhone !== undefined && { whatsappPhone }),
        ...(defaultReminderOffset !== undefined && { defaultReminderOffset }),
        ...(timezone !== undefined && { timezone }),
      };
    }

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        whatsappEnabled,
        whatsappPhone,
        defaultReminderOffset,
        timezone,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendTestWhatsApp,
  sendTestEmail,
  getPreferences,
  updatePreferences,
};
