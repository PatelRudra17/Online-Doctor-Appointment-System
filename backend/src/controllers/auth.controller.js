const { body } = require('express-validator');
const User = require('../models/User');
const { generateUserToken } = require('../utils/jwt');
const { successResponse, errorResponse, unauthorizedResponse, notFoundResponse } = require('../utils/apiResponse');
const { asyncHandler } = require('../middleware/error.middleware');

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return errorResponse(res, 400, 'Email and password are required');
  }

  // Find user with password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return unauthorizedResponse(res, 'Invalid credentials');
  }

  // Check if user is active
  if (!user.isActive) {
    return unauthorizedResponse(res, 'Account is deactivated');
  }

  // Compare password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return unauthorizedResponse(res, 'Invalid credentials');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateUserToken(user);

  // Prepare user data for response
  const userData = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    profileImage: user.profileImage,
    clinicId: user.clinicId,
    emailVerified: user.emailVerified,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt
  };

  return successResponse(res, 200, 'Login successful', {
    user: userData,
    token
  });
});

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = req.user;

  // Prepare user data for response
  const userData = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    phone: user.phone,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    address: user.address,
    profileImage: user.profileImage,
    clinicId: user.clinicId,
    emailVerified: user.emailVerified,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  return successResponse(res, 200, 'User profile retrieved successfully', userData);
});

/**
 * Refresh token
 * @route POST /api/auth/refresh
 * @access Private
 */
const refreshToken = asyncHandler(async (req, res) => {
  const user = req.user;

  // Generate new token
  const token = generateUserToken(user);

  return successResponse(res, 200, 'Token refreshed successfully', { token });
});

/**
 * Logout user (client-side token removal)
 * @route POST /api/auth/logout
 * @access Private
 */
const logout = asyncHandler(async (req, res) => {
  // In a stateless JWT setup, logout is handled client-side
  // Optionally, you could implement token blacklisting here
  return successResponse(res, 200, 'Logout successful');
});

/**
 * Change password
 * @route POST /api/auth/change-password
 * @access Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = req.user;

  // Validate input
  if (!currentPassword || !newPassword) {
    return errorResponse(res, 400, 'Current password and new password are required');
  }

  // Get user with password
  const userWithPassword = await User.findById(user.id).select('+password');

  // Verify current password
  const isCurrentPasswordValid = await userWithPassword.comparePassword(currentPassword);

  if (!isCurrentPasswordValid) {
    return unauthorizedResponse(res, 'Current password is incorrect');
  }

  // Update password (will be hashed by pre-save middleware)
  userWithPassword.password = newPassword;
  await userWithPassword.save();

  return successResponse(res, 200, 'Password changed successfully');
});

// Validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character')
];

module.exports = {
  login,
  getMe,
  refreshToken,
  logout,
  changePassword,
  loginValidation,
  changePasswordValidation
};
