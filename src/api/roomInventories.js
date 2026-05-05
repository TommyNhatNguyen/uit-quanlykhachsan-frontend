import api from './axios';

const BASE = '/api/room-inventories';

export const roomInventoriesApi = {
  list: (page = 1, pageSize = 10) =>
    api.get(BASE, { params: { page, page_size: pageSize } }),
  get: (roomId) => api.get(`${BASE}/${roomId}`),
  create: (data) => api.post(BASE, data),
  update: (roomId, data) => api.put(`${BASE}/${roomId}`, data),
  delete: (roomId) => api.delete(`${BASE}/${roomId}`),
};
