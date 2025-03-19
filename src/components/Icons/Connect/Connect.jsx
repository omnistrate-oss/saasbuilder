import { colors } from "src/themeConfig";

const ConnectIcon = (props) => {
  const { color = colors.gray700, disabled } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      {...props}
    >
      <path
        stroke={disabled ? "#A4A7AE" : color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.667}
        d="M6.25 5.833h-.417a4.167 4.167 0 1 0 0 8.334H7.5A4.167 4.167 0 0 0 11.666 10m2.084 4.167h.416a4.167 4.167 0 0 0 0-8.334H12.5A4.167 4.167 0 0 0 8.333 10"
      />
    </svg>
  );
};
export default ConnectIcon;
