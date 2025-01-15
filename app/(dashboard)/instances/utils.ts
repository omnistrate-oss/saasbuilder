import { CloudProvider } from "src/types/common/enums";
import { CustomNetwork } from "src/types/customNetwork";
import { ResourceInstance } from "src/types/resourceInstance";

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
        disabled: !["editor", "root"].includes(subscription.roleType),
        disabledMessage: "Cannot create instances under this subscription",
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

export const getCustomNetworksMenuItems = (
  customNetworks: CustomNetwork[],
  cloudProvider: CloudProvider,
  cloudProviderRegions: string[],
  region: string
) => {
  let options = customNetworks;
  if (cloudProvider) {
    options = customNetworks.filter((customNetwork) => {
      return customNetwork.cloudProviderName === cloudProvider;
    });

    options = customNetworks.filter((customNetwork) => {
      return cloudProviderRegions.includes(customNetwork.cloudProviderRegion);
    });
  }

  if (region) {
    options = customNetworks.filter((customNetwork) => {
      return customNetwork.cloudProviderRegion === region;
    });
  }

  return options.map((customNetwork) => ({
    label: customNetwork.name,
    value: customNetwork.id,
  }));
};

export const getMainResourceFromInstance = (instance?: ResourceInstance) => {
  if (!instance) {
    return null;
  }

  const { detailedNetworkTopology = {} } = instance;
  const [mainResourceId, mainResource] =
    Object.entries(detailedNetworkTopology).find(
      ([, resource]: any) => resource.main
    ) || [];

  if (mainResource) {
    // @ts-ignore
    mainResource.id = mainResourceId;
  }

  return mainResource;
};
