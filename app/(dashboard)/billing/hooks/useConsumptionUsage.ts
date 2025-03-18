import { useQuery } from "@tanstack/react-query";
import {
  getConsumptionUsage,
  GetConsumptionUsageQueryParams,
} from "src/api/consumption";

function useConsumptionUsage(queryParams: GetConsumptionUsageQueryParams = {}) {
  const { subscriptionID } = queryParams;

  const query = useQuery({
    queryKey: ["consumption-usage", subscriptionID],
    queryFn: async () => {
      const response = await getConsumptionUsage();

      return response.data;
    },
  });

  return query;
}

export default useConsumptionUsage;
