const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
// const logger = require('./config/logger');

// Import routes
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const appointmentsRoutes = require('./routes/appointments.routes');
const devRoutes = require('./routes/dev.routes');
const profileRoutes = require('./routes/profile.routes');
const templatesRoutes = require('./routes/templates.routes');

// Import error middleware
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost with any port in development
    if (process.env.NODE_ENV === 'development' && origin.includes('localhost:')) {
      return callback(null, true);
    }
    
    const allowedOrigins = process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(',')
      : ['http://localhost:5173', 'http://localhost:5175'];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Logging middleware
app.use(morgan('combined'));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api/dev', devRoutes);

// 404 handler
app.use('*', notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;
