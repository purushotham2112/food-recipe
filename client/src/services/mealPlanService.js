import api from './api';

export const getMealPlans = async (params = {}) => {
  return await api.get('/meal-plans', { params });
};

export const createMealPlan = async (data) => {
  return await api.post('/meal-plans', data);
};

export const deleteMealPlan = async (id) => {
  return await api.delete(`/meal-plans/${id}`);
};

export const generateShoppingFromMealPlans = async () => {
  return await api.post('/meal-plans/generate-shopping-list');
};
