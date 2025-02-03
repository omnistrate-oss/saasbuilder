import { styled } from "@mui/material";
import MuiSelect from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import LoadingSpinnerSmall from "../../CircularProgress/CircularProgress";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const LoadingUI = () => {
  return (
    <Stack alignItems="center" padding={1}>
      <LoadingSpinnerSmall sx={{ color: () => "black" }} />
    </Stack>
  );
};

const Select = styled(({ isLoading = false, children, ...props }) => (
  <MuiSelect fullWidth {...props} IconComponent={KeyboardArrowDownIcon}>
    {isLoading ? <LoadingUI /> : children}
  </MuiSelect>
))(() => ({
  minWidth: 240,
  boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
  borderRadius: 8,
  [`& .MuiOutlinedInput-input`]: {
    padding: "10px 12px",
    //border: "1px solid #D1D5DB",
    borderRadius: 8,
    fontWeight: 400,
  },
  [`& .MuiOutlinedInput-notchedOutline`]: {
    borderColor: "#D0D5DD",
  },
  [`& .MuiSelect-icon`]: {
    color: "black",
  },
  [`& .MuiSelect-icon.Mui-disabled`]: {
    color: "rgba(0, 0, 0, 0.26);",
  },
}));

export default Select;
