import { RESOURCE_TYPES } from "src/constants/resource";

export const getTabs = (
  isMetricsEnabled,
  isLogsEnabled,
  isActive,
  isResourceBYOA,
  isCliManagedResource,
  resourceType,
  isBackup
) => {
  const tabs: Record<string, string | undefined> = {
    resourceInstanceDetails: "Resource Instance Details",
    connectivity: "Connectivity",
    nodes: "Nodes",
  };
  if (isMetricsEnabled && !isResourceBYOA && !isCliManagedResource)
    tabs["metrics"] = "Metrics";
  if (isLogsEnabled && !isResourceBYOA) tabs["logs"] = "Logs";

  if (!isActive || resourceType === RESOURCE_TYPES.Terraform) {
    delete tabs.connectivity;
    delete tabs.nodes;
  }

  tabs["auditLogs"] = "Events";
  if (isBackup) {
    tabs["backups"] = "Backups";
  }

  return tabs;
};
