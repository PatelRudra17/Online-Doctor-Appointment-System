const express = require('express');
const router = express.Router();

const {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsValidation,
  getAppointmentByIdValidation,
  createAppointmentValidation,
  updateAppointmentValidation
} = require('../controllers/appointments.controller');

const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

/**
 * @route   GET /api/appointments
 * @desc    Get appointments with filtering by date range and doctor, scoped by clinicId from JWT
 * @access  Private
 */
router.get('/', authenticate, getAppointmentsValidation, validate, getAppointments);

/**
 * @route   GET /api/appointments/:id
 * @desc    Get single appointment by ID
 * @access  Private
 */
router.get('/:id', authenticate, getAppointmentByIdValidation, validate, getAppointmentById);

/**
 * @route   POST /api/appointments
 * @desc    Create new appointment
 * @access  Private
 */
router.post('/', authenticate, createAppointmentValidation, validate, createAppointment);

/**
 * @route   PUT /api/appointments/:id
 * @desc    Update appointment
 * @access  Private
 */
router.put('/:id', authenticate, updateAppointmentValidation, validate, updateAppointment);

/**
 * @route   DELETE /api/appointments/:id
 * @desc    Delete appointment
 * @access  Private
 */
router.delete('/:id', authenticate, getAppointmentByIdValidation, validate, deleteAppointment);

module.exports = router;
