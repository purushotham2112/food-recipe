import api from './api';

export const getAdminAnalytics = async () => {
  return await api.get('/admin/analytics');
};

export const getAdminUsers = async () => {
  return await api.get('/admin/users');
};

export const updateUserRole = async (id, role) => {
  return await api.put(`/admin/users/${id}`, { role });
};

export const deleteUser = async (id) => {
  return await api.delete(`/admin/users/${id}`);
};

export const getAdminReports = async () => {
  return await api.get('/admin/reports');
};

export const updateReportStatus = async (id, status) => {
  return await api.put(`/admin/reports/${id}`, { status });
};
