import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectWizardState } from '../../store/wizardSlice';

const SuccessPage = () => {
  const navigate = useNavigate();
  const wizardState = useSelector(selectWizardState);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Profile Activated Successfully!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Congratulations! Your professional profile has been successfully activated and is now ready for patients to discover and book consultations.
          </p>

          {/* Completion Summary */}
          <div className="bg-white shadow rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Setup Summary</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Professional Verification</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Personal Details</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Consultation Setup</span>
              </div>
            </div>
            
            {wizardState.personal && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Profile Name:</span> {wizardState.personal.firstName} {wizardState.personal.lastName}
                </p>
                {wizardState.personal.specialization && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Specialization:</span> {wizardState.personal.specialization}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-lg font-medium text-blue-900 mb-3">What's Next?</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Patients can now discover your profile and book consultations</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Manage your schedule and availability from the dashboard</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Update your profile anytime to keep information current</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleViewProfile}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              View Profile
            </button>
            <button
              onClick={handleGoToDashboard}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
