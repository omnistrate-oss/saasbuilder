import { useQuery } from "@tanstack/react-query";

import { getDeploymentCellToken } from "src/api/resourceInstance";

type QueryParams = {
  instanceId: string;
  subscriptionId: string;
};

const useToken = (queryParams: QueryParams, queryOptions = {}) => {
  const { instanceId, subscriptionId } = queryParams;
  const query = useQuery({
    queryKey: ["deployment-cell-token", instanceId, subscriptionId],
    queryFn: () => {
      return getDeploymentCellToken({
        instanceId,
        subscriptionId,
      });
    },
    refetchOnWindowFocus: false,
    select: (response) => response.data,
    ...queryOptions,
  });

  return query;
};

export default useToken;
