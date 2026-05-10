import { useMutation, useQuery } from "@tanstack/react-query";
import { bookingsApi } from "../api/bookings";

export function useBookings({ page = 1, pageSize = 10, isFullyPaid } = {}) {
  const filters = {};
  if (isFullyPaid != null) filters.is_fully_paid = isFullyPaid;

  return useQuery({
    queryKey: ["bookings", page, pageSize, filters],
    queryFn: () => bookingsApi.list(page, pageSize, filters),
  });
}

export default useBookings;

export function useBookingDetail(id) {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: () => bookingsApi.get(id),
    enabled: !!id,
  });
}

export function useBookingUpsert() {
  return useMutation({
    mutationFn: (data) => {
      const { id, ...payload } = data;
      return id ? bookingsApi.update(id, payload) : bookingsApi.create(payload);
    },
  });
}

export function useBookingDelete() {
  return useMutation({
    mutationFn: (id) => bookingsApi.delete(id),
  });
}
