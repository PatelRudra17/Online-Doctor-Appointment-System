import axios from 'axios';

// Create Axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kiviToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Skip redirect for auth endpoints that can legitimately return 401
      const authEndpoints = ['/auth/login'];
      const isAuthEndpoint = authEndpoints.some(endpoint => 
        error.config.url?.includes(endpoint)
      );
      
      if (!isAuthEndpoint) {
        // Token expired or invalid, clear auth and redirect to login
        localStorage.removeItem('kiviToken');
        localStorage.removeItem('kiviUser');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
