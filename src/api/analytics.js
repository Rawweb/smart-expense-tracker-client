import api from './axios.js';

export const getDashboard = () => api.get('/analytics/dashboard');
export const getSummary = (params) => api.get('/analytics/summary', { params });
export const getByCategory = (params) => api.get('/analytics/by-category', { params });
export const getDaily = (params) => api.get('/analytics/daily', { params });
