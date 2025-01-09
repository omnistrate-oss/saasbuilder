export const getServiceMenuItems = (serviceOfferings: any[]) => {
  const menuItems: any[] = [];
  if (!serviceOfferings?.length) {
    return menuItems;
  }

  const serviceIdsSet = new Set();
  serviceOfferings.forEach((offering) => {
    if (!serviceIdsSet.has(offering.serviceId)) {
      serviceIdsSet.add(offering.serviceId);
      menuItems.push({
        value: offering.serviceId,
        label: offering.serviceName,
      });
    }
  });

  return menuItems;
};

export const getServicePlanMenuItems = (
  serviceOfferings: any[],
  serviceId: string
) => {
  const menuItems: any[] = [];
  if (!serviceOfferings?.length) {
    return menuItems;
  }

  serviceOfferings.forEach((offering) => {
    if (offering.serviceId === serviceId) {
      menuItems.push({
        value: offering.productTierID,
        label: offering.productTierName,
      });
    }
  });

  return menuItems;
};

export const getSubscriptionMenuItems = (
  subscriptions: any[],
  servicePlanId: string
) => {
  const menuItems: any[] = [];
  if (!subscriptions?.length) {
    return menuItems;
  }

  subscriptions.forEach((subscription) => {
    if (subscription.servicePlanId === servicePlanId) {
      menuItems.push({
        value: subscription.id,
        label: subscription.name,
      });
    }
  });

  return menuItems;
};

export const getMainResourceFromInstance = (instance: any) => {
  if (!instance) {
    return null;
  }

  const { detailedNetworkTopology = {} } = instance;
  const [mainResourceId, mainResource]: any =
    Object.entries(detailedNetworkTopology).find(
      ([, resource]: any) => resource.main
    ) || [];

  mainResource.id = mainResourceId;
  return mainResource;
};
