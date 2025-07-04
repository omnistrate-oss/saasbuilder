import { useQueries, UseQueryOptions } from "@tanstack/react-query";

import { apiClient } from "src/api/client";
import { $api } from "src/api/query";

// Infer the AccountConfig type from the underlying fetch client
type AccountConfigResponse = Awaited<
  ReturnType<
    typeof apiClient.GET<
      "/2022-09-01-00/accountconfig/{id}",
      {
        params: {
          path: {
            id: string;
          };
        };
      }
    >
  >
>;
type AccountConfigData = NonNullable<AccountConfigResponse["data"]>;

// Define the return type using the inferred AccountConfig type

type QueryOptions = Omit<
  UseQueryOptions<AccountConfigData, unknown, AccountConfigData, string[]>,
  "queryKey" | "queryFn"
>;

const useAccountConfigsByIds = (accountConfigIds: string[], queryOptions: QueryOptions = {}) => {
  // Default to 60 seconds (60000ms) if refetchInterval is not specified and queries are enabled
  const refetchInterval = queryOptions.refetchInterval ?? 60000;

  const queries = useQueries({
    queries: accountConfigIds.map((id) =>
      $api.queryOptions("get", "/2022-09-01-00/accountconfig/{id}", {
        params: {
          path: {
            id,
          },
        },
        headers: {
          "x-ignore-global-error": true,
        },
        refetchOnMount: queryOptions.refetchOnMount ?? true,
        refetchOnWindowFocus: queryOptions.refetchOnWindowFocus ?? false,
        refetchInterval,
        retry: false, // Disable automatic retries on failure
        retryOnMount: false, // Don't retry when component mounts
        ...queryOptions,
      })
    ),
    combine: (results) => {
      // Create a record with account config IDs as keys and their data as values
      const accountConfigsData: Record<string, AccountConfigData> = {};

      results.forEach((result, index) => {
        const accountConfigId = accountConfigIds[index];
        if (result.data) {
          accountConfigsData[accountConfigId] = result.data;
        }
      });

      return {
        data: accountConfigsData,
        isPending: results.some((result) => result.isPending),
        isFetching: results.some((result) => result.isFetching),
        isError: results.some((result) => result.isError),
        errors: results.filter((result) => result.isError).map((result) => result.error),
        refetch: () => {
          results.forEach((result) => result.refetch?.());
        },
        refetchById: (id: string) => {
          const queryIndex = accountConfigIds.findIndex((accountId) => accountId === id);
          if (queryIndex !== -1 && results[queryIndex]) {
            results[queryIndex].refetch?.();
          }
        },
      };
    },
  });

  return queries;
};

export default useAccountConfigsByIds;
