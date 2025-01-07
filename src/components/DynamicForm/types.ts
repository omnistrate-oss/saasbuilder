import { FormMode } from "src/types/common/enums";

export type Field = {
  label: string;
  subLabel: string;
  name: string;
  type?: string;
  description?: React.ReactNode;
  required?: boolean;
  isHidden?: boolean;
  disabled?: boolean;
  dataTestId?: string;

  // For Menu Items in Select Field
  menuItems?: any[];
  isLoading?: boolean;
  emptyMenuText?: string;

  // Radio Buttons
  options?: any[];

  // Text Field
  placeholder?: string;

  // Generic
  value?: any;
  customComponent?: React.ReactNode;
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: any) => void;
  // eslint-disable-next-line no-unused-vars
  onBlur?: (e: any) => void;
};

export type Section = {
  title: string;
  fields: Field[];
};

export type FormConfiguration = {
  title: Record<FormMode, string>;
  description: Record<FormMode, string>;
  sections: Section[];
  footer: {
    submitButton: Record<FormMode, string>;
  };
};
