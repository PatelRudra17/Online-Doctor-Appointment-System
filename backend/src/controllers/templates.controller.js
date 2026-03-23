const { body, validationResult } = require('express-validator');
const TemplateProcedure = require('../models/TemplateProcedure');
const { successResponse, errorResponse, notFoundResponse, forbiddenResponse } = require('../utils/apiResponse');
const { asyncHandler } = require('../middleware/error.middleware');

/**
 * Get all template procedures for a clinic, ordered by orderIndex
 * @route GET /api/templates/procedures
 * @access Private
 */
const getProcedures = asyncHandler(async (req, res) => {
  // Enforce explicit clinic-association gating
  if (!req.user.clinicId) {
    return forbiddenResponse(res, 'Access denied: User must be associated with a clinic');
  }

  const clinicId = req.user.clinicId;

  const procedures = await TemplateProcedure.find({ clinicId })
    .sort({ orderIndex: 1 })
    .populate('creatorInfo', 'firstName lastName email')
    .populate('clinicInfo', 'name');

  return successResponse(res, 200, 'Procedures retrieved successfully', procedures);
});

/**
 * Create a new template procedure
 * @route POST /api/templates/procedures
 * @access Private
 */
const createProcedure = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, 'Validation failed', errors.array());
  }

  // Enforce explicit clinic-association gating
  if (!req.user.clinicId) {
    return forbiddenResponse(res, 'Access denied: User must be associated with a clinic');
  }

  const clinicId = req.user.clinicId;
  const { title, price, gst, ...otherFields } = req.body;

  // Get the last orderIndex for this clinic
  const lastProcedure = await TemplateProcedure.findOne({ clinicId })
    .sort({ orderIndex: -1 });

  const orderIndex = lastProcedure ? lastProcedure.orderIndex + 1 : 1;

  const procedure = await TemplateProcedure.create({
    // Map planned contract fields
    title,
    price,
    gst,
    clinicId,
    orderIndex,
    createdBy: req.user._id,
    
    // Set required model fields with sensible defaults for template procedures
    name: title, // Use title as name since they're similar
    description: `${title} procedure template`, // Generate default description
    category: 'other', // Default category
    specialization: 'General Practice', // Default specialization
    
    // Set required nested objects with minimal defaults
    duration: {
      estimated: 30, // Default 30 minutes
      min: 15,
      max: 60
    },
    cost: {
      base: price, // Use provided price as base cost
      currency: 'USD'
    },
    
    // Include other optional fields from request
    ...otherFields
  });

  const populatedProcedure = await TemplateProcedure.findById(procedure._id)
    .populate('creatorInfo', 'firstName lastName email')
    .populate('clinicInfo', 'name');

  return successResponse(res, 201, 'Procedure created successfully', populatedProcedure);
});

/**
 * Update a template procedure
 * @route PUT /api/templates/procedures/:id
 * @access Private
 */
const updateProcedure = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 400, 'Validation failed', errors.array());
  }

  // Enforce explicit clinic-association gating
  if (!req.user.clinicId) {
    return forbiddenResponse(res, 'Access denied: User must be associated with a clinic');
  }

  const procedure = await TemplateProcedure.findById(id);
  if (!procedure) {
    return notFoundResponse(res, 'Procedure not found');
  }

  // Verify user has access to this clinic
  if (procedure.clinicId.toString() !== req.user.clinicId.toString()) {
    return forbiddenResponse(res, 'Access denied to this procedure');
  }

  // Update allowed fields
  const allowedFields = ['title', 'price', 'gst', 'description', 'category', 'specialization', 'duration', 'cost', 'isActive'];
  const updates = {};
  
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const updatedProcedure = await TemplateProcedure.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true }
  ).populate('creatorInfo', 'firstName lastName email')
   .populate('clinicInfo', 'name');

  return successResponse(res, 200, 'Procedure updated successfully', updatedProcedure);
});

/**
 * Delete a template procedure
 * @route DELETE /api/templates/procedures/:id
 * @access Private
 */
const deleteProcedure = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Enforce explicit clinic-association gating
  if (!req.user.clinicId) {
    return forbiddenResponse(res, 'Access denied: User must be associated with a clinic');
  }

  const procedure = await TemplateProcedure.findById(id);
  if (!procedure) {
    return notFoundResponse(res, 'Procedure not found');
  }

  // Verify user has access to this clinic
  if (procedure.clinicId.toString() !== req.user.clinicId.toString()) {
    return forbiddenResponse(res, 'Access denied to this procedure');
  }

  await TemplateProcedure.findByIdAndDelete(id);

  return successResponse(res, 200, 'Procedure deleted successfully');
});

