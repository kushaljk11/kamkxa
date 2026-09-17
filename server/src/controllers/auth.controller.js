const User = require('../models/user.model');
const crypto = require('crypto');
const emailService = require('../services/email.service');
const { isDBConnected } = require('../config/db');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} = require('../utils/tokens');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
const register = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({
        error: 'Database connection is pending. Please configure your MONGODB_URI in server/.env to save your account.',
      });
    }

    const { firstName, lastName, email, password } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        error: 'Please provide all required fields: first name, last name, email, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long',
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        error: 'An account with this email address already exists',
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      passwordHash: password,
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    setRefreshTokenCookie(res, refreshToken);

    // Send welcome email asynchronously (non-blocking)
    emailService.sendWelcomeEmail({
      to: user.email,
      firstName: user.firstName,
    }).catch(err => console.warn('[EmailService] Welcome email error:', err.message));

    return res.status(201).json({
      success: true,
      message: 'Account successfully created',
      accessToken,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get tokens
// @access  Public
const login = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({
        error: 'Database connection is pending. Please configure your MONGODB_URI in server/.env.',
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Please provide email and password',
      });
    }

    // Lookup user with passwordHash explicitly selected
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      accessToken,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/logout
// @desc    Log out user and clear refresh cookie
// @access  Public
const logout = async (req, res) => {
  clearRefreshTokenCookie(res);
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// @route   POST /api/auth/refresh
// @desc    Refresh access token using HTTP-only refresh cookie
// @access  Public
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({
        error: 'No refresh token provided',
      });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (err) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        error: 'Invalid or expired refresh token',
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      clearRefreshTokenCookie(res);
      return res.status(401).json({
        error: 'User not found',
      });
    }

    const newAccessToken = generateAccessToken(user._id);

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('[Refresh Token Error]', error);
    return res.status(500).json({ error: 'Failed to refresh token' });
  }
};

// @route   GET /api/auth/me
// @desc    Get currently authenticated user profile
// @access  Private
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user.toJSON(),
  });
};

// @route   PATCH /api/auth/profile
// @desc    Update user profile & preferences
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, timezone, phone, preferences } = req.body;
    const user = req.user;

    if (firstName) user.firstName = firstName.trim();
    if (lastName) user.lastName = lastName.trim();
    if (timezone) user.timezone = timezone.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (preferences) {
      user.preferences = {
        ...user.preferences,
        ...preferences,
      };
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    // Check if user exists (fail silently in production for security, or acknowledge)
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, password reset instructions have been sent.',
      });
    }

    // Generate reset token and expiration
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Construct reset URL
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

    try {
      await emailService.sendPasswordResetEmail({
        to: user.email,
        firstName: user.firstName,
        resetUrl,
      });

      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, password reset instructions have been sent.',
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        error: 'Email delivery failed. Please check SMTP configuration or try again later.',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Hash token from url to match stored hash in database
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+passwordHash');

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired password reset token' });
    }

    // Update password
    user.passwordHash = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password successfully reset. You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
};
