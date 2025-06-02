import { $api } from "src/api/query";

type QueryParams = {
  instanceId: string;
  subscriptionId: string;
};

const useToken = ({ instanceId, subscriptionId }: QueryParams, queryOptions = {}) => {
  const query = $api.useQuery(
    "post",
    "/2022-09-01-00/resource-instance/{id}/deployment-cell-dashboard/token",
    {
      params: {
        path: {
          id: instanceId,
        },
        query: {
          subscriptionId,
        },
      },
    },
    {
      ...queryOptions,
    }
  );

  return query;
};

export default useToken;
