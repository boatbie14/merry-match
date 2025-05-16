// services/apiClient.js
// ## TODO 😗🕐 HIDDEN CONSOLE.LOG data
import axios from 'axios';
import { createClient  } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 const supabase = createClient(supabaseUrl, supabaseKey);

const baseURL = '/api';

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request Interceptor
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

// ✅ Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response Interceptor:', response);
    return response;
  },
  (error) => {
    console.error('Response Interceptor Error:', error);
    if (error.response?.status === 401) {
      console.log('Unauthorized - Redirecting or clearing token');
      localStorage.removeItem('authToken');
      // router.push('/login');
    } else if (error.response?.status === 404) {
      console.log('Resource Not Found');
    }
    return Promise.reject(error);
  }
);

// ✅ export apiClient และฟังก์ชัน
export default apiClient;