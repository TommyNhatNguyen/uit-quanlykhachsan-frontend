import api from './axios';

const BASE = '/api/service-details';

export const serviceDetailsApi = {
  list: (page = 1, pageSize = 10, filters = {}) =>
    api.get(BASE, { params: { page, page_size: pageSize, ...filters } }),
  // NOTE: PK in response is named "service_detail" (not "service_detail_id")
  get: (id) => api.get(`${BASE}/${id}`),
  create: (data) => api.post(BASE, data),
  update: (id, data) => api.put(`${BASE}/${id}`, data),
  delete: (id) => api.delete(`${BASE}/${id}`),
};
