import { FC } from "react";
import { styleConfig } from "src/providerConfig";
import { SVGIconProps } from "src/types/common/generalTypes";

const ArrowLeftCircleBrokenIcon: FC<SVGIconProps> = (props) => {
  const {
    disabled,
    color = styleConfig.primaryIconColor,
    ...restProps
  } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="none"
      {...restProps}
    >
      <g clipPath="url(#a)">
        <path
          stroke={disabled ? "#a3a6ac" : color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13.775 11.333a6.667 6.667 0 1 1 0-6.667M8 5.334 5.333 8m0 0L8 10.667M5.333 8h9.334"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ArrowLeftCircleBrokenIcon;
