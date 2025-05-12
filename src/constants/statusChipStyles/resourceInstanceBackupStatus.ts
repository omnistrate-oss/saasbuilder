import { Category, chipCategoryColors, ColorObject, defaultChipStyles } from "./index";

export const resourceInstanceStatusMap: Record<string, { category: Category; label: string }> = {
  Encrypted: { category: "unknown", label: "Encrypted" },
  "Not Encrypted": { category: "failed", label: "Not Encrypted" },
};

export const getResourceInstanceBackupStatusStylesAndLabel = (status: string): ColorObject & { label?: string } => {
  const category = resourceInstanceStatusMap[status]?.category;
  const label = resourceInstanceStatusMap[status]?.label;
  return {
    ...(category ? chipCategoryColors[category] : { ...defaultChipStyles }),
    ...(label ? { label } : {}),
  };
};
