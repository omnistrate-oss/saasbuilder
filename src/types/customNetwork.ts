import type { paths, components } from "./schema";

export type ListCustomNetworksSuccessResponse =
  paths["/2022-09-01-00/resource-instance/custom-network"]["get"]["responses"]["200"]["content"]["application/json"];

export type CustomNetwork = components["schemas"]["CustomNetwork"];

export type UpdateCustomNetworkRequestBody =
  components["schemas"]["UpdateCustomNetworkRequestBody"];

export type UpdateCustomNetworkSuccessResponse =
  paths["/2022-09-01-00/resource-instance/custom-network/{id}"]["patch"]["responses"]["200"]["content"]["application/json"];

export type CreateCustomNetworkRequestBody =
  components["schemas"]["CreateCustomNetworkRequestBody"];

export type CreateCustomNetworkSuccessResponse =
  paths["/2022-09-01-00/resource-instance/custom-network"]["post"]["responses"]["200"]["content"]["application/json"];
