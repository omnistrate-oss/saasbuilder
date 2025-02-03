import { styled } from "@mui/material";
import Button from "src/components/Button/Button";

const StyledButton = styled(Button)({
  width: "fit-content",
  padding: "12px 30px !important",
  minWidth: "auto",
  borderRadius: "12px",
  boxShadow: "none",
  borderColor: "#E9EAEC",
});

export default function SSOLoginButton(props) {
  return <StyledButton variant="outlined" {...props} />;
}
