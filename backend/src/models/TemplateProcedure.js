const mongoose = require('mongoose');

const templateProcedureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Procedure name is required'],
    trim: true,
    maxlength: [100, 'Procedure name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Procedure description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
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
    ]
  },
  subcategory: {
    type: String,
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
  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: [true, 'Clinic ID is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  gst: {
    type: Number,
    required: [true, 'GST is required'],
    min: [0, 'GST cannot be negative'],
    max: [100, 'GST cannot exceed 100%'],
    default: 0
  },
  orderIndex: {
    type: Number,
    required: [true, 'Order index is required'],
    min: [0, 'Order index cannot be negative'],
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator ID is required']
  },
  duration: {
    estimated: {
      type: Number,
      required: [true, 'Estimated duration is required'],
      min: [5, 'Duration must be at least 5 minutes'],
      max: [480, 'Duration cannot exceed 8 hours']
    },
    min: {
      type: Number,
      min: [5, 'Minimum duration must be at least 5 minutes']
    },
    max: {
      type: Number,
      max: [480, 'Maximum duration cannot exceed 8 hours']
    }
  },
  cost: {
    base: {
      type: Number,
      required: [true, 'Base cost is required'],
      min: [0, 'Base cost cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR']
    },
    insuranceCoverage: {
      percentage: { type: Number, min: 0, max: 100, default: 0 },
      conditions: { type: String, trim: true }
    },
    additionalCosts: [{
      name: { type: String, required: true, trim: true },
      amount: { type: Number, required: true, min: 0 },
      description: { type: String, trim: true }
    }]
  },
  preparation: {
    instructions: [{
      step: { type: Number, required: true },
      instruction: { type: String, required: true, trim: true },
      timing: { type: String, trim: true }, // e.g., "24 hours before", "2 hours before"
      importance: { type: String, enum: ['critical', 'important', 'recommended'], default: 'important' }
    }],
    medications: [{
      name: { type: String, required: true, trim: true },
      dosage: { type: String, required: true, trim: true },
      timing: { type: String, required: true, trim: true },
      notes: { type: String, trim: true }
    }],
    fasting: {
      required: { type: Boolean, default: false },
      duration: { type: String, trim: true }, // e.g., "8 hours", "12 hours"
      exceptions: { type: String, trim: true }
    },
    allergies: {
      contraindicated: [{ type: String, trim: true }],
      warnings: [{ type: String, trim: true }]
    }
  },
  procedure: {
    steps: [{
      step: { type: Number, required: true },
      title: { type: String, required: true, trim: true },
      description: { type: String, required: true, trim: true },
      duration: { type: Number }, // in minutes
      materials: [{ type: String, trim: true }],
      risks: [{ type: String, trim: true }],
      notes: { type: String, trim: true }
    }],
    anesthesia: {
      type: {
        type: String,
        enum: ['none', 'local', 'regional', 'general', 'sedation'],
        default: 'none'
      },
      considerations: { type: String, trim: true }
    },
    equipment: [{
      name: { type: String, required: true, trim: true },
      quantity: { type: Number, default: 1 },
      specifications: { type: String, trim: true }
    }],
    personnel: [{
      role: { type: String, required: true, trim: true },
      required: { type: Boolean, default: true },
      qualifications: { type: String, trim: true }
    }]
  },
  risks: {
    common: [{
      risk: { type: String, required: true, trim: true },
      probability: { type: String, enum: ['low', 'medium', 'high'], required: true },
      severity: { type: String, enum: ['mild', 'moderate', 'severe'], required: true },
      mitigation: { type: String, trim: true }
    }],
    rare: [{
      risk: { type: String, required: true, trim: true },
      probability: { type: String, enum: ['very_low', 'low'], required: true },
      severity: { type: String, enum: ['moderate', 'severe', 'life_threatening'], required: true },
      mitigation: { type: String, trim: true }
    }],
    contraindications: [{
      condition: { type: String, required: true, trim: true },
      severity: { type: String, enum: ['relative', 'absolute'], required: true },
      alternative: { type: String, trim: true }
    }]
  },
  recovery: {
    immediate: {
      observationTime: { type: Number }, // in minutes
      monitoring: [{ type: String, trim: true }],
      dischargeCriteria: [{ type: String, trim: true }]
    },
    shortTerm: {
      duration: { type: String, trim: true }, // e.g., "1-2 days", "1 week"
      restrictions: [{
        activity: { type: String, required: true, trim: true },
        duration: { type: String, required: true, trim: true },
        details: { type: String, trim: true }
      }],
      medications: [{
        name: { type: String, required: true, trim: true },
        dosage: { type: String, required: true, trim: true },
        frequency: { type: String, required: true, trim: true },
        duration: { type: String, required: true, trim: true }
      }],
      followUp: {
        required: { type: Boolean, default: false },
        timing: { type: String, trim: true },
        purpose: { type: String, trim: true }
      }
    },
    longTerm: {
      expectations: [{ type: String, trim: true }],
      lifestyle: [{ type: String, trim: true }],
      monitoring: [{
        parameter: { type: String, required: true, trim: true },
        frequency: { type: String, required: true, trim: true },
        normalRange: { type: String, trim: true }
      }]
    }
  },
  alternatives: [{
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    pros: [{ type: String, trim: true }],
    cons: [{ type: String, trim: true }],
    costComparison: { type: String, enum: ['cheaper', 'similar', 'more_expensive'] }
  }],
  documents: {
    consentForm: { type: String }, // URL to template
    patientInfo: { type: String }, // URL to patient education material
    postOpInstructions: { type: String }, // URL to post-op instructions
    educationalVideos: [{ title: String, url: String, duration: String }]
  },
  billing: {
    codes: [{
      type: { type: String, enum: ['CPT', 'ICD-10', 'HCPCS'], required: true },
      code: { type: String, required: true, trim: true },
      description: { type: String, trim: true }
    }],
    modifiers: [{ type: String, trim: true }],
    documentation: { type: String, trim: true }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  version: {
    type: Number,
    default: 1
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  usage: {
    timesUsed: { type: Number, default: 0 },
    lastUsed: { type: Date },
    successRate: { type: Number, min: 0, max: 100 },
    averageRating: { type: Number, min: 1, max: 5 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
templateProcedureSchema.virtual('clinicInfo', {
  ref: 'Clinic',
  localField: 'clinicId',
  foreignField: '_id',
  justOne: true,
  select: 'name'
});

templateProcedureSchema.virtual('creatorInfo', {
  ref: 'User',
  localField: 'createdBy',
  foreignField: '_id',
  justOne: true,
  select: 'firstName lastName email'
});

// Indexes
templateProcedureSchema.index({ name: 1 });
templateProcedureSchema.index({ category: 1 });
templateProcedureSchema.index({ specialization: 1 });
templateProcedureSchema.index({ clinicId: 1 });
templateProcedureSchema.index({ clinicId: 1, orderIndex: 1 });
templateProcedureSchema.index({ createdBy: 1 });
templateProcedureSchema.index({ isActive: 1 });
templateProcedureSchema.index({ isPublic: 1 });
templateProcedureSchema.index({ tags: 1 });
templateProcedureSchema.index({ 'cost.base': 1 });
templateProcedureSchema.index({ createdAt: -1 });

// Compound indexes
templateProcedureSchema.index({ clinicId: 1, specialization: 1 });
templateProcedureSchema.index({ specialization: 1, category: 1 });
templateProcedureSchema.index({ isActive: 1, isPublic: 1 });
templateProcedureSchema.index({ clinicId: 1, isActive: 1 });

// Text search index
templateProcedureSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text'
});

// Pre-save middleware to validate duration
templateProcedureSchema.pre('save', function(next) {
  if (this.duration.min && this.duration.max && this.duration.min > this.duration.max) {
    return next(new Error('Minimum duration cannot be greater than maximum duration'));
  }
  
  if (this.duration.min && this.duration.estimated && this.duration.min > this.duration.estimated) {
    return next(new Error('Minimum duration cannot be greater than estimated duration'));
  }
  
  if (this.duration.max && this.duration.estimated && this.duration.max < this.duration.estimated) {
    return next(new Error('Maximum duration cannot be less than estimated duration'));
  }
  
  next();
});

module.exports = mongoose.model('TemplateProcedure', templateProcedureSchema);
