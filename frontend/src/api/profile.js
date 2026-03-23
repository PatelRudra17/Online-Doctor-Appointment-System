import apiClient from './client.js';

// Get user profile
export const getProfile = async () => {
  try {
    const response = await apiClient.get('/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Submit verification details
export const submitVerification = async (verificationData) => {
  try {
    const response = await apiClient.post('/profile/verification', verificationData);
    return response.data;
  } catch (error) {
    console.error('Error submitting verification:', error);
    throw error;
  }
};

// Upload documents
export const uploadDocuments = async (formData) => {
  try {
    const response = await apiClient.post('/profile/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading documents:', error);
    throw error;
  }
};
