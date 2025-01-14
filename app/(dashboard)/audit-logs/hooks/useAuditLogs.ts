import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllAuditEvents } from "src/api/event";
import useEnvironmentType from "src/hooks/useEnvironmentType";

type QueryParams = {
  startDate?: string;
  endDate?: string;
  eventSourceTypes?: string;
};

const useAuditLogs = (queryParams: QueryParams = {}, queryOptions = {}) => {
  const environmentType = useEnvironmentType();
  const { startDate, endDate, eventSourceTypes } = queryParams;

  const query = useInfiniteQuery(
    ["audit-logs", startDate, endDate, eventSourceTypes, environmentType],
    async ({ pageParam }) => {
      const params: any = {};

      if (pageParam) {
        params.nextPageToken = pageParam;
      }
      if (startDate) {
        params.startDate = startDate;
      }
      if (endDate) {
        params.endDate = endDate;
      }
      if (eventSourceTypes) {
        params.eventSourceTypes = eventSourceTypes;
      }
      if (environmentType) {
        params.environmentType = environmentType;
      }

      const res = await getAllAuditEvents({
        pageSize: 10,
        ...params,
      });

      return res.data;
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage) => lastPage.nextPageToken,
      ...queryOptions,
    }
  );

  const refetchAndReset = async () => {
    query.remove();
    return query.refetch();
  };

  return {
    ...query,
    refetch: refetchAndReset,
  };
};

export default useAuditLogs;
