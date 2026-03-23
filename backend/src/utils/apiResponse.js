/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {Object|Array} data - Response data
 * @param {Object} meta - Additional metadata (pagination, etc.)
 */
const successResponse = (res, statusCode = 200, message = 'Success', data = null, meta = null) => {
  const response = {
    success: true,
    message,
    status: statusCode
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Object} errors - Detailed error information
 */
const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    message,
    status: statusCode
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send validation error response
 * @param {Object} res - Express response object
 * @param {Array} errors - Validation errors array
 * @param {string} message - Error message
 */
const validationErrorResponse = (res, errors, message = 'Validation Error') => {
  return errorResponse(res, 400, message, errors);
};

/**
 * Send unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const unauthorizedResponse = (res, message = 'Unauthorized') => {
  return errorResponse(res, 401, message);
};

/**
 * Send forbidden response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const forbiddenResponse = (res, message = 'Forbidden') => {
  return errorResponse(res, 403, message);
};

/**
 * Send not found response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const notFoundResponse = (res, message = 'Resource not found') => {
  return errorResponse(res, 404, message);
};

/**
 * Send conflict response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
const conflictResponse = (res, message = 'Conflict') => {
  return errorResponse(res, 409, message);
};

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {Array} data - Response data
 * @param {Object} pagination - Pagination metadata
 * @param {string} message - Success message
 */
const paginatedResponse = (res, data, pagination, message = 'Data retrieved successfully') => {
  return successResponse(res, 200, message, data, pagination);
};

module.exports = {
  successResponse,
  errorResponse,
  validationErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  conflictResponse,
  paginatedResponse
};
