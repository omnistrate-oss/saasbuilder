import { $api } from "src/api/query";

type QueryParams = {
  instanceId: string;
  subscriptionId?: string;
};

const useAccessInstanceAuditLogs = (queryParams: QueryParams, queryOptions = {}) => {
  const { instanceId, subscriptionId } = queryParams;
  const enabled = Boolean(instanceId && subscriptionId);

  const query = $api.useQuery(
    "get",
    "/2022-09-01-00/resource-instance/{instanceId}/audit-events",
    {
      params: {
        path: {
          instanceId,
        },
        query: {
          subscriptionId,
        },
      },
    },
    {
      select: (data) => {
        return data.events || [];
      },
      enabled,
      ...queryOptions,
    }
  );

  return query;
};

export default useAccessInstanceAuditLogs;
