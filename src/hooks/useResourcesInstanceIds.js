import { useQuery } from "@tanstack/react-query";
import { getResourceInstanceIds } from "../api/resourceInstance";

function useResourcesInstanceIds(
  serviceProviderId,
  serviceKey,
  serviceAPIVersion,
  serviceEnvironmentKey,
  serviceModelKey,
  productTierKey,
  resources = [],
  subscriptionId,
  enabled = true
) {
  const resourceKeys = resources.reduce((acc, curr) => {
    const { urlKey } = curr;
    acc[urlKey] = urlKey;
    return acc;
  }, {});

  const isEnabled = Boolean(
    serviceProviderId &&
      serviceKey &&
      serviceAPIVersion &&
      serviceEnvironmentKey &&
      serviceModelKey &&
      subscriptionId &&
      enabled
  );

  const queryDependencies = {
    serviceProviderId,
    serviceKey,
    serviceAPIVersion,
    serviceEnvironmentKey,
    serviceModelKey,
    productTierKey,
    subscriptionId,
    ...resourceKeys,
  };

  const query = useQuery(
    ["resources-instance-ids", { ...queryDependencies }],
    async () => {
      const resourceIdInstanceIdHashMap = {};

      await Promise.all(
        resources.map(({ urlKey, resourceId }) => {
          resourceIdInstanceIdHashMap[resourceId] = [];
          return getResourceInstanceIds(
            serviceProviderId,
            serviceKey,
            serviceAPIVersion,
            serviceEnvironmentKey,
            serviceModelKey,
            productTierKey,
            urlKey,
            subscriptionId
          ).then((response) => {
            const ids = response.data.ids;
            resourceIdInstanceIdHashMap[resourceId] = ids;
          });
        })
      );

      return resourceIdInstanceIdHashMap;
    },
    { enabled: isEnabled }
  );

  return query;
}

export default useResourcesInstanceIds;
