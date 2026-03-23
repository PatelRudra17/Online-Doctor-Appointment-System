import React from 'react';
import { useNavigate } from 'react-router-dom';

// This component is now deprecated. Use DashboardPage from pages/dashboard/DashboardPage.jsx instead.
const Dashboard = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Redirect to the new dashboard page
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to new dashboard...</p>
      </div>
    </div>
  );
};

export default Dashboard;
