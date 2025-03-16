import type { paths } from "./schema";

export type GetCurrentConsumptionUsageSuccessResponse =
  paths["/2022-09-01-00/resource-instance/usage"]["get"]["responses"]["200"]["content"]["application/json"];

export type DecribeConsumptionBillingStatusResponse =
  paths["/2022-09-01-00/resource-instance/billing-status"]["get"]["responses"]["200"]["content"]["application/json"];

export type ListConsumptionInvoicesSuccessResponse =
  paths["/2022-09-01-00/resource-instance/invoice"]["get"]["responses"]["200"]["content"]["application/json"];

export type DescribeConsumptionBillingDetailsSuccessResponse =
  paths["/2022-09-01-00/resource-instance/billing-details"]["get"]["responses"]["200"]["content"]["application/json"];

