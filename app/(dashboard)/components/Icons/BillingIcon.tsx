import { colors } from "src/themeConfig";

const BillingIcon = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.3333 19.5556C11.3333 21.2738 12.7262 22.6667 14.4444 22.6667H17.3333C19.1743 22.6667 20.6667 21.1743 20.6667 19.3333C20.6667 17.4924 19.1743 16 17.3333 16H14.6667C12.8257 16 11.3333 14.5076 11.3333 12.6667C11.3333 10.8257 12.8257 9.33334 14.6667 9.33334H17.5555C19.2738 9.33334 20.6667 10.7262 20.6667 12.4445M16 7.33334V9.33334M16 22.6667V24.6667M29.3333 16C29.3333 23.3638 23.3638 29.3333 16 29.3333C8.63619 29.3333 2.66666 23.3638 2.66666 16C2.66666 8.63621 8.63619 2.66667 16 2.66667C23.3638 2.66667 29.3333 8.63621 29.3333 16Z"
        stroke={colors.success500}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BillingIcon;