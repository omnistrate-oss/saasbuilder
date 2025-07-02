import { styleConfig } from "src/providerConfig";

const ActiveIcon = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ zIndex: 99 }}
    >
      <circle cx="16" cy="16" r="16" fill="#17B26A" />
      <circle cx="16" cy="16" r="13" fill={styleConfig.primaryButtonBg} stroke="white" strokeWidth="2" />
      <circle cx="16" cy="16" r="5" fill="white" />
    </svg>
  );
};
export default ActiveIcon;
