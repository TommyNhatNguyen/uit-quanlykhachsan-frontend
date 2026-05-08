import { useQuery } from "@tanstack/react-query";
import { bookingDetailsApi } from "../api/bookingDetails";

export function useBookingDetails({ page = 1, pageSize = 10 } = {}) {
  return useQuery({
    queryKey: ["booking-details", page, pageSize],
    queryFn: () => bookingDetailsApi.list(page, pageSize),
  });
}

export default useBookingDetails;
