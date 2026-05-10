import api from './axios';

const BASE = '/api/bookings';

export const bookingsApi = {
  list: (page = 1, pageSize = 10, filters = {}) =>
    api.get(BASE, { params: { page, page_size: pageSize, ...filters } }),
  get: (id) => api.get(`${BASE}/${id}`),
  create: (data) => api.post(`${BASE}/with-details`, data),
  update: (id, data) => api.put(`${BASE}/with-details/${id}`, data),
  delete: (id) => api.delete(`${BASE}/${id}`),
};
