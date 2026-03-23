import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, token } = useAuth();
  const location = useLocation();

  // Show loading spinner while authentication is being initialized
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  // Check authentication and token validity
  if (!isAuthenticated || !token) {
    // Redirect to login page with return URL
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
