import { colors } from "src/themeConfig";

const DownloadCLIIcon = ({ disabled }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        style={{ transition: "stroke 0.3s ease" }}
        d="M6.66669 10L10 13.3333M10 13.3333L13.3334 10M10 13.3333V5.66667C10 4.50775 10 3.92828 9.54125 3.2795C9.23644 2.84843 8.35884 2.3164 7.83567 2.24552C7.04826 2.13884 6.74925 2.29482 6.15121 2.60678C3.48613 3.99703 1.66669 6.78604 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 6.91549 16.6575 4.22239 14.1667 2.78152"
        stroke={disabled ? "#a3a6ac" : colors.gray600}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DownloadCLIIcon;
