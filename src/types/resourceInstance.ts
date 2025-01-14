import type { paths, components } from "./schema";

export type ListAllResourceInstancesSuccessResponse =
  paths["/2022-09-01-00/resource-instance"]["get"]["responses"]["200"]["content"]["application/json"];

export type ResourceInstance =
  components["schemas"]["DescribeResourceInstanceResult"];

export const RESOURCE_TYPES = {
  OperatorCRD: "OperatorCRD",
  Kustomize: "Kustomize",
};
