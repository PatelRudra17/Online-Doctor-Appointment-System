import apiClient from './client';

export const getAppointments = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.doctorId) queryParams.append('doctorId', params.doctorId);
    if (params.doctorIds && params.doctorIds.length > 0) {
      params.doctorIds.forEach(doctorId => {
        queryParams.append('doctorIds', doctorId);
      });
    }
    
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.dateTo) queryParams.append('dateTo', params.dateTo);
    if (params.status) queryParams.append('status', params.status);
    if (params.viewType) queryParams.append('viewType', params.viewType);
    
    const response = await apiClient.get(`/appointments?${queryParams.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};
