const { errorResponse } = require('../utils/apiResponse');
const logger = require('../config/logger');

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  // Log error with context
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    statusCode: err.statusCode || 500
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = 'Validation Error';
    const errors = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message
    }));
    return errorResponse(res, 400, message, errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${field} '${value}' already exists`;
    return errorResponse(res, 409, message);
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    return errorResponse(res, 404, message);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    return errorResponse(res, 401, message);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    return errorResponse(res, 401, message);
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large';
    return errorResponse(res, 400, message);
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    const message = 'Too many files';
    return errorResponse(res, 400, message);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected file field';
    return errorResponse(res, 400, message);
  }

  // Custom application errors
  if (err.isOperational) {
    return errorResponse(res, err.statusCode || 500, err.message);
  }

  // Default server error
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message || 'Internal Server Error';

  return errorResponse(res, err.statusCode || 500, message);
};

/**
 * 404 handler middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const notFoundHandler = (req, res, next) => {
  const message = `Route ${req.originalUrl} not found`;
  return errorResponse(res, 404, message);
};

/**
 * Async error wrapper for catching errors in async routes
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Custom error class for operational errors
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  AppError
};
