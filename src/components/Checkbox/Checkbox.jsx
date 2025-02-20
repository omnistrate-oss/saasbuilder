import * as React from "react";
import { styled } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import { colors } from "src/themeConfig";

const UnCheckedIcon = styled("span")(() => ({
  borderRadius: "6px",
  width: 20,
  height: 20,
  border: "1px solid #D0D5DD",
  background: "#fff",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    backgroundColor: "#F2F4F7",
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background: "#EAECF0",
  },
}));

// const CheckedIcon = styled(UnCheckedIcon)({
//   border: "none",
//   background: "none",
//   backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgNkMwIDIuNjg2MjkgMi42ODYyOSAwIDYgMEgxNEMxNy4zMTM3IDAgMjAgMi42ODYyOSAyMCA2VjE0QzIwIDE3LjMxMzcgMTcuMzEzNyAyMCAxNCAyMEg2QzIuNjg2MjkgMjAgMCAxNy4zMTM3IDAgMTRWNloiIGZpbGw9IiM3RjU2RDkiLz4KPHBhdGggZD0iTTE0LjY2NjYgNi41TDguMjQ5OTggMTIuOTE2N0w1LjMzMzMxIDEwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=)`,
//   backgroundPosition: "center center",
//   backgroundRepeat: "no-repeat",
// });

const CheckedIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.5 6C0.5 2.68629 3.18629 0 6.5 0H14.5C17.8137 0 20.5 2.68629 20.5 6V14C20.5 17.3137 17.8137 20 14.5 20H6.5C3.18629 20 0.5 17.3137 0.5 14V6Z"
      fill={colors.blue700}
    />
    <path
      d="M15.1666 6.5L8.74998 12.9167L5.83331 10"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const CustomCheckbox = React.forwardRef(function CustomCheckbox(props, ref) {
  return (
    <Checkbox
      sx={{
        "&:hover": { bgcolor: "transparent" },
      }}
      disableRipple
      color="default"
      checkedIcon={<CheckedIcon />}
      icon={<UnCheckedIcon />}
      inputProps={{ "aria-label": "Checkbox demo" }}
      ref={ref}
      {...props}
    />
  );
});

export default CustomCheckbox;
