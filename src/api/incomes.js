import api from './axios.js';

export const getIncomes = () => api.get('/incomes');
export const createIncome = (data) => api.post('/incomes', data);
export const updateIncome = (id, data) => api.put(`/incomes/${id}`, data);
export const deleteIncome = (id) => api.delete(`/incomes/${id}`);
