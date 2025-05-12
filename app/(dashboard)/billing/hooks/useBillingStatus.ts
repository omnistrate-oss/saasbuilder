import { useQuery } from "@tanstack/react-query";

import { getConsumptionBillingStatus } from "src/api/consumption";

function useBillingStatus() {
  const query = useQuery({
    queryKey: ["consumption-billing-status"],
    queryFn: async () => {
      const response = await getConsumptionBillingStatus();

      return response.data;
    },
  });

  return query;
}

export default useBillingStatus;
