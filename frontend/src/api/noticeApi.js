import api from './api';

export const noticeAPI = {
  getAllNotices: (params = {}) => api.get('/notices', { params }),
  getAllPublishedNotices: (params = {}) => api.get('/notices', { params: { page: 1, limit: 1000, ...params } }),
  getNoticeById: (id) => api.get(`/notices/${id}`),
  createNotice: (noticeData) => api.post('/notices', noticeData),
};