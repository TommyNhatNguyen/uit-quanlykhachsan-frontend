import { useQuery } from "@tanstack/react-query";
import { roomLogPricesApi } from "../api/roomLogPrices";

export function useRoomPriceLogs({ page = 1, pageSize = 10, roomId } = {}) {
  const filters = {};
  if (roomId) filters.room_id = roomId;

  return useQuery({
    queryKey: ["room-price-logs", page, pageSize, filters],
    queryFn: () => roomLogPricesApi.list(page, pageSize, filters),
  });
}

export default useRoomPriceLogs;
