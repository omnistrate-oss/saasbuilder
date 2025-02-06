import { colors } from "src/themeConfig";

const PlayIcon = (props) => {
  const { color = colors.gray700, disabled } = props;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none">
      <path
        style={{ transition: "stroke 0.3s ease" }}
        stroke={disabled ? colors.gray400 : color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.667}
        d="M4.167 4.158c0-.81 0-1.214.168-1.437a.833.833 0 0 1 .615-.33c.28-.016.616.209 1.29.658l8.763 5.842c.556.37.834.556.931.79a.833.833 0 0 1 0 .638c-.097.234-.375.42-.931.79L6.24 16.951c-.674.45-1.01.674-1.29.657a.833.833 0 0 1-.615-.329c-.168-.223-.168-.628-.168-1.437V4.158Z"
      />
    </svg>
  );
};
export default PlayIcon;
