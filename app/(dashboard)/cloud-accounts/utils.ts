import { Subscription } from "src/types/subscription";
import { ServiceOffering } from "src/types/serviceOffering";
import { ResourceInstance } from "src/types/resourceInstance";

export const getInitialValues = (
  selectedInstance: ResourceInstance | undefined,
  subscriptions: Subscription[],
  byoaServiceOfferingsObj: Record<string, Record<string, ServiceOffering>>
) => {
  if (selectedInstance) {
    const subscription = subscriptions.find(
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

  const filteredSubscriptions = subscriptions.filter(
    (sub) => byoaServiceOfferingsObj[sub.serviceId]?.[sub.productTierId]
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

  const cloudProvider =
    byoaServiceOfferingsObj[serviceId]?.[servicePlanId]?.cloudProviders?.[0] ||
    "";

  return {
    serviceId,
    servicePlanId,
    subscriptionId: rootSubscription?.id || filteredSubscriptions[0]?.id || "",
    cloudProvider,
    accountConfigurationMethod:
      cloudProvider === "aws" ? "CloudFormation" : "Terraform",
    awsAccountId: "",
    gcpProjectId: "",
    gcpProjectNumber: "",
  };
};
