import { useQuery } from "@tanstack/react-query";

import { getConsumptionUsagePerDay, GetConsumptionUsagePerDayQueryParams } from "src/api/consumption";

function useConsumptionUsagePerDay(queryParams: GetConsumptionUsagePerDayQueryParams = {}) {
  const { subscriptionID, startDate, endDate } = queryParams;

  const query = useQuery({
    queryKey: ["consumption-usage-per-day", subscriptionID, startDate, endDate],
    queryFn: async () => {
      const response = await getConsumptionUsagePerDay(queryParams);
      return response.data;
    },
  });

  return query;
}

export default useConsumptionUsagePerDay;
