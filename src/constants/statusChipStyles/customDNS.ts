import {
  Category,
  ColorObject,
  chipCategoryColors,
  defaultChipStyles,
} from "./index";

const customDNSStatusMap: Record<
  string,
  { category: Category; label: string }
> = {
  PENDING: { category: "pending", label: "Pending" },
  READY: { category: "success", label: "Ready" },
};

export const getCustomDNSStatusStylesAndLabel = (
  status: string
): ColorObject & { label?: string } => {
  const category = customDNSStatusMap[status]?.category;
  const label = customDNSStatusMap[status]?.label;
  return {
    ...(category ? chipCategoryColors[category] : { ...defaultChipStyles }),
    ...(label ? { label } : {}),
  };
};
