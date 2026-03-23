const { query } = require('express-validator');
const Appointment = require('../models/Appointment');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { asyncHandler } = require('../middleware/error.middleware');

/**
 * Get dashboard summary with appointment aggregation
 * @route GET /api/dashboard/summary?dateFrom&dateTo
 * @access Private
 */
const getDashboardSummary = asyncHandler(async (req, res) => {
  const { dateFrom, dateTo } = req.query;
  const userClinicId = req.user.clinicId;

  // Validate that user has a clinic
  if (!userClinicId) {
    return errorResponse(res, 400, 'User must be associated with a clinic');
  }

  // Set default date range if not provided
  let endDate = dateTo ? new Date(dateTo) : new Date();
  let startDate = dateFrom ? new Date(dateFrom) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

  // Normalize date boundaries for date-only inputs
  if (dateTo && !dateTo.includes('T')) {
    // If dateTo is date-only, set to end of day
    endDate = new Date(endDate);
    endDate.setHours(23, 59, 59, 999);
  }
  if (dateFrom && !dateFrom.includes('T')) {
    // If dateFrom is date-only, set to start of day
    startDate = new Date(startDate);
    startDate.setHours(0, 0, 0, 0);
  }

  // Validate dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return errorResponse(res, 400, 'Invalid date format');
  }

  if (startDate > endDate) {
    return errorResponse(res, 400, 'Start date cannot be after end date');
  }

  // Build date filter
  const dateFilter = {
    appointmentDate: {
      $gte: startDate,
      $lte: endDate
    },
    clinicId: userClinicId
  };

  // Aggregation pipeline for dashboard summary
  const summaryPipeline = [
    {
      $match: dateFilter
    },
    {
      $group: {
        _id: null,
        totalAppointments: { $sum: 1 },
        completedAppointments: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        cancelledAppointments: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        },
        noShowAppointments: {
          $sum: { $cond: [{ $eq: ['$status', 'no_show'] }, 1, 0] }
        },
        scheduledAppointments: {
          $sum: { $cond: [{ $in: ['$status', ['scheduled', 'confirmed']] }, 1, 0] }
        },
        totalRevenue: {
          $sum: { $cond: [{ $eq: ['$payment.status', 'paid'] }, '$payment.amount', 0] }
        },
        pendingRevenue: {
          $sum: { $cond: [{ $eq: ['$payment.status', 'pending'] }, '$payment.amount', 0] }
        },
        uniquePatients: { $addToSet: '$patientId' },
        uniqueDoctors: { $addToSet: '$doctorId' }
      }
    },
    {
      $project: {
        _id: 0,
        totalAppointments: 1,
        completedAppointments: 1,
        cancelledAppointments: 1,
        noShowAppointments: 1,
        scheduledAppointments: 1,
        totalRevenue: 1,
        pendingRevenue: 1,
        uniquePatients: { $size: '$uniquePatients' },
        uniqueDoctors: { $size: '$uniqueDoctors' },
        completionRate: {
          $cond: [
            { $eq: ['$totalAppointments', 0] },
            0,
            { $multiply: [{ $divide: ['$completedAppointments', '$totalAppointments'] }, 100] }
          ]
        },
        cancellationRate: {
          $cond: [
            { $eq: ['$totalAppointments', 0] },
            0,
            { $multiply: [{ $divide: ['$cancelledAppointments', '$totalAppointments'] }, 100] }
          ]
        },
        noShowRate: {
          $cond: [
            { $eq: ['$totalAppointments', 0] },
            0,
            { $multiply: [{ $divide: ['$noShowAppointments', '$totalAppointments'] }, 100] }
          ]
        }
      }
    }
  ];

  // Get appointment status breakdown
  const statusPipeline = [
    {
      $match: dateFilter
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ];

  // Get appointment type breakdown
  const typePipeline = [
    {
      $match: dateFilter
    },
    {
      $group: {
        _id: '$appointmentType',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ];

  // Get daily appointment trends
  const dailyTrendsPipeline = [
    {
      $match: dateFilter
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$appointmentDate'
          }
        },
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        cancelled: {
          $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
        },
        revenue: {
          $sum: { $cond: [{ $eq: ['$payment.status', 'paid'] }, '$payment.amount', 0] }
        }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ];

  // Execute all aggregations in parallel
  const [summaryResult, statusResult, typeResult, trendsResult] = await Promise.all([
    Appointment.aggregate(summaryPipeline),
    Appointment.aggregate(statusPipeline),
    Appointment.aggregate(typePipeline),
    Appointment.aggregate(dailyTrendsPipeline)
  ]);

  // Extract summary data or provide zero-placeholder
  const summary = summaryResult[0] || {
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    noShowAppointments: 0,
    scheduledAppointments: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    uniquePatients: 0,
    uniqueDoctors: 0,
    completionRate: 0,
    cancellationRate: 0,
    noShowRate: 0
  };

  // Format status breakdown
  const statusBreakdown = statusResult.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  // Format type breakdown
  const typeBreakdown = typeResult.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  // Format daily trends
  const dailyTrends = trendsResult.map(item => ({
    date: item._id,
    total: item.total,
    completed: item.completed,
    cancelled: item.cancelled,
    revenue: item.revenue
  }));

  // Prepare response data
  const responseData = {
    summary,
    breakdowns: {
      status: statusBreakdown,
      type: typeBreakdown
    },
    trends: {
      daily: dailyTrends
    },
    period: {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }
  };

  return successResponse(res, 200, 'Dashboard summary retrieved successfully', responseData);
});

// Validation rules
const dashboardSummaryValidation = [
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('Date from must be a valid date')
    .toDate(),
  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('Date to must be a valid date')
    .toDate()
];

module.exports = {
  getDashboardSummary,
  dashboardSummaryValidation
};
