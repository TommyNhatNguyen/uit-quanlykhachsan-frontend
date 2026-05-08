import { useMutation, useQuery } from "@tanstack/react-query";
import { paymentsApi } from "../api/payments";

export function usePayments({ page = 1, pageSize = 10, bookingDetailId, cashierId } = {}) {
  const filters = {};
  if (bookingDetailId) filters.booking_detail_id = bookingDetailId;
  if (cashierId) filters.cashier_id = cashierId;

  return useQuery({
    queryKey: ["payments", page, pageSize, filters],
    queryFn: () => paymentsApi.list(page, pageSize, filters),
  });
}

export default usePayments;

export function usePaymentDetail(id) {
  return useQuery({
    queryKey: ["payments", id],
    queryFn: () => paymentsApi.get(id),
    enabled: !!id,
  });
}

export function usePaymentUpsert() {
  return useMutation({
    mutationFn: (data) => {
      const { id, ...payload } = data;
      return id ? paymentsApi.update(id, payload) : paymentsApi.create(payload);
    },
  });
}

export function usePaymentDelete() {
  return useMutation({
    mutationFn: (id) => paymentsApi.delete(id),
  });
}
