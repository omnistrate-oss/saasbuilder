import { useQuery } from "@tanstack/react-query";
import { describeServiceOfferingResource } from "src/api/serviceOffering";

type QueryParams = {
  serviceId?: string;
  resourceId?: string;
  instanceId?: string;
};

const useResourceSchema = (queryParams: QueryParams = {}) => {
  const { serviceId, resourceId, instanceId = "none" } = queryParams;
  const isEnabled = Boolean(serviceId && resourceId);

  const query = useQuery(
    ["resource-schema", serviceId, resourceId, instanceId],
    () => describeServiceOfferingResource(serviceId!, resourceId!, instanceId),
    {
      enabled: isEnabled,
      select: (response) => {
        // Get the CREATE API
        return response.data?.apis?.find((api) => api.verb === "CREATE") || {};
      },
    }
  );

  return query;
};

export default useResourceSchema;
