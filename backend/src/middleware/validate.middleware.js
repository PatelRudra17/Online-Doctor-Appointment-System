const { validationResult } = require('express-validator');
const { validationErrorResponse } = require('../utils/apiResponse');

/**
 * Validation middleware - checks for validation errors and returns formatted response
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));
    
    return validationErrorResponse(res, formattedErrors);
  }
  
  next();
};

/**
 * Custom validation for ObjectId
 * @param {string} value - Value to validate
 * @returns {boolean} True if valid ObjectId format
 */
const isValidObjectId = (value) => {
  return /^[0-9a-fA-F]{24}$/.test(value);
};

/**
 * Middleware to validate ObjectId parameter
 * @param {string} paramName - Parameter name to validate
 * @returns {Function} Middleware function
 */
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const value = req.params[paramName];
    
    if (!value) {
      return validationErrorResponse(res, [{
        field: paramName,
        message: `${paramName} is required`,
        value: null
      }]);
    }
    
    if (!isValidObjectId(value)) {
      return validationErrorResponse(res, [{
        field: paramName,
        message: `Invalid ${paramName} format`,
        value
      }]);
    }
    
    next();
  };
};

/**
 * Middleware to validate email format
 * @param {string} field - Field name to validate (default: 'email')
 * @returns {Function} Middleware function
 */
const validateEmail = (field = 'email') => {
  return (req, res, next) => {
    const email = req.body[field];
    
    if (!email) {
      return validationErrorResponse(res, [{
        field,
        message: `${field} is required`,
        value: null
      }]);
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return validationErrorResponse(res, [{
        field,
        message: 'Invalid email format',
        value: email
      }]);
    }
    
    next();
  };
};

/**
 * Middleware to validate password strength
 * @param {string} field - Field name to validate (default: 'password')
 * @returns {Function} Middleware function
 */
const validatePassword = (field = 'password') => {
  return (req, res, next) => {
    const password = req.body[field];
    
    if (!password) {
      return validationErrorResponse(res, [{
        field,
        message: `${field} is required`,
        value: null
      }]);
    }
    
    if (password.length < 8) {
      return validationErrorResponse(res, [{
        field,
        message: 'Password must be at least 8 characters long',
        value: password
      }]);
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      return validationErrorResponse(res, [{
        field,
        message: 'Password must contain at least one lowercase letter',
        value: password
      }]);
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      return validationErrorResponse(res, [{
        field,
        message: 'Password must contain at least one uppercase letter',
        value: password
      }]);
    }
    
    if (!/(?=.*\d)/.test(password)) {
      return validationErrorResponse(res, [{
        field,
        message: 'Password must contain at least one number',
        value: password
      }]);
    }
    
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return validationErrorResponse(res, [{
        field,
        message: 'Password must contain at least one special character',
        value: password
      }]);
    }
    
    next();
  };
};

/**
 * Middleware to validate phone number format
 * @param {string} field - Field name to validate (default: 'phone')
 * @returns {Function} Middleware function
 */
const validatePhone = (field = 'phone') => {
  return (req, res, next) => {
    const phone = req.body[field];
    
    if (!phone) {
      return validationErrorResponse(res, [{
        field,
        message: `${field} is required`,
        value: null
      }]);
    }
    
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return validationErrorResponse(res, [{
        field,
        message: 'Invalid phone number format',
        value: phone
      }]);
    }
    
    next();
  };
};

module.exports = {
  validate,
  validateObjectId,
  validateEmail,
  validatePassword,
  validatePhone,
  isValidObjectId
};
