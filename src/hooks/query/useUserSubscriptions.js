import { useQuery } from "@tanstack/react-query";

import { getServiceOffering, getServiceOfferingIds } from "src/api/serviceOffering";
import { listSubscriptions } from "src/api/subscriptions";

import useEnvironmentType from "../useEnvironmentType";

const useUserSubscriptions = (queryParams = {}, queryOptions = {}) => {
  const { serviceId } = queryParams;
  const environmentType = useEnvironmentType();
  const subscriptionData = useQuery({
    queryKey: ["user-subscriptions", serviceId, environmentType],
    queryFn: async () => {
      const response = await listSubscriptions({ serviceId, environmentType });
      const subscriptions = response.data.subscriptions || [];
      if (serviceId) {
        const serviceOfferingRes = await getServiceOffering(serviceId, environmentType);

        const existingProductTierIds = serviceOfferingRes?.data?.offerings?.map((offering) => offering?.productTierID);
        return subscriptions?.filter((subscription) => existingProductTierIds?.includes(subscription?.productTierId));
      } else {
        const servicesRes = await getServiceOfferingIds();
        const services = servicesRes?.data?.services;
        return subscriptions?.filter((subscription) =>
          services?.find(
            (service) =>
              service?.serviceId === subscription?.serviceId &&
              service?.offerings?.find((offering) => offering?.productTierID === subscription.productTierId)
          )
        );
      }
    },
    select: (response) => response,
    ...queryOptions,
  });

  return subscriptionData;
};

export default useUserSubscriptions;
