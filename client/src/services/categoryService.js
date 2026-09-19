import api from './api';

export const getCategories = async () => {
  return await api.get('/categories');
};

export const getCategoryBySlug = async (slug) => {
  return await api.get(`/categories/slug/${slug}`);
};

export const createCategory = async (data) => {
  return await api.post('/categories', data);
};

export const updateCategory = async (id, data) => {
  return await api.put(`/categories/${id}`, data);
};

export const deleteCategory = async (id) => {
  return await api.delete(`/categories/${id}`);
};
