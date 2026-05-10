import { useMutation, useQuery } from "@tanstack/react-query";
import { serviceItemsApi } from "../api/serviceItems";

export function useServiceItems({ page = 1, pageSize = 10 } = {}) {
  return useQuery({
    queryKey: ["service-items", page, pageSize],
    queryFn: () => serviceItemsApi.list(page, pageSize),
  });
}

export default useServiceItems;

export function useServiceItemDetail(id) {
  return useQuery({
    queryKey: ["service-items", id],
    queryFn: () => serviceItemsApi.get(id),
    enabled: !!id,
  });
}

export function useServiceItemUpsert() {
  return useMutation({
    mutationFn: (data) =>
      data.id
        ? serviceItemsApi.update(data.id, {
            name: data.name,
            catalog: data.catalog ?? null,
            current_price: data.current_price,
          })
        : serviceItemsApi.create({
            name: data.name,
            catalog: data.catalog ?? null,
            current_price: data.current_price ?? 0,
          }),
  });
}

export function useServiceItemDelete() {
  return useMutation({
    mutationFn: (id) => serviceItemsApi.delete(id),
  });
}

export function useServiceItemHistoryPrices(id) {
  return useQuery({
    queryKey: ["service-items", "history-prices", id],
    queryFn: () => serviceItemsApi.getHistoryPrices(id),
    enabled: !!id,
  });
}
