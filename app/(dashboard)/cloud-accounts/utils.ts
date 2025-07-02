import { ResourceInstance } from "src/types/resourceInstance";
import { ServiceOffering } from "src/types/serviceOffering";
import { Subscription } from "src/types/subscription";
import { CLOUD_PROVIDER_DEFAULT_CREATION_METHOD } from "src/utils/constants/accountConfig";

export const getValidSubscriptionForInstanceCreation = (
  serviceOfferings: ServiceOffering[],
  serviceOfferingsObj: Record<string, Record<string, ServiceOffering>>,
  subscriptions: Subscription[],
  instances: ResourceInstance[],
  isPaymentConfigured: boolean,
  serviceID?: string,
  skipInstanceQuotaCheck = true
): Subscription | undefined => {
  const productTierInstanceLimitHash: Record<string, number> = {};
  const productTierPaymentRequirementHash: Record<string, boolean> = {};
  const subscriptionInstancesNumHash: Record<string, number> = {};

  serviceOfferings.forEach((serviceOffering) => {
    productTierInstanceLimitHash[serviceOffering.productTierID] =
      serviceOffering.maxNumberOfInstances !== undefined ? serviceOffering.maxNumberOfInstances : -1;

    productTierPaymentRequirementHash[serviceOffering.productTierID] = !Boolean(
      serviceOffering.allowCreatesWhenPaymentNotConfigured
    );
  });

  instances.forEach((instance) => {
    if (subscriptionInstancesNumHash[instance.subscriptionId as string]) {
      subscriptionInstancesNumHash[instance.subscriptionId as string] =
        subscriptionInstancesNumHash[instance.subscriptionId as string] + 1;
    } else {
      subscriptionInstancesNumHash[instance.subscriptionId as string] = 1;
    }
  });

  let filteredSubscriptions = subscriptions.filter(
    (sub) => serviceOfferingsObj[sub.serviceId]?.[sub.productTierId] && ["root", "editor"].includes(sub.roleType)
  );

  //if serviceID has been provided, look for subscriptions within the serviceID
  if (serviceID) {
    filteredSubscriptions = filteredSubscriptions.filter((subscription) => subscription.serviceId === serviceID);
  }

  const sortedSubscriptionsByName = filteredSubscriptions.sort((a, b) => a.serviceName.localeCompare(b.serviceName));

  const rootSubscriptions = sortedSubscriptionsByName.filter((sub) => sub.roleType === "root");

  const editorSubscriptions = sortedSubscriptionsByName.filter((sub) => sub.roleType === "editor");

  let selectedSubscription: Subscription | undefined;

  //from all subscriptions, prefer a root subscription, where user has not hit subsription limit

  selectedSubscription = rootSubscriptions.find((subsription) => {
    //check for blockers
    //-> if plan requires valid payment config, check that payment is configured
    //-> if plan has max instance limit set, check that the limit has not been met
    const productTierID = subsription.productTierId;
    const requiresPaymentConfig = productTierPaymentRequirementHash[productTierID];
    const numInstances = subscriptionInstancesNumHash[subsription.id] || 0;
    const instancesLimit = productTierInstanceLimitHash[productTierID];
    if (
      (requiresPaymentConfig && !isPaymentConfigured) ||
      (instancesLimit > -1 && numInstances >= instancesLimit && !skipInstanceQuotaCheck)
    )
      return false;

    return true;
  });

  if (!selectedSubscription) {
    //if no root subscription matches the required criteria, look for editor subscriptions
    selectedSubscription = editorSubscriptions.find((subsription) => {
      //check for blockers
      //-> if plan requires valid payment config, check that payment is configured
      //-> if plan has max instance limit set, check that the limit has not been met
      const productTierID = subsription.productTierId;
      const requiresPaymentConfig = productTierPaymentRequirementHash[productTierID];
      const numInstances = subscriptionInstancesNumHash[subsription.id] || 0;
      const instancesLimit = productTierInstanceLimitHash[productTierID];
      if ((requiresPaymentConfig && !isPaymentConfigured) || (instancesLimit > -1 && numInstances >= instancesLimit))
        return false;

      return true;
    });
  }

  return selectedSubscription;
};

