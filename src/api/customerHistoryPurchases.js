import api from './axios';

const BASE = '/api/customer-history-purchases';

export const customerHistoryPurchasesApi = {
  list: (page = 1, pageSize = 10) =>
    api.get(BASE, { params: { page, page_size: pageSize } }),
  get: (id) => api.get(`${BASE}/${id}`),
  create: (data) => api.post(BASE, data),
  update: (id, data) => api.put(`${BASE}/${id}`, data),
  delete: (id) => api.delete(`${BASE}/${id}`),
};
