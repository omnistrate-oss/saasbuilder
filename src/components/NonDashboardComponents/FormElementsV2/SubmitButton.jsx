import styled from "@emotion/styled";
import { Button } from "@mui/material";
import LoadingSpinnerSmall from "src/components/CircularProgress/CircularProgress";
import { styleConfig } from "src/providerConfig";

const SubmitButton = styled(({ children, loading, ...restProps }) => (
  <Button {...restProps}>
    {children}
    {loading && <LoadingSpinnerSmall sx={{ color: "#FFF" }} />}
  </Button>
))(() => ({
  backgroundColor: styleConfig.primaryColor,
  color: "#FFFFFF",
  fontWeight: "700",
  fontSize: "16px",
  lineHeight: "24px",
  letterSpacing: "0.3px",
  padding: "16px",
  textTransform: "none",
  borderRadius: "9999px",

  "&:hover": {
    backgroundColor: styleConfig.primaryHoverColor,
    color: "#FFFFFF",
  },

  "&:disabled": {
    backgroundColor: "#F1F2F4",
    color: "#A0AEC0",
  },
}));

export default SubmitButton;
