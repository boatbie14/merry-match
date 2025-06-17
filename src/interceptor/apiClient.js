import axios from 'axios';
import { supabase } from '@/lib/supabaseClient';

const baseURL = '/api';

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
 async (config) => {
      const {data} = await supabase.auth.getSession();
      const token = data.session?.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response Interceptor Error:', error);
    if (error.response?.status === 404) {
      console.log('Resource Not Found');
    }
    return Promise.reject(error);
  }
);

export default apiClient;