import { colors } from "src/themeConfig";

const CapacityIcon = () => {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="4" width="48" height="48" rx="24" fill="#93c7ff77" />
      <rect
        x="4"
        y="4"
        width="48"
        height="48"
        rx="24"
        stroke="#e8f3ffdd"
        strokeWidth="8"
      />
      <path
        d="M37 21C37 22.6569 32.9706 24 28 24C23.0294 24 19 22.6569 19 21M37 21C37 19.3431 32.9706 18 28 18C23.0294 18 19 19.3431 19 21M37 21V35C37 36.66 33 38 28 38C23 38 19 36.66 19 35V21M37 28C37 29.66 33 31 28 31C23 31 19 29.66 19 28"
        stroke={colors.blue700}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CapacityIcon;
