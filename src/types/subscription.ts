import type { paths, components } from "./schema";

export type ListSubscriptionsSuccessResponse =
  paths["/2022-09-01-00/subscription"]["get"]["responses"]["200"]["content"]["application/json"];

export type Subscription = components["schemas"]["DescribeSubscriptionResult"];
