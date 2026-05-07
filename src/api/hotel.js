import axiosInstance from "./axios";

class HotelApi {
  static path = "/api/hotels";

  list({ page = 1, pageSize = 10 }) {
    return axiosInstance.get(HotelApi.path, {
      params: {
        page,
        pageSize,
      },
    });
  }

  get(id) {
    return axiosInstance.get(`${HotelApi.path}/${id}`);
  }

  create(data) {
    return axiosInstance.post(`${HotelApi.path}`, data);
  }

  update(id, data) {
    return axiosInstance.put(`${HotelApi.path}/${id}`, data);
  }

  delete(id) {
    return axiosInstance.delete(`${HotelApi.path}/${id}`);
  }
}

export default HotelApi;
