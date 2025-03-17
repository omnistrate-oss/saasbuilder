import {
  Category,
  ColorObject,
  chipCategoryColors,
  defaultChipStyles,
} from "./index";

const invoiceStatusMap: Record<string, { category: Category; label: string }> =
  {
    draft: { category: "pending", label: "Draft" },
    open: { category: "pending", label: "Open" },
    paid: { category: "success", label: "Paid" },
    uncollectible: { category: "unknown", label: "Uncollectible" },
    void: { category: "unknown", label: "Void" },
  };

export const getInvoiceStatusStylesAndLabel = (
  status: string
): ColorObject & { label?: string } => {
  const category = invoiceStatusMap[status]?.category;
  const label = invoiceStatusMap[status]?.label;
  return {
    ...(category ? chipCategoryColors[category] : { ...defaultChipStyles }),
    ...(label ? { label } : {}),
  };
};
