import { Category, chipCategoryColors, ColorObject, defaultChipStyles } from "./index";

const invoiceStatusMap: Record<string, { category: Category; label: string }> = {
  draft: { category: "unknown", label: "Draft" },
  open: { category: "info", label: "Open" },
  paid: { category: "success", label: "Paid" },
  uncollectible: { category: "unknown", label: "Uncollectible" },
  void: { category: "unknown", label: "Void" },
  pastDue: { category: "failed", label: "Past Due" },
};

export const getInvoiceStatusStylesAndLabel = (status: string): ColorObject & { label?: string } => {
  const category = invoiceStatusMap[status]?.category;
  const label = invoiceStatusMap[status]?.label;
  return {
    ...(category ? chipCategoryColors[category] : { ...defaultChipStyles }),
    ...(label ? { label } : {}),
  };
};
