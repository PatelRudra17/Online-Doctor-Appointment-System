const mongoose = require('mongoose');

const reportRequestSchema = new mongoose.Schema({
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
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: false
  },
  reportType: {
    type: String,
    required: [true, 'Report type is required'],
    enum: [
      'medical_report',
      'lab_results',
      'imaging_results',
      'pathology_report',
      'discharge_summary',
      'consultation_report',
      'progress_report',
      'prescription_summary',
      'vaccination_record',
      'allergy_report',
      'surgical_report',
      'other'
    ]
  },
  title: {
    type: String,
    required: [true, 'Report title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Report description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  urgency: {
    type: String,
    enum: ['routine', 'urgent', 'stat'],
    default: 'routine'
  },
  status: {
    type: String,
    enum: ['requested', 'in_progress', 'ready', 'sent', 'delivered', 'cancelled', 'expired'],
    default: 'requested'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Requester ID is required']
  },
  requestedFor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Report recipient ID is required']
  },
  deliveryMethod: {
    type: String,
    enum: ['portal', 'email', 'fax', 'mail', 'pickup', 'secure_message'],
    default: 'portal'
  },
  deliveryDetails: {
    email: { type: String, trim: true },
    fax: { type: String, trim: true },
    mailingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    pickupLocation: { type: String, trim: true },
    secureMessageId: { type: String, trim: true }
  },
  timeFrame: {
    startDate: { type: Date },
    endDate: { type: Date },
    specificDates: [Date],
    lastVisitOnly: { type: Boolean, default: false }
  },
  content: {
    sections: [{
      title: { type: String, required: true, trim: true },
      content: { type: String, required: true, trim: true },
      order: { type: Number, required: true },
      include: { type: Boolean, default: true }
    }],
    includeImages: { type: Boolean, default: true },
    includeLabs: { type: Boolean, default: true },
    includeMedications: { type: Boolean, default: true },
    includeAllergies: { type: Boolean, default: true },
    includeVitals: { type: Boolean, default: true },
    includeProcedures: { type: Boolean, default: true },
    customFields: [{
      fieldName: { type: String, required: true, trim: true },
      fieldValue: { type: String, trim: true },
      include: { type: Boolean, default: true }
    }]
  },
  processing: {
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    startedAt: { type: Date },
    estimatedCompletion: { type: Date },
    actualCompletion: { type: Date },
    notes: { type: String, trim: true, maxlength: 1000 }
  },
  documents: [{
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['report', 'lab_result', 'imaging', 'prescription', 'other'],
      required: true
    },
    url: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    size: { type: Number }, // in bytes
    format: { type: String, trim: true } // PDF, JPG, etc.
  }],
  delivery: {
    sentAt: { type: Date },
    deliveredAt: { type: Date },
    method: { type: String, enum: ['portal', 'email', 'fax', 'mail', 'pickup', 'secure_message'] },
    trackingNumber: { type: String, trim: true },
    confirmationCode: { type: String, trim: true },
    deliveryNotes: { type: String, trim: true }
  },
  access: {
    passwordProtected: { type: Boolean, default: false },
    password: { type: String, trim: true },
    expiresAt: { type: Date },
    downloadLimit: { type: Number, default: 5 },
    downloadCount: { type: Number, default: 0 },
    lastAccessed: { type: Date },
    accessLog: [{
      accessedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      accessedAt: { type: Date, default: Date.now },
      ipAddress: { type: String, trim: true },
      userAgent: { type: String, trim: true }
    }]
  },
  billing: {
    cost: { type: Number, min: 0, default: 0 },
    currency: { type: String, default: 'USD', enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'] },
    status: {
      type: String,
      enum: ['not_billed', 'billed', 'paid', 'waived', 'insurance'],
      default: 'not_billed'
    },
    billedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    insuranceClaim: {
      claimNumber: { type: String, trim: true },
      authorizationCode: { type: String, trim: true },
      coveredAmount: { type: Number, min: 0 }
    }
  },
  notes: [{
    note: { type: String, required: true, trim: true, maxlength: 500 },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    addedAt: { type: Date, default: Date.now },
    isInternal: { type: Boolean, default: false } // visible to patient or not
  }],
  cancellation: {
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: { type: Date },
    reason: {
      type: String,
      required: function() {
        return this.status === 'cancelled';
      },
      trim: true
    },
    refundAmount: { type: Number, min: 0 }
  },
  followUp: {
    required: { type: Boolean, default: false },
    scheduledDate: Date,
    notes: { type: String, trim: true }
  },
  rating: {
    overall: { type: Number, min: 1, max: 5 },
    timeliness: { type: Number, min: 1, max: 5 },
    accuracy: { type: Number, min: 1, max: 5 },
    completeness: { type: Number, min: 1, max: 5 },
    feedback: { type: String, trim: true, maxlength: 1000 },
    ratedAt: { type: Date }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
reportRequestSchema.virtual('patientInfo', {
  ref: 'User',
  localField: 'patientId',
  foreignField: '_id',
  justOne: true,
  select: 'firstName lastName email phone dateOfBirth'
});

reportRequestSchema.virtual('doctorInfo', {
  ref: 'DoctorProfile',
  localField: 'doctorId',
  foreignField: '_id',
  justOne: true,
  select: 'specialization userId'
});

reportRequestSchema.virtual('clinicInfo', {
  ref: 'Clinic',
  localField: 'clinicId',
  foreignField: '_id',
  justOne: true,
  select: 'name address phone'
});

reportRequestSchema.virtual('requesterInfo', {
  ref: 'User',
  localField: 'requestedBy',
  foreignField: '_id',
  justOne: true,
  select: 'firstName lastName email role'
});

reportRequestSchema.virtual('recipientInfo', {
  ref: 'User',
  localField: 'requestedFor',
  foreignField: '_id',
  justOne: true,
  select: 'firstName lastName email'
});

// Virtual for processing duration
reportRequestSchema.virtual('processingDuration').get(function() {
  if (!this.processing.startedAt) return null;
  const end = this.processing.actualCompletion || new Date();
  return Math.round((end - this.processing.startedAt) / (1000 * 60 * 60)); // in hours
});

// Virtual for days since request
reportRequestSchema.virtual('daysSinceRequest').get(function() {
  return Math.round((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Indexes
reportRequestSchema.index({ patientId: 1 });
reportRequestSchema.index({ doctorId: 1 });
reportRequestSchema.index({ clinicId: 1 });
reportRequestSchema.index({ appointmentId: 1 });
reportRequestSchema.index({ reportType: 1 });
reportRequestSchema.index({ status: 1 });
reportRequestSchema.index({ urgency: 1 });
reportRequestSchema.index({ priority: 1 });
reportRequestSchema.index({ requestedBy: 1 });
reportRequestSchema.index({ requestedFor: 1 });
reportRequestSchema.index({ deliveryMethod: 1 });
reportRequestSchema.index({ 'processing.assignedTo': 1 });
reportRequestSchema.index({ 'billing.status': 1 });
reportRequestSchema.index({ createdAt: -1 });

// Compound indexes
reportRequestSchema.index({ patientId: 1, status: 1 });
reportRequestSchema.index({ doctorId: 1, status: 1 });
reportRequestSchema.index({ clinicId: 1, status: 1 });
reportRequestSchema.index({ status: 1, priority: 1 });
reportRequestSchema.index({ reportType: 1, status: 1 });
reportRequestSchema.index({ urgency: 1, status: 1 });

// Text search index
reportRequestSchema.index({
  title: 'text',
  description: 'text',
  'content.sections.content': 'text'
});

// Pre-save middleware to validate time frame
reportRequestSchema.pre('save', function(next) {
  if (this.timeFrame.startDate && this.timeFrame.endDate) {
    if (this.timeFrame.endDate <= this.timeFrame.startDate) {
      return next(new Error('End date must be after start date'));
    }
  }
  
  // Validate delivery details based on delivery method
  if (this.deliveryMethod === 'email' && !this.deliveryDetails.email) {
    return next(new Error('Email address is required for email delivery'));
  }
  
  if (this.deliveryMethod === 'fax' && !this.deliveryDetails.fax) {
    return next(new Error('Fax number is required for fax delivery'));
  }
  
  if (this.deliveryMethod === 'mail' && !this.deliveryDetails.mailingAddress) {
    return next(new Error('Mailing address is required for mail delivery'));
  }
  
  if (this.deliveryMethod === 'pickup' && !this.deliveryDetails.pickupLocation) {
    return next(new Error('Pickup location is required for pickup delivery'));
  }
  
  next();
});

// Pre-save middleware to handle status changes
reportRequestSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    const oldStatus = this._originalStatus || this.status;
    
    // Handle processing start
    if (this.status === 'in_progress' && oldStatus !== 'in_progress') {
      this.processing.startedAt = new Date();
      if (!this.processing.estimatedCompletion) {
        // Set default estimated completion based on urgency
        const hours = this.urgency === 'stat' ? 2 : this.urgency === 'urgent' ? 24 : 72;
        this.processing.estimatedCompletion = new Date(Date.now() + hours * 60 * 60 * 1000);
      }
    }
    
    // Handle completion
    if (this.status === 'ready' && oldStatus !== 'ready') {
      this.processing.actualCompletion = new Date();
    }
    
    // Handle delivery
    if (this.status === 'sent' && oldStatus !== 'sent') {
      this.delivery.sentAt = new Date();
      this.delivery.method = this.deliveryMethod;
    }
    
    // Handle delivery completion
    if (this.status === 'delivered' && oldStatus !== 'delivered') {
      this.delivery.deliveredAt = new Date();
    }
    
    // Handle cancellation
    if (this.status === 'cancelled' && oldStatus !== 'cancelled') {
      this.cancellation.cancelledAt = new Date();
    }
  }
  
  this._originalStatus = this.status;
  next();
});

module.exports = mongoose.model('ReportRequest', reportRequestSchema);