export const getInitialValues = (
  initialFormValues: {
    serviceId: string;
    servicePlanId: string;
    subscriptionId: string;
  },
  selectedInstance: ResourceInstance | undefined,
  byoaSubscriptions: Subscription[],
  byoaServiceOfferingsObj: Record<string, Record<string, ServiceOffering>>,
  byoaServiceOfferings: ServiceOffering[],
  instances: ResourceInstance[],
  isPaymentConfigured: boolean
) => {
  if (selectedInstance) {
    const subscription = byoaSubscriptions.find((sub) => sub.id === selectedInstance.subscriptionId);
    return {
      serviceId: subscription?.serviceId || "",
      servicePlanId: subscription?.productTierId || "",
      subscriptionId: subscription?.id || "",
      // @ts-ignore
      cloudProvider: selectedInstance.result_params?.gcp_project_id
        ? "gcp"
        : //@ts-ignore
          selectedInstance.result_params?.azure_subscription_id
          ? "azure"
          : "aws",
      accountConfigurationMethod:
        // @ts-ignore
        selectedInstance.result_params?.account_configuration_method,
      // @ts-ignore
      awsAccountId: selectedInstance.result_params?.aws_account_id,
      // @ts-ignore
      gcpProjectId: selectedInstance.result_params?.gcp_project_id,
      // @ts-ignore
      gcpProjectNumber: selectedInstance.result_params?.gcp_project_number,
      azureSubscriptionId:
        // @ts-ignore
        selectedInstance.result_params?.azure_subscription_id,
      //@ts-ignore
      azureTenantId: selectedInstance.result_params?.azure_tenant_id,
    };
  }

  const isValidFormValues = Boolean(
    byoaSubscriptions.find(
      (sub) =>
        sub.serviceId === initialFormValues?.serviceId &&
        sub.productTierId === initialFormValues?.servicePlanId &&
        sub.id === initialFormValues?.subscriptionId &&
        sub.roleType === "root"
    )
  );

  if (isValidFormValues) {
    const cloudProvider =
      byoaServiceOfferingsObj[initialFormValues?.serviceId]?.[initialFormValues?.servicePlanId]?.cloudProviders?.[0] ||
      "";

    return {
      ...initialFormValues,
      cloudProvider,
      accountConfigurationMethod: CLOUD_PROVIDER_DEFAULT_CREATION_METHOD[cloudProvider],
    };
  }

  const filteredSubscriptions = byoaSubscriptions.filter(
    (sub) => byoaServiceOfferingsObj[sub.serviceId]?.[sub.productTierId]
  );

  const selectedSubscription: Subscription | undefined = getValidSubscriptionForInstanceCreation(
    byoaServiceOfferings,
    byoaServiceOfferingsObj,
    byoaSubscriptions,
    instances,
    isPaymentConfigured,
    "",
    false
  );

  const serviceId =
    selectedSubscription?.serviceId || filteredSubscriptions[0]?.serviceId || byoaServiceOfferings[0]?.serviceId || "";

  const servicePlanId = selectedSubscription?.productTierId || "";

  const cloudProvider = byoaServiceOfferingsObj[serviceId]?.[servicePlanId]?.cloudProviders?.[0] || "";

  return {
    serviceId,
    servicePlanId,
    subscriptionId: selectedSubscription?.id || "",
    cloudProvider,
    accountConfigurationMethod: CLOUD_PROVIDER_DEFAULT_CREATION_METHOD[cloudProvider],
    awsAccountId: "",
    gcpProjectId: "",
    gcpProjectNumber: "",
  };
};

export const getOffboardReadiness = (cloudAccountInstanceStatus?: string, accountConfigInstanceStatus?: string) => {
  if (cloudAccountInstanceStatus === "DELETING" && accountConfigInstanceStatus === "READY_TO_OFFBOARD") return true;
  else return false;
};
