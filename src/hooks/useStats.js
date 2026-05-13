import { useQuery } from "@tanstack/react-query";
import StatsApi from "../api/stats";

const api = new StatsApi();

export function useStatsKpiToday() {
  return useQuery({
    queryKey: ["stats", "kpi-today"],
    queryFn: () => api.kpiToday(),
  });
}

export function useStatsRecentBookings({ limit = 50 } = {}) {
  return useQuery({
    queryKey: ["stats", "recent-bookings", limit],
    queryFn: () => api.recentBookings({ limit }),
  });
}

export function useStatsRevenue7Days() {
  return useQuery({
    queryKey: ["stats", "revenue-7days"],
    queryFn: () => api.revenue7Days(),
  });
}

export function useStatsRoomTypeDistribution() {
  return useQuery({
    queryKey: ["stats", "room-type-distribution"],
    queryFn: () => api.roomTypeDistribution(),
  });
}

export function useStatsTopCustomers({ limit = 20 } = {}) {
  return useQuery({
    queryKey: ["stats", "top-customers", limit],
    queryFn: () => api.topCustomers({ limit }),
  });
}
