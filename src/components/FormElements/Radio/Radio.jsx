import MuiRadioGroup from "@mui/material/RadioGroup";
import MuiRadio from "@mui/material/Radio";
import MuiFormControlLabel, { formControlLabelClasses } from "@mui/material/FormControlLabel";
import { textStyles, weights } from "../../Typography/Typography";
import { styled } from "@mui/material";

export const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  [`& .${formControlLabelClasses.label}`]: {
    ...textStyles.small,
    fontWeight: weights.medium,
    color: theme.palette.neutral[800],
  },
}));

export const Radio = styled(MuiRadio)(() => ({}));

export const RadioGroup = styled(MuiRadioGroup)(() => ({}));
