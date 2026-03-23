const { query, param } = require('express-validator');
const Appointment = require('../models/Appointment');
const { successResponse, errorResponse, notFoundResponse } = require('../utils/apiResponse');
const { asyncHandler } = require('../middleware/error.middleware');

/**
 * Get appointments with filtering by date range and doctor, scoped by clinicId from JWT
 * @route GET /api/appointments?dateFrom&dateTo&doctorId
 * @access Private
 */
const getAppointments = asyncHandler(async (req, res) => {
  const { dateFrom, dateTo, doctorId, doctorIds, page = 1, limit = 20, status, appointmentType } = req.query;
  const userClinicId = req.user.clinicId;

  // Validate that user has a clinic
  if (!userClinicId) {
    return errorResponse(res, 400, 'User must be associated with a clinic');
  }

  // Build base query
  const query = { clinicId: userClinicId };

  // Add date range filter if provided
  if (dateFrom || dateTo) {
    query.appointmentDate = {};
    if (dateFrom) {
      const startDate = new Date(dateFrom);
      if (isNaN(startDate.getTime())) {
        return errorResponse(res, 400, 'Invalid dateFrom format');
      }
      // Normalize dateFrom to start of day if it's date-only
      if (!dateFrom.includes('T')) {
        startDate.setHours(0, 0, 0, 0);
      }
      query.appointmentDate.$gte = startDate;
    }
    if (dateTo) {
      const endDate = new Date(dateTo);
      if (isNaN(endDate.getTime())) {
        return errorResponse(res, 400, 'Invalid dateTo format');
      }
      // Normalize dateTo to end of day if it's date-only
      if (!dateTo.includes('T')) {
        endDate.setHours(23, 59, 59, 999);
      }
      query.appointmentDate.$lte = endDate;
    }
  }

  // Add doctor filter if provided
  if (doctorId) {
    query.doctorId = doctorId;
  } else if (doctorIds) {
    // Support multiple doctor IDs (can be string or array)
    const doctorIdArray = Array.isArray(doctorIds) ? doctorIds : [doctorIds];
    query.doctorId = { $in: doctorIdArray };
  }

  // Add status filter if provided
  if (status) {
    query.status = status;
  }

  // Add appointment type filter if provided
  if (appointmentType) {
    query.appointmentType = appointmentType;
  }

  // Parse pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Validate pagination
  if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
    return errorResponse(res, 400, 'Invalid pagination parameters');
  }

  // Execute query with pagination
  const [appointments, total] = await Promise.all([
    Appointment.find(query)
      .populate('patientInfo', 'firstName lastName email phone dateOfBirth')
      .populate('doctorInfo', 'specialization consultationFee userId')
      .populate('clinicInfo', 'name address phone')
      .sort({ appointmentDate: -1, startTime: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Appointment.countDocuments(query)
  ]);

  // Calculate pagination metadata
  const totalPages = Math.ceil(total / limitNum);
  const pagination = {
    currentPage: pageNum,
    totalPages,
    totalItems: total,
    itemsPerPage: limitNum,
    hasNextPage: pageNum < totalPages,
    hasPreviousPage: pageNum > 1
  };

  return successResponse(res, 200, 'Appointments retrieved successfully', appointments, pagination);
});

/**
 * Get single appointment by ID
 * @route GET /api/appointments/:id
 * @access Private
 */
const getAppointmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userClinicId = req.user.clinicId;

  // Validate that user has a clinic
  if (!userClinicId) {
    return errorResponse(res, 400, 'User must be associated with a clinic');
  }

  // Validate appointment ID
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return errorResponse(res, 400, 'Invalid appointment ID');
  }

  // Find appointment scoped to user's clinic
  const appointment = await Appointment.findOne({ _id: id, clinicId: userClinicId })
    .populate('patientInfo', 'firstName lastName email phone dateOfBirth address')
    .populate('doctorInfo', 'specialization consultationFee userId')
    .populate('clinicInfo', 'name address phone email')
    .lean();

  if (!appointment) {
    return notFoundResponse(res, 'Appointment not found');
  }

  return successResponse(res, 200, 'Appointment retrieved successfully', appointment);
});

