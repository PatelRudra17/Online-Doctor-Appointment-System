import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectStatuses } from '../../store/wizardSlice';

const ActivateProfilePage = () => {
  const navigate = useNavigate();
  const statuses = useSelector(selectStatuses);

  const statusCards = [
    {
      id: 'verification',
      title: 'Verification',
      description: 'Complete identity and professional verification',
      status: statuses.verification
    },
    {
      id: 'personal',
      title: 'Personal Details',
      description: 'Provide your personal and professional information',
      status: statuses.personal
    },
    {
      id: 'consultation',
      title: 'Consultation Details',
      description: 'Set up your consultation preferences and services',
      status: statuses.consultation
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'in-progress':
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': { text: 'Completed', class: 'bg-green-100 text-green-800' },
      'in-progress': { text: 'In Progress', class: 'bg-blue-100 text-blue-800' },
      'pending': { text: 'Incomplete', class: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const handleGetStarted = () => {
    navigate('/activate-profile/verification');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Activate Your Profile
          </h1>
          <p className="text-lg text-gray-600">
            Complete the following steps to activate your professional profile
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {statusCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                {getStatusIcon(card.status)}
                {getStatusBadge(card.status)}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Get Started
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivateProfilePage;
