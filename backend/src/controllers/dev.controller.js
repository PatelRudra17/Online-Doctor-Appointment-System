const { body } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Clinic = require('../models/Clinic');
const DoctorProfile = require('../models/DoctorProfile');
const TemplateProcedure = require('../models/TemplateProcedure');
const Appointment = require('../models/Appointment');
const { successResponse, errorResponse, forbiddenResponse } = require('../utils/apiResponse');
const { asyncHandler } = require('../middleware/error.middleware');

/**
 * Seed development data - creates clinic, user, profile, procedures, and sample appointments
 * @route POST /api/dev/seed
 * @access Private (dev only)
 */
const seedDevData = asyncHandler(async (req, res) => {
  // Check if not in production
  if (process.env.NODE_ENV === 'production') {
    return forbiddenResponse(res, 'Seed endpoint is not available in production');
  }

  // Check for optional SEED_KEY
  const seedKey = req.headers['x-seed-key'] || req.body.seedKey;
  if (process.env.SEED_KEY && seedKey !== process.env.SEED_KEY) {
    return forbiddenResponse(res, 'Invalid seed key');
  }

  try {
    // Clean existing data (optional - uncomment if you want to start fresh)
    // await Promise.all([
    //   Appointment.deleteMany({}),
    //   TemplateProcedure.deleteMany({}),
    //   DoctorProfile.deleteMany({}),
    //   User.deleteMany({ email: 'doctor@demo.com' }),
    //   Clinic.deleteMany({ name: 'North County Family Health' })
    // ]);

    // 1. Create admin user first
    let adminUser = await User.findOne({ email: 'admin@demo.com' });
    if (!adminUser) {
      adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@demo.com',
        password: 'admin123',
        role: 'admin',
        phone: '+1234567890',
        dateOfBirth: new Date('1980-01-01'),
        gender: 'other',
        isActive: true,
        emailVerified: true
      });
    }

    // 2. Create clinic with adminId
    let clinic = await Clinic.findOne({ name: 'North County Family Health' });
    if (!clinic) {
      clinic = await Clinic.create({
        name: 'North County Family Health',
        email: 'info@ncfhpk.com',
        phone: '+1234567890',
        address: {
          street: '123 Main Street',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62701',
          country: 'United States'
        },
        website: 'https://ncfhpk.com',
        description: 'A comprehensive family health clinic providing quality healthcare services',
        specialties: ['General Practice', 'Pediatrics', 'Internal Medicine'],
        facilities: ['Laboratory', 'X-Ray', 'Pharmacy', 'Emergency Care'],
        operatingHours: {
          monday: { open: '08:00', close: '18:00', closed: false },
          tuesday: { open: '08:00', close: '18:00', closed: false },
          wednesday: { open: '08:00', close: '18:00', closed: false },
          thursday: { open: '08:00', close: '18:00', closed: false },
          friday: { open: '08:00', close: '18:00', closed: false },
          saturday: { open: '09:00', close: '14:00', closed: false },
          sunday: { open: '09:00', close: '12:00', closed: false }
        },
        adminId: adminUser._id
      });
    }

    // 3. Create user (doctor)
    let user = await User.findOne({ email: 'doctor@demo.com' });
    if (!user) {
      user = await User.create({
        firstName: 'John',
        lastName: 'Smith',
        email: 'doctor@demo.com',
        password: 'demo123',
        role: 'doctor',
        phone: '+1234567891',
        dateOfBirth: new Date('1980-05-15'),
        gender: 'male',
        clinicId: clinic._id,
        isActive: true,
        emailVerified: true
      });
    }

    // 4. Create doctor profile
    let doctorProfile = await DoctorProfile.findOne({ userId: user._id });
    if (!doctorProfile) {
      doctorProfile = await DoctorProfile.create({
        userId: user._id,
        clinicId: clinic._id,
        medicalLicenseNumber: 'MD123456789',
        specialization: 'General Practice',
        subSpecializations: ['Family Medicine', 'Preventive Care'],
        experience: {
          years: 15,
          currentPracticeStart: new Date('2010-01-01'),
          previousPositions: [
            {
              clinic: 'City Medical Center',
              position: 'Resident Physician',
              startDate: new Date('2005-07-01'),
              endDate: new Date('2010-06-30'),
              description: 'Completed residency in family medicine'
            }
          ]
        },
        education: [
          {
            degree: 'MD',
            institution: 'Harvard Medical School',
            year: 2005,
            location: 'Boston, MA'
          }
        ],
        consultationFee: {
          amount: 150,
          currency: 'USD'
        },
        availability: {
          monday: [{ startTime: '08:00', endTime: '12:00', maxAppointments: 4 }],
          tuesday: [{ startTime: '08:00', endTime: '12:00', maxAppointments: 4 }],
          wednesday: [{ startTime: '08:00', endTime: '12:00', maxAppointments: 4 }],
          thursday: [{ startTime: '08:00', endTime: '12:00', maxAppointments: 4 }],
          friday: [{ startTime: '08:00', endTime: '12:00', maxAppointments: 4 }]
        },
        languages: ['English', 'Spanish'],
        biography: 'Dr. John Smith is a board-certified family physician with over 15 years of experience providing comprehensive healthcare to patients of all ages.',
        isVerified: true,
        isActive: true,
        isNewPatientAccepting: true
      });

    }

    // 5. Create template procedures
    const procedures = [
      {
        name: 'General Consultation',
        description: 'Routine medical consultation for general health concerns',
        category: 'diagnostic',
        specialization: 'General Practice',
        clinicId: clinic._id,
        title: 'General Medical Consultation',
        price: 150,
        gst: 10,
        orderIndex: 1,
        createdBy: user._id,
        duration: { estimated: 30 },
        cost: {
          base: 150,
          currency: 'USD'
        }
      },
      {
        name: 'Annual Physical Exam',
        description: 'Comprehensive annual physical examination and health assessment',
        category: 'preventive',
        specialization: 'General Practice',
        clinicId: clinic._id,
        title: 'Annual Physical Examination',
        price: 200,
        gst: 10,
        orderIndex: 2,
        createdBy: user._id,
        duration: { estimated: 45 },
        cost: {
          base: 200,
          currency: 'USD'
        }
      },
      {
        name: 'Vaccination',
        description: 'Routine vaccination administration',
        category: 'preventive',
        specialization: 'General Practice',
        clinicId: clinic._id,
        title: 'Vaccination Administration',
        price: 50,
        gst: 5,
        orderIndex: 3,
        createdBy: user._id,
        duration: { estimated: 15 },
        cost: {
          base: 50,
          currency: 'USD'
        }
      }
    ];

    for (const procedure of procedures) {
      const existingProcedure = await TemplateProcedure.findOne({ 
        name: procedure.name, 
        clinicId: clinic._id 
      });
      if (!existingProcedure) {
        await TemplateProcedure.create(procedure);
      }
    }

    // 6. Create sample appointments
    const samplePatients = [
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@email.com',
        role: 'patient',
        phone: '+1234567892',
        dateOfBirth: new Date('1985-03-20'),
        gender: 'female',
        clinicId: clinic._id,
        isActive: true,
        emailVerified: true
      },
      {
        firstName: 'Bob',
        lastName: 'Williams',
        email: 'bob.williams@email.com',
        role: 'patient',
        phone: '+1234567893',
        dateOfBirth: new Date('1978-08-10'),
        gender: 'male',
        clinicId: clinic._id,
        isActive: true,
        emailVerified: true
      },
      {
        firstName: 'Carol',
        lastName: 'Davis',
        email: 'carol.davis@email.com',
        role: 'patient',
        phone: '+1234567894',
        dateOfBirth: new Date('1992-12-05'),
        gender: 'female',
        clinicId: clinic._id,
        isActive: true,
        emailVerified: true
      }
    ];

    // Create patients if they don't exist
    const createdPatients = [];
    for (const patientData of samplePatients) {
      let patient = await User.findOne({ email: patientData.email });
      if (!patient) {
        patient = await User.create({
          ...patientData,
          password: 'patient123'
        });
      }
      createdPatients.push(patient);
    }

    // Create sample appointments
    const sampleAppointments = [
      {
        patientId: createdPatients[0]._id,
        doctorId: doctorProfile._id,
        clinicId: clinic._id,
        appointmentDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        startTime: '09:00',
        endTime: '09:30',
        duration: 30,
        appointmentType: 'consultation',
        status: 'scheduled',
        priority: 'medium',
        reason: 'Annual checkup and preventive care',
        payment: {
          amount: 150,
          currency: 'USD',
          status: 'pending',
          method: 'cash'
        }
      },
      {
        patientId: createdPatients[1]._id,
        doctorId: doctorProfile._id,
        clinicId: clinic._id,
        appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        startTime: '10:00',
        endTime: '10:45',
        duration: 45,
        appointmentType: 'check_up',
        status: 'confirmed',
        priority: 'medium',
        reason: 'Follow-up appointment for chronic condition management',
        payment: {
          amount: 200,
          currency: 'USD',
          status: 'paid',
          method: 'card'
        }
      },
      {
        patientId: createdPatients[2]._id,
        doctorId: doctorProfile._id,
        clinicId: clinic._id,
        appointmentDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        startTime: '14:00',
        endTime: '14:15',
        duration: 15,
        appointmentType: 'vaccination',
        status: 'scheduled',
        priority: 'low',
        reason: 'Annual flu vaccination',
        payment: {
          amount: 50,
          currency: 'USD',
          status: 'pending',
          method: 'insurance'
        }
      }
    ];

    for (const appointmentData of sampleAppointments) {
      const existingAppointment = await Appointment.findOne({
        patientId: appointmentData.patientId,
        doctorId: appointmentData.doctorId,
        appointmentDate: appointmentData.appointmentDate,
        startTime: appointmentData.startTime
      });
      if (!existingAppointment) {
        await Appointment.create(appointmentData);
      }
    }

    // Prepare response data
    const responseData = {
      message: 'Development data seeded successfully',
      created: {
        clinic: {
          id: clinic._id,
          name: clinic.name,
          email: clinic.email
        },
        adminUser: {
        id: adminUser._id,
        name: `${adminUser.firstName} ${adminUser.lastName}`,
        email: adminUser.email,
        role: adminUser.role
      },
      user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role
        },
        doctorProfile: {
          id: doctorProfile._id,
          specialization: doctorProfile.specialization,
          licenseNumber: doctorProfile.medicalLicenseNumber
        },
        procedures: procedures.length,
        appointments: sampleAppointments.length,
        patients: createdPatients.length
      },
      loginCredentials: {
        email: 'doctor@demo.com',
        password: 'demo123'
      },
      patientCredentials: createdPatients.map(patient => ({
        email: patient.email,
        password: 'patient123'
      }))
    };

    return successResponse(res, 200, 'Development data seeded successfully', responseData);

  } catch (error) {
    console.error('Seed error:', error);
    return errorResponse(res, 500, 'Failed to seed development data', error.message);
  }
});

