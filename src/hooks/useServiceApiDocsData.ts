import { useQuery } from "@tanstack/react-query";

import { getServiceApiDocs } from "../api/service-api";

function useServiceApiDocsData(serviceId, serviceApiId) {
  const query = useQuery(
    ["service-api-docs", serviceId, serviceApiId],
    () => {
      return getServiceApiDocs(serviceId, serviceApiId);
    },
    {
      enabled: Boolean(serviceId && serviceApiId),
      refetchOnWindowFocus: false,
      select: (response) => {
        return response.data;
      },
    }
  );

  return query;
}

export default useServiceApiDocsData;
