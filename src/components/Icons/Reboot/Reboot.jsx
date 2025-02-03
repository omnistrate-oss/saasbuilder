import { colors } from "src/themeConfig";

const RebootIcon = (props) => {
  const { color = colors.gray700, disabled } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        stroke={disabled ? colors.gray400 : color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.667}
        d="M17.5 8.333S15.83 6.057 14.472 4.7a7.5 7.5 0 1 0 1.902 7.385m1.126-3.75v-5m0 5h-5"
      />
    </svg>
  );
};

export default RebootIcon;
