const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Clinic name is required'],
    trim: true,
    maxlength: [100, 'Clinic name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Clinic email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Clinic phone is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'United States'
    }
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  logo: {
    type: String,
    default: null
  },
  operatingHours: {
    monday: { open: String, close: String, closed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, closed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, closed: { type: Boolean, default: false } },
    friday: { open: String, close: String, closed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, closed: { type: Boolean, default: true } },
    sunday: { open: String, close: String, closed: { type: Boolean, default: true } }
  },
  specialties: [{
    type: String,
    trim: true,
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
  }],
  facilities: [{
    type: String,
    trim: true
  }],
  insuranceAccepted: [{
    name: { type: String, required: true },
    type: { type: String, enum: ['private', 'medicare', 'medicaid', 'other'] }
  }],
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full address
clinicSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}, ${this.address.country}`;
});

// Virtual for doctors count
clinicSchema.virtual('doctorsCount', {
  ref: 'DoctorProfile',
  localField: '_id',
  foreignField: 'clinicId',
  count: true
});

// Virtual for appointments count
clinicSchema.virtual('appointmentsCount', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'clinicId',
  count: true
});

// Indexes
clinicSchema.index({ name: 1 });
clinicSchema.index({ email: 1 });
clinicSchema.index({ phone: 1 });
clinicSchema.index({ 'address.city': 1 });
clinicSchema.index({ 'address.state': 1 });
clinicSchema.index({ specialties: 1 });
clinicSchema.index({ isActive: 1 });
clinicSchema.index({ isVerified: 1 });
clinicSchema.index({ adminId: 1 });
clinicSchema.index({ 'rating.average': -1 });
clinicSchema.index({ createdAt: -1 });

// Compound indexes
clinicSchema.index({ isActive: 1, isVerified: 1 });
clinicSchema.index({ 'address.city': 1, specialties: 1 });

// Pre-save middleware to validate operating hours
clinicSchema.pre('save', function(next) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  for (const day of days) {
    if (this.operatingHours && this.operatingHours[day] && !this.operatingHours[day].closed) {
      const open = this.operatingHours[day].open;
      const close = this.operatingHours[day].close;
      
      if (open && close) {
        const openTime = new Date(`2000-01-01 ${open}`);
        const closeTime = new Date(`2000-01-01 ${close}`);
        
        if (closeTime <= openTime) {
          return next(new Error(`${day} closing time must be after opening time`));
        }
      }
    }
  }
  
  next();
});

module.exports = mongoose.model('Clinic', clinicSchema);
