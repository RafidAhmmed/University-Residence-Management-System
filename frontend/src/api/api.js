import axios from 'axios';

const envUrl = import.meta.env.VITE_API_URL?.trim();
const isLocalBackendUrl = envUrl && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api\/?$/i.test(envUrl);
const url = import.meta.env.DEV && isLocalBackendUrl ? '/api' : (envUrl || '/api');
// Create axios instance
const api = axios.create({
  baseURL: url,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = String(error.config?.url || '');
    const publicAuthEndpoints = [
      '/auth/login',
      '/auth/register',
      '/auth/register/request-otp',
      '/auth/register/verify-otp',
      '/auth/password/request-otp',
      '/auth/password/verify-otp',
      '/auth/password/reset',
      '/auth/register/options',
    ];
    const isPublicAuthEndpoint = publicAuthEndpoints.some((endpoint) => requestUrl.includes(endpoint));

    if (status === 401 && !isPublicAuthEndpoint) {
      // Token expired/invalid for protected request: clear auth and send to login.
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;