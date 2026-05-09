import { useMutation, useQuery } from "@tanstack/react-query";
import { serviceDetailsApi } from "../api/serviceDetails";

export function useServiceDetails({ page = 1, pageSize = 10, serviceId = null, bookingDetailId = null } = {}) {
  const filters = {};
  if (serviceId) filters.service_id = serviceId;
  if (bookingDetailId) filters.booking_detail_id = bookingDetailId;

  return useQuery({
    queryKey: ["service-details", page, pageSize, filters],
    queryFn: () =>
      serviceDetailsApi.list(page, pageSize, filters),
  });
}

export default useServiceDetails;

export function useServiceDetailItem(id) {
  return useQuery({
    queryKey: ["service-details", id],
    queryFn: () => serviceDetailsApi.get(id),
    enabled: !!id,
  });
}

export function useServiceDetailUpsert() {
  return useMutation({
    mutationFn: (data) =>
      data.id
        ? serviceDetailsApi.update(data.id, {
            booking_detail_id: data.booking_detail_id,
            service_id: data.service_id,
            quanity: data.quanity,
            price: data.price,
            total_amount: data.total_amount,
          })
        : serviceDetailsApi.create({
            booking_detail_id: data.booking_detail_id,
            service_id: data.service_id,
            quanity: data.quanity,
            price: data.price,
            total_amount: data.total_amount,
          }),
  });
}

export function useServiceDetailDelete() {
  return useMutation({
    mutationFn: (id) => serviceDetailsApi.delete(id),
  });
}
