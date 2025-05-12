import apiClient from '@/interceptor/apiClient';
// import axios from 'axios';

export const getMarriedUsers = async () => {
  try {
    const response = await apiClient.get(`/merry/merried-users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching merried users:', error);
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

export const getMerriedMe = async ()=>{
  try{
    const response = await apiClient.get(`merry/merried-me`)
    return response.data
  }catch(error){
    console.error('Error fetching users like you :', error);
    throw error
  }
}

export const getMerriedMatch = async ()=>{
    try{
    const response = await apiClient.get(`merry/merried-match`)
    return response.data
  }catch(error){
    console.error('Error fetching merried-match :', error);
    throw error
  }
}

export const postMerriedLike = async (toUserId) =>{
    try {
      console.log(toUserId)
        const response = await apiClient.post('/merry/like', { toUserId });
        return response
      } catch (error) {
        console.error('Error fetching merried users:', error);
        throw error;
      }
};

export const deleteMerriedLike = async (toUserId) =>{
    try {console.log(toUserId)
        const response = await apiClient.delete('/merry/like', { data: { toUserId } });
        return response
      } catch (error) {
        console.error('Error fetching merried users:', error);
        throw error;
      }
};

