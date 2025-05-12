import type { components,paths } from "./schema";

export type ListAllAuditEventsSuccessResponse =
  paths["/2022-09-01-00/resource-instance/audit-events"]["get"]["responses"]["200"]["content"]["application/json"];

export type AuditEvent = components["schemas"]["DescribeAuditEventResult"];
