import { colors } from "src/themeConfig";

const RefreshIcon = (props) => {
  const {
    color = colors.gray600,
    disabled,
    width = 20,
    height = 20,
    ...restProps
  } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <path
        d="M1.66669 11.6667C1.66669 11.6667 1.76779 12.3744 4.69672 15.3033C7.62565 18.2322 12.3744 18.2322 15.3033 15.3033C16.341 14.2656 17.0111 12.9994 17.3135 11.6667M1.66669 11.6667V16.6667M1.66669 11.6667H6.66669M18.3334 8.33333C18.3334 8.33333 18.2323 7.62563 15.3033 4.6967C12.3744 1.76777 7.62565 1.76777 4.69672 4.6967C3.65899 5.73443 2.98893 7.0006 2.68654 8.33333M18.3334 8.33333V3.33333M18.3334 8.33333H13.3334"
        stroke={disabled ? "#D0D5DD" : color}
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default RefreshIcon;
