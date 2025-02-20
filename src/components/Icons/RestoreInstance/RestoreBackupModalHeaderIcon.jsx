import { colors } from "src/themeConfig";

const RestoreBackupModalHeaderIcon = (props) => (
  <svg
    width={56}
    height={56}
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x={4} y={4} width={48} height={48} rx={24} fill="#93c7ff77" />
    <rect
      x={4}
      y={4}
      width={48}
      height={48}
      rx={24}
      stroke="#e8f3ffdd"
      strokeWidth={8}
    />
    <path
      d="M30.5 35L32.5 37L37 32.5M37.9851 28.5499C37.995 28.3678 38 28.1845 38 28C38 22.4772 33.5228 18 28 18C22.4772 18 18 22.4772 18 28C18 33.4354 22.3365 37.858 27.7385 37.9966M28 22V28L31.7384 29.8692"
      stroke={colors.blue700}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default RestoreBackupModalHeaderIcon;