/**
 * Reorder template procedures
 * @route PUT /api/templates/procedures/reorder
 * @access Private
 */
const reorderProcedures = asyncHandler(async (req, res) => {
  const { orderedIds } = req.body;

  if (!orderedIds || !Array.isArray(orderedIds) || orderedIds.length === 0) {
    return errorResponse(res, 400, 'Ordered IDs array is required');
  }

  // Enforce explicit clinic-association gating
  if (!req.user.clinicId) {
    return forbiddenResponse(res, 'Access denied: User must be associated with a clinic');
  }

  const clinicId = req.user.clinicId;

  // Validate all procedures belong to the clinic
  const procedures = await TemplateProcedure.find({
    _id: { $in: orderedIds },
    clinicId
  });

  if (procedures.length !== orderedIds.length) {
    return forbiddenResponse(res, 'Some procedures do not belong to this clinic');
  }

  // Prepare bulk operations
  const bulkOps = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id, clinicId },
      update: { orderIndex: index + 1 }
    }
  }));

  // Execute bulk write
  await TemplateProcedure.bulkWrite(bulkOps);

  // Return updated procedures
  const updatedProcedures = await TemplateProcedure.find({ clinicId })
    .sort({ orderIndex: 1 })
    .populate('creatorInfo', 'firstName lastName email')
    .populate('clinicInfo', 'name');

  return successResponse(res, 200, 'Procedures reordered successfully', updatedProcedures);
});

// Validation rules
const createProcedureValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),
  body('gst')
    .isNumeric()
    .withMessage('GST must be a number')
    .isFloat({ min: 0, max: 100 })
    .withMessage('GST must be between 0 and 100'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('category')
    .optional()
    .isIn([
      'diagnostic',
      'therapeutic',
      'surgical',
      'preventive',
      'emergency',
      'cosmetic',
      'rehabilitation',
      'mental_health',
      'pediatric',
      'geriatric',
      'women_health',
      'men_health',
      'other'
    ])
    .withMessage('Invalid category'),
  body('specialization')
    .optional()
    .isIn([
      'General Practice',
      'Cardiology',
      'Dermatology',
      'Endocrinology',
      'Gastroenterology',
      'Neurology',
      'Oncology',
      'Pediatrics',
      'Psychiatry',
      'Radiology',
      'Surgery',
      'Urology',
      'Orthopedics',
      'Ophthalmology',
      'ENT',
      'Other'
    ])
    .withMessage('Invalid specialization')
];

const updateProcedureValidation = [
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('price')
    .optional()
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),
  body('gst')
    .optional()
    .isNumeric()
    .withMessage('GST must be a number')
    .isFloat({ min: 0, max: 100 })
    .withMessage('GST must be between 0 and 100'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('category')
    .optional()
    .isIn([
      'diagnostic',
      'therapeutic',
      'surgical',
      'preventive',
      'emergency',
      'cosmetic',
      'rehabilitation',
      'mental_health',
      'pediatric',
      'geriatric',
      'women_health',
      'men_health',
      'other'
    ])
    .withMessage('Invalid category'),
  body('specialization')
    .optional()
    .isIn([
      'General Practice',
      'Cardiology',
      'Dermatology',
      'Endocrinology',
      'Gastroenterology',
      'Neurology',
      'Oncology',
      'Pediatrics',
      'Psychiatry',
      'Radiology',
      'Surgery',
      'Urology',
      'Orthopedics',
      'Ophthalmology',
      'ENT',
      'Other'
    ])
    .withMessage('Invalid specialization')
];

const reorderProceduresValidation = [
  body('orderedIds')
    .isArray({ min: 1 })
    .withMessage('Ordered IDs must be a non-empty array'),
  body('orderedIds.*')
    .isMongoId()
    .withMessage('All IDs must be valid MongoDB IDs')
];

module.exports = {
  getProcedures,
  createProcedure,
  updateProcedure,
  deleteProcedure,
  reorderProcedures,
  createProcedureValidation,
  updateProcedureValidation,
  reorderProceduresValidation
};
