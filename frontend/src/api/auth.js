import apiClient from './client';

// Login API function
export const loginApi = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get current user API function
export const getMeApi = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
