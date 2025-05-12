import styled from "@emotion/styled";
import { Button } from "@mui/material";

import LoadingSpinnerSmall from "src/components/CircularProgress/CircularProgress";

const SubmitButton = styled(({ children, loading, ...restProps }) => (
  <Button {...restProps}>
    {children}
    {loading && <LoadingSpinnerSmall sx={{ color: "#FFF" }} />}
  </Button>
))(() => ({
  backgroundColor: "#111827",
  color: "#FFFFFF",
  fontWeight: "700",
  fontSize: "16px",
  lineHeight: "24px",
  letterSpacing: "0.3px",
  padding: "16px",
  textTransform: "none",
  borderRadius: "10px",

  "&:hover": {
    backgroundColor: "#111827",
    color: "#FFFFFF",
  },

  "&:disabled": {
    backgroundColor: "#F1F2F4",
    color: "#A0AEC0",
  },
}));

export default SubmitButton;
