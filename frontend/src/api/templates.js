import apiClient from './client';

export const getProcedures = async () => {
  try {
    const response = await apiClient.get('/templates/procedures');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching procedures:', error);
    throw error;
  }
};

export const createProcedure = async (procedureData) => {
  try {
    const response = await apiClient.post('/templates/procedures', procedureData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating procedure:', error);
    throw error;
  }
};

export const updateProcedure = async (id, procedureData) => {
  try {
    const response = await apiClient.put(`/templates/procedures/${id}`, procedureData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating procedure:', error);
    throw error;
  }
};

export const deleteProcedure = async (id) => {
  try {
    await apiClient.delete(`/templates/procedures/${id}`);
  } catch (error) {
    console.error('Error deleting procedure:', error);
    throw error;
  }
};

export const reorderProcedures = async (orderedIds) => {
  try {
    const response = await apiClient.put('/templates/procedures/reorder', { orderedIds });
    return response.data.data;
  } catch (error) {
    console.error('Error reordering procedures:', error);
    throw error;
  }
};
