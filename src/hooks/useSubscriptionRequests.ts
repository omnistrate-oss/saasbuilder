import { useQuery } from "@tanstack/react-query";

import { listSubscriptionRequests } from "src/api/subscriptionRequests";
import useEnvironmentType from "src/hooks/useEnvironmentType";

const useSubscriptionRequests = (queryOptions = {}) => {
  const environmentType = useEnvironmentType();
  const query = useQuery({
    queryKey: ["subscription-requests"],
    queryFn: () =>
      listSubscriptionRequests({
        environmentType,
      }),
    select: (response) => {
      return response.data.subscriptionRequests;
    },
    ...queryOptions,
  });

  return query;
};

export default useSubscriptionRequests;
