const express = require('express');
const router = express.Router();

// Import middleware
const { authenticate } = require('../middleware/auth.middleware');

// Import controllers
const {
  getProcedures,
  createProcedure,
  updateProcedure,
  deleteProcedure,
  reorderProcedures,
  createProcedureValidation,
  updateProcedureValidation,
  reorderProceduresValidation
} = require('../controllers/templates.controller');

// Import validation middleware
const { validate } = require('../middleware/validate.middleware');

/**
 * @route   GET /api/templates/procedures
 * @desc    Get all template procedures for a clinic, ordered by orderIndex
 * @access  Private
 */
router.get('/procedures', authenticate, getProcedures);

/**
 * @route   POST /api/templates/procedures
 * @desc    Create a new template procedure
 * @access  Private
 */
router.post('/procedures', 
  authenticate, 
  createProcedureValidation, 
  validate, 
  createProcedure
);

/**
 * @route   PUT /api/templates/procedures/reorder
 * @desc    Reorder template procedures
 * @access  Private
 */
router.put('/procedures/reorder', 
  authenticate, 
  reorderProceduresValidation, 
  validate, 
  reorderProcedures
);

/**
 * @route   PUT /api/templates/procedures/:id
 * @desc    Update a template procedure
 * @access  Private
 */
router.put('/procedures/:id', 
  authenticate, 
  updateProcedureValidation, 
  validate, 
  updateProcedure
);

/**
 * @route   DELETE /api/templates/procedures/:id
 * @desc    Delete a template procedure
 * @access  Private
 */
router.delete('/procedures/:id', authenticate, deleteProcedure);

module.exports = router;
