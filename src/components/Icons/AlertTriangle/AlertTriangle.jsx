import { useTheme } from "@mui/material";
import React from "react";

function AlertTriangle(props) {
  const theme = useTheme();
  const mainAlertColor = theme.palette.warning.main;
  const { height = 16, width = 16, color = mainAlertColor, ...restProps } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <path
        d="M8 6.00015V8.66682M8 11.3335H8.00667M7.07688 2.59464L1.59362 12.0657C1.28948 12.591 1.13742 12.8537 1.15989 13.0693C1.1795 13.2573 1.27801 13.4282 1.43091 13.5394C1.60622 13.6668 1.90973 13.6668 2.51674 13.6668H13.4833C14.0903 13.6668 14.3938 13.6668 14.5691 13.5394C14.722 13.4282 14.8205 13.2573 14.8401 13.0693C14.8626 12.8537 14.7105 12.591 14.4064 12.0657L8.92312 2.59463C8.62007 2.07119 8.46855 1.80947 8.27087 1.72157C8.09843 1.64489 7.90157 1.64489 7.72913 1.72157C7.53145 1.80947 7.37992 2.07119 7.07688 2.59464Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default AlertTriangle;
