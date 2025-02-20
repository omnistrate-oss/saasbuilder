import { styleConfig } from "src/providerConfig";

const SettingsIcon = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.0673 12H7.33333C5.49238 12 4 10.5076 4 8.66667C4 6.82572 5.49238 5.33333 7.33333 5.33333H20.0673M11.9327 26.6667H24.6667C26.5076 26.6667 28 25.1743 28 23.3333C28 21.4924 26.5076 20 24.6667 20H11.9327M4 23.3333C4 25.9107 6.08934 28 8.66667 28C11.244 28 13.3333 25.9107 13.3333 23.3333C13.3333 20.756 11.244 18.6667 8.66667 18.6667C6.08934 18.6667 4 20.756 4 23.3333ZM28 8.66667C28 11.244 25.9107 13.3333 23.3333 13.3333C20.756 13.3333 18.6667 11.244 18.6667 8.66667C18.6667 6.08934 20.756 4 23.3333 4C25.9107 4 28 6.08934 28 8.66667Z"
        stroke={styleConfig.primaryIconColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SettingsIcon;
