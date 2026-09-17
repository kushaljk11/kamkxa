const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'gotaskmanager_dev_access_secret_key_12345';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'gotaskmanager_dev_refresh_secret_key_67890';

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, ACCESS_SECRET, {
    expiresIn: '15m',
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_SECRET);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET);
};

const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};
