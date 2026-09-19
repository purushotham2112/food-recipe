import api from './api';

export const getShoppingList = async () => {
  return await api.get('/shopping-list');
};

export const addShoppingItem = async (data) => {
  return await api.post('/shopping-list', data);
};

export const updateShoppingItem = async (itemId, data) => {
  return await api.put(`/shopping-list/${itemId}`, data);
};

export const deleteShoppingItem = async (itemId) => {
  return await api.delete(`/shopping-list/${itemId}`);
};

export const clearShoppingList = async () => {
  return await api.delete('/shopping-list');
};
