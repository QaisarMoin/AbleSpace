import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ablespace-xyiu.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Added Authorization header:', config.headers.Authorization);
  } else {
    console.log('No token found in localStorage');
  }
  return config;
});

// Add response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication error:', error.response.data);
      // Clear token and redirect to login if needed
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
