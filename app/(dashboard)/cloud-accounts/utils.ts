import { Subscription } from "src/types/subscription";
import { ServiceOffering } from "src/types/serviceOffering";
import { ResourceInstance } from "src/types/resourceInstance";
import { ACCOUNT_CREATION_METHODS } from "src/utils/constants/accountConfig";

export const getInitialValues = (
  initialFormValues: {
    serviceId: string;
    servicePlanId: string;
    subscriptionId: string;
  },
  selectedInstance: ResourceInstance | undefined,
  byoaSubscriptions: Subscription[],
  byoaServiceOfferingsObj: Record<string, Record<string, ServiceOffering>>,
  byoaServiceOfferings: ServiceOffering[]
) => {
  if (selectedInstance) {
    const subscription = byoaSubscriptions.find(
      (sub) => sub.id === selectedInstance.subscriptionId
    );
    return {
      serviceId: subscription?.serviceId || "",
      servicePlanId: subscription?.productTierId || "",
      subscriptionId: subscription?.id || "",
      // @ts-ignore
      cloudProvider: selectedInstance.result_params?.gcp_project_id
        ? "gcp"
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
      byoaServiceOfferingsObj[initialFormValues?.serviceId]?.[
        initialFormValues?.servicePlanId
      ]?.cloudProviders?.[0] || "";

    return {
      ...initialFormValues,
      cloudProvider,
      accountConfigurationMethod:
        cloudProvider === "aws"
          ? ACCOUNT_CREATION_METHODS.CLOUDFORMATION
          : ACCOUNT_CREATION_METHODS.GCP_SCRIPT,
    };
  }

  const filteredSubscriptions = byoaSubscriptions.filter(
    (sub) => byoaServiceOfferingsObj[sub.serviceId]?.[sub.productTierId]
  );

  const rootSubscription = filteredSubscriptions.find(
    (sub) => sub.roleType === "root"
  );

  const serviceId =
    rootSubscription?.serviceId ||
    filteredSubscriptions[0]?.serviceId ||
    byoaServiceOfferings[0]?.serviceId ||
    "";

  const servicePlanId =
    rootSubscription?.productTierId ||
    filteredSubscriptions[0]?.productTierId ||
    "";

  const cloudProvider =
    byoaServiceOfferingsObj[serviceId]?.[servicePlanId]?.cloudProviders?.[0] ||
    "";

  return {
    serviceId,
    servicePlanId,
    subscriptionId: rootSubscription?.id || filteredSubscriptions[0]?.id || "",
    cloudProvider,
    accountConfigurationMethod:
      cloudProvider === "aws"
        ? ACCOUNT_CREATION_METHODS.CLOUDFORMATION
        : ACCOUNT_CREATION_METHODS.GCP_SCRIPT,
    awsAccountId: "",
    gcpProjectId: "",
    gcpProjectNumber: "",
  };
};
