import { Subscription } from "src/types/subscription";
import { CloudProvider } from "src/types/common/enums";
import { CustomNetwork } from "src/types/customNetwork";
import { MenuItem } from "src/types/common/generalTypes";
import { ServiceOffering } from "src/types/serviceOffering";
import { ResourceInstance } from "src/types/resourceInstance";
import { Range } from "react-date-range";
import { cloudProviderLogoMap } from "src/constants/cloudProviders";
import { initialRangeState } from "src/components/DateRangePicker/DateRangePicketStatic";
import { getResourceInstanceStatusStylesAndLabel } from "src/constants/statusChipStyles/resourceInstanceStatus";
import StatusChip from "src/components/StatusChip/StatusChip";
import { Stack } from "@mui/system";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

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

export const getSubscriptionMenuItems = (
  subscriptions: Subscription[],
  servicePlanId: string
) => {
  const menuItems: MenuItem[] = [];
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

export const getInitialValues = (
  instance: ResourceInstance | undefined,
  subscriptions: Subscription[],
  serviceOfferingsObj: Record<string, Record<string, ServiceOffering>>
) => {
  if (instance) {
    const subscription = subscriptions.find(
      (sub) => sub.id === instance?.subscriptionId
    );

    return {
      serviceId: subscription?.serviceId || "",
      servicePlanId: subscription?.productTierId || "",
      subscriptionId: instance?.subscriptionId || "",
      // @ts-ignore
      resourceId: getMainResourceFromInstance(instance)?.id || "",
      cloudProvider: instance?.cloud_provider || "",
      region: instance?.region || "",
      requestParams: {
        ...(instance?.result_params || {}),
      },
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
    requestParams: {},
  };
};

export type FilterCategorySchema = {
  label: string;
  name: string;
  type: "list" | "date-range";
  options?: { value: string; label: string; logoURL?: string }[];
  range?: Range;
  renderOption?: (...args: any) => React.ReactNode;
};

export const getInstanceFiltersObject = (
  instances: ResourceInstance[],
  subscriptionsObj: Record<string, Subscription>
) => {
  const result: Record<string, FilterCategorySchema> = {
    services: {
      label: "Service Name",
      name: "services",
      options: [],
      type: "list",
      renderOption: (option) => {
        return (
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            gap="8px"
          >
            <Box
              borderRadius="50%"
              border="1px solid rgba(0, 0, 0, 0.08)"
              overflow="hidden"
              width="36px"
              height="36px"
              flexShrink={0}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                width="36"
                height="36"
                style={{ objectFit: "cover" }}
                src={
                  option.logoURL ||
                  "/assets/images/dashboard/service/servicePlaceholder.png"
                }
                alt={option.value}
              />
            </Box>
            <p>{option.value}</p>
          </Stack>
        );
      },
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
      renderOption: (option) => cloudProviderLogoMap[option.value],
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
      renderOption: (option) => {
        const statusSytlesAndLabel = getResourceInstanceStatusStylesAndLabel(
          option.value
        );
        return <StatusChip status={option.value} {...statusSytlesAndLabel} />;
      },
    },
    createdOn: {
      label: "Created On",
      type: "date-range",
      name: "createdOn",
      range: initialRangeState,
    },
  };
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
      result.lifecycleStatus.options?.push({ value: status, label: status });
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
    const resourceName = getMainResourceFromInstance(instance)?.resourceName;
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
      const resourceName = getMainResourceFromInstance(instance)?.resourceName;
      return resourceName && resourceOptions.has(resourceName);
    });
  }

  //filter based on cloud provider
  if (filterOptionsMap.cloudProviders?.options?.length) {
    const cloudProviderOptions = new Set(
      filterOptionsMap.cloudProviders?.options?.map((option) => option.value)
    );
    console.log("cloud prvider filters", cloudProviderOptions);
    result = result.filter((instance) => {
      console.log("cloud prvider filters", cloudProviderOptions);

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
