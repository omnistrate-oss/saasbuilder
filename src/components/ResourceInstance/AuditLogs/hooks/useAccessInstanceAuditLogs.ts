import { QueryOptions, useQuery, UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { getResourceInstanceEvents } from "src/api/event";
import { AccessEvent } from "src/types/event";

type QueryParams = {
  instanceId?: string;
  subscriptionId?: string;
};

function useAccessInstanceAuditLogs(queryParams: QueryParams = {}, queryOptions: QueryOptions = {}) {
  const { instanceId, subscriptionId } = queryParams;
  const enabled = Boolean(instanceId && subscriptionId);

  const query: UseQueryResult<AccessEvent[]> = useQuery({
    queryKey: ["instanceLogsAccess", instanceId, subscriptionId],
    queryFn: () => getResourceInstanceEvents(instanceId, subscriptionId),
    enabled: enabled,
    refetchOnWindowFocus: false,
    select: (response: AxiosResponse) => {
      return response.data.events || [];
    },
    ...queryOptions,
  });

  return query;
}

export default useAccessInstanceAuditLogs;
