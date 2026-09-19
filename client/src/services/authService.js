import api from './api';

export const registerUser = async (data) => {
  return await api.post('/auth/register', data);
};

export const loginUser = async (data) => {
  return await api.post('/auth/login', data);
};

export const logoutUser = async () => {
  return await api.post('/auth/logout');
};

export const getMe = async () => {
  return await api.get('/auth/me');
};

export const updateProfile = async (data) => {
  return await api.put('/auth/profile', data);
};
