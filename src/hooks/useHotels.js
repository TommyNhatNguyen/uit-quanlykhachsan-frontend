import { useMutation, useQuery } from "@tanstack/react-query";
import HotelApi from "../api/hotel";

const api = new HotelApi();

export function useHotels({ page = 1, pageSize = 10 } = {}) {
  const response = useQuery({
    queryKey: ["hotels", page, pageSize],
    queryFn: () => api.list({ page, pageSize }),
  });

  return response;
}

export default useHotels;

export function useHotelDetail(id) {
  const response = useQuery({
    queryKey: ["hotels", id],
    queryFn: () => api.get(id),
    enabled: !!id,
  });
  return response;
}

export const useHotelUpsert = () => {
  const response = useMutation({
    mutationFn: (data) => {
      console.log("🚀 ~ useHotelUpsert ~ data:", data);
      if (data.id) {
        return api.update(data.id, data);
      }
      return api.create(data);
    },
  });
  return response;
};

export const useHotelDelete = () => {
  const response = useMutation({
    mutationFn: (id) => api.delete(id),
  });
  return response;
};