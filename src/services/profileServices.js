import apiClient from '@/interceptor/apiClient';

export const updateUserProfile = async (data) => {
  try {
    const response = await apiClient.put(`/profile/update`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};


export const deleteUsers = async () => {
  try {

    const response = await apiClient.delete(`/profile/delete`);
    return response
  } catch (error) {
    console.error('Error fetching merried users:', error);
    throw error;
  }
};