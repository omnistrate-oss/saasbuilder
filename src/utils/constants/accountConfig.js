// import { CLOUD_PROVIDERS } from "src/constants/cloudProviders";

export const ACCOUNT_CREATION_METHODS = {
  CLOUDFORMATION: "CloudFormation",
  GCP_SCRIPT: "GCPScript",
  // TERRAFORM: "Terraform",
  AZURE_SCRIPT: "AzureScript",
};

export const CLOUD_ACCOUNT_CREATION_METHOD_OPTIONS = {
  aws: [ACCOUNT_CREATION_METHODS.CLOUDFORMATION],
  gcp: [ACCOUNT_CREATION_METHODS.GCP_SCRIPT],
  azure: [ACCOUNT_CREATION_METHODS.AZURE_SCRIPT],
};

export const ACCOUNT_CREATION_METHOD_LABELS = {
  CloudFormation: "CloudFormation",
  GCPScript: "GCP Cloud Shell Script",
  // Terraform: "Terraform",
  AzureScript: "Azure Cloud Shell Script",
};

export const CLOUD_PROVIDER_DEFAULT_CREATION_METHOD = {
  aws: "CloudFormation",
  gcp: "GCPScript",
  azure: "AzureScript",
};

export const getAccountConfigStatusBasedHeader = (
  status,
  cloud_provider_account_config_id = ""
  // accountCreationMethod,
  // cloudprovider
) => {
  if (cloud_provider_account_config_id && status === "FAILED") {
    return "The account configuration verification failed. Please review the instructions below to retry the setup and resolve any issues:";
  }
  if (status === "VERIFYING" || status === "PENDING") {
    return "To complete the account configuration setup:";
  }

  if (status === "FAILED") {
    return "The account configuration verification failed.";
  }
  if (status === "READY") {
    return "This account has already been configured successfully. However if you need to reconfigure for any reason, the instructions are provided below:";
  }
  return "To complete the account configuration setup:";
};
