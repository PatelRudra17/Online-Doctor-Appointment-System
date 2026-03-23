import apiClient from './client';

export const getDashboardData = async () => {
  try {
    const response = await apiClient.get('/dashboard');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export const getDashboardSummary = async (dateFrom, dateTo) => {
  try {
    const params = new URLSearchParams();
    
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    
    const response = await apiClient.get(`/dashboard/summary?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
};
