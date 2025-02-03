import { colors } from "src/themeConfig";

const RestoreInstanceIcon = (props) => {
  const { color = colors.gray700, disabled, ...restProps } = props;

  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <g clipPath="url(#clip0_127_1184)">
        <path
          d="M12.0833 15.8333L13.75 17.5L17.5 13.75M18.3209 10.4582C18.3292 10.3065 18.3333 10.1537 18.3333 9.99999C18.3333 5.39762 14.6024 1.66666 9.99999 1.66666C5.39762 1.66666 1.66666 5.39762 1.66666 9.99999C1.66666 14.5295 5.28042 18.215 9.78206 18.3305M9.99999 4.99999V9.99999L13.1153 11.5576"
          stroke={disabled ? colors.gray400 : color}
          strokeWidth={1.66667}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_127_1184">
          <rect width={20} height={20} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default RestoreInstanceIcon;
