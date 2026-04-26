import api from './api';

export const authAPI = {
  getRegisterOptions: () => api.get('/auth/register/options'),
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  requestRegisterOtp: (userData) => api.post('/auth/register/request-otp', userData),
  verifyRegisterOtp: (payload) => api.post('/auth/register/verify-otp', payload),
  requestPasswordResetOtp: (payload) => api.post('/auth/password/request-otp', payload),
  verifyPasswordResetOtp: (payload) => api.post('/auth/password/verify-otp', payload),
  resetPassword: (payload) => api.post('/auth/password/reset', payload),
  changePassword: (payload) => api.post('/auth/password/change', payload),
  logout: () => api.post('/auth/logout'),
};