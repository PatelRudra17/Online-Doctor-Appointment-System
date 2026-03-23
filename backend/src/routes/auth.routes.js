const express = require('express');
const router = express.Router();

const {
  login,
  getMe,
  refreshToken,
  logout,
  changePassword,
  loginValidation,
  changePasswordValidation
} = require('../controllers/auth.controller');

const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post('/login', loginValidation, validate, login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, getMe);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh JWT token
 * @access  Private
 */
router.post('/refresh', authenticate, refreshToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, logout);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post('/change-password', authenticate, changePasswordValidation, validate, changePassword);

module.exports = router;
