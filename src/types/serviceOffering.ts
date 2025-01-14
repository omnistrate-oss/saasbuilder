import type { paths, components } from "./schema";

export type ListServiceOfferingSuccessResponse =
  paths["/2022-09-01-00/service-offering"]["get"]["responses"]["200"]["content"]["application/json"];

export type Service = components["schemas"]["DescribeServiceOfferingResult"];

export type Offering = components["schemas"]["ServiceOffering"];

export type ServiceOffering = Omit<Service, "offerings"> & Offering;
