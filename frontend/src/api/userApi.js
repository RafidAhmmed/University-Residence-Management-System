import api from './api';

export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  updateUserProfile: (id, profileData, profilePictureFile = null) => {
    const formData = new FormData();

    // Add profile data
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== null && profileData[key] !== undefined) {
        formData.append(key, profileData[key]);
      }
    });

    // Add profile picture file if provided
    if (profilePictureFile) {
      formData.append('profilePicture', profilePictureFile);
    }

    return api.put(`/users/${id}/profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};