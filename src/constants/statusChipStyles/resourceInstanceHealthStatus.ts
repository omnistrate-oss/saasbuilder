import { InstanceComputedHealthStatus } from "src/types/resourceInstance";
import {
  Category,
  ColorObject,
  chipCategoryColors,
  defaultChipStyles,
} from "./index";

export const instaceHealthStatusMap: Record<
  InstanceComputedHealthStatus,
  { category: Category; label: string }
> = {
  DEGRADED: { category: "pending", label: "Degraded" },
  HEALTHY: { category: "success", label: "Healthy" },
  UNHEALTHY: { category: "failed", label: "Unhealthy" },
  UNKNOWN: { category: "unknown", label: "Unknown" },
  "NA": { category: "unknown", label: "N/A" },
};

export const getResourceInstanceChipStylesAndLabel = (
  status: InstanceComputedHealthStatus
): ColorObject & { label?: string } => {
  const category = instaceHealthStatusMap[status]?.category;
  const label = instaceHealthStatusMap[status]?.label;
  return {
    ...(category ? chipCategoryColors[category] : { ...defaultChipStyles }),
    ...(label ? { label } : {}),
  };
};
