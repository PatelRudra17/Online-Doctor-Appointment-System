const { verifyToken } = require('../utils/jwt');
const { unauthorizedResponse, forbiddenResponse } = require('../utils/apiResponse');
const User = require('../models/User');
const logger = require('../config/logger');

/**
 * Authentication middleware - verifies JWT token and attaches user to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorizedResponse(res, 'Access token is required');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return unauthorizedResponse(res, 'Access token is required');
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
    const user = await User.findById(decoded.id).select('-password').populate('clinicId', 'name address phone email');
    
    if (!user) {
      return unauthorizedResponse(res, 'User not found');
    }

    if (!user.isActive) {
      return forbiddenResponse(res, 'Account is deactivated');
    }

    // Attach user to request
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return unauthorizedResponse(res, 'Invalid access token');
    }
    
    if (error.name === 'TokenExpiredError') {
      return unauthorizedResponse(res, 'Access token expired');
    }

    logger.error('Auth middleware error:', { message: error.message, stack: error.stack });
    return unauthorizedResponse(res, 'Authentication failed');
  }
};

/**
 * Authorization middleware - checks if user has required role
 * @param {Array|string} roles - Allowed roles
 * @returns {Function} Middleware function
 */
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return unauthorizedResponse(res, 'Authentication required');
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(req.user.role)) {
      return forbiddenResponse(res, 'Insufficient permissions');
    }

    next();
  };
};

/**
 * Optional authentication middleware - doesn't fail if no token provided
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      return next();
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password').populate('clinicId', 'name address phone email');
    
    if (user && user.isActive) {
      req.user = user;
      req.token = token;
    }

    next();
  } catch (error) {
    // Silently continue for optional auth
    next();
  }
};

/**
 * Clinic access middleware - ensures user can access specified clinic
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const clinicAccess = (req, res, next) => {
  if (!req.user) {
    return unauthorizedResponse(res, 'Authentication required');
  }

  const requestedClinicId = req.params.clinicId || req.body.clinicId;
  
  // Super admins can access any clinic
  if (req.user.role === 'super_admin') {
    return next();
  }

  // Other users can only access their own clinic
  if (req.user.clinicId && req.user.clinicId.toString() !== requestedClinicId) {
    return forbiddenResponse(res, 'Access denied to this clinic');
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  clinicAccess
};
