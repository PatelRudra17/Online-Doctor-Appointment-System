const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const { successResponse, errorResponse, validationErrorResponse, notFoundResponse } = require('../utils/apiResponse');
const { asyncHandler } = require('../middleware/error.middleware');

/**
 * Helper function to get or auto-create doctor profile for current user
 * @param {string} userId - User ID
 * @param {object} user - User object with role and clinicId
 * @returns {Promise<object>} - Doctor profile object
 */
const getOrCreateDoctorProfile = async (userId, user) => {
  // Try to find existing profile
  let profile = await DoctorProfile.findOne({ userId })
    .populate('userId', 'firstName lastName email phone dateOfBirth gender')
    .populate('clinicId', 'name address phone email');

  if (!profile) {
    // Auto-create profile for doctor users
    if (user.role !== 'doctor') {
      throw new Error('Only doctors can have a profile');
    }

    // Check if user has a clinic
    if (!user.clinicId) {
      throw new Error('User must be assigned to a clinic before creating a profile');
    }

    // Create basic profile
    profile = new DoctorProfile({
      userId,
      clinicId: user.clinicId,
      medicalLicenseNumber: `TEMP-${Date.now()}`, // Temporary, will be updated
      specialization: 'General Practice',
      experience: {
        years: 0,
        currentPracticeStart: new Date()
      },
      consultationFee: {
        amount: 0,
        currency: 'USD'
      }
    });

    await profile.save();
    
    // Populate the newly created profile
    profile = await DoctorProfile.findById(profile._id)
      .populate('userId', 'firstName lastName email phone dateOfBirth gender')
      .populate('clinicId', 'name address phone email');
  }

  return profile;
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/documents');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.jpeg', '.jpg', '.png', '.pdf', '.doc', '.docx'];
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const hasValidExtension = allowedExtensions.includes(fileExtension);
    const hasValidMimeType = allowedMimeTypes.includes(file.mimetype);

    if (hasValidExtension && hasValidMimeType) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, PNG, PDF, DOC, and DOCX files are allowed'));
    }
  }
});

/**
 * Get or auto-create doctor profile for current user
 * @route GET /api/profile
 * @access Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  
  try {
    // For admin users, return basic user info without doctor profile
    if (req.user.role === 'admin') {
      const user = await User.findById(userId).select('-password').populate('clinicId', 'name address phone email');
      if (!user) {
        return notFoundResponse(res, 'User not found');
      }
      
      return successResponse(res, 200, 'Profile retrieved successfully', {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          role: user.role
        },
        profile: null // Admin users don't have doctor profiles
      });
    }
    
    // For doctors, get or create doctor profile
    const profile = await getOrCreateDoctorProfile(userId, req.user);
    return successResponse(res, 200, 'Profile retrieved successfully', profile);
  } catch (error) {
    if (error.message === 'Only doctors can have a profile') {
      return errorResponse(res, 403, error.message);
    }
    if (error.message === 'User must be assigned to a clinic before creating a profile') {
      return errorResponse(res, 400, error.message);
    }
    throw error;
  }
});

/**
 * Update doctor profile and sync user data
 * @route PUT /api/profile
 * @access Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { firstName, lastName, username, email, gender, dob, mobileNumber } = req.body;

  // Find and update user
  const user = await User.findById(userId);
  if (!user) {
    return notFoundResponse(res, 'User not found');
  }

  // Update user fields if provided
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (username) user.username = username;
  if (email) user.email = email;
  if (gender) user.gender = gender;
  if (dob) user.dateOfBirth = new Date(dob);
  if (mobileNumber) user.phone = mobileNumber;

  await user.save();

  // Get or create doctor profile
  try {
    const profile = await getOrCreateDoctorProfile(userId, req.user);
    return successResponse(res, 200, 'Profile updated successfully', profile);
  } catch (error) {
    if (error.message === 'Only doctors can have a profile') {
      return errorResponse(res, 403, error.message);
    }
    if (error.message === 'User must be assigned to a clinic before creating a profile') {
      return errorResponse(res, 400, error.message);
    }
    throw error;
  }
});

/**
 * Submit verification with MRN
 * @route POST /api/profile/verification
 * @access Private
 */
