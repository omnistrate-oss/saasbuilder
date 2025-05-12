import styled from "@emotion/styled";
import { Typography } from "@mui/material";

const DisplayHeading = styled((props) => <Typography component="h1" {...props} />)(() => ({
  fontWeight: "700",
  fontSize: "32px",
  lineHeight: "40px",
  textAlign: "center",
  color: "#111827",
}));

export default DisplayHeading;
