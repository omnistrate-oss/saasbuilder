import type { components, paths } from "./schema";

export type ListAllSubscriptionUsersSuccessResponse =
  paths["/2022-09-01-00/resource-instance/subscription-users"]["get"]["responses"]["200"]["content"]["application/json"];

export type SubscriptionUser = components["schemas"]["SubscriptionUsers"];