const submitVerification = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { mrn } = req.body;

  if (!mrn) {
    return errorResponse(res, 400, 'MRN is required for verification');
  }

  // Get or create doctor profile
  let profile;
  try {
    profile = await getOrCreateDoctorProfile(userId, req.user);
  } catch (error) {
    if (error.message === 'Only doctors can have a profile') {
      return errorResponse(res, 403, error.message);
    }
    if (error.message === 'User must be assigned to a clinic before creating a profile') {
      return errorResponse(res, 400, error.message);
    }
    throw error;
  }

  // Update verification information
  profile.verification = {
    ...profile.verification,
    status: 'pending',
    submittedAt: new Date()
  };

  // Store MRN in medicalLicenseNumber field temporarily or add as custom field
  profile.medicalLicenseNumber = mrn;

  profile.verificationStatus = 'pending';

  await profile.save();

  // Return updated profile
  profile = await DoctorProfile.findById(profile._id)
    .populate('userId', 'firstName lastName email phone dateOfBirth gender')
    .populate('clinicId', 'name address phone email');

  return successResponse(res, 200, 'Verification submitted successfully', profile);
});

/**
 * Upload documents for verification
 * @route POST /api/profile/documents
 * @access Private
 */
const uploadDocuments = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Get or create doctor profile
  let profile;
  try {
    profile = await getOrCreateDoctorProfile(userId, req.user);
  } catch (error) {
    if (error.message === 'Only doctors can have a profile') {
      return errorResponse(res, 403, error.message);
    }
    if (error.message === 'User must be assigned to a clinic before creating a profile') {
      return errorResponse(res, 400, error.message);
    }
    throw error;
  }

  const uploadedDocuments = [];

  // Process uploaded files
  const documentFields = ['mrnCertificate', 'idFront', 'idBack', 'educationCertificate', 'other'];
  
  for (const field of documentFields) {
    if (req.files[field] && req.files[field].length > 0) {
      const file = req.files[field][0];
      
      // Map field names to document types and preserve field identity
      const documentTypeMap = {
        'mrnCertificate': 'medical_license',
        'idFront': 'identity_proof_front',
        'idBack': 'identity_proof_back',
        'educationCertificate': 'degree_certificate',
        'other': 'other'
      };

      const document = {
        type: documentTypeMap[field] || 'other',
        sourceField: field, // Preserve the original field name
        url: `/uploads/documents/${file.filename}`,
        filename: file.originalname,
        uploadedAt: new Date(),
        status: 'pending'
      };

      profile.documents.push(document);
      uploadedDocuments.push(document);
    }
  }

  // Check if required documents are present and update verification status
  // Now requiring specific field-level documents
  const hasMrnCertificate = profile.documents.some(doc => doc.sourceField === 'mrnCertificate');
  const hasIdFront = profile.documents.some(doc => doc.sourceField === 'idFront');
  const hasIdBack = profile.documents.some(doc => doc.sourceField === 'idBack');
  const hasEducationCertificate = profile.documents.some(doc => doc.sourceField === 'educationCertificate');
  
  const hasRequiredDocs = hasMrnCertificate && hasIdFront && hasIdBack && hasEducationCertificate;

  if (hasRequiredDocs) {
    profile.verificationStatus = 'pending';
    profile.verification = {
      ...profile.verification,
      status: 'pending',
      submittedAt: new Date()
    };
  }

  await profile.save();

  // Return updated profile
  profile = await DoctorProfile.findById(profile._id)
    .populate('userId', 'firstName lastName email phone dateOfBirth gender')
    .populate('clinicId', 'name address phone email');

  return successResponse(res, 200, 'Documents uploaded successfully', {
    profile,
    uploadedDocuments
  });
});

// Validation rules
const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  body('dob')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date'),
  body('mobileNumber')
    .optional()
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please enter a valid mobile number')
];

const submitVerificationValidation = [
  body('mrn')
    .notEmpty()
    .trim()
    .withMessage('MRN is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('MRN must be between 1 and 50 characters')
];

module.exports = {
  getProfile,
  updateProfile,
  submitVerification,
  uploadDocuments,
  upload,
  updateProfileValidation,
  submitVerificationValidation
};
