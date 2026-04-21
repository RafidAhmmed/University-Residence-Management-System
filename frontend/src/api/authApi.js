import api from './api';

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  requestRegisterOtp: (userData) => api.post('/auth/register/request-otp', userData),
  verifyRegisterOtp: (payload) => api.post('/auth/register/verify-otp', payload),
  requestPasswordResetOtp: (payload) => api.post('/auth/password/request-otp', payload),
  verifyPasswordResetOtp: (payload) => api.post('/auth/password/verify-otp', payload),
  resetPassword: (payload) => api.post('/auth/password/reset', payload),
  logout: () => api.post('/auth/logout'),
};