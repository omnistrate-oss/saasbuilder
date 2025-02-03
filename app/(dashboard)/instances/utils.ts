import { Subscription } from "src/types/subscription";
import { CloudProvider } from "src/types/common/enums";
import { CustomNetwork } from "src/types/customNetwork";
import { MenuItem } from "src/types/common/generalTypes";
import { ServiceOffering } from "src/types/serviceOffering";
import { resourceInstanceStatusMap } from "src/constants/statusChipStyles/resourceInstanceStatus";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  DateRange,
  initialRangeState,
} from "src/components/DateRangePicker/DateTimeRangePickerStatic";
dayjs.extend(utc);
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
      id: instance.id,
      serviceId: subscription?.serviceId || "",
      servicePlanId: subscription?.productTierId || "",
      subscriptionId: instance.subscriptionId || "",
      // @ts-ignore
      resourceId: instance.resourceID || "",
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
    resourceId: (resources[0]?.value as string) || "",
    cloudProvider,
    region: region || "",
    requestParams: {},
  };
};

export const getResourceNameFromInstance = (instance: ResourceInstance) => {
  const { detailedNetworkTopology = {} } = instance ?? {};
  const [, mainResource] =
    Object.entries(detailedNetworkTopology).find(
      ([, resource]: any) => resource.main
    ) || [];

  return (mainResource as any)?.resourceName;
};

export type FilterCategorySchema = {
  label: string;
  name: string;
  type: "list" | "date-range";
  options?: { value: string; label: string; logoURL?: string }[];
  range?: DateRange;
  renderOption?: (...args: any) => React.ReactNode;
};

export const getIntialFiltersObject: () => Record<
  string,
  FilterCategorySchema
> = () => {
  return {
    services: {
      label: "Service Name",
      name: "services",
      options: [],
      type: "list",
    },
    servicePlans: {
      label: "Subscription Plan",
      name: "servicePlans",
      options: [],
      type: "list",
    },
    resources: {
      label: "Resource Type",
      name: "resources",
      options: [],
      type: "list",
    },
    cloudProviders: {
      label: "Cloud Provider",
      name: "cloudProviders",
      options: [],
      type: "list",
    },
    regions: {
      label: "Region",
      name: "regions",
      options: [],
      type: "list",
    },
    subscriptionOwner: {
      label: "Subscription Owner",
      name: "subscriptionOwner",
      options: [],
      type: "list",
    },
    lifecycleStatus: {
      label: "Lifecycle Status",
      name: "lifecycleStatus",
      options: [],
      type: "list",
    },
    createdOn: {
      label: "Created On",
      type: "date-range",
      name: "createdOn",
      range: initialRangeState,
    },
  };
};

export const getInstanceFiltersObject = (
  instances: ResourceInstance[],
  subscriptionsObj: Record<string, Subscription>
) => {
  const result: Record<string, FilterCategorySchema> = getIntialFiltersObject();
  const servicesSet = new Set();
  const servicePlansSet = new Set();
  const resourcesSet = new Set();
  const cloudProvidersSet = new Set();
  const regionsSet = new Set();
  const subOwnersSet = new Set();
  const lifecycleStatusSet = new Set();

  instances?.forEach((instance) => {
    //add lifecylce status options
    const status = instance.status;
    if (!lifecycleStatusSet.has(status) && status) {
      result.lifecycleStatus.options?.push({
        value: status,
        label: resourceInstanceStatusMap[status]?.label ?? status,
      });
      lifecycleStatusSet.add(status);
    }

    const subscription = subscriptionsObj[instance.subscriptionId as string];

    if (!subscription) return;

    //get service option
    const serviceName = subscription.serviceName;
    if (!servicesSet.has(serviceName)) {
      result.services.options?.push({
        value: serviceName,
        label: serviceName,
        logoURL: subscription.serviceLogoURL,
      });
      servicesSet.add(serviceName);
    }

    //get service plans
    const productTierName = subscription.productTierName;
    if (!servicePlansSet.has(productTierName)) {
      result.servicePlans.options?.push({
        value: productTierName,
        label: productTierName,
      });
      servicePlansSet.add(productTierName);
    }

    //get resource options
    const resourceName = getResourceNameFromInstance(instance);
    if (resourceName && !resourcesSet.has(resourceName)) {
      result.resources.options?.push({
        value: resourceName,
        label: resourceName,
      });
      resourcesSet.add(resourceName);
    }

    //get cloud providers
    const cloudProvider = instance.cloud_provider;
    if (cloudProvider && !cloudProvidersSet.has(cloudProvider)) {
      result.cloudProviders.options?.push({
        value: cloudProvider,
        label: cloudProvider,
      });
      cloudProvidersSet.add(cloudProvider);
    }

    //get regions
    const region = instance.region;
    if (region && !regionsSet.has(region)) {
      result.regions.options?.push({ value: region, label: region });
      regionsSet.add(region);
    }

    //get SubscriptionOwner options
    const subscriptionOwnerName = subscription.subscriptionOwnerName;
    if (!subOwnersSet.has(subscriptionOwnerName)) {
      result.subscriptionOwner.options?.push({
        value: subscriptionOwnerName,
        label: subscriptionOwnerName,
      });
      subOwnersSet.add(subscriptionOwnerName);
    }
  });

  return result;
};

