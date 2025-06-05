import { GetConsumptionUsagePerDayQueryParams } from "src/api/consumption";
import { $api } from "src/api/query";

function useConsumptionUsagePerDay(queryParams: GetConsumptionUsagePerDayQueryParams = {}) {
  const query = $api.useQuery("get", "/2022-09-01-00/resource-instance/usage-per-day", {
    params: {
      query: queryParams,
    },
  });

  return query;
}

export default useConsumptionUsagePerDay;
