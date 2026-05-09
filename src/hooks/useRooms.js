import { useMutation, useQuery } from "@tanstack/react-query";
import { roomsApi } from "../api/rooms";

export function useRooms({
  page = 1,
  pageSize = 10,
  roomTypeId,
  priceFrom,
  priceTo,
} = {}) {
  const filters = {};
  if (roomTypeId) filters.room_type_id = roomTypeId;
  if (priceFrom != null) filters.price_from = priceFrom;
  if (priceTo != null) filters.price_to = priceTo;

  return useQuery({
    queryKey: ["rooms", page, pageSize, filters],
    queryFn: () => roomsApi.list(page, pageSize, filters),
  });
}

export default useRooms;

export function useRoomDetail(id) {
  return useQuery({
    queryKey: ["rooms", id],
    queryFn: () => roomsApi.get(id),
    enabled: !!id,
  });
}

export function useRoomUpsert() {
  return useMutation({
    mutationFn: (data) => {
      const { id, ...payload } = data;
      return id ? roomsApi.update(id, payload) : roomsApi.create(payload);
    },
  });
}

export function useRoomDelete() {
  return useMutation({
    mutationFn: (id) => roomsApi.delete(id),
  });
}

export function useRoomUpdatePrice() {
  return useMutation({
    mutationFn: (data) => {
      return roomsApi.updatePrice(data);
    },
  });
}
