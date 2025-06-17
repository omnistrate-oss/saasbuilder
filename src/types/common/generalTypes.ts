import { SVGProps } from "react";

export type SVGIconProps = SVGProps<SVGSVGElement> & {
  color?: string;
  disabled?: boolean;
};

export type MenuItem = {
  label: string;
  value: string | number | React.ReactNode;
  disabled?: boolean;
  disabledMessage?: string;
};
