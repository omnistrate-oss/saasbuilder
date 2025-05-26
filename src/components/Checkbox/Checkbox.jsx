import * as React from "react";
import MuiCheckbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";

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

const CheckedIcon = styled(UnCheckedIcon)({
  border: "none",
  background: "none",
  backgroundImage: `url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgNkMwIDIuNjg2MjkgMi42ODYyOSAwIDYgMEgxNEMxNy4zMTM3IDAgMjAgMi42ODYyOSAyMCA2VjE0QzIwIDE3LjMxMzcgMTcuMzEzNyAyMCAxNCAyMEg2QzIuNjg2MjkgMjAgMCAxNy4zMTM3IDAgMTRWNloiIGZpbGw9IiM3RjU2RDkiLz4KPHBhdGggZD0iTTE0LjY2NjYgNi41TDguMjQ5OTggMTIuOTE2N0w1LjMzMzMxIDEwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=)`,
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
});

const Checkbox = React.forwardRef(function Checkbox(props, ref) {
  return (
    <MuiCheckbox
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

export default Checkbox;
