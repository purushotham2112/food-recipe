import api from './api';

export const getPantryItems = async () => {
  return await api.get('/pantry');
};

export const addPantryItem = async (data) => {
  return await api.post('/pantry', data);
};

export const updatePantryItem = async (id, data) => {
  return await api.put(`/pantry/${id}`, data);
};

export const deletePantryItem = async (id) => {
  return await api.delete(`/pantry/${id}`);
};
