// services/apiClient.js
// ## TODO 😗🕐 HIDDEN CONSOLE.LOG data
import axios from 'axios';

const baseURL = '/api';

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // console.log('Request Interceptor:', config);
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
    console.log('Response Interceptor:', response);
    return response;
  },
  (error) => {
    console.error('Response Interceptor Error:', error);
    if (error.response?.status === 401) {
      console.log('Unauthorized - Redirecting or clearing token');
      localStorage.removeItem('authToken');
      // router.push('/login'); // พาไปหน้า login ถ้าไม่ login
    } else if (error.response?.status === 404) {
      console.log('Resource Not Found');
    }
    return Promise.reject(error);
  }
);

export default apiClient;