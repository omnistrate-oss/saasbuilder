import { styled } from "@mui/material";
import MuiFormControlLabel, { formControlLabelClasses } from "@mui/material/FormControlLabel";

const FormControlLabel = styled(MuiFormControlLabel)(() => ({
  [`& .${formControlLabelClasses.label}`]: {
    color: "#344054",
    fontSize: "14px",
    lineHeight: "20px",
    fontWeight: 500,
  },
}));

export default FormControlLabel;
