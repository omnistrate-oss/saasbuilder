import { useQuery } from "@tanstack/react-query";

import { describeServiceOfferingResource } from "../api/serviceOffering";

function useServiceOfferingResourceSchema(serviceId, resourceId, resourceInstanceId = "none") {
  const isQueryEnabled = Boolean(serviceId && resourceId && resourceInstanceId);

  const resourceSchemeQuery = useQuery(
    ["resource-schema", serviceId, resourceId, resourceInstanceId],
    () => {
      return describeServiceOfferingResource(serviceId, resourceId, resourceInstanceId);
    },
    {
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
    }
  );

  return resourceSchemeQuery;
}

export default useServiceOfferingResourceSchema;
