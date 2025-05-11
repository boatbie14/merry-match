import apiClient from '@/interceptor/apiClient';
// import axios from 'axios';

export const getMarriedUsers = async () => {
  try {
    const response = await apiClient.get(`/merry/merried-users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching married users:', error);
    throw error;
  }
};

export const getUserHobbies = async (id)=>{
  try{
    const response = await apiClient.get(`/merry/user-hobbies/${id}`);
    return response.data;
  }catch(error){
    console.error('Error fetching users hobbies :', error);
    throw error
  }
}


export const postMerriyLike = async () =>{
    try {
        const response = await apiClient.post('/merry/like-users');
        return response.data;
      } catch (error) {
        console.error('Error fetching married users:', error);
        throw error;
      }
};

export const deleteMerriyLike = async () =>{
    try {
        const response = await apiClient.delete('/merry/like-users');
        return response.data;
      } catch (error) {
        console.error('Error fetching married users:', error);
        throw error;
      }
};

