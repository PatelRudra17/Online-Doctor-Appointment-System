const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Patient ID is required']
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DoctorProfile',
    required: [true, 'Doctor ID is required']
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: [true, 'Clinic ID is required']
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Appointment date must be in the future'
    }
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [5, 'Duration must be at least 5 minutes'],
    max: [480, 'Duration cannot exceed 8 hours']
  },
  appointmentType: {
    type: String,
    required: [true, 'Appointment type is required'],
    enum: [
      'consultation',
      'follow_up',
      'emergency',
      'surgery',
      'diagnostic',
      'therapy',
      'vaccination',
      'check_up',
      'other'
    ]
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled'],
    default: 'scheduled'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  reason: {
    type: String,
    required: [true, 'Reason for appointment is required'],
    trim: true,
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  symptoms: [{
    symptom: { type: String, required: true, trim: true },
    severity: { type: String, enum: ['mild', 'moderate', 'severe'], default: 'moderate' },
    duration: { type: String, trim: true },
    notes: { type: String, trim: true }
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  payment: {
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Payment amount cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR']
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'partial'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['cash', 'card', 'insurance', 'online', 'other'],
      default: 'cash'
    },
    transactionId: {
      type: String,
      trim: true
    }
  },
  insurance: {
    provider: { type: String, trim: true },
    policyNumber: { type: String, trim: true },
    authorizationNumber: { type: String, trim: true },
    coverageAmount: { type: Number, min: 0 }
  },
  reminder: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    reminderTime: { type: Number, default: 24 }, // hours before appointment
    lastSent: { type: Date }
  },
  rescheduling: {
    originalDate: Date,
    originalStartTime: String,
    originalEndTime: String,
    rescheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rescheduledAt: {
      type: Date,
      default: Date.now
    },
    reason: { type: String, trim: true }
  },
  cancellation: {
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: {
      type: Date,
      default: Date.now
    },
    reason: {
      type: String,
      required: function() {
        return this.status === 'cancelled';
      },
      trim: true
    },
    refundAmount: { type: Number, min: 0 },
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed'],
      default: 'pending'
    }
  },
  documents: [{
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['medical_record', 'prescription', 'lab_result', 'imaging', 'other'],
      required: true
    },
    url: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  followUp: {
    required: { type: Boolean, default: false },
    scheduledDate: Date,
    notes: { type: String, trim: true }
  },
  rating: {
    overall: { type: Number, min: 1, max: 5 },
    doctorRating: { type: Number, min: 1, max: 5 },
    clinicRating: { type: Number, min: 1, max: 5 },
    experienceRating: { type: Number, min: 1, max: 5 },
    feedback: { type: String, trim: true, maxlength: 1000 },
    ratedAt: { type: Date }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals for populated fields
appointmentSchema.virtual('patientInfo', {
  ref: 'User',
  localField: 'patientId',
  foreignField: '_id',
  justOne: true,
  select: 'firstName lastName email phone dateOfBirth'
});

appointmentSchema.virtual('doctorInfo', {
  ref: 'DoctorProfile',
  localField: 'doctorId',
  foreignField: '_id',
  justOne: true,
  select: 'specialization consultationFee userId'
});

appointmentSchema.virtual('clinicInfo', {
  ref: 'Clinic',
  localField: 'clinicId',
  foreignField: '_id',
  justOne: true,
  select: 'name address phone'
});

// Virtual for full appointment datetime
appointmentSchema.virtual('fullStartDateTime').get(function() {
  const date = this.appointmentDate.toISOString().split('T')[0];
  return new Date(`${date}T${this.startTime}:00`);
});

appointmentSchema.virtual('fullEndDateTime').get(function() {
  const date = this.appointmentDate.toISOString().split('T')[0];
  return new Date(`${date}T${this.endTime}:00`);
});

// Indexes
appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ doctorId: 1 });
appointmentSchema.index({ clinicId: 1 });
appointmentSchema.index({ appointmentDate: 1 });
appointmentSchema.index({ startTime: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentType: 1 });
appointmentSchema.index({ priority: 1 });
appointmentSchema.index({ 'payment.status': 1 });
appointmentSchema.index({ createdAt: -1 });

// Compound indexes
appointmentSchema.index({ doctorId: 1, appointmentDate: 1, startTime: 1 });
appointmentSchema.index({ patientId: 1, appointmentDate: -1 });
appointmentSchema.index({ clinicId: 1, appointmentDate: 1, status: 1 });
appointmentSchema.index({ status: 1, appointmentDate: 1 });
appointmentSchema.index({ doctorId: 1, status: 1, appointmentDate: 1 });

// Unique index to prevent double booking
appointmentSchema.index(
  { doctorId: 1, appointmentDate: 1, startTime: 1, endTime: 1, status: 1 },
  { 
    unique: true,
    partialFilterExpression: { 
      status: { $in: ['scheduled', 'confirmed', 'in_progress'] }
    }
  }
);

// Pre-save middleware to validate time
appointmentSchema.pre('save', function(next) {
  const startTime = new Date(`2000-01-01 ${this.startTime}`);
  const endTime = new Date(`2000-01-01 ${this.endTime}`);
  
  if (endTime <= startTime) {
    return next(new Error('End time must be after start time'));
  }
  
  // Calculate duration in minutes
  const calculatedDuration = (endTime - startTime) / (1000 * 60);
  if (Math.abs(calculatedDuration - this.duration) > 5) {
    return next(new Error('Duration does not match the time difference between start and end'));
  }
  
  next();
});

// Pre-save middleware to handle status changes
appointmentSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    const oldStatus = this._originalStatus || this.status;
    
    // Handle cancellation
    if (this.status === 'cancelled' && oldStatus !== 'cancelled') {
      this.cancellation.cancelledAt = new Date();
    }
    
    // Handle completion
    if (this.status === 'completed' && oldStatus !== 'completed') {
      // Mark as completed for rating
      if (!this.rating.ratedAt) {
        this.rating.ratedAt = new Date();
      }
    }
  }
  
  this._originalStatus = this.status;
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
