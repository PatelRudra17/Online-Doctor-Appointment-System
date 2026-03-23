import React, { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  CurrencyDollarIcon, 
  DocumentTextIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  ChartBarIcon,
  UserGroupIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { getDashboardData, getDashboardSummary } from '../../api/dashboard';

const DashboardPage = () => {
  const [selectedTab, setSelectedTab] = useState('Invoices');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [viewType, setViewType] = useState('Today');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = ['Invoices', 'Receipts', 'Dues', 'Online Payments', 'Sent For Claims', 'Claim History'];
  const viewOptions = ['Today', 'Daily'];

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange.start, dateRange.end]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      // First try to get basic dashboard data
      const basicData = await getDashboardData();
      
      // If date range is specified, also get summary data
      let summaryData = null;
      if (dateRange.start || dateRange.end) {
        try {
          summaryData = await getDashboardSummary(dateRange.start, dateRange.end);
        } catch (summaryError) {
          console.log('Summary data not available, using basic data');
        }
      }
      
      // Merge data or use basic data
      setDashboardData(summaryData || basicData);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Row - Three Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointments Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Appointments</h2>
            
            <div className="space-y-4">
              {/* Date Range Picker */}
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Start date"
                />
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="End date"
                />
              </div>
              
              {/* Today/Daily Dropdowns */}
              <div className="flex gap-2">
                {viewOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setViewType(option)}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewType === option
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              
              {/* Loading State */}
              {loading && (
                <div className="text-center py-8 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p>Loading...</p>
                </div>
              )}
              
              {/* Error State */}
              {error && (
                <div className="text-center py-8 text-red-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-red-400" />
                  <p>{error}</p>
                </div>
              )}
              
              {/* Empty State */}
              {!loading && !error && (!dashboardData || (!dashboardData.summary && !dashboardData.breakdowns && !dashboardData.trends)) && (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>--- No Data Available ---</p>
                </div>
              )}
            </div>
          </div>

          {/* Consultant's Activity */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Consultant's Activity</h2>
            
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <UserCircleIcon className="w-12 h-12 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {loading ? 'Loading...' : 'Dr. Raju'}
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {loading ? '₹ 0.00 (0)' : `₹${dashboardData?.summary?.totalRevenue || 0} (${dashboardData?.summary?.totalAppointments || 0})`}
                </p>
              </div>
            </div>
          </div>

          {/* Overall Statistics */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Statistics</h2>
            
            <div className="space-y-4">
              {/* Status Toggles */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200">
                    Active
                  </button>
                  <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200">
                    Inactive
                  </button>
                </div>
              </div>
              
              {/* Bottom Tabs */}
              <div className="border-t pt-4">
                <div className="flex flex-wrap gap-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        selectedTab === tab
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Empty State */}
              <div className="text-center py-4 text-gray-500">
                <DocumentTextIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No {selectedTab.toLowerCase()} data</p>
              </div>
            </div>
          </div>
        </div>

        {/* Generate New Reports Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Generate New Reports</h2>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                <PrinterIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                <ArrowDownTrayIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select Report Type</option>
              <option>Daily Report</option>
              <option>Weekly Report</option>
              <option>Monthly Report</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select Department</option>
              <option>All Departments</option>
              <option>OPD</option>
              <option>IPD</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              Generate Report
            </button>
          </div>
        </div>

        {/* Bottom Section - Three Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Summary */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Category Summary</h2>
            <div className="text-center py-8">
              <ChartBarIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">No category data available</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ₹{loading ? '0' : (dashboardData?.summary?.totalRevenue || 0)}
              </p>
            </div>
          </div>

          {/* IPD Income */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">IPD Income</h2>
            <div className="text-center py-8">
              <CurrencyDollarIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">No IPD income data</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ₹{loading ? '0' : (dashboardData?.summary?.totalRevenue || 0)}
              </p>
            </div>
          </div>

          {/* Overall Metrics */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Metrics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Patients</span>
                <span className="text-lg font-semibold text-gray-900">
                  {loading ? '0' : (dashboardData?.summary?.uniquePatients || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="text-lg font-semibold text-gray-900">
                  ₹{loading ? '0' : (dashboardData?.summary?.totalRevenue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Appointments</span>
                <span className="text-lg font-semibold text-gray-900">
                  {loading ? '0' : (dashboardData?.summary?.totalAppointments || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
