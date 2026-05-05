import api from './axios';

const BASE = '/api/counters';

export const countersApi = {
  list: (page = 1, pageSize = 10) =>
    api.get(BASE, { params: { page, page_size: pageSize } }),
  // PK is a string name, not a number
  get: (name) => api.get(`${BASE}/${name}`),
  create: (data) => api.post(BASE, data),
  update: (name, data) => api.put(`${BASE}/${name}`, data),
  delete: (name) => api.delete(`${BASE}/${name}`),
};
