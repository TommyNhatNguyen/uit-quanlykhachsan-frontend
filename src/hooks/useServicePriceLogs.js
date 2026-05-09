import { useQuery } from "@tanstack/react-query";
import { servicePriceLogsApi } from "../api/servicePriceLogs";

export function useServicePriceLogs({ page = 1, pageSize = 10, serviceId = null } = {}) {
  const filters = {};
  if (serviceId) filters.service_id = serviceId;

  return useQuery({
    queryKey: ["service-price-logs", page, pageSize, filters],
    queryFn: () => servicePriceLogsApi.list(page, pageSize, filters),
  });
}

export default useServicePriceLogs;
