const express = require('express');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  getProfile,
  updateProfile,
  submitVerification,
  uploadDocuments,
  upload,
  updateProfileValidation,
  submitVerificationValidation
} = require('../controllers/profile.controller');
const { validate } = require('../middleware/validate.middleware');

const router = express.Router();

/**
 * @route   GET /api/profile
 * @desc    Get or auto-create doctor profile for current user
 * @access  Private (Doctors only)
 */
router.get('/', authenticate, authorize('doctor'), getProfile);

/**
 * @route   PUT /api/profile
 * @desc    Update doctor profile and sync user data
 * @access  Private (Doctors only)
 */
router.put('/', 
  authenticate, 
  authorize('doctor'), 
  updateProfileValidation, 
  validate, 
  updateProfile
);

/**
 * @route   POST /api/profile/verification
 * @desc    Submit verification with MRN
 * @access  Private (Doctors only)
 */
router.post('/verification', 
  authenticate, 
  authorize('doctor'), 
  submitVerificationValidation, 
  validate, 
  submitVerification
);

/**
 * @route   POST /api/profile/documents
 * @desc    Upload documents for verification
 * @access  Private (Doctors only)
 */
router.post('/documents', 
  authenticate, 
  authorize('doctor'), 
  upload.fields([
    { name: 'mrnCertificate', maxCount: 1 },
    { name: 'idFront', maxCount: 1 },
    { name: 'idBack', maxCount: 1 },
    { name: 'educationCertificate', maxCount: 1 },
    { name: 'other', maxCount: 5 }
  ]), 
  uploadDocuments
);

module.exports = router;
