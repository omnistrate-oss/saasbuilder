import * as React from "react";

const DeleteIcon = (props) => {
  let { color = "" } = props;
  if (!color) {
    color = "#0E5FB5";
  }
  const { disabled = false } = props;

  if (disabled) {
    color = "#a3a6ac";
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      {...props}
    >
      <path
        style={{ transition: "stroke 0.3s ease" }}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.667}
        d="M7.5 2.5h5M2.5 5h15m-1.667 0-.584 8.766c-.088 1.315-.132 1.973-.416 2.472a2.5 2.5 0 0 1-1.082 1.012c-.516.25-1.175.25-2.493.25H8.742c-1.318 0-1.977 0-2.493-.25a2.5 2.5 0 0 1-1.082-1.012c-.284-.5-.328-1.157-.416-2.472L4.167 5m4.166 3.75v4.167m3.334-4.167v4.167"
      />
    </svg>
  );
};
export default DeleteIcon;
