import { useQuery } from "@tanstack/react-query";

import { getSubscriptions, listSubscriptions } from "src/api/subscriptions";
import { checkSubscriptionIsForProductTier, findSubscriptionByPriority } from "src/utils/access/findSubscription";

function fetchSubscriptionDetails({ subscriptionId, serviceId }) {
  if (subscriptionId) {
    return getSubscriptions(subscriptionId);
  } else {
    return serviceId
      ? listSubscriptions({
          serviceId: serviceId,
        })
      : listSubscriptions();
  }
}

function useSubscriptionForProductTierAccess(serviceId, productTierId, subscriptionId) {
  const isQueryEnabled = Boolean(productTierId && serviceId);
  const query = useQuery(
    ["user-subscription", productTierId, serviceId, subscriptionId],
    () => {
      return fetchSubscriptionDetails({
        subscriptionId,
        serviceId,
      });
    },
    {
      enabled: isQueryEnabled,
      refetchOnWindowFocus: false,
      select: (response) => {
        if (subscriptionId) {
          const isSubscriptionValid = checkSubscriptionIsForProductTier(response?.data, serviceId, productTierId);
          if (isSubscriptionValid) {
            return response.data;
          } else {
            return null;
          }
        } else {
          const subscriptionsList = response?.data?.subscriptions;
          return findSubscriptionByPriority(subscriptionsList, serviceId, productTierId);
        }
      },
    }
  );

  return query;
}

export default useSubscriptionForProductTierAccess;
