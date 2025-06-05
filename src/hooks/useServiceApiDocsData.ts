import { useQuery } from "@tanstack/react-query";

import { getServiceApiDocs } from "../api/service-api";

function useServiceApiDocsData(serviceId, serviceApiId) {
  const query = useQuery({
    queryKey: ["service-api-docs", serviceId, serviceApiId],
    queryFn: () => {
      return getServiceApiDocs(serviceId, serviceApiId);
    },
    enabled: Boolean(serviceId && serviceApiId),
    select: (response) => {
      return response.data;
    },
  });

  return query;
}

export default useServiceApiDocsData;
