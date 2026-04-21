import api from './api';

export const noticeAPI = {
  getAllNotices: (params = {}) => api.get('/notices', { params }),
  getAllPublishedNotices: (params = {}) => api.get('/notices', { params: { page: 1, limit: 1000, ...params } }),
  getNoticeById: (id) => api.get(`/notices/${id}`),
  createNotice: (noticeData, pdfFile = null) => {
    const formData = new FormData();

    Object.keys(noticeData).forEach((key) => {
      if (noticeData[key] !== null && noticeData[key] !== undefined) {
        formData.append(key, noticeData[key]);
      }
    });

    if (pdfFile) {
      formData.append('pdfFile', pdfFile);
    }

    return api.post('/notices', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};