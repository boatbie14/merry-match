import apiClient from '@/interceptor/apiClient';

export const getUserHobbies = async (userHobbiesId)=>{
  try{
    const response = await apiClient.get(`/user-hobbies/${userHobbiesId}`);
    return response.data;
  }catch(error){
    console.error('Error fetching users hobbies :', error);
    throw error
  }
}