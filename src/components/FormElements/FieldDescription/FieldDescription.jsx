import { styled } from "@mui/material";

import { textStyles, weights } from "../../Typography/Typography";

const FieldDescription = styled("p")(() => ({
  color: "#98A2B3",
  ...textStyles.xsmall,
  fontWeight: weights.regular,
}));

export default FieldDescription;
