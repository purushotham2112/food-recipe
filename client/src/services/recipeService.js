import api from './api';

export const getRecipes = async (params = {}) => {
  return await api.get('/recipes', { params });
};

export const getRecipeBySlug = async (slug) => {
  return await api.get(`/recipes/slug/${slug}`);
};

export const getRecipeById = async (id) => {
  return await api.get(`/recipes/${id}`);
};

export const createRecipe = async (recipeData) => {
  return await api.post('/recipes', recipeData);
};

export const updateRecipe = async (id, recipeData) => {
  return await api.put(`/recipes/${id}`, recipeData);
};

export const deleteRecipe = async (id) => {
  return await api.delete(`/recipes/${id}`);
};

export const toggleFavorite = async (id) => {
  return await api.post(`/recipes/${id}/favorite`);
};

export const getUserFavorites = async () => {
  return await api.get('/users/favorites');
};

export const getRecipeReviews = async (id) => {
  return await api.get(`/recipes/${id}/reviews`);
};

export const createRecipeReview = async (id, reviewData) => {
  return await api.post(`/recipes/${id}/reviews`, reviewData);
};
