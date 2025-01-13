import { CloudProvider } from "src/types/common/enums";

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

  return menuItems.sort((a, b) => a.label.localeCompare(b.label));
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

  return menuItems.sort((a, b) => a.label.localeCompare(b.label));
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
    if (subscription.productTierId === servicePlanId) {
      menuItems.push({
        value: subscription.id,
        label: subscription.id,
      });
    }
  });

  return menuItems.sort((a, b) => a.label.localeCompare(b.label));
};

export const getResourceMenuItems = (offering: any) => {
  const menuItems: any[] = [];

  if (!offering?.resourceParameters?.length) {
    return menuItems;
  }

  offering.resourceParameters.forEach((resource) => {
    if (resource.resourceId?.startsWith("r-injectedaccountconfig")) {
      return;
    }

    menuItems.push({
      label: resource.name,
      value: resource.resourceId,
    });
  });

  return menuItems.sort((a, b) => a.label.localeCompare(b.label));
};

export const getRegionMenuItems = (
  offering: any,
  cloudProvider: CloudProvider
) => {
  const menuItems: any[] = [];

  if (!offering || !cloudProvider) {
    return menuItems;
  }

  if (cloudProvider === "aws") {
    offering.awsRegions.forEach((region: string) => {
      menuItems.push({
        label: region,
        value: region,
      });
    });
  } else if (cloudProvider === "gcp") {
    offering.gcpRegions.forEach((region: string) => {
      menuItems.push({
        label: region,
        value: region,
      });
    });
  } else if (cloudProvider === "azure") {
    offering.azureRegions.forEach((region: string) => {
      menuItems.push({
        label: region,
        value: region,
      });
    });
  }

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

  if (mainResource) {
    mainResource.id = mainResourceId;
  }

  return mainResource;
};
