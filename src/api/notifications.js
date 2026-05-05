import api from './axios';

const BASE = '/api/notifications';

export const notificationsApi = {
  list: (page = 1, pageSize = 10) =>
    api.get(BASE, { params: { page, page_size: pageSize } }),
  get: (id) => api.get(`${BASE}/${id}`),
  create: (data) => api.post(BASE, data),
  // To mark as read: update(id, { unread: false })
  update: (id, data) => api.put(`${BASE}/${id}`, data),
  delete: (id) => api.delete(`${BASE}/${id}`),
};