/**
 * Create new appointment
 * @route POST /api/appointments
 * @access Private
 */
const createAppointment = asyncHandler(async (req, res) => {
  const userClinicId = req.user.clinicId;

  // Validate that user has a clinic
  if (!userClinicId) {
    return errorResponse(res, 400, 'User must be associated with a clinic');
  }

  // Set clinicId from JWT token
  req.body.clinicId = userClinicId;

  // Create appointment
  const appointment = await Appointment.create(req.body);

  // Populate appointment data for response
  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate('patientInfo', 'firstName lastName email phone dateOfBirth')
    .populate('doctorInfo', 'specialization consultationFee userId')
    .populate('clinicInfo', 'name address phone')
    .lean();

  return successResponse(res, 201, 'Appointment created successfully', populatedAppointment);
});

/**
 * Update appointment
 * @route PUT /api/appointments/:id
 * @access Private
 */
const updateAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userClinicId = req.user.clinicId;

  // Validate that user has a clinic
  if (!userClinicId) {
    return errorResponse(res, 400, 'User must be associated with a clinic');
  }

  // Validate appointment ID
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return errorResponse(res, 400, 'Invalid appointment ID');
  }

  // Find and update appointment scoped to user's clinic
  const appointment = await Appointment.findOneAndUpdate(
    { _id: id, clinicId: userClinicId },
    req.body,
    { new: true, runValidators: true }
  )
    .populate('patientInfo', 'firstName lastName email phone dateOfBirth')
    .populate('doctorInfo', 'specialization consultationFee userId')
    .populate('clinicInfo', 'name address phone')
    .lean();

  if (!appointment) {
    return notFoundResponse(res, 'Appointment not found');
  }

  return successResponse(res, 200, 'Appointment updated successfully', appointment);
});

/**
 * Delete appointment
 * @route DELETE /api/appointments/:id
 * @access Private
 */
const deleteAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userClinicId = req.user.clinicId;

  // Validate that user has a clinic
  if (!userClinicId) {
    return errorResponse(res, 400, 'User must be associated with a clinic');
  }

  // Validate appointment ID
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return errorResponse(res, 400, 'Invalid appointment ID');
  }

  // Find and delete appointment scoped to user's clinic
  const appointment = await Appointment.findOneAndDelete({ _id: id, clinicId: userClinicId });

  if (!appointment) {
    return notFoundResponse(res, 'Appointment not found');
  }

  return successResponse(res, 200, 'Appointment deleted successfully');
});

// Validation rules
const getAppointmentsValidation = [
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('Date from must be a valid date')
    .toDate(),
  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('Date to must be a valid date')
    .toDate(),
  query('doctorId')
    .optional()
    .isMongoId()
    .withMessage('Doctor ID must be a valid MongoDB ID'),
  query('doctorIds')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        // If it's a comma-separated string, split and validate each ID
        const ids = value.split(',');
        return ids.every(id => /^[0-9a-fA-F]{24}$/.test(id));
      }
      if (Array.isArray(value)) {
        return value.every(id => /^[0-9a-fA-F]{24}$/.test(id));
      }
      return false;
    })
    .withMessage('Doctor IDs must be valid MongoDB IDs'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isIn(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled'])
    .withMessage('Invalid status value'),
  query('appointmentType')
    .optional()
    .isIn(['consultation', 'follow_up', 'emergency', 'surgery', 'diagnostic', 'therapy', 'vaccination', 'check_up', 'other'])
    .withMessage('Invalid appointment type')
];

const getAppointmentByIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Appointment ID must be a valid MongoDB ID')
];

const createAppointmentValidation = [
  // Add validation rules for appointment creation
  // This would include all required fields from the Appointment schema
];

const updateAppointmentValidation = [
  param('id')
    .isMongoId()
    .withMessage('Appointment ID must be a valid MongoDB ID')
];

module.exports = {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsValidation,
  getAppointmentByIdValidation,
  createAppointmentValidation,
  updateAppointmentValidation
};
