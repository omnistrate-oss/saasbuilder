import { styleConfig } from "src/providerConfig";
import { colors } from "src/themeConfig";

const CircleCheckIcon = ({ disabled }: { disabled?: boolean }) => {
  return (
    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.58333 10.0001L9.08333 12.5001L14.0833 7.50008M18.6667 10.0001C18.6667 14.6025 14.9357 18.3334 10.3333 18.3334C5.73096 18.3334 2 14.6025 2 10.0001C2 5.39771 5.73096 1.66675 10.3333 1.66675C14.9357 1.66675 18.6667 5.39771 18.6667 10.0001Z"
        stroke={disabled ? styleConfig.sidebarIconDisabledColor : colors.gray400}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CircleCheckIcon;
