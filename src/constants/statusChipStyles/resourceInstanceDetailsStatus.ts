import {
  Category,
  ColorObject,
  chipCategoryColors,
  defaultChipStyles,
} from "./index";

export const resourceInstanceStatusMap: Record<
  string,
  { category: Category; label: string }
> = {
  Enabled: { category: "success", label: "Enabled" },
  Disabled: { category: "failed", label: "Disabled" },
  Active: { category: "success", label: "Active" },
  Expired: { category: "unknown", label: "Expired" },
  True: { category: "success", label: "True" },
  False: { category: "failed", label: "False" },
  true: { category: "success", label: "True" },
  false: { category: "failed", label: "False" },
};

export const getResourceInstanceDetailsStatusStylesAndLabel = (
  status: string
): ColorObject & { label?: string } => {
  const category = resourceInstanceStatusMap[status]?.category;
  const label = resourceInstanceStatusMap[status]?.label;
  return {
    ...(category ? chipCategoryColors[category] : { ...defaultChipStyles }),
    ...(label ? { label } : {}),
  };
};
