const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: [true, 'Clinic ID is required']
  },
  medicalLicenseNumber: {
    type: String,
    required: [true, 'Medical license number is required'],
    unique: true,
    trim: true
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    enum: [
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
    ]
  },
  subSpecializations: [{
    type: String,
    trim: true
  }],
  education: [{
    degree: {
      type: String,
      required: true,
      trim: true
    },
    institution: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: Number,
      required: true,
      min: [1900, 'Year must be after 1900'],
      max: [new Date().getFullYear() + 10, 'Year cannot be too far in the future']
    },
    location: {
      type: String,
      trim: true
    }
  }],
  experience: {
    years: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Years of experience cannot be negative']
    },
    currentPracticeStart: {
      type: Date,
      required: [true, 'Current practice start date is required']
    },
    previousPositions: [{
      clinic: { type: String, trim: true },
      position: { type: String, trim: true },
      startDate: Date,
      endDate: Date,
      description: { type: String, trim: true }
    }]
  },
  certifications: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    issuingOrganization: {
      type: String,
      required: true,
      trim: true
    },
    issueDate: {
      type: Date,
      required: true
    },
    expiryDate: {
      type: Date,
      required: true
    },
    certificateNumber: {
      type: String,
      trim: true
    }
  }],
  professionalMemberships: [{
    organization: {
      type: String,
      required: true,
      trim: true
    },
    membershipNumber: {
      type: String,
      trim: true
    },
    joinDate: {
      type: Date,
      required: true
    }
  }],
  consultationFee: {
    amount: {
      type: Number,
      required: [true, 'Consultation fee amount is required'],
      min: [0, 'Fee amount cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR']
    }
  },
  availability: {
    monday: [
      {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        maxAppointments: { type: Number, default: 4 }
      }
    ],
    tuesday: [
      {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        maxAppointments: { type: Number, default: 4 }
      }
    ],
    wednesday: [
      {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        maxAppointments: { type: Number, default: 4 }
      }
    ],
    thursday: [
      {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        maxAppointments: { type: Number, default: 4 }
      }
    ],
    friday: [
      {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        maxAppointments: { type: Number, default: 4 }
      }
    ],
    saturday: [
      {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        maxAppointments: { type: Number, default: 4 }
      }
    ],
    sunday: [
      {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        maxAppointments: { type: Number, default: 4 }
      }
    ]
  },
  languages: [{
    type: String,
    trim: true,
    enum: [
      'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
      'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi',
      'Bengali', 'Urdu', 'Indonesian', 'Malay', 'Thai', 'Vietnamese',
      'Other'
    ]
  }],
  biography: {
    type: String,
    maxlength: [2000, 'Biography cannot exceed 2000 characters']
  },
  achievements: [{
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    date: Date,
    organization: { type: String, trim: true }
  }],
  researchPublications: [{
    title: { type: String, required: true, trim: true },
    journal: { type: String, trim: true },
    publicationDate: Date,
    doi: { type: String, trim: true },
    coAuthors: [{ type: String, trim: true }]
  }],
  socialMedia: {
    linkedin: String,
    researchGate: String,
    orcid: String
  },
  verification: {
    status: {
      type: String,
      enum: ['not_submitted', 'pending', 'verified', 'rejected'],
      default: 'not_submitted'
    },
    submittedAt: {
      type: Date
    },
    verifiedAt: {
      type: Date
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectionReason: {
      type: String,
      trim: true
    }
  },
  documents: [{
    type: {
      type: String,
      enum: ['medical_license', 'degree_certificate', 'board_certification', 'identity_proof_front', 'identity_proof_back', 'address_proof', 'other'],
      required: true
    },
    sourceField: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    notes: {
      type: String,
      trim: true
    }
  }],
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isNewPatientAccepting: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name (populated from user)
doctorProfileSchema.virtual('fullName', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
  select: 'firstName lastName email phone'
});

// Virtual for clinic info
doctorProfileSchema.virtual('clinicInfo', {
  ref: 'Clinic',
  localField: 'clinicId',
  foreignField: '_id',
  justOne: true,
  select: 'name address phone email'
});

// Virtual for appointments count
doctorProfileSchema.virtual('appointmentsCount', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'doctorId',
  count: true
});

// Indexes
doctorProfileSchema.index({ userId: 1 });
doctorProfileSchema.index({ clinicId: 1 });
doctorProfileSchema.index({ medicalLicenseNumber: 1 });
doctorProfileSchema.index({ specialization: 1 });
doctorProfileSchema.index({ 'verification.status': 1 });
doctorProfileSchema.index({ isActive: 1 });
doctorProfileSchema.index({ isNewPatientAccepting: 1 });
doctorProfileSchema.index({ 'rating.average': -1 });
doctorProfileSchema.index({ createdAt: -1 });

// Compound indexes
doctorProfileSchema.index({ clinicId: 1, specialization: 1 });
doctorProfileSchema.index({ specialization: 1, 'verification.status': 1 });
doctorProfileSchema.index({ isActive: 1, isNewPatientAccepting: 1 });

// Pre-save middleware to validate availability times
doctorProfileSchema.pre('save', function(next) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  for (const day of days) {
    if (this.availability && this.availability[day] && this.availability[day].length > 0) {
      for (const slot of this.availability[day]) {
        const startTime = new Date(`2000-01-01 ${slot.startTime}`);
        const endTime = new Date(`2000-01-01 ${slot.endTime}`);
        
        if (endTime <= startTime) {
          return next(new Error(`${day} end time must be after start time`));
        }
      }
    }
  }
  
  next();
});

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);
