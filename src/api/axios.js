import { axiosInstance } from '../config/axiosInstance';

axiosInstance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg =
      err.response?.data?.detail ||
      err.response?.data?.error ||
      'Lỗi không xác định';
    return Promise.reject(new Error(msg));
  }
);

export default axiosInstance;
