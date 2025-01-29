import { Subscription } from "src/types/subscription";
import { CloudProvider } from "src/types/common/enums";
import { CustomNetwork } from "src/types/customNetwork";
import { MenuItem } from "src/types/common/generalTypes";
import { ServiceOffering } from "src/types/serviceOffering";
import {
  ResourceInstance,
  InstanceComputedHealthStatus,
} from "src/types/resourceInstance";
import { SxProps } from "@mui/material";
import { instaceHealthStatusMap } from "src/constants/statusChipStyles/resourceInstanceHealthStatus";

export const getServiceMenuItems = (serviceOfferings: ServiceOffering[]) => {
  const menuItems: MenuItem[] = [];
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
  serviceOfferings: ServiceOffering[],
  serviceId: string
) => {
  const menuItems: MenuItem[] = [];
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

export const getResourceMenuItems = (offering: ServiceOffering) => {
  const menuItems: MenuItem[] = [];

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
  offering: ServiceOffering,
  cloudProvider: CloudProvider
) => {
  const menuItems: MenuItem[] = [];

  if (!offering || !cloudProvider) {
    return menuItems;
  }

  if (cloudProvider === "aws") {
    offering.awsRegions?.forEach((region: string) => {
      menuItems.push({
        label: region,
        value: region,
      });
    });
  } else if (cloudProvider === "gcp") {
    offering.gcpRegions?.forEach((region: string) => {
      menuItems.push({
        label: region,
        value: region,
      });
    });
  } else if (cloudProvider === "azure") {
    // @ts-ignore
    offering.azureRegions?.forEach((region: string) => {
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

export const getMainResourceFromInstance = (
  instance?: ResourceInstance,
  offering?: ServiceOffering
) => {
  if (!instance || !offering) {
    return null;
  }

  const mainResource = offering.resourceParameters.find(
    (resource) => resource.resourceId === instance.resourceID
  );

  return mainResource;
};

export const getInitialValues = (
  instance: ResourceInstance | undefined,
  subscriptions: Subscription[],
  serviceOfferingsObj: Record<string, Record<string, ServiceOffering>>
) => {
  if (instance) {
    const subscription = subscriptions.find(
      (sub) => sub.id === instance?.subscriptionId
    );

    const requestParams: any = { ...(instance.result_params as object) };
    if (instance.network_type) {
      requestParams.network_type = instance.network_type;
    }

    if (instance.customNetworkDetail) {
      requestParams.custom_network_id = instance.customNetworkDetail.id;
    }

    return {
      serviceId: subscription?.serviceId || "",
      servicePlanId: subscription?.productTierId || "",
      subscriptionId: instance.subscriptionId || "",
      // @ts-ignore
      resourceId: getMainResourceFromInstance(instance)?.id || "",
      cloudProvider: instance.cloud_provider,
      region: instance.region,
      network_type: instance.network_type || "",
      requestParams,
    };
  }

  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      serviceOfferingsObj[sub.serviceId]?.[sub.productTierId] &&
      ["root", "editor"].includes(sub.roleType)
  );

  const rootSubscription = filteredSubscriptions.find(
    (sub) => sub.roleType === "root"
  );

  const serviceId =
    rootSubscription?.serviceId || filteredSubscriptions[0]?.serviceId || "";
  const servicePlanId =
    rootSubscription?.productTierId ||
    filteredSubscriptions[0]?.productTierId ||
    "";

  const offering = serviceOfferingsObj[serviceId]?.[servicePlanId];
  const cloudProvider = offering?.cloudProviders?.[0] || "";

  let region;
  if (cloudProvider === "aws") {
    region = offering.awsRegions?.[0];
  } else if (cloudProvider === "gcp") {
    region = offering.gcpRegions?.[0];
  } else if (cloudProvider === "azure") {
    // @ts-ignore
    region = offering.azureRegions?.[0];
  }

  const resources = getResourceMenuItems(offering);

  return {
    serviceId,
    servicePlanId,
    subscriptionId: rootSubscription?.id || filteredSubscriptions[0]?.id || "",
    resourceId: resources[0]?.value || "",
    cloudProvider,
    region: region || "",
    network_type: "",
    requestParams: {},
  };
};

export const getRowBorderStyles = () => {
  const styles: Record<string, SxProps> = {};

  for (const status in instaceHealthStatusMap) {
    const colorMap: Record<InstanceComputedHealthStatus, string> = {
      DEGRADED: "#F79009",
      HEALTHY: "#17B26A",
      UNHEALTHY: "#F04438",
      UNKNOWN: "#363F72",
      NA: "#676b83",
    };

    const color = colorMap[status as InstanceComputedHealthStatus];

    styles[`& .${status} td:first-child`] = {
      position: "relative",
    };

    styles[`& .${status} td:first-child::before`] = {
      content: '""',
      height: "38px",
      width: "4px",
      background: color,
      transform: "translateY(1px)",
      position: "absolute",
      borderTopRightRadius: "3px",
      borderBottomRightRadius: "3px",
      left: 0,
    };
  }
  return styles;
};
