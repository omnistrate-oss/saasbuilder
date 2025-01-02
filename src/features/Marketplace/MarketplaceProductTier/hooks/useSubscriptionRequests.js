import { useQuery } from "@tanstack/react-query";
import { listSubscriptionRequests } from "src/api/subscriptionRequests";

function useSubscriptionRequests(queryParams = {}, queryOptions = {}) {
  const query = useQuery(
    ["subscription-requests"],
    () => listSubscriptionRequests(queryParams),
    {
      select: (response) => {
        return response.data.subscriptionRequests;
      },
      ...queryOptions,
    }
  );

  return query;
}

export default useSubscriptionRequests;
