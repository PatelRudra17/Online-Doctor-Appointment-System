import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <div className="text-6xl font-bold text-gray-400 mb-4">404</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
