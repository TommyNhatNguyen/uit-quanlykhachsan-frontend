import api from './axios';

export const fetchState = () => api.get('/api/state');

export const saveState = (data) =>
  api.put('/api/state', data).catch((e) => console.warn('saveState lỗi:', e));

export const resetState = () => api.post('/api/state/reset');
