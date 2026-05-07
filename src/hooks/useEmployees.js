import { useMutation, useQuery } from "@tanstack/react-query";
import { employeesApi } from "../api/employees";

export function useEmployees({ page = 1, pageSize = 10 } = {}) {
  return useQuery({
    queryKey: ["employees", page, pageSize],
    queryFn: () => employeesApi.list(page, pageSize),
  });
}

export default useEmployees;

export function useEmployeeDetail(id) {
  return useQuery({
    queryKey: ["employees", id],
    queryFn: () => employeesApi.get(id),
    enabled: !!id,
  });
}

export function useEmployeeUpsert() {
  return useMutation({
    mutationFn: (data) => {
      const { id, ...payload } = data;
      return id
        ? employeesApi.update(id, payload)
        : employeesApi.create(payload);
    },
  });
}

export function useEmployeeDelete() {
  return useMutation({
    mutationFn: (id) => employeesApi.delete(id),
  });
}
