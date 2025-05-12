import { Category, chipCategoryColors, ColorObject, defaultChipStyles } from "./index";

export const resourceInstanceLicenseStatusMap: Record<string, { category: Category; label: string }> = {
  ACTIVE: { category: "success", label: "Active" },
  EXPIRED: { category: "unknown", label: "Expired" },
  EXPIRING_SOON: { category: "pending", label: "Expiring Soon" },
};

export const getResourceInstanceLicenseStatusStylesAndLabel = (status: string): ColorObject & { label?: string } => {
  const category = resourceInstanceLicenseStatusMap[status]?.category;
  const label = resourceInstanceLicenseStatusMap[status]?.label;
  return {
    ...(category ? chipCategoryColors[category] : { ...defaultChipStyles }),
    ...(label ? { label } : {}),
  };
};
