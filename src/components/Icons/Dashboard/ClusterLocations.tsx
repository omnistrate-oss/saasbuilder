import { styleConfig } from "src/providerConfig";

function ClusterLocationsIcon(props) {
  const { color = styleConfig.primaryIconColor, ...restProps } = props;

  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.55128 14.326C3.75749 14.0173 3.36059 13.8629 3.24471 13.6405C3.14426 13.4477 3.14413 13.2181 3.24435 13.0251C3.35997 12.8026 3.75668 12.6478 4.55011 12.3382L27.0671 3.55103C27.7834 3.27152 28.1415 3.13177 28.3703 3.20822C28.569 3.27461 28.725 3.43056 28.7914 3.6293C28.8678 3.85813 28.7281 4.21625 28.4486 4.93249L19.6615 27.4495C19.3518 28.2429 19.197 28.6396 18.9745 28.7552C18.7815 28.8555 18.5519 28.8553 18.3591 28.7549C18.1367 28.639 17.9823 28.2421 17.6736 27.4483L14.1695 18.4377C14.1068 18.2765 14.0755 18.196 14.0271 18.1281C13.9842 18.068 13.9316 18.0154 13.8715 17.9725C13.8036 17.9241 13.7231 17.8928 13.562 17.8301L4.55128 14.326Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...restProps}
      />
    </svg>
  );
}

export default ClusterLocationsIcon;