/**
 * Clear all development data
 * @route DELETE /api/dev/seed
 * @access Private (dev only)
 */
const clearDevData = asyncHandler(async (req, res) => {
  // Check if not in production
  if (process.env.NODE_ENV === 'production') {
    return forbiddenResponse(res, 'Clear endpoint is not available in production');
  }

  // Check for optional SEED_KEY
  const seedKey = req.headers['x-seed-key'] || req.body.seedKey;
  if (process.env.SEED_KEY && seedKey !== process.env.SEED_KEY) {
    return forbiddenResponse(res, 'Invalid seed key');
  }

  try {
    const result = await Promise.all([
      Appointment.deleteMany({}),
      TemplateProcedure.deleteMany({}),
      DoctorProfile.deleteMany({}),
      User.deleteMany({ email: { $in: ['admin@demo.com', 'doctor@demo.com', 'alice.johnson@email.com', 'bob.williams@email.com', 'carol.davis@email.com'] } }),
      Clinic.deleteMany({ name: 'North County Family Health' })
    ]);

    return successResponse(res, 200, 'Development data cleared successfully', {
      deletedCounts: {
        appointments: result[0].deletedCount,
        procedures: result[1].deletedCount,
        doctorProfiles: result[2].deletedCount,
        users: result[3].deletedCount,
        clinics: result[4].deletedCount
      }
    });

  } catch (error) {
    console.error('Clear error:', error);
    return errorResponse(res, 500, 'Failed to clear development data', error.message);
  }
});

// Validation rules
const seedValidation = [
  body('seedKey')
    .optional()
    .isString()
    .withMessage('Seed key must be a string')
];

module.exports = {
  seedDevData,
  clearDevData,
  seedValidation
};
