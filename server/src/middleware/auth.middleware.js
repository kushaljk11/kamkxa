const { verifyAccessToken } = require('../utils/tokens');
const User = require('../models/user.model');
const { isDBConnected } = require('../config/db');

const protect = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header: Bearer <token>
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        error: 'Not authorized. Please log in to access this resource.',
      });
    }

    // Verify access token
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      return res.status(401).json({
        error: 'Access token expired or invalid',
        code: 'TOKEN_EXPIRED',
      });
    }

    // Check database connection
    const mongoose = require('mongoose');
    if (isDBConnected() && mongoose.Types.ObjectId.isValid(decoded.userId)) {
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({
          error: 'User account associated with this token no longer exists.',
        });
      }
      req.user = user;
      req.userId = user._id.toString();
    } else {
      // Fallback user session when DB is pending or using demo token
      req.user = {
        _id: decoded.userId,
        firstName: 'Kushal',
        lastName: 'Shrestha',
        email: 'kushal@gotaskmanager.app',
        timezone: 'Asia/Kathmandu',
      };
      req.userId = decoded.userId.toString();
    }

    next();
  } catch (error) {
    console.error('[Auth Middleware Error]', error);
    return res.status(500).json({ error: 'Server authentication failure' });
  }
};

module.exports = {
  protect,
};
