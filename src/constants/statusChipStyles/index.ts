export type Category = "success" | "inProgress" | "pending" | "info" | "failed" | "unknown";
export type ColorObject = {
  bgColor: string;
  color: string;
  borderColor: string;
};

export const defaultChipStyles: ColorObject = {
  bgColor: "#F8F9FC",
  color: "#363F72",
  borderColor: "#D5D9EB",
};

export const chipCategoryColors: Record<Category, ColorObject> = {
  success: {
    bgColor: "#ECFDF3",
    color: "#067647",
    borderColor: "#ABEFC6",
  },
  inProgress: {
    bgColor: "#F0F9FF",
    color: "#026AA2",
    borderColor: "#B9E6FE",
  },
  pending: {
    bgColor: "#FFFAEB",
    color: "#B54708",
    borderColor: "#FEDF89",
  },
  info: {
    bgColor: "#EEF4FF",
    color: "#3538CD",
    borderColor: "#C7D7FE",
  },
  failed: {
    bgColor: "#FEF3F2",
    color: "#B42318",
    borderColor: "#FECDCA",
  },
  unknown: {
    bgColor: "#F8F9FC",
    color: "#363F72",
    borderColor: "#D5D9EB",
  },
};
