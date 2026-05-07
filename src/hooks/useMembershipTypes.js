import { useMutation, useQuery } from "@tanstack/react-query";
import { membershipTypesApi } from "../api/membershipTypes";

export function useMembershipTypes({ page = 1, pageSize = 100 } = {}) {
  return useQuery({
    queryKey: ["membership-types", page, pageSize],
    queryFn: () => membershipTypesApi.list(page, pageSize),
  });
}

export default useMembershipTypes;

export function useMembershipTypeDetail(id) {
  return useQuery({
    queryKey: ["membership-types", id],
    queryFn: () => membershipTypesApi.get(id),
    enabled: !!id,
  });
}

export function useMembershipTypeUpsert() {
  return useMutation({
    mutationFn: (data) => {
      const { id, ...payload } = data;
      return id
        ? membershipTypesApi.update(id, payload)
        : membershipTypesApi.create(payload);
    },
  });
}

export function useMembershipTypeDelete() {
  return useMutation({
    mutationFn: (id) => membershipTypesApi.delete(id),
  });
}
