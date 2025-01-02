import { useQuery } from "@tanstack/react-query";
import { listServiceOfferings } from "src/api/serviceOffering";
import useEnvironmentType from "src/hooks/useEnvironmentType";

function useOrgServiceOfferings(queryOptions = {}) {
  const environmentType = useEnvironmentType();
  const query = useQuery(
    ["org-service-offerings"],
    () => listServiceOfferings({ environmentType: environmentType }),
    {
      select: (data) => {
        const services = data.data?.services || [];
        const serviceOfferings = [];

        services.forEach((service) => {
          service?.offerings.forEach((offering) => {
            const offeringData = {
              ...service,
              ...offering,
            };
            delete offeringData.offerings;

            serviceOfferings.push(offeringData);
          });
        });

        serviceOfferings.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        return serviceOfferings;
      },
      ...queryOptions,
    }
  );

  return query;
}

export default useOrgServiceOfferings;
