import { useMutation, useQuery } from "@tanstack/react-query";
import { roomTypesApi } from "../api/roomTypes";

export function useRoomTypes({ page = 1, pageSize = 10 } = {}) {
  return useQuery({
    queryKey: ["room-types", page, pageSize],
    queryFn: () => roomTypesApi.list(page, pageSize),
  });
}

export default useRoomTypes;

export function useRoomTypeDetail(id) {
  return useQuery({
    queryKey: ["room-types", id],
    queryFn: () => roomTypesApi.get(id),
    enabled: !!id,
  });
}

export function useRoomTypeUpsert() {
  return useMutation({
    mutationFn: (data) =>
      data.id
        ? roomTypesApi.update(data.id, { name: data.name })
        : roomTypesApi.create({ name: data.name }),
  });
}

export function useRoomTypeDelete() {
  return useMutation({
    mutationFn: (id) => roomTypesApi.delete(id),
  });
}