export const getFilteredInstances = (
  instances: ResourceInstance[],
  filterOptionsMap: Record<string, FilterCategorySchema>,
  subscriptionsObj: Record<string, Subscription>
) => {
  let result = [...instances];

  //filters based on service
  if (filterOptionsMap.services?.options?.length) {
    const serviceOptions = new Set(
      filterOptionsMap.services?.options?.map((option) => option.value)
    );
    result = result.filter((instance) => {
      const serviceName =
        subscriptionsObj[instance.subscriptionId as string]?.serviceName;
      return serviceName && serviceOptions.has(serviceName);
    });
  }

  //filters based on service plan
  if (filterOptionsMap.servicePlans?.options?.length) {
    const servicePlanOptions = new Set(
      filterOptionsMap.servicePlans?.options?.map((option) => option.value)
    );
    result = result.filter((instance) => {
      const productTierName =
        subscriptionsObj[instance.subscriptionId as string]?.productTierName;
      return productTierName && servicePlanOptions.has(productTierName);
    });
  }

  //filters based on resource name
  if (filterOptionsMap.resources?.options?.length) {
    const resourceOptions = new Set(
      filterOptionsMap.resources?.options?.map((option) => option.value)
    );
    result = result.filter((instance) => {
      const resourceName = getResourceNameFromInstance(instance);
      return resourceName && resourceOptions.has(resourceName);
    });
  }

  //filter based on cloud provider
  if (filterOptionsMap.cloudProviders?.options?.length) {
    const cloudProviderOptions = new Set(
      filterOptionsMap.cloudProviders?.options?.map((option) => option.value)
    );
    result = result.filter((instance) => {
      const cloudProvider = instance.cloud_provider;
      return cloudProvider && cloudProviderOptions.has(cloudProvider);
    });
  }

  //filter based on regions
  if (filterOptionsMap.regions?.options?.length) {
    const regionOptions = new Set(
      filterOptionsMap.regions?.options?.map((option) => option.value)
    );

    result = result.filter((instance) => {
      const region = instance.region;
      return region && regionOptions.has(region);
    });
  }

  //filter based on subscription owner
  if (filterOptionsMap.subscriptionOwner?.options?.length) {
    const subscriptionOwnerOptions = new Set(
      filterOptionsMap.subscriptionOwner?.options?.map((option) => option.value)
    );

    result = result.filter((instance) => {
      const subscriptionOwnerName =
        subscriptionsObj[instance.subscriptionId as string]
          ?.subscriptionOwnerName;
      return (
        subscriptionOwnerName &&
        subscriptionOwnerOptions.has(subscriptionOwnerName)
      );
    });
  }

  // filter on lifecycle status
  if (filterOptionsMap.lifecycleStatus?.options?.length) {
    const statusOptions = new Set(
      filterOptionsMap.lifecycleStatus?.options?.map((option) => option.value)
    );

    result = result.filter((instance) => {
      const status = instance.status;
      return status && statusOptions.has(status);
    });
  }

  //filter on created On
  if (
    filterOptionsMap.createdOn?.range?.startDate &&
    filterOptionsMap.createdOn?.range?.endDate
  ) {
    const startDateTime = filterOptionsMap.createdOn.range?.startDate;
    const endDateTime = filterOptionsMap.createdOn.range?.endDate;

    result = result.filter((instance) => {
      const created_at = instance.created_at
        ? new Date(instance.created_at)
        : null;
      return (
        created_at &&
        dayjs(created_at).isSameOrAfter(startDateTime, "second") &&
        dayjs(created_at).isSameOrBefore(endDateTime, "second") //compare granularity is seconds
      );
    });
  }

  return result;
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
