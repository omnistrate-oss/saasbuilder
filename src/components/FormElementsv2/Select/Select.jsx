import { menuClasses, styled } from "@mui/material";
import MuiSelect from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import LoadingSpinnerSmall from "../../CircularProgress/CircularProgress";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { colors } from "src/themeConfig";

const LoadingUI = () => {
  return (
    <Stack alignItems="center" padding={1}>
      <LoadingSpinnerSmall sx={{ color: () => "black" }} />
    </Stack>
  );
};

const Select = styled(({ isLoading = false, children, ...props }) => (
  <MuiSelect
    fullWidth
    IconComponent={KeyboardArrowDownIcon}
    {...props}
    MenuProps={{
      ...props.MenuProps,
      sx: {
        ...(props.MenuProps?.sx || {}),
        [`& .${menuClasses.paper}`]: {
          marginTop: "4px",
          border: "1px solid #EAECF0",
          boxShadow:
            "0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)",
          borderRadius: "8px",
        },
        [`& .${menuClasses.list}`]: {
          padding: "4px",
        },
      },
    }}
  >
    {isLoading ? <LoadingUI /> : children}
  </MuiSelect>
))(({ theme, marginTop = "6px" }) => ({
  marginTop: marginTop,
  minWidth: 140,
  boxShadow: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
  borderRadius: 8,
  background: "white",
  marginTop: 6,
  [`& .MuiOutlinedInput-input`]: {
    padding: "10px 14px",
    borderRadius: 8,
    fontSize: 16,
    lineHeight: "24px",
    fontWeight: 400,
  },
  [`& .MuiSelect-icon`]: {
    color: "black",
  },
  [`& .MuiSelect-icon.Mui-disabled`]: {
    color: "rgba(0, 0, 0, 0.26);",
  },

  "&.Mui-focused.Mui-error": {
    boxShadow:
      "0px 0px 0px 4px #FEE4E2, 0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
  },

  "&.Mui-disabled": {
    background: theme.palette.gray["50"],
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "1px solid #D0D5DD",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: `2px solid ${colors.success500}`,
  },
  "&.Mui-error .MuiOutlinedInput-notchedOutline": {
    border: "1px solid  #FCA5A5",
  },
  "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
    border: `1px solid  ${theme.palette.gray["300"]}`,
  },
  "&.Mui-disabled .MuiOutlinedInput-input": {
    WebkitTextFillColor: theme.palette.gray["500"],
  },
}));

export default Select;
