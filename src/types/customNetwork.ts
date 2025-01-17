import { CloudProvider } from "./common/enums";

export type NetworkInstance = {
  awsAccountID?: string;
  cloudProviderNativeNetworkId?: string;
  gcpProjectID?: string;
  gcpProjectNumber?: string;
  hostClusterID?: string;
};

export type CustomNetwork = {
  cidr?: string;
  cloudProviderName?: CloudProvider;
  cloudProviderRegion?: string;
  id: string;
  name?: string;
  networkInstances?: NetworkInstance[];
};

export type CustomNetworkCreatePayload = {
  cidr: string;
  cloudProviderName: CloudProvider;
  cloudProviderRegion: string;
  name: string;
};
