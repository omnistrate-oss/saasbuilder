import { SVGIconProps } from "src/types/common/generalTypes";

type CloseIconProps = {
  width?: string;
  height?: string;
  styles?: Record<string, string>;
} & SVGIconProps;

const CloseIcon = (props: CloseIconProps) => {
  const { color = "#98A2B3", width = "24", height = "24" } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CloseIcon;
