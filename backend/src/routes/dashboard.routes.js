const express = require('express');
const router = express.Router();

const {
  getDashboardSummary,
  dashboardSummaryValidation
} = require('../controllers/dashboard.controller');

const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

/**
 * @route   GET /api/dashboard
 * @desc    Get basic dashboard data
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const user = req.user;
    
    // Return basic user info and role-based data
    const responseData = {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        clinicId: user.clinicId
      },
      stats: {
        totalAppointments: 0,
        upcomingAppointments: 0,
        completedAppointments: 0,
        totalPatients: 0
      },
      role: user.role
    };

    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      status: 200,
      data: responseData
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard data',
      status: 500
    });
  }
});

/**
 * @route   GET /api/dashboard/summary
 * @desc    Get dashboard summary with appointment aggregation
 * @access  Private
 */
router.get('/summary', authenticate, dashboardSummaryValidation, validate, getDashboardSummary);

module.exports = router;
