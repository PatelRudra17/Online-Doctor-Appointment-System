const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in token
 * @param {string} expiresIn - Token expiration time (default: '7d')
 * @returns {string} JWT token
 */
const signToken = (payload, expiresIn = process.env.JWT_EXPIRE || '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Generate token for user
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
const generateUserToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    clinicId: user.clinicId
  };
  return signToken(payload);
};

module.exports = {
  signToken,
  verifyToken,
  generateUserToken
};
