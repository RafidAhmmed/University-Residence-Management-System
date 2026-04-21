import api from './api';

export const feeAPI = {
  getMyFees: () => api.get('/fees/me'),
  getAllFees: () => api.get('/fees/admin'),
  assignFees: (payload) => api.post('/fees/admin/assign', payload),
  payFee: (feeId, payload) => api.post(`/fees/${feeId}/pay`, payload),
};