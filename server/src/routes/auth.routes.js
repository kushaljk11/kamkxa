const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);

module.exports = router;
