import axiosInstance from "./axios";

class StatsApi {
  static path = "/api/stats";

  kpiToday() {
    return axiosInstance.get(`${StatsApi.path}/kpi-today`);
  }

  recentBookings({ limit = 50 } = {}) {
    return axiosInstance.get(`${StatsApi.path}/recent-bookings`, {
      params: { limit },
    });
  }

  revenue7Days() {
    return axiosInstance.get(`${StatsApi.path}/revenue-7days`);
  }

  roomTypeDistribution() {
    return axiosInstance.get(`${StatsApi.path}/room-type-distribution`);
  }

  topCustomers({ limit = 20 } = {}) {
    return axiosInstance.get(`${StatsApi.path}/top-customers`, {
      params: { limit },
    });
  }
}

export default StatsApi;
