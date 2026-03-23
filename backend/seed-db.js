const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models
const User = require('./src/models/User');
const Clinic = require('./src/models/Clinic');
const DoctorProfile = require('./src/models/DoctorProfile');
const TemplateProcedure = require('./src/models/TemplateProcedure');
const Appointment = require('./src/models/Appointment');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clean existing data
    await Promise.all([
      Appointment.deleteMany({}),
      TemplateProcedure.deleteMany({}),
      DoctorProfile.deleteMany({}),
      User.deleteMany({}),
      Clinic.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // 1. Create admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@demo.com',
      username: 'admin',
      password: 'admin1234',
      role: 'admin',
      phone: '+1234567890',
      dateOfBirth: new Date('1980-01-01'),
      gender: 'other',
      isActive: true,
      emailVerified: true
    });
    console.log('Created admin user');

    // 2. Create clinic
    const clinic = await Clinic.create({
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
      specialties: ['General Practice', 'Pediatrics', 'Cardiology'],
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
    console.log('Created clinic');

    // 3. Create doctor user
    const doctorUser = await User.create({
      firstName: 'John',
      lastName: 'Smith',
      email: 'doctor@demo.com',
      username: 'doctor',
      password: 'demo1234',
      role: 'doctor',
      phone: '+1234567891',
      dateOfBirth: new Date('1980-05-15'),
      gender: 'male',
      clinicId: clinic._id,
      isActive: true,
      emailVerified: true
    });
    console.log('Created doctor user');

    // 4. Create doctor profile
    const doctorProfile = await DoctorProfile.create({
      userId: doctorUser._id,
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
    console.log('Created doctor profile');

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
        createdBy: doctorUser._id,
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
        createdBy: doctorUser._id,
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
        createdBy: doctorUser._id,
        duration: { estimated: 15 },
        cost: {
          base: 50,
          currency: 'USD'
        }
      }
    ];

    await TemplateProcedure.insertMany(procedures);
    console.log('Created template procedures');

    console.log('\n=== Database Seeded Successfully ===');
    console.log('\nLogin Credentials:');
    console.log('Admin: admin@demo.com / admin1234');
    console.log('Doctor: doctor@demo.com / demo1234');
    console.log('\nServer is running on: http://localhost:5000');
    console.log('Frontend is running on: http://localhost:5173');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();
