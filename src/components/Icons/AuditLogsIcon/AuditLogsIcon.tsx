import { FC } from "react";

import { styleConfig } from "src/providerConfig";

type AuditLogsIconProps = {
  color?: string;
};

const AuditLogsIcon: FC<AuditLogsIconProps> = ({ color = styleConfig.headerIconColor, ...otherProps }) => {
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" {...otherProps}>
      <path
        d="M33.25 19L14.25 19M33.25 9.49999L14.25 9.49999M33.25 28.5L14.25 28.5M7.91667 19C7.91667 19.8744 7.20778 20.5833 6.33333 20.5833C5.45888 20.5833 4.75 19.8744 4.75 19C4.75 18.1255 5.45888 17.4167 6.33333 17.4167C7.20778 17.4167 7.91667 18.1255 7.91667 19ZM7.91667 9.49999C7.91667 10.3744 7.20778 11.0833 6.33333 11.0833C5.45888 11.0833 4.75 10.3744 4.75 9.49999C4.75 8.62554 5.45888 7.91666 6.33333 7.91666C7.20778 7.91666 7.91667 8.62554 7.91667 9.49999ZM7.91667 28.5C7.91667 29.3744 7.20778 30.0833 6.33333 30.0833C5.45888 30.0833 4.75 29.3744 4.75 28.5C4.75 27.6255 5.45888 26.9167 6.33333 26.9167C7.20778 26.9167 7.91667 27.6255 7.91667 28.5Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AuditLogsIcon;
