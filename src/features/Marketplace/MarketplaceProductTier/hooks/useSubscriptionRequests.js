import { useQuery } from "@tanstack/react-query";
import useEnvironmentType from "src/hooks/useEnvironmentType";
import { listSubscriptionRequests } from "src/api/subscriptionRequests";

function useSubscriptionRequests(queryOptions = {}) {
  const environmentType = useEnvironmentType();
  const query = useQuery(
    ["subscription-requests"],
    () =>
      listSubscriptionRequests({
        environmentType,
      }),
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
