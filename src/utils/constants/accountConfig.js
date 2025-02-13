export const ACCOUNT_CREATION_METHODS = {
  CLOUDFORMATION: "CloudFormation",
  GCP_SCRIPT: "GCPScript",
  TERRAFORM: "Terraform",
};

export const ACCOUNT_CREATION_METHOD_LABELS = {
  CloudFormation: "CloudFormation",
  GCPScript: "GCP Shell Script",
  Terraform: "Terraform",
};

export const CLOUD_PROVIDER_DEFAULT_CREATION_METHOD = {
  aws: "CloudFormation",
  gcp: "GCPScript",
};
