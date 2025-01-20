import { CloudProvider } from "./common/enums";
import type { paths, components } from "./schema";

export type ListCustomNetworksSuccessResponse =
  paths["/2022-09-01-00/resource-instance/custom-network"]["get"]["responses"]["200"]["content"]["application/json"];

export type CustomNetwork = components["schemas"]["CustomNetwork"];

export type UpdateCustomNetworkRequestBody =
  components["schemas"]["UpdateCustomNetworkRequestBody"];

export type UpdateCustomNetworkSuccessResponse =
  paths["/2022-09-01-00/resource-instance/custom-network/{id}"]["patch"]["responses"]["200"]["content"]["application/json"];

export type ModifyCustomNetwork = {
  id: string;
  name: string;
};

export type CustomNetworkCreatePayload = {
  cidr: string;
  cloudProviderName: CloudProvider;
  cloudProviderRegion: string;
  name: string;
};
