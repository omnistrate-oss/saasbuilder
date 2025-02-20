import { styled } from "@mui/material";
import MuiRadio from "@mui/material/Radio";
import MuiRadioGroup from "@mui/material/RadioGroup";
import * as React from "react";
import { colors } from "src/themeConfig";

const RadioUncheckedIcon = styled("span")(() => ({
  borderRadius: 8,
  border: `1px solid ${colors.gray300}`,
  height: 16,
  width: 16,
  background: "#FFF",
}));

const RadioCheckedIcon = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
      fill={colors.blue700}
    />
    <path
      d="M5 8C5 6.34315 6.34315 5 8 5C9.65685 5 11 6.34315 11 8C11 9.65685 9.65685 11 8 11C6.34315 11 5 9.65685 5 8Z"
      fill="white"
    />
  </svg>
);

export default function Radio(props) {
  return (
    <MuiRadio
      {...props}
      checkedIcon={<RadioCheckedIcon />}
      icon={<RadioUncheckedIcon />}
    />
  );
}

export const RadioGroup = styled(MuiRadioGroup)(() => ({
  marginTop: 6,
}));
