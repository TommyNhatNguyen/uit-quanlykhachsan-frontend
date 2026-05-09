import api from "./axios";

const BASE = "/api/service-price-logs";

export const servicePriceLogsApi = {
  list: (page = 1, pageSize = 10, filters = {}) =>
    api.get(BASE, { params: { page, page_size: pageSize, ...filters } }),
  get: (id) => api.get(`${BASE}/${id}`),
};
