const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  sendTestWhatsApp,
  sendTestEmail,
  getPreferences,
  updatePreferences,
} = require('../controllers/reminder.controller');

const router = express.Router();

router.use(protect);

router.post('/test-whatsapp', sendTestWhatsApp);
router.post('/test-email', sendTestEmail);
router.route('/preferences')
  .get(getPreferences)
  .patch(updatePreferences);

module.exports = router;
