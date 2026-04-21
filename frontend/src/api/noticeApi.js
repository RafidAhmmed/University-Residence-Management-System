import api from './api';

export const noticeAPI = {
  getAllNotices: (params = {}) => api.get('/notices', { params }),
  getNoticeById: (id) => api.get(`/notices/${id}`),
  getMyNotices: () => api.get('/notices/admin/my'),
  createNotice: (noticeData) => api.post('/notices', noticeData),
};