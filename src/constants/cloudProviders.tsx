import AWSIcon from "src/components/Icons/CloudProviders/AWSLogo";
import GCPIcon from "src/components/Icons/CloudProviders/GCPLogo";
import AzureIcon from "src/components/Icons/CloudProviders/AzureLogo";

import AwsLogo from "src/components/Logos/AwsLogo";
import GcpLogo from "src/components/Logos/GcpLogo";
import AzureLogo from "src/components/Logos/AzureLogo";

export const cloudProviderLabels = {
  gcp: "Google Cloud Platform",
  aws: "Amazon Web Services",
  azure: "Microsoft Azure",
};

//short logos map
export const cloudProviderLogoMap = {
  aws: <AWSIcon />,
  gcp: <GCPIcon />,
  azure: <AzureIcon />,
};

//long logos map
export const cloudProviderLongLogoMap = {
  aws: <AwsLogo />,
  gcp: <GcpLogo />,
  azure: <AzureLogo />,
};

export const cloudProviderLabelsShort = {
  aws: "AWS",
  gcp: "GCP",
  azure: "Azure",
};

export const CLOUD_PROVIDERS = {
  aws: "aws",
  gcp: "gcp",
  azure: "azure",
};
