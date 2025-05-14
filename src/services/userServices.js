import apiClient from '@/interceptor/apiClient';

export const getUsers = async () => {
  try {
    const response = await apiClient.get(`/profile`);
    return response.data;
  } catch (error) {
    console.error('Error fetching merried users:', error);
    throw error;
  }
};