import { useMutation, useQuery } from "@tanstack/react-query";
import { customersApi } from "../api/customers";

export function useCustomers({ page = 1, pageSize = 10, membershipTypeId } = {}) {
  const filters = {};
  if (membershipTypeId) filters.membership_type_id = membershipTypeId;

  return useQuery({
    queryKey: ["customers", page, pageSize, filters],
    queryFn: () => customersApi.list(page, pageSize, filters),
  });
}

export default useCustomers;

export function useCustomerDetail(id) {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: () => customersApi.get(id),
    enabled: !!id,
  });
}

export function useCustomerUpsert() {
  return useMutation({
    mutationFn: (data) => {
      const { id, ...payload } = data;
      return id
        ? customersApi.update(id, payload)
        : customersApi.create(payload);
    },
  });
}

export function useCustomerDelete() {
  return useMutation({
    mutationFn: (id) => customersApi.delete(id),
  });
}
