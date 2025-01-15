import { FormMode } from "src/types/common/enums";
import { Subscription } from "src/types/subscription";
import { ResourceInstance } from "src/types/resourceInstance";

export const getInitialValues = (
  selectedInstance: ResourceInstance | undefined,
  formMode: FormMode,
  subscriptionsObj: Record<string, Subscription>
) => {
  const subscription =
    subscriptionsObj[selectedInstance?.subscriptionId as string];
  if (formMode === "create" || !selectedInstance || !subscription) {
    return {
      serviceId: "",
      servicePlanId: "",
      subscriptionId: "",
      cloudProvider: "",
      accountConfigurationMethod: "CloudFormation",
      awsAccountId: "",
      gcpProjectId: "",
      gcpProjectNumber: "",
    };
  }

  return {
    serviceId: subscription.serviceId,
    servicePlanId: subscription.productTierId,
    subscriptionId: subscription.id,
    cloudProvider: selectedInstance.result_params?.gcp_project_id
      ? "gcp"
      : "aws",
    accountConfigurationMethod:
      selectedInstance.result_params?.account_configuration_method,
    awsAccountId: selectedInstance.result_params?.aws_account_id,
    gcpProjectId: selectedInstance.result_params?.gcp_project_id,
    gcpProjectNumber: selectedInstance.result_params?.gcp_project_number,
  };
};
