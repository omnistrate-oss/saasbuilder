import { $api } from "src/api/query";
import { components } from "src/types/schema";

type QueryParams = {
  serviceId: string;
  resourceId: string;
  instanceId?: string;
};

const useServiceOfferingResourceSchema = (queryParams: QueryParams) => {
  const { serviceId, resourceId, instanceId } = queryParams;

  const query = $api.useQuery(
    "get",
    "/2022-09-01-00/service-offering/{serviceId}/resource/{resourceId}/instance/{instanceId}",
    {
      params: {
        path: {
          serviceId,
          resourceId,
          instanceId: instanceId || "none",
        },
      },
    },
    {
      select: (data) => {
        // @ts-ignore
        const schemas: Record<
          "CREATE" | "DESCRIBE" | "LIST" | "UPDATE" | "DELETE",
          {
            inputParameters: components["schemas"]["InputParameterEntity"][];
            outputParameters: components["schemas"]["OutputParameterEntity"][];
            verb: string;
          }
        > = {};

        data.apis?.forEach((schema) => {
          schemas[schema.verb] = schema;
        });

        return schemas;
      },
      enabled: Boolean(serviceId && resourceId),
    }
  );

  return query;
};

export default useServiceOfferingResourceSchema;
