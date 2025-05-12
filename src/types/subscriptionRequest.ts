import type { components, paths } from "./schema";

export type ListSubscriptionRequestsSuccessResponse =
  paths["/2022-09-01-00/subscription/request"]["get"]["responses"]["200"]["content"]["application/json"];

export type SubscriptionRequest = components["schemas"]["DescribeSubscriptionRequestResult"];
