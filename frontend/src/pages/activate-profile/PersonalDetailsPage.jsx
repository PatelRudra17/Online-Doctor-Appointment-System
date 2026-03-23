import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  selectPersonal, 
  updatePersonal, 
  updateStatus, 
  nextStep, 
  previousStep 
} from '../../store/wizardSlice';
import { updateProfile } from '../../api/profile';

const PersonalDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const personal = useSelector(selectPersonal);
  
  const [formData, setFormData] = useState(() => {
    return {
      firstName: personal.firstName || '',
      lastName: personal.lastName || '',
      email: personal.email || '',
      phone: personal.phone || '',
      specialization: personal.specialization || '',
      experience: personal.experience || '',
      qualification: personal.qualification || ''
    };
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const specializations = [
    'General Practice',
    'Cardiology',
    'Dermatology',
    'Pediatrics',
    'Orthopedics',
    'Gynecology',
    'Neurology',
    'Psychiatry',
    'Ophthalmology',
    'ENT',
    'Other'
  ];

  const qualifications = [
    'MBBS',
    'MD',
    'MS',
    'DM',
    'MCh',
    'DNB',
    'Fellowship',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    // Save current progress
    dispatch(updatePersonal(formData));
    
    dispatch(previousStep());
    navigate('/activate-profile/verification');
  };

  const handleSaveAndNext = async () => {
    try {
      setSubmitting(true);
      setError(null);

      // Save form data to Redux
      dispatch(updatePersonal(formData));
      
      // Update profile via API
      await updateProfile({
        personalDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          specialty: formData.specialization,
          experience: formData.experience,
          qualification: formData.qualification
        }
      });
      
      // Update status to completed
      dispatch(updateStatus({ section: 'personal', status: 'completed' }));
      
      // Navigate to next step
      dispatch(nextStep());
      navigate('/activate-profile/consultation');
    } catch (err) {
      console.error('Error saving personal details:', err);
      setError('Failed to save personal details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  const isFormValid = 
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim() &&
    formData.phone.trim() &&
    formData.specialization.trim() &&
    formData.qualification.trim();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Step Tabs */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-center">
              <li className="flex items-center">
                <div className="flex items-center px-2">
                  <span className="flex items-center px-6 py-2 text-sm font-medium rounded-full bg-green-600 text-white">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white mr-2">
                      ✓
                    </span>
                    Verification
                  </span>
                </div>
              </li>
              <li className="flex items-center">
                <span className="flex items-center px-6 py-2 text-sm font-medium rounded-full bg-blue-600 text-white">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white mr-2">
                    2
                  </span>
                  Personal Details
                </span>
              </li>
              <li className="flex items-center">
                <div className="flex items-center px-2">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-500">Consultation</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Personal Details</h2>
            <p className="mt-1 text-sm text-gray-600">
              Please provide your personal and professional information
            </p>
          </div>

          <div className="p-6">
            <form className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization *
                    </label>
                    <select
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select specialization</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-2">
                      Highest Qualification *
                    </label>
                    <select
                      id="qualification"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select qualification</option>
                      {qualifications.map(qual => (
                        <option key={qual} value={qual}>{qual}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      min="0"
                      max="50"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Number of years"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Information (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any additional information you'd like to share..."
                />
              </div>
            </form>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="text-red-800">{error}</div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                disabled={submitting}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <div className="space-x-3">
                <button
                  onClick={() => dispatch(updatePersonal(formData))}
                  disabled={submitting}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Progress
                </button>
                <button
                  onClick={handleSaveAndNext}
                  disabled={!isFormValid || submitting}
                  className={`px-6 py-2 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isFormValid && !submitting
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {submitting ? 'Saving...' : 'Save & Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsPage;
