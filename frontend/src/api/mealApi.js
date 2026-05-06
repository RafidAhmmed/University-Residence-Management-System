import api from './api';

export const mealAPI = {
  // Get meal prices
  getMealPrices: (date = null, hall = null) => {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    if (hall) params.set('hall', hall);
    const query = params.toString();
    const url = query ? `/meals/prices?${query}` : '/meals/prices';
    return api.get(url);
  },

  // Check if student can order meals (before midnight)
  canOrderMeals: (date = null, hall = null) => {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    if (hall) params.set('hall', hall);
    const query = params.toString();
    const url = query ? `/meals/can-order?${query}` : '/meals/can-order';
    return api.get(url);
  },

  // Create meal order
  createMealOrder: (mealData) => api.post('/meals', mealData),

  // Get student's meal orders
  getStudentMealOrders: (page = 1, limit = 10) =>
    api.get(`/meals/my-orders?page=${page}&limit=${limit}`),

  // Get student's deposit information
  getStudentDeposit: () => api.get('/meals/deposit/info'),

  // Add money to deposit (fake payment)
  addDeposit: (amount, paymentMethod) =>
    api.post('/meals/deposit/add', { amount, paymentMethod }),

  // Admin: Get all meal orders
  getAllMealOrders: (page = 1, limit = 20, status = null) => {
    let url = `/meals/admin/all-orders?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    return api.get(url);
  },

  // Admin: Update meal prices
  updateMealPrices: (mealType, chickenPrice, fishPrice, effectiveFrom, hall) =>
    api.put(`/meals/prices/${mealType}`, {
      mealType,
      chickenPrice,
      fishPrice,
      effectiveFrom,
      hall,
    }),

  // Admin: Meal closures
  getMealClosures: () => api.get('/meals/admin/closures'),
  createMealClosure: (startDate, endDate, hall) =>
    api.post('/meals/admin/closures', { startDate, endDate, hall }),
  deleteMealClosure: (id) => api.delete(`/meals/admin/closures/${id}`),

  // Special meals
  getSpecialMeals: (date, hall) => {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    if (hall) params.set('hall', hall);
    const query = params.toString();
    const url = query ? `/meals/specials?${query}` : '/meals/specials';
    return api.get(url);
  },
  getAdminSpecialMeals: () => api.get('/meals/admin/specials'),
  createSpecialMeal: (payload) => api.post('/meals/admin/specials', payload),
  deleteSpecialMeal: (id) => api.delete(`/meals/admin/specials/${id}`),
};
