const express = require('express');
const router = express.Router();

const {
  seedDevData,
  clearDevData,
  seedValidation
} = require('../controllers/dev.controller');

const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

/**
 * @route   POST /api/dev/seed
 * @desc    Seed development data - creates clinic, user, profile, procedures, and sample appointments
 * @access  Private (dev only)
 */
router.post('/seed', authenticate, seedValidation, validate, seedDevData);

/**
 * @route   DELETE /api/dev/seed
 * @desc    Clear all development data
 * @access  Private (dev only)
 */
router.delete('/seed', authenticate, seedValidation, validate, clearDevData);

module.exports = router;
