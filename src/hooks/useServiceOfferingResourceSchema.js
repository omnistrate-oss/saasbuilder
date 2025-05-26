import { useQuery } from "@tanstack/react-query";

import { describeServiceOfferingResource } from "../api/serviceOffering";

function useServiceOfferingResourceSchema(serviceId, resourceId, resourceInstanceId = "none") {
  const isQueryEnabled = Boolean(serviceId && resourceId && resourceInstanceId);

  const resourceSchemeQuery = useQuery({
    queryKey: ["resource-schema", serviceId, resourceId, resourceInstanceId],
    queryFn: () => {
      return describeServiceOfferingResource(serviceId, resourceId, resourceInstanceId);
    },
    enabled: isQueryEnabled,
    refetchOnWindowFocus: false,
    select: (response) => {
      const responseData = response.data;
      const schemas = {};
      responseData.apis.forEach((schema) => {
        schemas[schema.verb] = schema;
      });
      return schemas;
    },
  });

  return resourceSchemeQuery;
}

export default useServiceOfferingResourceSchema;
