import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  selectConsultation, 
  updateConsultation, 
  updateStatus, 
  completeWizard 
} from '../../store/wizardSlice';

const ConsultationDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const consultation = useSelector(selectConsultation);
  
  const [formData, setFormData] = useState(() => {
    const savedState = localStorage.getItem('wizardState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        if (parsedState.consultation) {
          return { ...consultation, ...parsedState.consultation };
        }
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
    return {
      clinicName: consultation.clinicName || '',
      clinicAddress: consultation.clinicAddress || '',
      clinicPhone: consultation.clinicPhone || '',
      services: consultation.services || [],
      consultationFees: consultation.consultationFees || ''
    };
  });

  const availableServices = [
    'General Consultation',
    'Specialist Consultation',
    'Video Consultation',
    'Home Visit',
    'Second Opinion',
    'Health Check-up',
    'Follow-up Visit',
    'Emergency Consultation'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleBack = () => {
    // Save current progress
    dispatch(updateConsultation(formData));
    saveToLocalStorage();
    
    navigate('/activate-profile/personal');
  };

  const handleComplete = () => {
    // Save form data to Redux
    dispatch(updateConsultation(formData));
    
    // Update status to completed
    dispatch(updateStatus({ section: 'consultation', status: 'completed' }));
    
    // Mark wizard as completed
    dispatch(completeWizard());
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Navigate to success page or dashboard
    navigate('/activate-profile/success');
  };

  const saveToLocalStorage = () => {
    const savedState = localStorage.getItem('wizardState');
    let wizardState = savedState ? JSON.parse(savedState) : {};
    
    wizardState.consultation = formData;
    wizardState.timestamp = new Date().toISOString();
    
    localStorage.setItem('wizardState', JSON.stringify(wizardState));
  };

  const isFormValid = 
    formData.clinicName.trim() &&
    formData.clinicAddress.trim() &&
    formData.clinicPhone.trim() &&
    formData.services.length > 0 &&
    formData.consultationFees.trim();

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
                <div className="flex items-center px-2">
                  <span className="flex items-center px-6 py-2 text-sm font-medium rounded-full bg-green-600 text-white">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white mr-2">
                      ✓
                    </span>
                    Personal Details
                  </span>
                </div>
              </li>
              <li className="flex items-center">
                <span className="flex items-center px-6 py-2 text-sm font-medium rounded-full bg-blue-600 text-white">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white mr-2">
                    3
                  </span>
                  Consultation
                </span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Consultation Details</h2>
            <p className="mt-1 text-sm text-gray-600">
              Set up your consultation preferences and services
            </p>
          </div>

          <div className="p-6">
            <form className="space-y-6">
              {/* Clinic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Clinic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700 mb-2">
                      Clinic/Hospital Name *
                    </label>
                    <input
                      type="text"
                      id="clinicName"
                      name="clinicName"
                      value={formData.clinicName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your clinic or hospital name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="clinicAddress" className="block text-sm font-medium text-gray-700 mb-2">
                      Clinic Address *
                    </label>
                    <textarea
                      id="clinicAddress"
                      name="clinicAddress"
                      rows="3"
                      value={formData.clinicAddress}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter complete clinic address"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="clinicPhone" className="block text-sm font-medium text-gray-700 mb-2">
                      Clinic Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="clinicPhone"
                      name="clinicPhone"
                      value={formData.clinicPhone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Services Offered */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Services Offered *</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableServices.map(service => (
                    <label
                      key={service}
                      className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    >
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {service}
                      </span>
                    </label>
                  ))}
                </div>
                {formData.services.length === 0 && (
                  <p className="mt-2 text-sm text-red-600">Please select at least one service</p>
                )}
              </div>

              {/* Consultation Fees */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Consultation Fees</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="consultationFees" className="block text-sm font-medium text-gray-700 mb-2">
                      Standard Consultation Fee *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        id="consultationFees"
                        name="consultationFees"
                        value={formData.consultationFees}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="videoConsultationFees" className="block text-sm font-medium text-gray-700 mb-2">
                      Video Consultation Fee (Optional)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        id="videoConsultationFees"
                        name="videoConsultationFees"
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Working Hours (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="workingDays" className="block text-sm font-medium text-gray-700 mb-2">
                      Working Days
                    </label>
                    <input
                      type="text"
                      id="workingDays"
                      name="workingDays"
                      placeholder="Monday - Friday"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="workingHours" className="block text-sm font-medium text-gray-700 mb-2">
                      Working Hours
                    </label>
                    <input
                      type="text"
                      id="workingHours"
                      name="workingHours"
                      placeholder="9:00 AM - 6:00 PM"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
              <div className="space-x-3">
                <button
                  onClick={saveToLocalStorage}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Progress
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!isFormValid}
                  className={`px-6 py-2 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isFormValid
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Complete Setup
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetailsPage;
